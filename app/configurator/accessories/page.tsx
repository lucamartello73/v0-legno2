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
  const [autoAdvanceTimeout, setAutoAdvanceTimeout] = useState<NodeJS.Timeout | null>(null)
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

    // Cleanup: cancella timeout quando il componente viene smontato
    return () => {
      if (autoAdvanceTimeout) {
        clearTimeout(autoAdvanceTimeout)
      }
    }
  }, [autoAdvanceTimeout])

  const handleAccessoryToggle = (accessory: Accessory) => {
    const isSelected = accessory_names.includes(accessory.name)
    let newIds: string[] = []
    let newNames: string[] = []

    // Cancella timeout precedente se esiste
    if (autoAdvanceTimeout) {
      clearTimeout(autoAdvanceTimeout)
      setAutoAdvanceTimeout(null)
    }

    if (!isSelected) {
      newNames = [...accessory_names, accessory.name]
      newIds = [...accessory_names, accessory.id]
    } else {
      newNames = accessory_names.filter((name) => name !== accessory.name)
      newIds = accessory_names.filter((name) => name !== accessory.name)
    }

    useConfigurationStore.getState().setAccessories(newIds, newNames)
    
    // Track accessories selection
    const selectedAccessories = accessories.filter(a => newNames.includes(a.name))
    const totalPrice = selectedAccessories.reduce((sum, a) => sum + (a.price || 0), 0)
    
    VercelAnalytics.trackAccessoriesSelected(
      selectedAccessories.map(a => ({ name: a.name, price: a.price || 0 })),
      totalPrice
    )
    
    // Track in nostro sistema (Supabase)
    updateConfigurationTracking({
      step_reached: 6,
      accessori_ids: newIds,
      accessori_nomi: newNames,
      accessori_count: newNames.length,
      accessori_prezzo_totale: totalPrice,
    })

    // 🎯 AUTO-AVANZAMENTO: Se seleziona 1 accessorio, avanza dopo 2 secondi
    // Questo dà tempo al cliente di selezionare altri accessori se vuole
    // Se clicca un altro accessorio entro 2 secondi, il timeout viene cancellato
    if (!isSelected && newNames.length === 1) {
      const timeout = setTimeout(() => {
        router.push('/configurator/contacts')
      }, 2000) // 2 secondi per dare tempo al cliente
      setAutoAdvanceTimeout(timeout)
    }
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
            Seleziona gli accessori per personalizzare la tua pergola (opzionale)
          </p>
          <p className="text-sm text-primary/80 font-medium">
            💡 Seleziona 1 accessorio per avanzare automaticamente • Seleziona più accessori per vedere tutte le opzioni
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {accessories.map((accessory) => {
            const isSelected = accessory_names.includes(accessory.name)

            return (
              <Card
                key={accessory.id}
                className={`transition-all duration-300 hover-lift cursor-pointer ${
                  isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-lg"
                }`}
                onClick={() => handleAccessoryToggle(accessory)}
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
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className={`min-w-[100px] ${isSelected ? "bg-primary text-primary-foreground" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAccessoryToggle(accessory)
                      }}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Selezionato
                        </>
                      ) : (
                        "Seleziona"
                      )}
                    </Button>
                  </div>
                  <CardDescription className="mb-3">{accessory.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        {accessory_names.length > 0 && (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 shadow-lg">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-lg mb-4 flex items-center">
                <Check className="w-5 h-5 mr-2 text-primary" />
                Accessori Selezionati ({accessory_names.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {accessory_names.map((name) => (
                  <Badge key={name} variant="default" className="px-3 py-1">
                    {name}
                  </Badge>
                ))}
              </div>
              {accessory_names.length === 1 && autoAdvanceTimeout && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">
                    ⏱️ Avanzamento automatico tra 2 secondi...
                    <br />
                    <span className="text-xs">Seleziona altri accessori per annullare</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {accessory_names.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-lg">Nessun accessorio selezionato</p>
            <p className="text-sm mt-1">Clicca su un accessorio per selezionarlo</p>
          </div>
        )}
      </div>
    </ConfiguratorLayout>
  )
}
