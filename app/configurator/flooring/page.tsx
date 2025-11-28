"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ConfiguratorLayout } from "@/components/configurator-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { useConfigurationStore } from "@/lib/store"
import { createClient } from "@/lib/supabase/client"
import type { FlooringType } from "@/lib/types"
import { updateConfigurationTracking } from "@/lib/configuration-tracking"
import { VercelAnalytics } from "@/lib/vercel-analytics-integration"

export default function FlooringPage() {
  const [flooringTypes, setFlooringTypes] = useState<FlooringType[]>([])
  const [loading, setLoading] = useState(true)
  const { flooring_names, setFlooring } = useConfigurationStore()
  const router = useRouter()

  useEffect(() => {
    // Track step start
    VercelAnalytics.trackStepReached(5, 'pavimentazione')
    
    async function fetchFlooringTypes() {
      const supabase = createClient()
      const { data, error } = await supabase.from("configuratorelegno_flooring_types").select("*").order("created_at")

      if (error) {
        console.error("Error fetching flooring types:", error)
      } else {
        setFlooringTypes(data || [])
      }
      setLoading(false)
    }

    fetchFlooringTypes()
  }, [])

  const handleFlooringToggle = (flooring: FlooringType) => {
    const isSelected = flooring_names.includes(flooring.name)
    let newNames: string[]

    if (isSelected) {
      // If already selected, deselect it
      newNames = []
    } else {
      // Replace any previous selection with the new one
      newNames = [flooring.name]
      
      // Track selection
      VercelAnalytics.trackFlooringSelected(newNames)
      
      // Track in nostro sistema (Supabase)
      updateConfigurationTracking({
        step_reached: 5,
        pavimentazione_nomi: newNames,
        pavimentazione_count: newNames.length,
      })
      
      // AUTO-NAVIGAZIONE: Passa automaticamente allo step successivo dopo selezione
      setTimeout(() => {
        router.push("/configurator/accessories")
      }, 400)
    }

    setFlooring(newNames, newNames)
  }

  // Migliora il rilevamento: mostra card se ALMENO UNA ha immagine valida
  // Cambiato da some() per essere più permissivo
  const hasImages = flooringTypes.length > 0 && flooringTypes.some((flooring) => {
    const url = flooring.image_url
    return url && 
           url !== "/placeholder.svg" && 
           url !== "" && 
           url.trim().length > 0
  })

  if (loading) {
    return (
      <ConfiguratorLayout currentStep={5} prevHref="/configurator/coverage">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Caricamento tipi pavimentazione...</p>
        </div>
      </ConfiguratorLayout>
    )
  }

  return (
    <ConfiguratorLayout currentStep={5} prevHref="/configurator/coverage" nextHref="/configurator/accessories">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Pavimentazione</h2>
          <p className="text-muted-foreground text-lg">Clicca per selezionare (opzionale) e continuare automaticamente</p>
        </div>

        {hasImages ? (
          // Show cards with images when images are available
          <div className="grid md:grid-cols-3 gap-6">
            {flooringTypes.map((flooring) => {
              const isSelected = flooring_names.includes(flooring.name)

              return (
                <Card
                  key={flooring.id}
                  className={`transition-all duration-300 hover-lift cursor-pointer ${
                    isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-lg"
                  }`}
                  onClick={() => handleFlooringToggle(flooring)}
                >
                  <CardHeader>
                    <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
                      <img
                        src={flooring.image_url || "/placeholder.svg"}
                        alt={flooring.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback se immagine esterna non carica
                          const target = e.target as HTMLImageElement
                          target.onerror = null // Previeni loop
                          target.src = "/placeholder.svg"
                          console.warn(`⚠️  Immagine non caricata per ${flooring.name}: ${flooring.image_url}`)
                        }}
                        loading="lazy"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{flooring.name}</CardTitle>
                      {isSelected && (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <CardDescription>{flooring.description}</CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        ) : (
          // Show simple buttons when no images are available
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flooringTypes.map((flooring) => {
              const isSelected = flooring_names.includes(flooring.name)

              return (
                <Button
                  key={flooring.id}
                  variant={isSelected ? "default" : "outline"}
                  size="lg"
                  className={`h-auto min-h-[120px] p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 text-wrap ${
                    isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                  onClick={() => handleFlooringToggle(flooring)}
                >
                  <div className="flex items-center gap-2 text-center">
                    <span className="font-medium text-lg leading-tight">{flooring.name}</span>
                    {isSelected && <Check className="w-5 h-5 flex-shrink-0" />}
                  </div>
                  {flooring.description && (
                    <p className="text-sm opacity-80 text-center leading-relaxed line-clamp-3 break-words max-w-full">
                      {flooring.description}
                    </p>
                  )}
                </Button>
              )
            })}
          </div>
        )}

        {flooring_names.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h4 className="font-medium mb-3">Pavimentazione Selezionata:</h4>
              <div className="flex flex-wrap gap-2">
                {flooring_names.map((name) => (
                  <Badge key={name} variant="secondary">
                    {name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {flooring_names.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p>Nessuna pavimentazione selezionata (opzionale) - usa il pulsante "Continua" per procedere</p>
          </div>
        )}
      </div>
    </ConfiguratorLayout>
  )
}
