"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import { homepageSettingsApi } from "@/lib/api"
import { Save } from "lucide-react"

interface HomepageSettings {
  hero_title: string
  hero_subtitle: string
  hero_image_url: string
  dimensions_addossata_image: string
  dimensions_libera_image: string
}

export function AdminHomepage() {
  const [settings, setSettings] = useState<HomepageSettings>({
    hero_title: "",
    hero_subtitle: "",
    hero_image_url: "",
    dimensions_addossata_image: "",
    dimensions_libera_image: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const data = await homepageSettingsApi.get()
      setSettings(data)
    } catch (error) {
      console.error("Error loading homepage settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await homepageSettingsApi.update(settings)
      alert("Impostazioni homepage salvate con successo!")
    } catch (error) {
      console.error("Error saving homepage settings:", error)
      alert("Errore nel salvataggio delle impostazioni")
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof HomepageSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Caricamento impostazioni...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestione Homepage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="hero_title">Titolo Hero</Label>
              <Input
                id="hero_title"
                value={settings.hero_title}
                onChange={(e) => handleInputChange("hero_title", e.target.value)}
                placeholder="Configuratore Pergole MARTELLO 1930"
              />
            </div>

            <div>
              <Label htmlFor="hero_subtitle">Sottotitolo Hero</Label>
              <Textarea
                id="hero_subtitle"
                value={settings.hero_subtitle}
                onChange={(e) => handleInputChange("hero_subtitle", e.target.value)}
                placeholder="Progetta la tua pergola ideale..."
                rows={4}
              />
            </div>
          </div>

          <div>
            <ImageUpload
              label="Immagine Hero"
              value={settings.hero_image_url}
              onChange={(url) => handleInputChange("hero_image_url", url)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ImageUpload
            label="Immagine Dimensioni Pergola Addossata"
            value={settings.dimensions_addossata_image}
            onChange={(url) => handleInputChange("dimensions_addossata_image", url)}
          />

          <ImageUpload
            label="Immagine Dimensioni Pergola Libera"
            value={settings.dimensions_libera_image}
            onChange={(url) => handleInputChange("dimensions_libera_image", url)}
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving} className="emerald-gradient text-white">
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Salvataggio..." : "Salva Impostazioni"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
