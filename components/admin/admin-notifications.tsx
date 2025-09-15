"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
import {
  Bell,
  BellRing,
  Send,
  Settings,
  Trash2,
  Eye,
  Plus,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
} from "lucide-react"

interface Notification {
  id: number
  user_type: string
  recipient_email: string
  title: string
  message: string
  type: string
  related_id: number
  is_read: boolean
  is_sent: boolean
  priority: string
  created_at: string
  read_at: string
  sent_at: string
}

interface NotificationPreferences {
  id: number
  user_email: string
  email_notifications: boolean
  push_notifications: boolean
  sms_notifications: boolean
  notification_types: string[]
}

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newNotification, setNewNotification] = useState({
    user_type: "client",
    recipient_email: "",
    title: "",
    message: "",
    type: "system_alert",
    priority: "normal",
  })
  const [isCreating, setIsCreating] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    loadNotifications()
    loadPreferences()
  }, [])

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from("configuratorelegno_notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
  }

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from("configuratorelegno_notification_preferences")
        .select("*")
        .eq("user_email", "admin@martello1930.net")
        .single()

      if (error && error.code !== "PGRST116") throw error
      setPreferences(data)
    } catch (error) {
      console.error("Error loading preferences:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const createNotification = async () => {
    if (!newNotification.title || !newNotification.message || !newNotification.recipient_email) {
      alert("Compila tutti i campi obbligatori")
      return
    }

    setIsCreating(true)
    try {
      const { error } = await supabase.from("configuratorelegno_notifications").insert([newNotification])

      if (error) throw error

      await loadNotifications()
      setNewNotification({
        user_type: "client",
        recipient_email: "",
        title: "",
        message: "",
        type: "system_alert",
        priority: "normal",
      })
    } catch (error) {
      console.error("Error creating notification:", error)
      alert("Errore nella creazione della notifica")
    } finally {
      setIsCreating(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from("configuratorelegno_notifications")
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) throw error
      await loadNotifications()
    } catch (error) {
      console.error("Error marking as read:", error)
    }
  }

  const deleteNotification = async (id: number) => {
    if (!confirm("Sei sicuro di voler eliminare questa notifica?")) return

    try {
      const { error } = await supabase.from("configuratorelegno_notifications").delete().eq("id", id)

      if (error) throw error
      await loadNotifications()
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const updatePreferences = async (updates: Partial<NotificationPreferences>) => {
    try {
      if (preferences) {
        const { error } = await supabase
          .from("configuratorelegno_notification_preferences")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", preferences.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("configuratorelegno_notification_preferences").insert([
          {
            user_email: "admin@martello1930.net",
            ...updates,
          },
        ])

        if (error) throw error
      }

      await loadPreferences()
    } catch (error) {
      console.error("Error updating preferences:", error)
    }
  }

  const getNotificationIcon = (type: string, priority: string) => {
    if (priority === "urgent") return <AlertTriangle className="h-5 w-5 text-red-500" />
    if (priority === "high") return <AlertCircle className="h-5 w-5 text-orange-500" />

    switch (type) {
      case "new_configuration":
        return <Bell className="h-5 w-5 text-blue-500" />
      case "status_update":
        return <Info className="h-5 w-5 text-green-500" />
      case "new_feedback":
        return <CheckCircle className="h-5 w-5 text-purple-500" />
      case "system_alert":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: "bg-gray-500",
      normal: "bg-blue-500",
      high: "bg-orange-500",
      urgent: "bg-red-500",
    }
    return (
      <Badge className={`${colors[priority as keyof typeof colors]} text-white text-xs`}>
        {priority.toUpperCase()}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getUnreadCount = () => notifications.filter((n) => !n.is_read).length

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Caricamento notifiche...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats and Actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BellRing className="h-6 w-6 text-blue-600" />
            <span className="text-2xl font-bold">{notifications.length}</span>
            <span className="text-muted-foreground">Notifiche</span>
          </div>
          {getUnreadCount() > 0 && <Badge className="bg-red-500 text-white">{getUnreadCount()} non lette</Badge>}
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Preferenze
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Preferenze Notifiche</DialogTitle>
                <DialogDescription>Configura come ricevere le notifiche</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Notifiche Email</Label>
                  <Switch
                    checked={preferences?.email_notifications || false}
                    onCheckedChange={(checked) => updatePreferences({ email_notifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Notifiche Push</Label>
                  <Switch
                    checked={preferences?.push_notifications || false}
                    onCheckedChange={(checked) => updatePreferences({ push_notifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Notifiche SMS</Label>
                  <Switch
                    checked={preferences?.sms_notifications || false}
                    onCheckedChange={(checked) => updatePreferences({ sms_notifications: checked })}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuova Notifica
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crea Nuova Notifica</DialogTitle>
                <DialogDescription>Invia una notifica personalizzata</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Destinatario</Label>
                    <Select
                      value={newNotification.user_type}
                      onValueChange={(value) => setNewNotification({ ...newNotification, user_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Cliente</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priorità</Label>
                    <Select
                      value={newNotification.priority}
                      onValueChange={(value) => setNewNotification({ ...newNotification, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Bassa</SelectItem>
                        <SelectItem value="normal">Normale</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Email Destinatario</Label>
                  <Input
                    value={newNotification.recipient_email}
                    onChange={(e) => setNewNotification({ ...newNotification, recipient_email: e.target.value })}
                    placeholder="cliente@example.com"
                    type="email"
                  />
                </div>

                <div>
                  <Label>Titolo</Label>
                  <Input
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                    placeholder="Titolo della notifica"
                  />
                </div>

                <div>
                  <Label>Messaggio</Label>
                  <Textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                    placeholder="Contenuto del messaggio..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Tipo</Label>
                  <Select
                    value={newNotification.type}
                    onValueChange={(value) => setNewNotification({ ...newNotification, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system_alert">Avviso Sistema</SelectItem>
                      <SelectItem value="status_update">Aggiornamento Stato</SelectItem>
                      <SelectItem value="new_configuration">Nuova Configurazione</SelectItem>
                      <SelectItem value="new_feedback">Nuovo Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={createNotification} disabled={isCreating}>
                  {isCreating ? "Invio..." : "Invia Notifica"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Centro Notifiche</CardTitle>
          <p className="text-sm text-muted-foreground">Gestisci tutte le notifiche del sistema</p>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Nessuna notifica presente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`${!notification.is_read ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""}`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getNotificationIcon(notification.type, notification.priority)}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{notification.title}</h4>
                            {getPriorityBadge(notification.priority)}
                            <Badge variant="outline" className="text-xs">
                              {notification.user_type === "admin" ? "Admin" : "Cliente"}
                            </Badge>
                            {!notification.is_read && <Badge className="bg-blue-500 text-white text-xs">Nuovo</Badge>}
                          </div>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Per: {notification.recipient_email}</span>
                            <span>{formatDate(notification.created_at)}</span>
                            {notification.is_sent && (
                              <Badge variant="outline" className="text-xs">
                                <Send className="h-3 w-3 mr-1" />
                                Inviata
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {!notification.is_read && (
                          <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
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
