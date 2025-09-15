"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { createBrowserClient } from "@supabase/ssr"
import { Calendar, Clock, CheckCircle, User } from "lucide-react"

interface AppointmentBookingProps {
  configurationId?: number
  onBookingSuccess?: () => void
}

export function AppointmentBooking({ configurationId, onBookingSuccess }: AppointmentBookingProps) {
  const [availableSlots, setAvailableSlots] = useState<{ date: string; times: string[] }[]>([])
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    appointment_type: "consultation",
    location: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    generateAvailableSlots()
  }, [])

  const generateAvailableSlots = () => {
    const slots = []
    const today = new Date()

    // Generate slots for next 14 days
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Skip weekends for now (can be configured)
      if (date.getDay() === 0) continue // Skip Sunday

      const dateString = date.toISOString().split("T")[0]
      const times = []

      // Generate time slots from 9:00 to 17:00
      for (let hour = 9; hour < 17; hour++) {
        times.push(`${hour.toString().padStart(2, "0")}:00`)
        if (hour < 16) {
          // Don't add 17:30
          times.push(`${hour.toString().padStart(2, "0")}:30`)
        }
      }

      slots.push({ date: dateString, times })
    }

    setAvailableSlots(slots)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !selectedTime) {
      alert("Seleziona data e ora per l'appuntamento")
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from("configuratorelegno_appointments").insert([
        {
          ...formData,
          configuration_id: configurationId || null,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          duration_minutes: 60,
          status: "scheduled",
        },
      ])

      if (error) throw error

      setIsSubmitted(true)
      onBookingSuccess?.()
    } catch (error) {
      console.error("Error booking appointment:", error)
      alert("Errore nella prenotazione. Riprova più tardi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold text-green-700">Appuntamento Prenotato!</h3>
            <div className="space-y-2 text-gray-600">
              <p>Il tuo appuntamento è stato prenotato per:</p>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-center gap-2 font-medium">
                  <Calendar className="h-4 w-4" />
                  {formatDate(selectedDate)}
                </div>
                <div className="flex items-center justify-center gap-2 font-medium">
                  <Clock className="h-4 w-4" />
                  {selectedTime}
                </div>
              </div>
              <p className="text-sm">
                Riceverai una conferma via email. Il nostro team ti contatterà per confermare i dettagli.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Prenota un Appuntamento</CardTitle>
        <p className="text-center text-muted-foreground">Scegli data e ora per la tua consulenza personalizzata</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Dati Personali
            </h3>
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
              <Label htmlFor="client_phone">Telefono</Label>
              <Input
                id="client_phone"
                value={formData.client_phone}
                onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                placeholder="+39 333 123 4567"
              />
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Dettagli Appuntamento
            </h3>
            <div>
              <Label htmlFor="appointment_type">Tipo di Appuntamento</Label>
              <Select
                value={formData.appointment_type}
                onValueChange={(value) => setFormData({ ...formData, appointment_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consulenza Iniziale</SelectItem>
                  <SelectItem value="site_visit">Sopralluogo</SelectItem>
                  <SelectItem value="follow_up">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Seleziona Data</Label>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Scegli una data" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots.map((slot) => (
                      <SelectItem key={slot.date} value={slot.date}>
                        {formatDate(slot.date)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="time">Seleziona Ora</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime} disabled={!selectedDate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Scegli un orario" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedDate &&
                      availableSlots
                        .find((slot) => slot.date === selectedDate)
                        ?.times.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="location">Indirizzo (opzionale)</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Dove si svolgerà l'appuntamento"
              />
            </div>

            <div>
              <Label htmlFor="notes">Note Aggiuntive</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Descrivi le tue esigenze o domande specifiche..."
                rows={3}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting || !selectedDate || !selectedTime}>
            {isSubmitting ? (
              "Prenotazione in corso..."
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Prenota Appuntamento
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
