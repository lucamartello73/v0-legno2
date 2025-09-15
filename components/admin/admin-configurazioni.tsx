"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PDFGenerator } from "@/components/pdf-generator"
import { configurationsApi } from "@/lib/api"
import { Calendar, User, Settings, Edit, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import type { Configuration } from "@/lib/types"

const statusConfig = {
  pending: { label: "In Attesa", color: "bg-yellow-500", icon: Clock },
  processing: { label: "In Lavorazione", color: "bg-blue-500", icon: AlertCircle },
  completed: { label: "Completato", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "Annullato", color: "bg-red-500", icon: XCircle },
}

export function AdminConfigurazioni() {
  const [configurations, setConfigurations] = useState<Configuration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedConfig, setSelectedConfig] = useState<Configuration | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

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

  const updateConfigurationStatus = async () => {
    if (!selectedConfig || !newStatus) return

    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from("configuratorelegno_configurations")
        .update({
          status: newStatus,
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedConfig.id)

      if (error) throw error

      // Update local state
      setConfigurations((prev) =>
        prev.map((config) =>
          config.id === selectedConfig.id ? { ...config, status: newStatus as any, admin_notes: adminNotes } : config,
        ),
      )

      setSelectedConfig(null)
      setNewStatus("")
      setAdminNotes("")
    } catch (error) {
      console.error("Error updating configuration:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const openStatusDialog = (config: Configuration) => {
    setSelectedConfig(config)
    setNewStatus(config.status || "pending")
    setAdminNotes(config.admin_notes || "")
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

  const getStatusBadge = (status: string | undefined) => {
    const currentStatus = status || "pending"
    const config = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
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
        <CardTitle>Gestione Preventivi</CardTitle>
        <p className="text-sm text-muted-foreground">
          Visualizza e gestisci lo stato delle configurazioni inviate dai clienti
        </p>
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
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(config.status)}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {config.created_at && formatDate(config.created_at)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <PDFGenerator configuration={config} />
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => openStatusDialog(config)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Gestisci Stato
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Gestisci Stato Preventivo</DialogTitle>
                            <DialogDescription>
                              Aggiorna lo stato del preventivo e aggiungi note amministrative
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Stato Preventivo</label>
                              <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleziona stato" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">In Attesa</SelectItem>
                                  <SelectItem value="processing">In Lavorazione</SelectItem>
                                  <SelectItem value="completed">Completato</SelectItem>
                                  <SelectItem value="cancelled">Annullato</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Note Amministrative</label>
                              <Textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Aggiungi note interne per questo preventivo..."
                                rows={3}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={updateConfigurationStatus} disabled={isUpdating}>
                              {isUpdating ? "Aggiornamento..." : "Aggiorna Stato"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {config.admin_notes && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-1">Note Amministrative:</h4>
                      <p className="text-sm text-blue-800">{config.admin_notes}</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Configuration Details */}
                    <div className="space-y-4">
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
                            {config.service_type === "chiavi_in_mano" ? "Chiavi in Mano" : "Solo Fornitura"}
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
                            <span className="font-medium">Note Cliente:</span>
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
