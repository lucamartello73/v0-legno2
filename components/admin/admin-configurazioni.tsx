"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { configurationsApi } from "@/lib/api"
import { Calendar, User, Settings } from "lucide-react"
import type { Configuration } from "@/lib/types"

export function AdminConfigurazioni() {
  const [configurations, setConfigurations] = useState<Configuration[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConfigurations()
  }, [])

  const loadConfigurations = async () => {
    try {
      const data = await configurationsApi.getAll()
      setConfigurations(data)
    } catch (error) {
      console.error("Error loading configurations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Caricamento configurazioni...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurazioni Salvate</CardTitle>
        <p className="text-sm text-muted-foreground">Visualizza tutte le configurazioni inviate dai clienti</p>
      </CardHeader>
      <CardContent>
        {configurations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Nessuna configurazione salvata</p>
          </div>
        ) : (
          <div className="space-y-6">
            {configurations.map((config) => (
              <Card key={config.id} className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Configuration Details */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {config.created_at && formatDate(config.created_at)}
                      </div>

                      <div>
                        <h3 className="font-medium text-lg mb-2">Dettagli Pergola</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Tipo:</span>
                            <Badge variant="secondary">{config.type_name}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Dimensioni:</span>
                            <span>
                              {config.width}×{config.depth}×{config.height} cm
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Colore:</span>
                            <span>
                              {config.color_category?.replace("_", " ")} - {config.color_name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Copertura:</span>
                            <span>{config.coverage_name}</span>
                          </div>
                          {config.flooring_names.length > 0 && (
                            <div className="flex justify-between">
                              <span>Pavimentazioni:</span>
                              <span className="text-right">{config.flooring_names.join(", ")}</span>
                            </div>
                          )}
                          {config.accessory_names.length > 0 && (
                            <div className="flex justify-between">
                              <span>Accessori:</span>
                              <span className="text-right">{config.accessory_names.join(", ")}</span>
                            </div>
                          )}
                          {config.total_price > 0 && (
                            <div className="flex justify-between font-medium">
                              <span>Totale Accessori:</span>
                              <span className="text-secondary">{formatPrice(config.total_price)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4" />
                        <span className="font-medium">Dati Cliente</span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Nome:</span>
                          <span>
                            {config.contact_data?.nome} {config.contact_data?.cognome}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Email:</span>
                          <span>{config.contact_data?.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Telefono:</span>
                          <span>{config.contact_data?.telefono}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Città:</span>
                          <span>{config.contact_data?.citta}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Indirizzo:</span>
                          <span className="text-right">{config.contact_data?.indirizzo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Servizio:</span>
                          <Badge variant="outline">
                            {config.service_type === "chiavi_in_mano" ? "Chiavi in Mano" : "Fai da Te"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Contatto Preferito:</span>
                          <Badge variant="outline" className="capitalize">
                            {config.contact_preference}
                          </Badge>
                        </div>
                        {config.contact_data?.note && (
                          <div className="pt-2 border-t">
                            <span className="font-medium">Note:</span>
                            <p className="text-muted-foreground mt-1">{config.contact_data.note}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
