"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ConfiguratorLayout } from "@/components/configurator-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useConfigurationStore } from "@/lib/store"
import { colorPalettes, type ColorCategory } from "@/lib/types"

export default function ColorPage() {
  const { color_category, color_name, setColor, isStepValid, color_value } = useConfigurationStore()
  const [customColors, setCustomColors] = useState<Record<string, string>>({})
  const [showCustomInput, setShowCustomInput] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const handleColorSelect = (category: ColorCategory, colorName: string, colorValue: string) => {
    setColor(category, colorName, colorValue)
    // Reset custom color inputs when selecting predefined colors
    setCustomColors((prev) => ({ ...prev, [category]: "" }))
    setShowCustomInput((prev) => ({ ...prev, [category]: false }))
    
    // AUTO-NAVIGAZIONE: Passa automaticamente allo step successivo dopo breve delay
    setTimeout(() => {
      router.push("/configurator/coverage")
    }, 400) // 400ms di delay per feedback visivo
  }

  const handleCustomColorSelect = (category: ColorCategory) => {
    const customColorValue = customColors[category]
    if (customColorValue?.trim()) {
      setColor(category, "Colore Personalizzato", customColorValue)
      
      // AUTO-NAVIGAZIONE anche per colori custom
      setTimeout(() => {
        router.push("/configurator/coverage")
      }, 400)
    }
  }

  const toggleCustomInput = (category: string) => {
    setShowCustomInput((prev) => ({ ...prev, [category]: !prev[category] }))
  }

  return (
    <ConfiguratorLayout
      currentStep={3}
      prevHref="/configurator/dimensions"
      nextHref={isStepValid(3) ? "/configurator/coverage" : undefined}
    >
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Scegli il Colore</h2>
          <p className="text-muted-foreground text-lg">Clicca sul colore per selezionare e continuare automaticamente</p>
        </div>

        <div className="space-y-8">
          {Object.entries(colorPalettes).map(([category, colors]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="capitalize">
                  {category.replace("_", " ")}
                  {color_category === category && (
                    <Badge className="ml-2 bg-primary text-primary-foreground">Categoria Selezionata</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  {colors.map((color) => (
                    <div
                      key={color.name}
                      className={`cursor-pointer rounded-lg border-2 p-3 transition-all hover:shadow-md ${
                        color_category === category && color_name === color.name
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleColorSelect(category as ColorCategory, color.name, color.value)}
                    >
                      <div className="w-full h-12 rounded-md mb-2 border" style={{ backgroundColor: color.value }} />
                      <p className="text-sm font-medium text-center">{color.name}</p>
                      {color_category === category && color_name === color.name && (
                        <div className="text-center mt-1">
                          <Badge variant="secondary" className="text-xs">
                            Selezionato
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}

                  <div
                    className={`cursor-pointer rounded-lg border-2 p-3 transition-all hover:shadow-md ${
                      color_category === category && color_name === "Colore Personalizzato"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => toggleCustomInput(category)}
                  >
                    <div className="w-full h-12 rounded-md mb-2 border bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">ALTRO</span>
                    </div>
                    <p className="text-sm font-medium text-center">Altro</p>
                    {color_category === category && color_name === "Colore Personalizzato" && (
                      <div className="text-center mt-1">
                        <Badge variant="secondary" className="text-xs">
                          Selezionato
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {showCustomInput[category] && (
                  <div className="border-t pt-4 bg-gray-50 rounded-lg p-4">
                    <Label htmlFor={`custom-${category}`} className="text-sm font-medium mb-2 block">
                      Inserisci la tua preferenza di colore:
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id={`custom-${category}`}
                        placeholder="Es: Blu navy, Verde militare, Grigio chiaro..."
                        value={customColors[category] || ""}
                        onChange={(e) => setCustomColors((prev) => ({ ...prev, [category]: e.target.value }))}
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && customColors[category]?.trim()) {
                            handleCustomColorSelect(category as ColorCategory)
                          }
                        }}
                      />
                      <Button
                        onClick={() => handleCustomColorSelect(category as ColorCategory)}
                        disabled={!customColors[category]?.trim()}
                        className="px-6"
                      >
                        Conferma
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selection Summary - RIMOSSA LA AUTO-NAVIGAZIONE DAL PULSANTE */}
        {color_category && color_name && (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary border-2 shadow-lg">
            <CardContent className="pt-6 pb-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color_value || "#666" }}
                  />
                  <span className="font-semibold text-lg">
                    {color_category.replace("_", " ")} - {color_name}
                  </span>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    ✓ Colore selezionato! Usa il pulsante "Continua" in basso per procedere quando sei pronto.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ConfiguratorLayout>
  )
}
