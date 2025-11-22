"use client"

import { useState, useEffect } from "react"
import { ConfiguratorLayout } from "@/components/configurator-layout"
import { completeConfigurationTracking, updateConfigurationTracking } from "@/lib/configuration-tracking"
import { VercelAnalytics } from "@/lib/vercel-analytics-integration"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useConfigurationStore } from "@/lib/store"
import { CheckCircle, Mail, Phone, MessageCircle } from "lucide-react"
import Link from "next/link"
import { trackConfiguratorSubmit } from "@/lib/gtag"

export default function SummaryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const configuration = useConfigurationStore()
  
  useEffect(() => {
    // Track step start
    VercelAnalytics.trackStepReached(8, 'riepilogo')
    
    // Track reaching summary (step 8)
    updateConfigurationTracking({
      step_reached: 8,
    })
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
    }).format(price)
  }

  const getContactIcon = () => {
    switch (configuration.contact_preference) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "telefono":
        return <Phone className="h-4 w-4" />
      case "whatsapp":
        return <MessageCircle className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      trackConfiguratorSubmit(configuration)

      // Save configuration to database
      const response = await fetch("/api/configurations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(configuration),
      })

      if (response.ok) {
        // Send email
        await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(configuration),
        })
        
        // ✅ COMPLETA TRACKING (IL PIÙ IMPORTANTE!)
        await completeConfigurationTracking(
          {
            cliente_nome: `${configuration.contact_data?.nome} ${configuration.contact_data?.cognome}`,
            cliente_email: configuration.contact_data?.email,
            cliente_telefono: configuration.contact_data?.telefono,
            cliente_citta: configuration.contact_data?.citta,
            cliente_note: configuration.contact_data?.note,
          },
          {
            // Aggiorna dati finali (se non già tracciati)
            tipo_pergola_nome: configuration.type_name,
            dimensioni_larghezza: configuration.width,
            dimensioni_profondita: configuration.depth,
            dimensioni_altezza: configuration.height,
            colore_struttura_nome: configuration.color_category === 'struttura' ? configuration.color_name : undefined,
            copertura_nome: configuration.coverage_name,
            pavimentazione_nomi: configuration.flooring_names,
            accessori_nomi: configuration.accessory_names,
            // prezzo_configurazione: calculateTotalPrice(configuration), // Se hai logica prezzo
          }
        )
        
        // Track su Vercel Analytics
        VercelAnalytics.trackConfiguratorCompleted(
          0, // Prezzo finale (se disponibile)
          configuration
        )

        setIsSubmitted(true)
      } else {
        throw new Error("Errore nel salvataggio della configurazione")
      }
    } catch (error) {
      console.error("Error submitting configuration:", error)
      alert("Si è verificato un errore. Riprova più tardi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewConfiguration = () => {
    configuration.reset()
    setIsSubmitted(false)
  }

  if (isSubmitted) {
    return (
      <ConfiguratorLayout currentStep={8}>
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Configurazione Inviata!</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Grazie per aver utilizzato il nostro configuratore. Riceverai il preventivo personalizzato entro 24 ore.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleNewConfiguration} className="emerald-gradient text-white">
              Nuova Configurazione
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Torna alla Home</Link>
            </Button>
          </div>
        </div>
      </ConfiguratorLayout>
    )
  }

  return (
    <ConfiguratorLayout currentStep={8} prevHref="/configurator/contacts">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Riepilogo Configurazione</h2>
          <p className="text-muted-foreground text-lg">
            Verifica i dettagli della tua pergola prima di inviare la richiesta
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Configuration Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dettagli Pergola</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Tipo</h4>
                  <Badge variant="secondary">{configuration.type_name}</Badge>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Dimensioni</h4>
                  <p className="text-sm text-muted-foreground">
                    {configuration.width} cm × {configuration.depth} cm × {configuration.height} cm
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Colore</h4>
                  <p className="text-sm text-muted-foreground">
                    {configuration.color_category?.replace("_", " ")} - {configuration.color_name}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Copertura</h4>
                  <Badge variant="secondary">{configuration.coverage_name}</Badge>
                </div>

                {configuration.flooring_names.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Pavimentazioni</h4>
                      <div className="flex flex-wrap gap-2">
                        {configuration.flooring_names.map((name) => (
                          <Badge key={name} variant="outline">
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {configuration.accessory_names.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Accessori</h4>
                      <div className="space-y-2">
                        {configuration.accessory_names.map((name) => (
                          <Badge key={name} variant="outline">
                            {name}
                          </Badge>
                        ))}
                      </div>
                      {configuration.total_price > 0 && (
                        <div className="mt-3 p-3 bg-secondary/10 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Totale Accessori:</span>
                            <span className="text-lg font-bold text-secondary">
                              {formatPrice(configuration.total_price)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact and Service Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dati di Contatto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium">Nome Completo</h4>
                  <p className="text-sm text-muted-foreground">
                    {configuration.contact_data?.nome} {configuration.contact_data?.cognome}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-sm text-muted-foreground">{configuration.contact_data?.email}</p>
                </div>
                <div>
                  <h4 className="font-medium">Telefono</h4>
                  <p className="text-sm text-muted-foreground">{configuration.contact_data?.telefono}</p>
                </div>
                <div>
                  <h4 className="font-medium">Indirizzo</h4>
                  <p className="text-sm text-muted-foreground">
                    {configuration.contact_data?.indirizzo}, {configuration.contact_data?.citta}
                  </p>
                </div>
                {configuration.contact_data?.note && (
                  <div>
                    <h4 className="font-medium">Note</h4>
                    <p className="text-sm text-muted-foreground">{configuration.contact_data.note}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferenze Servizio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium">Tipo di Servizio</h4>
                  <Badge variant="secondary">
                    {configuration.service_type === "chiavi_in_mano" ? "Chiavi in Mano" : "Fai da Te"}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium">Preferenza di Contatto</h4>
                  <div className="flex items-center gap-2">
                    {getContactIcon()}
                    <span className="text-sm text-muted-foreground capitalize">{configuration.contact_preference}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button onClick={handleSubmit} disabled={isSubmitting} size="lg" className="emerald-gradient text-white px-8">
            {isSubmitting ? "Invio in corso..." : "Invia Richiesta Preventivo"}
          </Button>
          <p className="text-sm text-muted-foreground mt-3">Riceverai il preventivo personalizzato entro 24 ore</p>
        </div>
      </div>
    </ConfiguratorLayout>
  )
}
