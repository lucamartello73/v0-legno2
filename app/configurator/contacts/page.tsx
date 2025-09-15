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

        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold text-primary mb-2">Scegli il Tipo di Servizio</CardTitle>
            <p className="text-muted-foreground text-lg">Seleziona la modalità di fornitura che preferisci</p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <RadioGroup
              value={service_type || ""}
              onValueChange={(value) => setService(value as "chiavi_in_mano" | "fai_da_te")}
              className="grid md:grid-cols-2 gap-8"
            >
              <div
                className={`relative p-8 rounded-xl border-3 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  service_type === "chiavi_in_mano"
                    ? "border-primary bg-gradient-to-br from-primary/15 to-primary/25 ring-4 ring-primary/30 shadow-xl"
                    : "border-muted bg-white hover:border-primary/60 hover:shadow-lg"
                }`}
              >
                {service_type === "chiavi_in_mano" && (
                  <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                <div className="flex items-start space-x-4">
                  <RadioGroupItem value="chiavi_in_mano" id="chiavi_in_mano" className="mt-2 scale-125" />
                  <Label htmlFor="chiavi_in_mano" className="cursor-pointer flex-1">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-primary">🔑 Chiavi in Mano</div>
                        <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                          COMPLETO
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-foreground">Con Trasporto e Montaggio</div>
                      <div className="text-muted-foreground leading-relaxed">
                        Servizio completo: progettazione, fornitura, trasporto e installazione professionale
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                        <div className="text-sm font-medium text-green-800">✓ Sopralluogo gratuito</div>
                        <div className="text-sm font-medium text-green-800">✓ Montaggio professionale</div>
                        <div className="text-sm font-medium text-green-800">✓ Garanzia completa</div>
                        <div className="text-sm font-medium text-green-800">✓ Assistenza post-vendita</div>
                      </div>
                    </div>
                  </Label>
                </div>
              </div>

              <div
                className={`relative p-8 rounded-xl border-3 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  service_type === "fai_da_te"
                    ? "border-primary bg-gradient-to-br from-primary/15 to-primary/25 ring-4 ring-primary/30 shadow-xl"
                    : "border-muted bg-white hover:border-primary/60 hover:shadow-lg"
                }`}
              >
                {service_type === "fai_da_te" && (
                  <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                <div className="flex items-start space-x-4">
                  <RadioGroupItem value="fai_da_te" id="fai_da_te" className="mt-2 scale-125" />
                  <Label htmlFor="fai_da_te" className="cursor-pointer flex-1">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-primary">📦 Solo Fornitura</div>
                        <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                          ECONOMICO
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-foreground">Fai da Te</div>
                      <div className="text-muted-foreground leading-relaxed">
                        Solo materiali con istruzioni dettagliate per il montaggio autonomo
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                        <div className="text-sm font-medium text-blue-800">✓ Prezzo più conveniente</div>
                        <div className="text-sm font-medium text-blue-800">✓ Istruzioni dettagliate</div>
                        <div className="text-sm font-medium text-blue-800">✓ Supporto telefonico</div>
                        <div className="text-sm font-medium text-blue-800">✓ Video tutorial inclusi</div>
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
              <p className="text-muted-foreground">Scegli come preferisci essere contattato per il preventivo</p>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={contact_preference || ""}
                onValueChange={(value) => setContactPreference(value as "email" | "telefono" | "whatsapp")}
                className="space-y-4"
              >
                <div
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                    contact_preference === "email"
                      ? "border-primary bg-gradient-to-br from-primary/15 to-primary/25 ring-2 ring-primary/30 shadow-lg"
                      : "border-muted bg-white hover:border-primary/60 hover:shadow-md"
                  }`}
                >
                  {contact_preference === "email" && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="email" id="email_pref" className="scale-125" />
                    <Label htmlFor="email_pref" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">📧</div>
                        <div>
                          <div className="text-lg font-semibold">Email</div>
                          <div className="text-sm text-muted-foreground">Ricevi il preventivo via email</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>

                <div
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                    contact_preference === "telefono"
                      ? "border-primary bg-gradient-to-br from-primary/15 to-primary/25 ring-2 ring-primary/30 shadow-lg"
                      : "border-muted bg-white hover:border-primary/60 hover:shadow-md"
                  }`}
                >
                  {contact_preference === "telefono" && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="telefono" id="telefono_pref" className="scale-125" />
                    <Label htmlFor="telefono_pref" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">📞</div>
                        <div>
                          <div className="text-lg font-semibold">Telefono</div>
                          <div className="text-sm text-muted-foreground">
                            Chiamata diretta per discutere il preventivo
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>

                <div
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                    contact_preference === "whatsapp"
                      ? "border-primary bg-gradient-to-br from-primary/15 to-primary/25 ring-2 ring-primary/30 shadow-lg"
                      : "border-muted bg-white hover:border-primary/60 hover:shadow-md"
                  }`}
                >
                  {contact_preference === "whatsapp" && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="flex items-center space-x-4">
                    <RadioGroupItem value="whatsapp" id="whatsapp_pref" className="scale-125" />
                    <Label htmlFor="whatsapp_pref" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">💬</div>
                        <div>
                          <div className="text-lg font-semibold">WhatsApp</div>
                          <div className="text-sm text-muted-foreground">Chat veloce e comoda su WhatsApp</div>
                        </div>
                      </div>
                    </Label>
                  </div>
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
