"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import { coverageTypesApi } from "@/lib/api"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import type { CoverageType } from "@/lib/types"

export function AdminCoperture() {
  const [coverageTypes, setCoverageTypes] = useState<CoverageType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
  })

  useEffect(() => {
    loadCoverageTypes()
  }, [])

  const loadCoverageTypes = async () => {
    try {
      const data = await coverageTypesApi.getAll()
      setCoverageTypes(data)
    } catch (error) {
      console.error("Error loading coverage types:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      await coverageTypesApi.create(formData)
      await loadCoverageTypes()
      setIsCreating(false)
      setFormData({ name: "", description: "", image_url: "" })
      alert("Tipo copertura creato con successo!")
    } catch (error) {
      console.error("Error creating coverage type:", error)
      alert("Errore nella creazione del tipo copertura")
    }
  }

  const handleUpdate = async (id: string) => {
    try {
      await coverageTypesApi.update({ id, ...formData })
      await loadCoverageTypes()
      setEditingId(null)
      alert("Tipo copertura aggiornato con successo!")
    } catch (error) {
      console.error("Error updating coverage type:", error)
      alert("Errore nell'aggiornamento del tipo copertura")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo tipo di copertura?")) {
      try {
        await coverageTypesApi.delete(id)
        await loadCoverageTypes()
        alert("Tipo copertura eliminato con successo!")
      } catch (error) {
        console.error("Error deleting coverage type:", error)
        alert("Errore nell'eliminazione del tipo copertura")
      }
    }
  }

  const startEdit = (coverage: CoverageType) => {
    setEditingId(coverage.id)
    setFormData({
      name: coverage.name,
      description: coverage.description || "",
      image_url: coverage.image_url || "",
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
            <p className="mt-4 text-muted-foreground">Caricamento tipi copertura...</p>
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
            <CardTitle>Gestione Tipi Copertura</CardTitle>
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
                <CardTitle className="text-lg">Nuovo Tipo Copertura</CardTitle>
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
                        placeholder="Nome del tipo copertura"
                      />
                    </div>
                    <div>
                      <Label htmlFor="new-description">Descrizione</Label>
                      <Textarea
                        id="new-description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descrivi le caratteristiche della copertura (materiale, resistenza agli agenti atmosferici, isolamento, estetica, ecc.)"
                        rows={4}
                        characterLimit={500}
                        helperText="Fornisci una descrizione completa che evidenzi i vantaggi e le caratteristiche tecniche di questo tipo di copertura."
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

          {/* Coverage Types List */}
          <div className="space-y-4">
            {coverageTypes.map((coverage) => (
              <Card key={coverage.id} className={editingId === coverage.id ? "border-primary/20 bg-primary/5" : ""}>
                <CardContent className="pt-6">
                  {editingId === coverage.id ? (
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
                              helperText="Fornisci una descrizione completa che evidenzi i vantaggi e le caratteristiche tecniche di questo tipo di copertura."
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
                        <Button onClick={() => handleUpdate(coverage.id)} disabled={!formData.name}>
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
                        {coverage.image_url && (
                          <img
                            src={coverage.image_url || "/placeholder.svg"}
                            alt={coverage.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-lg">{coverage.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{coverage.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => startEdit(coverage)}
                          size="sm"
                          variant="outline"
                          disabled={editingId !== null || isCreating}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(coverage.id)}
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

          {coverageTypes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nessun tipo di copertura configurato</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
