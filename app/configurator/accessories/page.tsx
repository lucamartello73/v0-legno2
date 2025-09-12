"use client"

import { useState, useEffect } from "react"
import { ConfiguratorLayout } from "@/components/configurator-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useConfigurationStore } from "@/lib/store"
import { createClient } from "@/lib/supabase/client"
import type { Accessory } from "@/lib/types"

export default function AccessoriesPage() {
  const [accessories, accessoriesState] = useState<Accessory[]>([])
  const [loading, setLoading] = useState(true)
  const { accessory_names, total_price, setTotalPrice } = useConfigurationStore()

  useEffect(() => {
    async function fetchAccessories() {
      const supabase = createClient()
      const { data, error } = await supabase.from("configuratorelegno_accessories").select("*").order("created_at")

      if (error) {
        console.error("Error fetching accessories:", error)
      } else {
        accessoriesState(data || [])
      }
      setLoading(false)
    }

    fetchAccessories()
  }, [])

  useEffect(() => {
    // Calculate total price when accessories change
    const selectedAccessories = accessories.filter((acc) => accessory_names.includes(acc.name))
    const total = selectedAccessories.reduce((sum, acc) => sum + acc.price, 0)
    setTotalPrice(total)
  }, [accessory_names, accessories, setTotalPrice])

  const handleAccessoryToggle = (accessory: Accessory, checked: boolean) => {
    let newIds: string[] = []
    let newNames: string[] = []

    if (checked) {
      newNames = [...accessory_names, accessory.name]
      newIds = [...accessory_names, accessory.id]
    } else {
      newNames = accessory_names.filter((name) => name !== accessory.name)
      newIds = accessory_names.filter((name) => name !== accessory.name)
    }

    useConfigurationStore.getState().setAccessories(newIds, newNames)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(price)
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
          <p className="text-muted-foreground text-lg">
            Aggiungi accessori per personalizzare la tua pergola (opzionale)
          </p>
        </div>

        {/* Total Price Display */}
        {total_price > 0 && (
          <Card className="bg-secondary/10 border-secondary/30">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-secondary">Totale Accessori: {formatPrice(total_price)}</h3>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {accessories.map((accessory) => {
            const isSelected = accessory_names.includes(accessory.name)

            return (
              <Card
                key={accessory.id}
                className={`transition-all duration-300 hover-lift ${
                  isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-lg"
                }`}
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
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleAccessoryToggle(accessory, checked as boolean)}
                    />
                  </div>
                  <CardDescription className="mb-3">{accessory.description}</CardDescription>
                  <div className="text-xl font-bold text-secondary">{formatPrice(accessory.price)}</div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        {/* Selection Summary */}
        {accessory_names.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h4 className="font-medium mb-3">Accessori Selezionati:</h4>
              <div className="space-y-2">
                {accessory_names.map((name) => {
                  const accessory = accessories.find((acc) => acc.name === name)
                  return (
                    <div key={name} className="flex justify-between items-center">
                      <Badge variant="secondary">{name}</Badge>
                      {accessory && <span className="font-medium">{formatPrice(accessory.price)}</span>}
                    </div>
                  )
                })}
              </div>
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Totale:</span>
                  <span className="text-secondary">{formatPrice(total_price)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {accessory_names.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p>Nessun accessorio selezionato (opzionale)</p>
          </div>
        )}
      </div>
    </ConfiguratorLayout>
  )
}
