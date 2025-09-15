"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { createBrowserClient } from "@supabase/ssr"
import { Bell, X, Check } from "lucide-react"

interface Notification {
  id: number
  title: string
  message: string
  type: string
  priority: string
  is_read: boolean
  created_at: string
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("configuratorelegno_notifications")
        .select("*")
        .eq("user_type", "admin")
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setIsLoading(false)
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

      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    } catch (error) {
      console.error("Error marking as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)

      if (unreadIds.length === 0) return

      const { error } = await supabase
        .from("configuratorelegno_notifications")
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .in("id", unreadIds)

      if (error) throw error

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    } catch (error) {
      console.error("Error marking all as read:", error)
    }
  }

  const getUnreadCount = () => notifications.filter((n) => !n.is_read).length

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Ora"
    if (diffInMinutes < 60) return `${diffInMinutes}m fa`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h fa`
    return `${Math.floor(diffInMinutes / 1440)}g fa`
  }

  const unreadCount = getUnreadCount()

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notifiche</h4>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  Segna tutte
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Caricamento...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Nessuna notifica</div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.is_read ? "bg-blue-50/50" : ""}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium line-clamp-1">{notification.title}</p>
                        {!notification.is_read && <div className="h-2 w-2 bg-blue-500 rounded-full"></div>}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(notification.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                setIsOpen(false)
                // Navigate to full notifications page
                window.location.href = "/admin/dashboard?tab=notifications"
              }}
            >
              Vedi tutte le notifiche
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
