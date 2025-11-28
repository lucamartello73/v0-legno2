"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ConfiguratorLayout } from "@/components/configurator-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useConfigurationStore } from "@/lib/store"
import { createClient } from "@/lib/supabase/client"
import type { Accessory } from "@/lib/types"
import { Check } from "lucide-react"
import { updateConfigurationTracking } from "@/lib/configuration-tracking"
import { VercelAnalytics } from "@/lib/vercel-analytics-integration"

export default function AccessoriesPage() {
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [loading, setLoading] = useState(true)
  const { accessory_names } = useConfigurationStore()
  const router = useRouter()

  useEffect(() => {
    // Track step start
    VercelAnalytics.trackStepReached(6, 'accessori')
    
    async function fetchAccessories() {
      const supabase = createClient()
      const { data, error } = await supabase.from("configuratorelegno_accessories").select("*").order("created_at")

      if (error) {
        console.error("Error fetching accessories:", error)
      } else {
        setAccessories(data || [])
      }
      setLoading(false)
    }

    fetchAccessories()
  }, [])

  const handleAccessorySelect = (accessory: Accessory | null) => {
    // 🎯 SELEZIONE SINGOLA: sostituisce completamente la selezione precedente
    let newIds: string[] = []
    let newNames: string[] = []
    let totalPrice = 0

    if (accessory) {
      // Seleziona solo questo accessorio (selezione singola)
      newIds = [accessory.id]
      newNames = [accessory.name]
      totalPrice = accessory.price || 0
    }
    // Se accessory è null, deseleziona tutto (opzione "Nessun accessorio")

    useConfigurationStore.getState().setAccessories(newIds, newNames)
    
    // Track accessories selection
    if (accessory) {
      VercelAnalytics.trackAccessoriesSelected(
        [{ name: accessory.name, price: accessory.price || 0 }],
        totalPrice
      )
    }
    
    // Track in nostro sistema (Supabase)
    updateConfigurationTracking({
      step_reached: 6,
      accessori_ids: newIds,
      accessori_nomi: newNames,
      accessori_count: newNames.length,
      accessori_prezzo_totale: totalPrice,
    })

    // 🚀 AVANZAMENTO IMMEDIATO dopo selezione
    // Ritardo di 800ms per dare feedback visivo
    setTimeout(() => {
      router.push('/configurator/contacts')
    }, 800)
  }

  if (loading) {
    return (
      <ConfiguratorLayout currentStep={6} prevHref="/configurator/flooring">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Caricamento accessori...</p>
        </div>
      </ConfiguratorLayout>
    )
  }

  return (
    <ConfiguratorLayout currentStep={6} prevHref="/configurator/flooring" nextHref="/configurator/contacts">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Accessori</h2>
          <p className="text-muted-foreground text-lg mb-2">
            Scegli un accessorio per la tua pergola
          </p>
          <p className="text-sm text-primary/80 font-medium">
            💡 Clicca su un accessorio per selezionarlo e passare al prossimo step
          </p>
        </div>

        {/* Opzione: Nessun Accessorio */}
        <Card
          className="transition-all duration-300 hover-lift cursor-pointer hover:shadow-lg border-2 border-dashed mb-6"
          onClick={() => handleAccessorySelect(null)}
        >
          <CardContent className="py-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Nessun Accessorio</h3>
            <p className="text-muted-foreground">
              Procedi senza aggiungere accessori alla tua pergola
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {accessories.map((accessory) => {
            const isSelected = accessory_names.includes(accessory.name)

            return (
              <Card
                key={accessory.id}
                className={`transition-all duration-300 hover-lift cursor-pointer ${
                  isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-lg"
                }`}
                onClick={() => handleAccessorySelect(accessory)}
              >
                <CardHeader>
                  <div className="aspect-video rounded-lg overflow-hidden mb-4">
                    <img
                      src={accessory.image_url || "/placeholder.svg"}
                      alt={accessory.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{accessory.name}</CardTitle>
                    {accessory.price && (
                      <Badge variant="secondary" className="text-base font-semibold">
                        €{accessory.price.toFixed(2)}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="mb-3">{accessory.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>


      </div>
    </ConfiguratorLayout>
  )
}
