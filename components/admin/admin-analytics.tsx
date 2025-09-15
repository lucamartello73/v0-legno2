"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createBrowserClient } from "@supabase/ssr"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface AnalyticsData {
  totalConfigurations: number
  pendingQuotes: number
  completedQuotes: number
  popularPergola: string
  popularColor: string
  popularAccessories: string[]
  monthlyStats: { month: string; count: number }[]
  serviceTypeStats: { name: string; value: number; color: string }[]
}

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Fetch all configurations
      const { data: configurations, error } = await supabase.from("configuratorelegno_configurations").select("*")

      if (error) throw error

      if (!configurations) {
        setAnalytics({
          totalConfigurations: 0,
          pendingQuotes: 0,
          completedQuotes: 0,
          popularPergola: "Nessun dato",
          popularColor: "Nessun dato",
          popularAccessories: [],
          monthlyStats: [],
          serviceTypeStats: [],
        })
        setLoading(false)
        return
      }

      // Calculate analytics
      const totalConfigurations = configurations.length
      const pendingQuotes = configurations.filter((c) => c.status === "pending" || !c.status).length
      const completedQuotes = configurations.filter((c) => c.status === "completed").length

      // Most popular pergola
      const pergolaCount: { [key: string]: number } = {}
      configurations.forEach((config) => {
        if (config.pergola_type) {
          pergolaCount[config.pergola_type] = (pergolaCount[config.pergola_type] || 0) + 1
        }
      })
      const popularPergola = Object.keys(pergolaCount).reduce(
        (a, b) => (pergolaCount[a] > pergolaCount[b] ? a : b),
        "Nessun dato",
      )

      // Most popular color
      const colorCount: { [key: string]: number } = {}
      configurations.forEach((config) => {
        if (config.colors) {
          const colors = typeof config.colors === "string" ? JSON.parse(config.colors) : config.colors
          Object.values(colors).forEach((color: any) => {
            if (color && typeof color === "string") {
              colorCount[color] = (colorCount[color] || 0) + 1
            }
          })
        }
      })
      const popularColor = Object.keys(colorCount).reduce(
        (a, b) => (colorCount[a] > colorCount[b] ? a : b),
        "Nessun dato",
      )

      // Most popular accessories
      const accessoryCount: { [key: string]: number } = {}
      configurations.forEach((config) => {
        if (config.accessories) {
          const accessories =
            typeof config.accessories === "string" ? JSON.parse(config.accessories) : config.accessories
          accessories.forEach((acc: string) => {
            accessoryCount[acc] = (accessoryCount[acc] || 0) + 1
          })
        }
      })
      const popularAccessories = Object.keys(accessoryCount)
        .sort((a, b) => accessoryCount[b] - accessoryCount[a])
        .slice(0, 3)

      // Monthly stats (last 6 months)
      const monthlyStats = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthName = date.toLocaleDateString("it-IT", { month: "short" })
        const count = configurations.filter((config) => {
          const configDate = new Date(config.created_at)
          return configDate.getMonth() === date.getMonth() && configDate.getFullYear() === date.getFullYear()
        }).length
        monthlyStats.push({ month: monthName, count })
      }

      // Service type stats
      const chiaveInMano = configurations.filter((c) => c.service_type === "chiavi_in_mano").length
      const soloFornitura = configurations.filter((c) => c.service_type === "solo_fornitura").length

      const serviceTypeStats = [
        { name: "Chiavi in Mano", value: chiaveInMano, color: "#10b981" },
        { name: "Solo Fornitura", value: soloFornitura, color: "#3b82f6" },
      ]

      setAnalytics({
        totalConfigurations,
        pendingQuotes,
        completedQuotes,
        popularPergola,
        popularColor,
        popularAccessories,
        monthlyStats,
        serviceTypeStats,
      })
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Caricamento...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configurazioni Totali</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📊</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalConfigurations}</div>
            <p className="text-xs text-muted-foreground">Tutte le configurazioni create</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preventivi in Attesa</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">⏳</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{analytics.pendingQuotes}</div>
            <p className="text-xs text-muted-foreground">Da processare</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preventivi Completati</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">✅</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics.completedQuotes}</div>
            <p className="text-xs text-muted-foreground">Processati con successo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasso di Conversione</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📈</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {analytics.totalConfigurations > 0
                ? Math.round((analytics.completedQuotes / analytics.totalConfigurations) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Preventivi completati</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configurazioni per Mese</CardTitle>
            <CardDescription>Ultimi 6 mesi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.monthlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipo di Servizio</CardTitle>
            <CardDescription>Distribuzione delle richieste</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.serviceTypeStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.serviceTypeStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Popular Items */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pergola Più Richiesta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-green-600">{analytics.popularPergola}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Colore Più Popolare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-blue-600">{analytics.popularColor}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accessori Top 3</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.popularAccessories.length > 0 ? (
                analytics.popularAccessories.map((accessory, index) => (
                  <Badge key={index} variant="secondary">
                    {index + 1}. {accessory}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nessun dato disponibile</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
