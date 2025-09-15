"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createBrowserClient } from "@supabase/ssr"
import { Calendar, MapPin, Star, ChevronRight } from "lucide-react"
import Link from "next/link"

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
}

export default function ProgettiPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
        .eq("is_published", true)
        .order("completion_date", { ascending: false })

      if (error) throw error

      const allProjects = data || []
      setProjects(allProjects)
      setFeaturedProjects(allProjects.filter((p) => p.is_featured))
    } catch (error) {
      console.error("Error loading projects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Caricamento progetti...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 to-amber-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">I Nostri Progetti</h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Scopri le pergole che abbiamo realizzato per i nostri clienti. Ogni progetto è unico e personalizzato.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-amber-900 mb-4">Progetti in Evidenza</h2>
              <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={project.main_image_url || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        In Evidenza
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-amber-900 mb-2">{project.title}</h3>
                        <p className="text-gray-600 line-clamp-3">{project.description}</p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {project.location}
                        </div>
                        {project.completion_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(project.completion_date)}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Tipo:</span> {project.pergola_type}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Dimensioni:</span> {project.dimensions}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {project.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      {project.client_testimonial && (
                        <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                          <p className="text-sm italic text-gray-700 mb-2">"{project.client_testimonial}"</p>
                          <p className="text-xs font-medium text-amber-800">- {project.client_name}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* All Projects */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-4">Tutti i Progetti</h2>
            <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Nessun progetto disponibile al momento.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={project.main_image_url || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg text-amber-900">{project.title}</h3>

                      <div className="flex items-center gap-3 text-xs text-gray-500">
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

                      <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>

                      <div className="flex flex-wrap gap-1">
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mt-20 text-center">
          <div className="bg-gradient-to-r from-amber-900 to-amber-700 text-white rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Vuoi Realizzare la Tua Pergola?</h2>
            <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
              Inizia subito a configurare la tua pergola personalizzata. Il nostro team ti seguirà in ogni fase del
              progetto.
            </p>
            <Link href="/configurator">
              <Button size="lg" className="bg-white text-amber-900 hover:bg-amber-50">
                Inizia Configurazione
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
