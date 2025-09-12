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

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <Tabs defaultValue="homepage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="pergole">Pergole</TabsTrigger>
          <TabsTrigger value="accessori">Accessori</TabsTrigger>
          <TabsTrigger value="coperture">Coperture</TabsTrigger>
          <TabsTrigger value="pavimenti">Pavimenti</TabsTrigger>
          <TabsTrigger value="configurazioni">Configurazioni</TabsTrigger>
          <TabsTrigger value="email">Test Email</TabsTrigger>
        </TabsList>

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
