"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { createBrowserClient } from "@supabase/ssr"
import { Calendar, Clock, MapPin, Phone, Mail, Plus, Edit, Trash2, CheckCircle, XCircle, RotateCcw } from "lucide-react"

interface Appointment {
  id: number
  configuration_id: number
  client_name: string
  client_email: string
  client_phone: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  appointment_type: string
  status: string
  location: string
  notes: string
  admin_notes: string
  reminder_sent: boolean
  created_at: string
}

const appointmentTypes = {
  consultation: { label: "Consulenza", color: "bg-blue-500" },
  site_visit: { label: "Sopralluogo", color: "bg-green-500" },
  installation: { label: "Installazione", color: "bg-purple-500" },
  follow_up: { label: "Follow-up", color: "bg-orange-500" },
}

const statusConfig = {
  scheduled: { label: "Programmato", color: "bg-blue-500", icon: Clock },
  confirmed: { label: "Confermato", color: "bg-green-500", icon: CheckCircle },
  completed: { label: "Completato", color: "bg-gray-500", icon: CheckCircle },
  cancelled: { label: "Annullato", color: "bg-red-500", icon: XCircle },
  rescheduled: { label: "Riprogrammato", color: "bg-orange-500", icon: RotateCcw },
}

export function AdminCalendario() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    appointment_date: "",
    appointment_time: "",
    appointment_type: "consultation",
    location: "",
    notes: "",
    admin_notes: "",
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    loadAppointments()
  }, [selectedDate])

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from("configuratorelegno_appointments")
        .select("*")
        .gte("appointment_date", selectedDate)
        .lte(
          "appointment_date",
          new Date(new Date(selectedDate).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        )
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true })

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error("Error loading appointments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (selectedAppointment) {
        const { error } = await supabase
          .from("configuratorelegno_appointments")
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq("id", selectedAppointment.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("configuratorelegno_appointments").insert([formData])

        if (error) throw error
      }

      await loadAppointments()
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error saving appointment:", error)
      alert("Errore nel salvare l'appuntamento")
    }
  }

  const updateAppointmentStatus = async (id: number, status: string) => {
    try {
      const { error } = await supabase
        .from("configuratorelegno_appointments")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)

      if (error) throw error
      await loadAppointments()
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const deleteAppointment = async (id: number) => {
    if (!confirm("Sei sicuro di voler eliminare questo appuntamento?")) return

    try {
      const { error } = await supabase.from("configuratorelegno_appointments").delete().eq("id", id)

      if (error) throw error
      await loadAppointments()
    } catch (error) {
      console.error("Error deleting appointment:", error)
    }
  }

  const openEditDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setFormData({
      client_name: appointment.client_name,
      client_email: appointment.client_email,
      client_phone: appointment.client_phone,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      appointment_type: appointment.appointment_type,
      location: appointment.location,
      notes: appointment.notes,
      admin_notes: appointment.admin_notes,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      client_name: "",
      client_email: "",
      client_phone: "",
      appointment_date: "",
      appointment_time: "",
      appointment_type: "consultation",
      location: "",
      notes: "",
      admin_notes: "",
    })
    setSelectedAppointment(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5)
  }

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const config = appointmentTypes[type as keyof typeof appointmentTypes]
    return <Badge className={`${config.color} text-white`}>{config.label}</Badge>
  }

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split("T")[0]
    return appointments.filter((apt) => apt.appointment_date === today)
  }

  const getUpcomingAppointments = () => {
    const today = new Date().toISOString().split("T")[0]
    return appointments.filter((apt) => apt.appointment_date > today)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Caricamento calendario...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const todayAppointments = getTodayAppointments()
  const upcomingAppointments = getUpcomingAppointments()

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{appointments.length}</p>
                <p className="text-xs text-muted-foreground">Appuntamenti Totali</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{todayAppointments.length}</p>
                <p className="text-xs text-muted-foreground">Oggi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{appointments.filter((a) => a.status === "confirmed").length}</p>
                <p className="text-xs text-muted-foreground">Confermati</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <RotateCcw className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{appointments.filter((a) => a.status === "scheduled").length}</p>
                <p className="text-xs text-muted-foreground">Da Confermare</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Gestione Calendario</CardTitle>
              <p className="text-sm text-muted-foreground">Gestisci gli appuntamenti con i clienti</p>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <Label htmlFor="date-filter">Visualizza da:</Label>
                <Input
                  id="date-filter"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuovo Appuntamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{selectedAppointment ? "Modifica Appuntamento" : "Nuovo Appuntamento"}</DialogTitle>
                    <DialogDescription>Inserisci i dettagli dell'appuntamento</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="client_name">Nome Cliente</Label>
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="client_phone">Telefono</Label>
                        <Input
                          id="client_phone"
                          value={formData.client_phone}
                          onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="appointment_type">Tipo Appuntamento</Label>
                        <Select
                          value={formData.appointment_type}
                          onValueChange={(value) => setFormData({ ...formData, appointment_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consultation">Consulenza</SelectItem>
                            <SelectItem value="site_visit">Sopralluogo</SelectItem>
                            <SelectItem value="installation">Installazione</SelectItem>
                            <SelectItem value="follow_up">Follow-up</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="appointment_date">Data</Label>
                        <Input
                          id="appointment_date"
                          type="date"
                          value={formData.appointment_date}
                          onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="appointment_time">Ora</Label>
                        <Input
                          id="appointment_time"
                          type="time"
                          value={formData.appointment_time}
                          onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="location">Località</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Indirizzo dell'appuntamento"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Note Cliente</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label htmlFor="admin_notes">Note Amministrative</Label>
                      <Textarea
                        id="admin_notes"
                        value={formData.admin_notes}
                        onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                        rows={2}
                      />
                    </div>

                    <DialogFooter>
                      <Button type="submit">{selectedAppointment ? "Aggiorna" : "Crea"} Appuntamento</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Today's Appointments */}
      {todayAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Appuntamenti di Oggi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <Card key={appointment.id} className="border-l-4 border-l-green-500">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">{appointment.client_name}</h4>
                          {getStatusBadge(appointment.status)}
                          {getTypeBadge(appointment.appointment_type)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(appointment.appointment_time)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {appointment.client_email}
                          </div>
                          {appointment.client_phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {appointment.client_phone}
                            </div>
                          )}
                        </div>
                        {appointment.location && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {appointment.location}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(appointment)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAppointment(appointment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Tutti gli Appuntamenti</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Nessun appuntamento programmato</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">{appointment.client_name}</h4>
                          {getStatusBadge(appointment.status)}
                          {getTypeBadge(appointment.appointment_type)}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {formatDate(appointment.appointment_date)}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {formatTime(appointment.appointment_time)} ({appointment.duration_minutes} min)
                            </div>
                            {appointment.location && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {appointment.location}
                              </div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              {appointment.client_email}
                            </div>
                            {appointment.client_phone && (
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                {appointment.client_phone}
                              </div>
                            )}
                          </div>
                        </div>

                        {appointment.notes && (
                          <div className="bg-gray-50 p-2 rounded text-sm">
                            <strong>Note:</strong> {appointment.notes}
                          </div>
                        )}

                        {appointment.admin_notes && (
                          <div className="bg-blue-50 p-2 rounded text-sm">
                            <strong>Note Admin:</strong> {appointment.admin_notes}
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          {appointment.status === "scheduled" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Conferma
                            </Button>
                          )}
                          {appointment.status === "confirmed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Completa
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Annulla
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(appointment)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAppointment(appointment.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
