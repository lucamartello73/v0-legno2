"use client"

import type React from "react"

import { Header } from "@/components/header"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { TrackingAbandonmentHandler } from "@/components/tracking-abandonment"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useConfigurationStore } from "@/lib/store"
import { trackConfiguratorStep, useConfiguratorAbandonTracking } from "@/lib/gtag"
import { useEffect } from "react"

interface ConfiguratorLayoutProps {
  children: React.ReactNode
  currentStep: number
  nextHref?: string
  prevHref?: string
}

const steps = [
  { number: 1, title: "Tipo Pergola", href: "/configurator/type" },
  { number: 2, title: "Dimensioni", href: "/configurator/dimensions" },
  { number: 3, title: "Colore", href: "/configurator/color" },
  { number: 4, title: "Copertura", href: "/configurator/coverage" },
  { number: 5, title: "Pavimentazione", href: "/configurator/flooring" },
  { number: 6, title: "Accessori", href: "/configurator/accessories" },
  { number: 7, title: "Contatti", href: "/configurator/contacts" },
  { number: 8, title: "Riepilogo", href: "/configurator/summary" },
]

export function ConfiguratorLayout({ children, currentStep, nextHref, prevHref }: ConfiguratorLayoutProps) {
  const { isStepValid } = useConfigurationStore()
  const progress = (currentStep / steps.length) * 100
  const cleanup = useConfiguratorAbandonTracking(currentStep)

  useEffect(() => {
    // Traccia l'ingresso nello step corrente
    trackConfiguratorStep(currentStep)

    // Setup tracking abbandono pagina
    return cleanup
  }, [currentStep])

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <Header />
      <WhatsAppButton />
      <TrackingAbandonmentHandler />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Progress Header */}
          <div className="mb-8 bg-black/20 backdrop-blur-sm rounded-lg p-6 border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">Configuratore Pergole</h1>
              <span className="text-sm text-white/90">
                Step {currentStep} di {steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2 mb-4" />

            {/* Step Indicators */}
            <div className="hidden md:flex items-center justify-between">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex flex-col items-center ${
                    step.number === currentStep
                      ? "text-white"
                      : step.number < currentStep
                        ? "text-white/90"
                        : "text-white/80"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                      step.number === currentStep
                        ? "bg-[#E91E63] text-white"
                        : step.number < currentStep
                          ? "bg-[#E91E63] text-white"
                          : "bg-black/40 text-white border border-white/30"
                    }`}
                  >
                    {step.number}
                  </div>
                  <span className="text-xs text-center">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/95 backdrop-blur-sm border-white/20 rounded-lg shadow-lg p-6 md:p-8 mb-8">
            {children}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div>
              {prevHref && (
                <Button
                  asChild
                  variant="outline"
                  className="bg-black/30 border-white/40 text-white hover:bg-black/40 backdrop-blur-sm"
                >
                  <Link href={prevHref}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Indietro
                  </Link>
                </Button>
              )}
            </div>
            <div>
              {nextHref && (
                <Button
                  asChild
                  className="bg-[#3E2723] hover:bg-[#2C1810] text-white"
                  disabled={!isStepValid(currentStep)}
                >
                  <Link href={nextHref}>
                    {currentStep === steps.length ? "Completa" : "Continua"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
