"use client"

import { useState } from "react"
import { ConfiguratorLayout } from "@/components/configurator-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useConfigurationStore } from "@/lib/store"
import { colorPalettes, type ColorCategory } from "@/lib/types"

export default function ColorPage() {
  const { color_category, color_name, setColor, isStepValid } = useConfigurationStore()
  const [customColor, setCustomColor] = useState("")

  const handleColorSelect = (category: ColorCategory, colorName: string, colorValue: string) => {
    setColor(category, colorName, colorValue)
    setCustomColor("")
  }

  const handleCustomColorSelect = (category: ColorCategory) => {
    if (customColor.trim()) {
      setColor(category, "Colore Personalizzato", customColor)
    }
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
          <p className="text-muted-foreground text-lg">Seleziona la categoria e il colore per la tua pergola</p>
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
                </div>

                {/* Custom Color Option */}
                <div className="border-t pt-4">
                  <Label htmlFor={`custom-${category}`} className="text-sm font-medium">
                    Colore Personalizzato
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id={`custom-${category}`}
                      placeholder="Inserisci nome colore personalizzato"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                    />
                    <button
                      onClick={() => handleCustomColorSelect(category as ColorCategory)}
                      disabled={!customColor.trim()}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                    >
                      Seleziona
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selection Summary */}
        {color_category && color_name && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <h4 className="font-medium mb-2">Colore Selezionato:</h4>
                <p className="text-lg">
                  <span className="font-medium">{color_category.replace("_", " ")}</span> - {color_name}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ConfiguratorLayout>
  )
}
