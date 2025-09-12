"use client"

import { ConfiguratorLayout } from "@/components/configurator-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useConfigurationStore } from "@/lib/store"

export default function DimensionsPage() {
  const { type_name, width, depth, height, setDimensions, isStepValid } = useConfigurationStore()

  const handleDimensionChange = (dimension: "width" | "depth" | "height", value: string) => {
    const numValue = Number.parseInt(value) || 0
    const newDimensions = { width, depth, height, [dimension]: numValue }
    setDimensions(newDimensions.width, newDimensions.depth, newDimensions.height)
  }

  const getImageForType = () => {
    if (type_name === "Pergola Addossata") {
      return "/placeholder.svg?height=400&width=600&text=Pergola+Addossata"
    }
    return "/placeholder.svg?height=400&width=600&text=Pergola+Libera"
  }

  return (
    <ConfiguratorLayout
      currentStep={2}
      prevHref="/configurator/type"
      nextHref={isStepValid(2) ? "/configurator/color" : undefined}
    >
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Definisci le Dimensioni</h2>
          <p className="text-muted-foreground text-lg">
            Inserisci le dimensioni desiderate per la tua {type_name?.toLowerCase()}
          </p>
        </div>

        {/* Reference Image */}
        <div className="flex justify-center">
          <div className="max-w-md">
            <img
              src={getImageForType() || "/placeholder.svg"}
              alt={`Dimensioni ${type_name}`}
              className="w-full h-auto rounded-lg shadow-sm"
            />
          </div>
        </div>

        {/* Dimension Inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Dimensioni (in centimetri)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="width">Larghezza</Label>
                <Input
                  id="width"
                  type="number"
                  min="100"
                  max="1000"
                  value={width}
                  onChange={(e) => handleDimensionChange("width", e.target.value)}
                  className={width < 100 ? "border-destructive" : ""}
                />
                <p className="text-xs text-muted-foreground">Minimo: 100 cm</p>
                {width < 100 && <p className="text-xs text-destructive">La larghezza deve essere almeno 100 cm</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="depth">Profondità</Label>
                <Input
                  id="depth"
                  type="number"
                  min="100"
                  max="1000"
                  value={depth}
                  onChange={(e) => handleDimensionChange("depth", e.target.value)}
                  className={depth < 100 ? "border-destructive" : ""}
                />
                <p className="text-xs text-muted-foreground">Minimo: 100 cm</p>
                {depth < 100 && <p className="text-xs text-destructive">La profondità deve essere almeno 100 cm</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Altezza</Label>
                <Input
                  id="height"
                  type="number"
                  min="200"
                  max="400"
                  value={height}
                  onChange={(e) => handleDimensionChange("height", e.target.value)}
                  className={height < 200 ? "border-destructive" : ""}
                />
                <p className="text-xs text-muted-foreground">Minimo: 200 cm</p>
                {height < 200 && <p className="text-xs text-destructive">L'altezza deve essere almeno 200 cm</p>}
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Riepilogo Dimensioni:</h4>
              <p className="text-sm text-muted-foreground">
                {width} cm × {depth} cm × {height} cm
                {isStepValid(2) && <span className="text-primary ml-2">✓ Dimensioni valide</span>}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ConfiguratorLayout>
  )
}
