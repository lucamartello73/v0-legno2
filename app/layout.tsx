import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Suspense } from "react"
import "./globals.css"
import Script from "next/script"
import FooterMartello1930 from "@/components/layout/footer-martello1930"

export const metadata: Metadata = {
  title: "LEGNO - Configuratore Pergole MARTELLO 1930",
  description:
    "Progetta la tua pergola ideale in legno con il nostro configuratore avanzato. Scegli dimensioni, colori, coperture e accessori per creare la soluzione perfetta per il tuo spazio esterno.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-R8NFXDFZQ1" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-R8NFXDFZQ1', {
              page_title: 'LEGNO Configuratore Pergole',
              custom_map: {
                'custom_parameter_1': 'configurator_name',
                'custom_parameter_2': 'step_name'
              }
            });
          `}
        </Script>
      </head>
      <body className="font-sans flex flex-col min-h-screen">
        <main className="flex-grow">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
        <FooterMartello1930 />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
