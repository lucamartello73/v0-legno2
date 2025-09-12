"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import { flooringTypesApi } from "@/lib/api"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import type { FlooringType } from "@/lib/types"

export function AdminPavimenti() {
  const [flooringTypes, setFlooringTypes] = useState<FlooringType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
  })

  useEffect(() => {
    loadFlooringTypes()
  }, [])

  const loadFlooringTypes = async () => {
    try {
      const data = await flooringTypesApi.getAll()
      setFlooringTypes(data)
    } catch (error) {
      console.error("Error loading flooring types:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      await flooringTypesApi.create(formData)
      await loadFlooringTypes()
      setIsCreating(false)
      setFormData({ name: "", description: "", image_url: "" })
      alert("Tipo pavimentazione creato con successo!")
    } catch (error) {
      console.error("Error creating flooring type:", error)
      alert("Errore nella creazione del tipo pavimentazione")
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      await flooringTypesApi.update({ id, ...formData })
      await loadFlooringTypes()
      setEditingId(null)
      alert("Tipo pavimentazione aggiornato con successo!")
    } catch (error) {
      console.error("Error updating flooring type:", error)
      alert("Errore nell'aggiornamento del tipo pavimentazione")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo tipo di pavimentazione?")) {
      try {
        await flooringTypesApi.delete(id)
        await loadFlooringTypes()
        alert("Tipo pavimentazione eliminato con successo!")
      } catch (error) {
        console.error("Error deleting flooring type:", error)
        alert("Errore nell'eliminazione del tipo pavimentazione")
      }
    }
  }

  const startEdit = (flooring: FlooringType) => {
    setEditingId(flooring.id)
    setFormData({
      name: flooring.name,
      description: flooring.description || "",
      image_url: flooring.image_url || "",
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsCreating(false)
    setFormData({ name: "", description: "", image_url: "" })
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Caricamento tipi pavimentazione...</p>
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
            <CardTitle>Gestione Tipi Pavimentazione</CardTitle>
            <Button
              onClick={() => setIsCreating(true)}
              className="emerald-gradient text-white"
              disabled={isCreating || editingId !== null}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nuovo Tipo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Create Form */}
          {isCreating && (
            <Card className="mb-6 border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Nuovo Tipo Pavimentazione</CardTitle>
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
                        placeholder="Nome del tipo pavimentazione"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-description">Descrizione</Label>
                      <Textarea
                        id="new-description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descrizione del tipo pavimentazione"
                        rows={3}
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

          {/* Flooring Types List */}
          <div className="space-y-4">
            {flooringTypes.map((flooring) => (
              <Card key={flooring.id} className={editingId === flooring.id ? "border-primary/20 bg-primary/5" : ""}>
                <CardContent className="pt-6">
                  {editingId === flooring.id ? (
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
                            <Label>Descrizione</Label>
                            <Textarea
                              value={formData.description}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              rows={3}
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
                        <Button onClick={() => handleUpdate(flooring.id)} disabled={!formData.name}>
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
                        {flooring.image_url && (
                          <img
                            src={flooring.image_url || "/placeholder.svg"}
                            alt={flooring.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-lg">{flooring.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{flooring.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => startEdit(flooring)}
                          size="sm"
                          variant="outline"
                          disabled={editingId !== null || isCreating}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(flooring.id)}
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

          {flooringTypes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nessun tipo di pavimentazione configurato</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
