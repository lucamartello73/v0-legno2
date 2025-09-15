"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import { pergolaTypesApi } from "@/lib/api"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import type { PergolaType } from "@/lib/types"

export function AdminPergole() {
  const [pergoleTypes, setPergoleTypes] = useState<PergolaType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
  })

  useEffect(() => {
    loadPergoleTypes()
  }, [])

  const loadPergoleTypes = async () => {
    try {
      const data = await pergolaTypesApi.getAll()
      setPergoleTypes(data)
    } catch (error) {
      console.error("Error loading pergola types:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      await pergolaTypesApi.create(formData)
      await loadPergoleTypes()
      setIsCreating(false)
      setFormData({ name: "", description: "", image_url: "" })
      alert("Tipo pergola creato con successo!")
    } catch (error) {
      console.error("Error creating pergola type:", error)
      alert("Errore nella creazione del tipo pergola")
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      await pergolaTypesApi.update({ id, ...formData })
      await loadPergoleTypes()
      setEditingId(null)
      alert("Tipo pergola aggiornato con successo!")
    } catch (error) {
      console.error("Error updating pergola type:", error)
      alert("Errore nell'aggiornamento del tipo pergola")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo tipo di pergola?")) {
      try {
        await pergolaTypesApi.delete(id)
        await loadPergoleTypes()
        alert("Tipo pergola eliminato con successo!")
      } catch (error) {
        console.error("Error deleting pergola type:", error)
        alert("Errore nell'eliminazione del tipo pergola")
      }
    }
  }

  const startEdit = (pergola: PergolaType) => {
    setEditingId(pergola.id)
    setFormData({
      name: pergola.name,
      description: pergola.description || "",
      image_url: pergola.image_url || "",
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
            <p className="mt-4 text-muted-foreground">Caricamento tipi pergola...</p>
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
            <CardTitle>Gestione Tipi Pergola</CardTitle>
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
                <CardTitle className="text-lg">Nuovo Tipo Pergola</CardTitle>
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
                        placeholder="Nome del tipo pergola"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-description">Descrizione</Label>
                      <Textarea
                        id="new-description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descrivi le caratteristiche della pergola (stile, materiali, dimensioni consigliate, utilizzo ideale, ecc.)"
                        rows={4}
                        characterLimit={500}
                        helperText="Fornisci una descrizione dettagliata che aiuti i clienti a comprendere lo stile e l'utilizzo ideale di questo tipo di pergola."
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

          {/* Pergola Types List */}
          <div className="space-y-4">
            {pergoleTypes.map((pergola) => (
              <Card key={pergola.id} className={editingId === pergola.id ? "border-primary/20 bg-primary/5" : ""}>
                <CardContent className="pt-6">
                  {editingId === pergola.id ? (
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
                              rows={4}
                              characterLimit={500}
                              helperText="Fornisci una descrizione dettagliata che aiuti i clienti a comprendere lo stile e l'utilizzo ideale di questo tipo di pergola."
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
                        <Button onClick={() => handleUpdate(pergola.id)} disabled={!formData.name}>
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
                        {pergola.image_url && (
                          <img
                            src={pergola.image_url || "/placeholder.svg"}
                            alt={pergola.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-lg">{pergola.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{pergola.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => startEdit(pergola)}
                          size="sm"
                          variant="outline"
                          disabled={editingId !== null || isCreating}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(pergola.id)}
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

          {pergoleTypes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nessun tipo di pergola configurato</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
