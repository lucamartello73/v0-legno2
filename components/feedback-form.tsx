"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { createBrowserClient } from "@supabase/ssr"
import { Star, Send, CheckCircle } from "lucide-react"

interface FeedbackFormProps {
  configurationId?: number
  onSubmitSuccess?: () => void
}

export function FeedbackForm({ configurationId, onSubmitSuccess }: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    title: "",
    comment: "",
    rating: 0,
    service_rating: 0,
    quality_rating: 0,
    delivery_rating: 0,
    would_recommend: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.rating === 0) {
      alert("Per favore seleziona una valutazione generale")
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("configuratorelegno_feedback").insert([
        {
          ...formData,
          configuration_id: configurationId || null,
          service_rating: formData.service_rating || formData.rating,
          quality_rating: formData.quality_rating || formData.rating,
          delivery_rating: formData.delivery_rating || formData.rating,
        },
      ])

      if (error) throw error

      setIsSubmitted(true)
      onSubmitSuccess?.()
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("Errore nell'invio del feedback. Riprova più tardi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStarRating = (value: number, onChange: (rating: number) => void, label: string) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => onChange(star)} className="focus:outline-none">
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-200"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold text-green-700">Grazie per il tuo feedback!</h3>
            <p className="text-gray-600">La tua recensione è stata inviata e sarà pubblicata dopo la verifica.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Lascia una Recensione</CardTitle>
        <p className="text-center text-muted-foreground">La tua opinione è importante per noi e aiuta altri clienti</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client_name">Nome Completo</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="client_email">Email</Label>
              <Input
                id="client_email"
                type="email"
                value={formData.client_email}
                onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="title">Titolo Recensione</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="es. Servizio eccellente e pergola perfetta"
              required
            />
          </div>

          <div>
            <Label htmlFor="comment">La tua esperienza</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Racconta la tua esperienza con i nostri servizi..."
              rows={4}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {renderStarRating(
                formData.rating,
                (rating) => setFormData({ ...formData, rating }),
                "Valutazione Generale *",
              )}

              {renderStarRating(
                formData.service_rating,
                (rating) => setFormData({ ...formData, service_rating: rating }),
                "Servizio Clienti",
              )}
            </div>

            <div className="space-y-4">
              {renderStarRating(
                formData.quality_rating,
                (rating) => setFormData({ ...formData, quality_rating: rating }),
                "Qualità Prodotto",
              )}

              {renderStarRating(
                formData.delivery_rating,
                (rating) => setFormData({ ...formData, delivery_rating: rating }),
                "Puntualità Consegna",
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="would_recommend"
              checked={formData.would_recommend}
              onCheckedChange={(checked) => setFormData({ ...formData, would_recommend: checked })}
            />
            <Label htmlFor="would_recommend">Consiglieresti i nostri servizi ad altri?</Label>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || formData.rating === 0}>
            {isSubmitting ? (
              "Invio in corso..."
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Invia Recensione
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
