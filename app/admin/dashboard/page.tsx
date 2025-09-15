"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHomepage } from "@/components/admin/admin-homepage"
import { AdminPergole } from "@/components/admin/admin-pergole"
import { AdminAccessori } from "@/components/admin/admin-accessori"
import { AdminCoperture } from "@/components/admin/admin-coperture"
import { AdminPavimenti } from "@/components/admin/admin-pavimenti"
import { AdminConfigurazioni } from "@/components/admin/admin-configurazioni"
import { AdminTestEmail } from "@/components/admin/admin-test-email"
import { AdminAnalytics } from "@/components/admin/admin-analytics"
import { AdminProgetti } from "@/components/admin/admin-progetti"
import { AdminFeedback } from "@/components/admin/admin-feedback"
import { AdminNotifications } from "@/components/admin/admin-notifications"
import { AdminCalendario } from "@/components/admin/admin-calendario"

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-12">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="pergole">Pergole</TabsTrigger>
          <TabsTrigger value="accessori">Accessori</TabsTrigger>
          <TabsTrigger value="coperture">Coperture</TabsTrigger>
          <TabsTrigger value="pavimenti">Pavimenti</TabsTrigger>
          <TabsTrigger value="progetti">Progetti</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="notifiche">Notifiche</TabsTrigger>
          <TabsTrigger value="calendario">Calendario</TabsTrigger>
          <TabsTrigger value="configurazioni">Configurazioni</TabsTrigger>
          <TabsTrigger value="email">Test Email</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <AdminAnalytics />
        </TabsContent>

        <TabsContent value="homepage">
          <AdminHomepage />
        </TabsContent>

        <TabsContent value="pergole">
          <AdminPergole />
        </TabsContent>

        <TabsContent value="accessori">
          <AdminAccessori />
        </TabsContent>

        <TabsContent value="coperture">
          <AdminCoperture />
        </TabsContent>

        <TabsContent value="pavimenti">
          <AdminPavimenti />
        </TabsContent>

        <TabsContent value="progetti">
          <AdminProgetti />
        </TabsContent>

        <TabsContent value="feedback">
          <AdminFeedback />
        </TabsContent>

        <TabsContent value="notifiche">
          <AdminNotifications />
        </TabsContent>

        <TabsContent value="calendario">
          <AdminCalendario />
        </TabsContent>

        <TabsContent value="configurazioni">
          <AdminConfigurazioni />
        </TabsContent>

        <TabsContent value="email">
          <AdminTestEmail />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  )
}
