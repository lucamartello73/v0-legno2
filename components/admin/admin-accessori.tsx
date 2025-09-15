"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import { accessoriesApi } from "@/lib/api"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import type { Accessory } from "@/lib/types"

export function AdminAccessori() {
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image_url: "",
  })

  useEffect(() => {
    loadAccessories()
  }, [])

  const loadAccessories = async () => {
    try {
      const data = await accessoriesApi.getAll()
      setAccessories(data)
    } catch (error) {
      console.error("Error loading accessories:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const createSampleAccessories = async () => {
    const sampleAccessories = [
      {
        name: "Tenda da Sole Laterale",
        description: "Tenda laterale retrattile per protezione dal sole e dal vento",
        price: 299.99,
        image_url: "/retractable-side-awning-pergola-shade.jpg",
      },
      {
        name: "Illuminazione LED",
        description: "Sistema di illuminazione LED integrato per pergola",
        price: 199.99,
        image_url: "/led-lighting-system-pergola-outdoor.jpg",
      },
      {
        name: "Ventilatore da Soffitto",
        description: "Ventilatore da soffitto per pergola con telecomando",
        price: 349.99,
        image_url: "/ceiling-fan-pergola-outdoor-remote-control.jpg",
      },
      {
        name: "Tende a Rullo",
        description: "Tende a rullo motorizzate per chiusura laterale",
        price: 449.99,
        image_url: "/motorized-roller-blinds-pergola-outdoor.jpg",
      },
      {
        name: "Riscaldatore Infrarossi",
        description: "Riscaldatore a infrarossi per uso esterno",
        price: 259.99,
        image_url: "/infrared-heater-outdoor-pergola-patio.jpg",
      },
      {
        name: "Zanzariere",
        description: "Sistema di zanzariere retrattili per pergola",
        price: 189.99,
        image_url: "/retractable-mosquito-net-pergola-outdoor.jpg",
      },
    ]

    try {
      for (const accessory of sampleAccessories) {
        await accessoriesApi.create(accessory)
      }
      await loadAccessories()
      alert("Accessori di esempio creati con successo!")
    } catch (error) {
      console.error("Error creating sample accessories:", error)
      alert("Errore nella creazione degli accessori di esempio")
    }
  }

  const generateImagesForExistingAccessories = async () => {
    try {
      const accessoriesToUpdate = accessories.filter((acc) => !acc.image_url || acc.image_url === "")

      if (accessoriesToUpdate.length === 0) {
        alert("Tutti gli accessori hanno già un'immagine!")
        return
      }

      for (const accessory of accessoriesToUpdate) {
        let imageUrl = ""

        // Map accessory types to actual image files
        if (accessory.name.toLowerCase().includes("tenda")) {
          imageUrl = "/retractable-side-awning-pergola-shade.jpg"
        } else if (
          accessory.name.toLowerCase().includes("illuminazione") ||
          accessory.name.toLowerCase().includes("led")
        ) {
          imageUrl = "/led-lighting-system-pergola-outdoor.jpg"
        } else if (accessory.name.toLowerCase().includes("ventilatore")) {
          imageUrl = "/ceiling-fan-pergola-outdoor-remote-control.jpg"
        } else if (accessory.name.toLowerCase().includes("rullo")) {
          imageUrl = "/motorized-roller-blinds-pergola-outdoor.jpg"
        } else if (accessory.name.toLowerCase().includes("riscaldatore")) {
          imageUrl = "/infrared-heater-outdoor-pergola-patio.jpg"
        } else if (accessory.name.toLowerCase().includes("zanzariere")) {
          imageUrl = "/retractable-mosquito-net-pergola-outdoor.jpg"
        } else {
          // Default fallback image for other accessories
          imageUrl = "/retractable-side-awning-pergola-shade.jpg"
        }

        await accessoriesApi.update({
          id: accessory.id,
          name: accessory.name,
          description: accessory.description || "",
          price: accessory.price,
          image_url: imageUrl,
        })
      }

      await loadAccessories()
      alert(`Immagini generate per ${accessoriesToUpdate.length} accessori!`)
    } catch (error) {
      console.error("Error generating images:", error)
      alert("Errore nella generazione delle immagini")
    }
  }

  const generateImagesForAllAccessories = async () => {
    if (!confirm("Vuoi rigenerare le immagini per TUTTI gli accessori? Questo sostituirà le immagini esistenti.")) {
      return
    }

    try {
      for (const accessory of accessories) {
        let imageUrl = ""

        // Map accessory types to actual image files
        if (accessory.name.toLowerCase().includes("tenda")) {
          imageUrl = "/retractable-side-awning-pergola-shade.jpg"
        } else if (
          accessory.name.toLowerCase().includes("illuminazione") ||
          accessory.name.toLowerCase().includes("led")
        ) {
          imageUrl = "/led-lighting-system-pergola-outdoor.jpg"
        } else if (accessory.name.toLowerCase().includes("ventilatore")) {
          imageUrl = "/ceiling-fan-pergola-outdoor-remote-control.jpg"
        } else if (accessory.name.toLowerCase().includes("rullo")) {
          imageUrl = "/motorized-roller-blinds-pergola-outdoor.jpg"
        } else if (accessory.name.toLowerCase().includes("riscaldatore")) {
          imageUrl = "/infrared-heater-outdoor-pergola-patio.jpg"
        } else if (accessory.name.toLowerCase().includes("zanzariere")) {
          imageUrl = "/retractable-mosquito-net-pergola-outdoor.jpg"
        } else {
          // Default fallback image for other accessories
          imageUrl = "/retractable-side-awning-pergola-shade.jpg"
        }

        await accessoriesApi.update({
          id: accessory.id,
          name: accessory.name,
          description: accessory.description || "",
          price: accessory.price,
          image_url: imageUrl,
        })
      }

      await loadAccessories()
      alert(`Immagini rigenerate per tutti i ${accessories.length} accessori!`)
    } catch (error) {
      console.error("Error generating images:", error)
      alert("Errore nella rigenerazione delle immagini")
    }
  }

  const handleCreate = async () => {
    try {
      await accessoriesApi.create(formData)
      await loadAccessories()
      setIsCreating(false)
      setFormData({ name: "", description: "", price: 0, image_url: "" })
      alert("Accessorio creato con successo!")
    } catch (error) {
      console.error("Error creating accessory:", error)
      alert("Errore nella creazione dell'accessorio")
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      await accessoriesApi.update({ id, ...formData })
      await loadAccessories()
      setEditingId(null)
      alert("Accessorio aggiornato con successo!")
    } catch (error) {
      console.error("Error updating accessory:", error)
      alert("Errore nell'aggiornamento dell'accessorio")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo accessorio?")) {
      try {
        await accessoriesApi.delete(id)
        await loadAccessories()
        alert("Accessorio eliminato con successo!")
      } catch (error) {
        console.error("Error deleting accessory:", error)
        alert("Errore nell'eliminazione dell'accessorio")
      }
    }
  }

  const startEdit = (accessory: Accessory) => {
    setEditingId(accessory.id)
    setFormData({
      name: accessory.name,
      description: accessory.description || "",
      price: accessory.price,
      image_url: accessory.image_url || "",
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsCreating(false)
    setFormData({ name: "", description: "", price: 0, image_url: "" })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Caricamento accessori...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestione Accessori</CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={createSampleAccessories}
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
                disabled={isCreating || editingId !== null}
              >
                <Plus className="mr-2 h-4 w-4" />
                Aggiungi Esempi
              </Button>
              <Button
                onClick={generateImagesForExistingAccessories}
                variant="outline"
                className="text-purple-600 border-purple-600 hover:bg-purple-50 bg-transparent"
                disabled={isCreating || editingId !== null}
              >
                <Edit className="mr-2 h-4 w-4" />
                Genera Immagini Mancanti
              </Button>
              <Button
                onClick={generateImagesForAllAccessories}
                variant="outline"
                className="text-orange-600 border-orange-600 hover:bg-orange-50 bg-transparent"
                disabled={isCreating || editingId !== null}
              >
                <Edit className="mr-2 h-4 w-4" />
                Rigenera Tutte le Immagini
              </Button>
              <Button
                onClick={() => setIsCreating(true)}
                className="emerald-gradient text-white"
                disabled={isCreating || editingId !== null}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nuovo Accessorio
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Create Form */}
          {isCreating && (
            <Card className="mb-6 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Nuovo Accessorio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-name">Nome</Label>
                      <Input
                        id="new-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nome dell'accessorio"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-price">Prezzo (€)</Label>
                      <Input
                        id="new-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-description">Descrizione</Label>
                      <Textarea
                        id="new-description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descrivi l'accessorio, le sue funzionalità, i vantaggi e le modalità di installazione"
                        rows={4}
                        characterLimit={300}
                        helperText="Descrivi chiaramente l'accessorio, i suoi vantaggi e come migliora l'esperienza della pergola."
                      />
                    </div>
                  </div>
                  <div>
                    <ImageUpload
                      label="Immagine"
                      value={formData.image_url}
                      onChange={(url) => setFormData({ ...formData, image_url: url })}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreate} disabled={!formData.name}>
                    <Save className="mr-2 h-4 w-4" />
                    Salva
                  </Button>
                  <Button onClick={cancelEdit} variant="outline">
                    <X className="mr-2 h-4 w-4" />
                    Annulla
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Accessories List */}
          <div className="space-y-4">
            {accessories.map((accessory) => (
              <Card key={accessory.id} className={editingId === accessory.id ? "border-primary/20 bg-primary/5" : ""}>
                <CardContent className="pt-6">
                  {editingId === accessory.id ? (
                    // Edit Form
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div>
                            <Label>Nome</Label>
                            <Input
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Prezzo (€)</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={formData.price}
                              onChange={(e) =>
                                setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })
                              }
                            />
                          </div>
                          <div>
                            <Label>Descrizione</Label>
                            <Textarea
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              rows={4}
                              characterLimit={300}
                              helperText="Descrivi chiaramente l'accessorio, i suoi vantaggi e come migliora l'esperienza della pergola."
                            />
                          </div>
                        </div>
                        <div>
                          <ImageUpload
                            label="Immagine"
                            value={formData.image_url}
                            onChange={(url) => setFormData({ ...formData, image_url: url })}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleUpdate(accessory.id)} disabled={!formData.name}>
                          <Save className="mr-2 h-4 w-4" />
                          Salva
                        </Button>
                        <Button onClick={cancelEdit} variant="outline">
                          <X className="mr-2 h-4 w-4" />
                          Annulla
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Display Mode
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        {accessory.image_url && (
                          <img
                            src={accessory.image_url || "/placeholder.svg"}
                            alt={accessory.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-lg">{accessory.name}</h3>
                          <p className="text-xl font-bold text-secondary mb-1">{formatPrice(accessory.price)}</p>
                          <p className="text-sm text-muted-foreground">{accessory.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => startEdit(accessory)}
                          size="sm"
                          variant="outline"
                          disabled={editingId !== null || isCreating}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(accessory.id)}
                          size="sm"
                          variant="destructive"
                          disabled={editingId !== null || isCreating}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {accessories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nessun accessorio configurato</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
