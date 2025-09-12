"use client"

import { useState, useEffect } from "react"
import { ConfiguratorLayout } from "@/components/configurator-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useConfigurationStore } from "@/lib/store"
import { createClient } from "@/lib/supabase/client"
import type { FlooringType } from "@/lib/types"

export default function FlooringPage() {
  const [flooringTypes, setFlooringTypes] = useState<FlooringType[]>([])
  const [loading, setLoading] = useState(true)
  const { flooring_names, setFlooring } = useConfigurationStore()

  useEffect(() => {
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

  const handleFlooringToggle = (flooring: FlooringType, checked: boolean) => {
    let newIds: string[] = []
    let newNames: string[] = []

    if (checked) {
      newNames = [...flooring_names, flooring.name]
      newIds = [...flooring_names, flooring.id] // Using names as IDs for simplicity
    } else {
      newNames = flooring_names.filter((name) => name !== flooring.name)
      newIds = flooring_names.filter((name) => name !== flooring.name)
    }

    setFlooring(newIds, newNames)
  }

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
          <p className="text-muted-foreground text-lg">Seleziona i tipi di pavimentazione desiderati (opzionale)</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {flooringTypes.map((flooring) => {
            const isSelected = flooring_names.includes(flooring.name)

            return (
              <Card
                key={flooring.id}
                className={`transition-all duration-300 hover-lift ${
                  isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-lg"
                }`}
              >
                <CardHeader>
                  <div className="aspect-video rounded-lg overflow-hidden mb-4">
                    <img
                      src={flooring.image_url || "/placeholder.svg"}
                      alt={flooring.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{flooring.name}</CardTitle>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleFlooringToggle(flooring, checked as boolean)}
                    />
                  </div>
                  <CardDescription>{flooring.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        {/* Selection Summary */}
        {flooring_names.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h4 className="font-medium mb-3">Pavimentazioni Selezionate:</h4>
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
            <p>Nessuna pavimentazione selezionata (opzionale)</p>
          </div>
        )}
      </div>
    </ConfiguratorLayout>
  )
}
