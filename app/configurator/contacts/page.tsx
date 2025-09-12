"use client"

import { useState } from "react"
import { ConfiguratorLayout } from "@/components/configurator-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useConfigurationStore } from "@/lib/store"
import type { ContactData } from "@/lib/types"

export default function ContactsPage() {
  const {
    contact_data,
    service_type,
    contact_preference,
    setContactData,
    setService,
    setContactPreference,
    isStepValid,
  } = useConfigurationStore()

  const [formData, setFormData] = useState<ContactData>(
    contact_data || {
      nome: "",
      cognome: "",
      email: "",
      telefono: "",
      citta: "",
      indirizzo: "",
      note: "",
      privacy_consent: false,
    },
  )

  const [errors, setErrors] = useState<Partial<ContactData & { privacy_consent: string }>>({})

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePhone = (phone: string) => /^[+]?[\d\s-()]{8,}$/.test(phone)

  const handleInputChange = (field: keyof ContactData, value: string | boolean) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    setContactData(newFormData)

    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined })
    }
  }

  const validateForm = () => {
    const newErrors: Partial<ContactData & { privacy_consent: string }> = {}

    if (!formData.nome.trim()) newErrors.nome = "Nome richiesto"
    if (!formData.cognome.trim()) newErrors.cognome = "Cognome richiesto"
    if (!formData.email.trim()) {
      newErrors.email = "Email richiesta"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Email non valida"
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = "Telefono richiesto"
    } else if (!validatePhone(formData.telefono)) {
      newErrors.telefono = "Telefono non valido"
    }
    if (!formData.citta.trim()) newErrors.citta = "Città richiesta"
    if (!formData.indirizzo.trim()) newErrors.indirizzo = "Indirizzo richiesto"
    if (!formData.privacy_consent) newErrors.privacy_consent = "Consenso privacy richiesto"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return (
    <ConfiguratorLayout
      currentStep={7}
      prevHref="/configurator/accessories"
      nextHref={isStepValid(7) ? "/configurator/summary" : undefined}
    >
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Dati di Contatto</h2>
          <p className="text-muted-foreground text-lg">
            Scegli il tipo di servizio e inserisci i tuoi dati per ricevere il preventivo personalizzato
          </p>
        </div>

        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">Scegli il Tipo di Servizio</CardTitle>
            <p className="text-muted-foreground">Seleziona la modalità di fornitura che preferisci</p>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={service_type || ""}
              onValueChange={(value) => setService(value as "chiavi_in_mano" | "fai_da_te")}
              className="grid md:grid-cols-2 gap-6"
            >
              <div
                className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                  service_type === "chiavi_in_mano"
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="chiavi_in_mano" id="chiavi_in_mano" className="mt-1" />
                  <Label htmlFor="chiavi_in_mano" className="cursor-pointer flex-1">
                    <div className="space-y-2">
                      <div className="font-bold text-lg text-primary">Chiavi in Mano</div>
                      <div className="font-medium">Con Trasporto e Montaggio</div>
                      <div className="text-sm text-muted-foreground">
                        Servizio completo: progettazione, fornitura, trasporto e installazione professionale
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        ✓ Sopralluogo gratuito
                        <br />✓ Montaggio professionale
                        <br />✓ Garanzia completa
                      </div>
                    </div>
                  </Label>
                </div>
              </div>

              <div
                className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                  service_type === "fai_da_te"
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-muted hover:border-primary/50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="fai_da_te" id="fai_da_te" className="mt-1" />
                  <Label htmlFor="fai_da_te" className="cursor-pointer flex-1">
                    <div className="space-y-2">
                      <div className="font-bold text-lg text-primary">Solo Fornitura</div>
                      <div className="font-medium">Fai da Te</div>
                      <div className="text-sm text-muted-foreground">
                        Solo materiali con istruzioni dettagliate per il montaggio autonomo
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        ✓ Prezzo più conveniente
                        <br />✓ Istruzioni dettagliate
                        <br />✓ Supporto telefonico
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Data */}
          <Card>
            <CardHeader>
              <CardTitle>Dati Personali</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    className={errors.nome ? "border-destructive" : ""}
                  />
                  {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cognome">Cognome *</Label>
                  <Input
                    id="cognome"
                    value={formData.cognome}
                    onChange={(e) => handleInputChange("cognome", e.target.value)}
                    className={errors.cognome ? "border-destructive" : ""}
                  />
                  {errors.cognome && <p className="text-xs text-destructive">{errors.cognome}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Telefono *</Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  className={errors.telefono ? "border-destructive" : ""}
                />
                {errors.telefono && <p className="text-xs text-destructive">{errors.telefono}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="citta">Città *</Label>
                <Input
                  id="citta"
                  value={formData.citta}
                  onChange={(e) => handleInputChange("citta", e.target.value)}
                  className={errors.citta ? "border-destructive" : ""}
                />
                {errors.citta && <p className="text-xs text-destructive">{errors.citta}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="indirizzo">Indirizzo *</Label>
                <Input
                  id="indirizzo"
                  value={formData.indirizzo}
                  onChange={(e) => handleInputChange("indirizzo", e.target.value)}
                  className={errors.indirizzo ? "border-destructive" : ""}
                />
                {errors.indirizzo && <p className="text-xs text-destructive">{errors.indirizzo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note (opzionale)</Label>
                <Textarea
                  id="note"
                  value={formData.note || ""}
                  onChange={(e) => handleInputChange("note", e.target.value)}
                  placeholder="Eventuali richieste specifiche..."
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy_consent"
                    checked={formData.privacy_consent || false}
                    onCheckedChange={(checked) => handleInputChange("privacy_consent", checked as boolean)}
                    className={errors.privacy_consent ? "border-destructive" : ""}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="privacy_consent" className="text-sm cursor-pointer">
                      Acconsento al trattamento dei miei dati personali *
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Accetto che i miei dati vengano utilizzati per l'invio del preventivo e per eventuali
                      comunicazioni commerciali. I dati saranno trattati secondo la{" "}
                      <a
                        href="/privacy-policy"
                        target="_blank"
                        className="text-primary hover:underline"
                        rel="noreferrer"
                      >
                        Privacy Policy
                      </a>{" "}
                      in conformità al GDPR.
                    </p>
                  </div>
                </div>
                {errors.privacy_consent && <p className="text-xs text-destructive ml-6">{errors.privacy_consent}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Contact Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferenza di Contatto</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={contact_preference || ""}
                onValueChange={(value) => setContactPreference(value as "email" | "telefono" | "whatsapp")}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email_pref" />
                  <Label htmlFor="email_pref" className="cursor-pointer">
                    Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="telefono" id="telefono_pref" />
                  <Label htmlFor="telefono_pref" className="cursor-pointer">
                    Telefono
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="whatsapp_pref" />
                  <Label htmlFor="whatsapp_pref" className="cursor-pointer">
                    WhatsApp
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {!isStepValid(7) && (
          <div className="text-center text-muted-foreground">
            <p>Completa tutti i campi obbligatori e accetta il consenso privacy per continuare</p>
          </div>
        )}
      </div>
    </ConfiguratorLayout>
  )
}
