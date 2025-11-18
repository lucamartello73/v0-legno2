"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ConfiguratorLayout } from "@/components/configurator-layout"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useConfigurationStore } from "@/lib/store"
import { createClient } from "@/lib/supabase/client"
import type { PergolaType } from "@/lib/types"
import { 
  trackConfiguratorStart, 
  trackPergolaTypeSelected,
  startStepTimer,
  trackStepDuration
} from "@/lib/vercel-analytics-tracking"

export default function TypePage() {
  const [pergolaTypes, setPergolaTypes] = useState<PergolaType[]>([])
  const [loading, setLoading] = useState(true)
  const { type_name, setType } = useConfigurationStore()
  const router = useRouter()

  useEffect(() => {
    async function fetchPergolaTypes() {
      const supabase = createClient()

      const { data: typesData, error: typesError } = await supabase
        .from("configuratorelegno_pergola_types")
        .select("*")
        .order("created_at")

      if (typesError) {
        console.error("Error fetching pergola types:", typesError)
      } else {
        setPergolaTypes(typesData || [])
      }

      setLoading(false)
    }

    fetchPergolaTypes()
  }, [])

  const handleTypeSelect = (type: PergolaType) => {
    // Track type selection
    trackPergolaTypeSelected(type.name)
    trackStepDuration(1, 'tipo_pergola')
    
    setType(type.id, type.name)
    
    // AUTO-NAVIGAZIONE: Passa automaticamente allo step successivo dopo breve delay
    setTimeout(() => {
      router.push("/configurator/dimensions")
    }, 300) // 300ms di delay per feedback visivo
  }

  if (loading) {
    return (
      <ConfiguratorLayout currentStep={1}>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground/70">Caricamento tipi pergola...</p>
        </div>
      </ConfiguratorLayout>
    )
  }

  return (
    <ConfiguratorLayout currentStep={1} nextHref={type_name ? "/configurator/dimensions" : undefined}>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Scegli il Tipo di Pergola</h2>
          <p className="text-foreground/80 text-lg">Seleziona il tipo di pergola più adatto al tuo spazio esterno</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {pergolaTypes.map((type) => (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all duration-300 hover-lift ${
                type_name === type.name ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-lg"
              }`}
              onClick={() => handleTypeSelect(type)}
            >
              <CardHeader>
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <img
                    src={type.image_url || "/placeholder.svg?height=300&width=400&text=Immagine+Non+Disponibile"}
                    alt={type.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=300&width=400&text=Immagine+Non+Disponibile"
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{type.name}</CardTitle>
                  {type_name === type.name && <Badge className="bg-primary text-primary-foreground">Selezionato</Badge>}
                </div>
                <CardDescription className="text-base">{type.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {!type_name && (
          <div className="text-center text-foreground/70">
            <p>Clicca su una carta per selezionare e procedere automaticamente</p>
          </div>
        )}
      </div>
    </ConfiguratorLayout>
  )
}
