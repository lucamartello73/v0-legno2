"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { createBrowserClient } from "@supabase/ssr"
import { Plus, Edit, Trash2, Star, Eye, Calendar, MapPin } from "lucide-react"

interface Project {
  id: number
  title: string
  description: string
  location: string
  completion_date: string
  pergola_type: string
  dimensions: string
  main_image_url: string
  gallery_images: string[]
  features: string[]
  client_testimonial: string
  client_name: string
  is_featured: boolean
  is_published: boolean
  created_at: string
}

export function AdminProgetti() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    completion_date: "",
    pergola_type: "",
    dimensions: "",
    main_image_url: "",
    gallery_images: "",
    features: "",
    client_testimonial: "",
    client_name: "",
    is_featured: false,
    is_published: true,
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("configuratorelegno_projects")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error("Error loading projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const projectData = {
        ...formData,
        gallery_images: formData.gallery_images
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url),
        features: formData.features
          .split(",")
          .map((feature) => feature.trim())
          .filter((feature) => feature),
        completion_date: formData.completion_date || null,
      }

      if (editingProject) {
        const { error } = await supabase
          .from("configuratorelegno_projects")
          .update(projectData)
          .eq("id", editingProject.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("configuratorelegno_projects").insert([projectData])

        if (error) throw error
      }

      await loadProjects()
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving project:", error)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      location: project.location,
      completion_date: project.completion_date,
      pergola_type: project.pergola_type,
      dimensions: project.dimensions,
      main_image_url: project.main_image_url,
      gallery_images: project.gallery_images.join(", "),
      features: project.features.join(", "),
      client_testimonial: project.client_testimonial,
      client_name: project.client_name,
      is_featured: project.is_featured,
      is_published: project.is_published,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Sei sicuro di voler eliminare questo progetto?")) return

    try {
      const { error } = await supabase.from("configuratorelegno_projects").delete().eq("id", id)

      if (error) throw error
      await loadProjects()
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  const toggleFeatured = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("configuratorelegno_projects")
        .update({ is_featured: !currentStatus })
        .eq("id", id)

      if (error) throw error
      await loadProjects()
    } catch (error) {
      console.error("Error updating featured status:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      completion_date: "",
      pergola_type: "",
      dimensions: "",
      main_image_url: "",
      gallery_images: "",
      features: "",
      client_testimonial: "",
      client_name: "",
      is_featured: false,
      is_published: true,
    })
    setEditingProject(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT")
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Caricamento progetti...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Galleria Progetti</CardTitle>
            <p className="text-sm text-muted-foreground">Gestisci i progetti realizzati da mostrare ai clienti</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nuovo Progetto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProject ? "Modifica Progetto" : "Nuovo Progetto"}</DialogTitle>
                <DialogDescription>Aggiungi i dettagli del progetto realizzato</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Titolo Progetto</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pergola_type">Tipo Pergola</Label>
                    <Input
                      id="pergola_type"
                      value={formData.pergola_type}
                      onChange={(e) => setFormData({ ...formData, pergola_type: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrizione</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Località</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dimensions">Dimensioni</Label>
                    <Input
                      id="dimensions"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      placeholder="es. 6x4x3 metri"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="completion_date">Data Completamento</Label>
                  <Input
                    id="completion_date"
                    type="date"
                    value={formData.completion_date}
                    onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="main_image_url">URL Immagine Principale</Label>
                  <Input
                    id="main_image_url"
                    value={formData.main_image_url}
                    onChange={(e) => setFormData({ ...formData, main_image_url: e.target.value })}
                    placeholder="/pergola-description.jpg"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="features">Caratteristiche (separate da virgola)</Label>
                  <Input
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Illuminazione LED, Tende motorizzate, Legno certificato"
                  />
                </div>

                <div>
                  <Label htmlFor="client_testimonial">Testimonianza Cliente</Label>
                  <Textarea
                    id="client_testimonial"
                    value={formData.client_testimonial}
                    onChange={(e) => setFormData({ ...formData, client_testimonial: e.target.value })}
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="client_name">Nome Cliente</Label>
                  <Input
                    id="client_name"
                    value={formData.client_name}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    />
                    <Label htmlFor="is_featured">Progetto in evidenza</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                    />
                    <Label htmlFor="is_published">Pubblicato</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit">{editingProject ? "Aggiorna" : "Crea"} Progetto</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Eye className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Nessun progetto presente</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={project.main_image_url || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {project.is_featured && (
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        In Evidenza
                      </Badge>
                    )}
                    {!project.is_published && <Badge variant="secondary">Bozza</Badge>}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {project.location}
                      </div>
                      {project.completion_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(project.completion_date)}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.features.slice(0, 2).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {project.features.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.features.length - 2}
                        </Badge>
                      )}
                    </div>

                    {project.client_testimonial && (
                      <div className="mt-3 p-2 bg-muted rounded text-xs italic">
                        "{project.client_testimonial.substring(0, 80)}..."
                        <div className="text-right mt-1 font-medium">- {project.client_name}</div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t">
                    <Button variant="ghost" size="sm" onClick={() => toggleFeatured(project.id, project.is_featured)}>
                      <Star className={`h-4 w-4 ${project.is_featured ? "fill-yellow-400 text-yellow-400" : ""}`} />
                    </Button>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
