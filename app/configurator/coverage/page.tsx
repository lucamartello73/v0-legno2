"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ConfiguratorLayout } from "@/components/configurator-layout"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useConfigurationStore } from "@/lib/store"
import { createClient } from "@/lib/supabase/client"
import type { CoverageType } from "@/lib/types"

export default function CoveragePage() {
  const [coverageTypes, setCoverageTypes] = useState<CoverageType[]>([])
  const [loading, setLoading] = useState(true)
  const { coverage_name, setCoverage, isStepValid } = useConfigurationStore()
  const router = useRouter()

  useEffect(() => {
    async function fetchCoverageTypes() {
      const supabase = createClient()
      const { data, error } = await supabase.from("configuratorelegno_coverage_types").select("*").order("created_at")

      if (error) {
        console.error("Error fetching coverage types:", error)
      } else {
        setCoverageTypes(data || [])
      }
      setLoading(false)
    }

    fetchCoverageTypes()
  }, [])

  const handleCoverageSelect = (coverage: CoverageType) => {
    setCoverage(coverage.id, coverage.name)
    
    // AUTO-NAVIGAZIONE: Passa automaticamente allo step successivo dopo breve delay
    setTimeout(() => {
      router.push("/configurator/flooring")
    }, 300)
  }

  if (loading) {
    return (
      <ConfiguratorLayout currentStep={4} prevHref="/configurator/color">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Caricamento tipi copertura...</p>
        </div>
      </ConfiguratorLayout>
    )
  }

  return (
    <ConfiguratorLayout
      currentStep={4}
      prevHref="/configurator/color"
      nextHref={isStepValid(4) ? "/configurator/flooring" : undefined}
    >
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Scegli la Copertura</h2>
          <p className="text-muted-foreground text-lg">Clicca sulla carta per selezionare e continuare automaticamente</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {coverageTypes.map((coverage) => (
            <Card
              key={coverage.id}
              className={`cursor-pointer transition-all duration-300 hover-lift ${
                coverage_name === coverage.name ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-lg"
              }`}
              onClick={() => handleCoverageSelect(coverage)}
            >
              <CardHeader>
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <img
                    src={coverage.image_url || "/placeholder.svg"}
                    alt={coverage.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{coverage.name}</CardTitle>
                  {coverage_name === coverage.name && (
                    <Badge className="bg-primary text-primary-foreground">Selezionato</Badge>
                  )}
                </div>
                <CardDescription>{coverage.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {!coverage_name && (
          <div className="text-center text-muted-foreground">
            <p>Clicca su una carta per selezionare e procedere</p>
          </div>
        )}
      </div>
    </ConfiguratorLayout>
  )
}
