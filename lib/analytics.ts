"use client"

// Costante configuratore come richiesto
const CONFIGURATOR_NAME = "pergole_legno"

// Interfaccia per i parametri degli eventi GA4
interface GAEventParams {
  configurator_name: string
  step_name?: string
  traffic_source?: string
  traffic_medium?: string
  [key: string]: any
}

// Funzione per recuperare dati di provenienza traffico
function getTrafficData() {
  if (typeof window === "undefined") return { source: "direct", medium: "none" }

  const urlParams = new URLSearchParams(window.location.search)
  const utmSource = urlParams.get("utm_source")
  const utmMedium = urlParams.get("utm_medium")

  // Se non ci sono parametri UTM, usa il referrer
  if (!utmSource && !utmMedium) {
    const referrer = document.referrer
    if (!referrer) return { source: "direct", medium: "none" }

    try {
      const referrerDomain = new URL(referrer).hostname
      if (referrerDomain.includes("google")) return { source: "google", medium: "organic" }
      if (referrerDomain.includes("facebook")) return { source: "facebook", medium: "social" }
      if (referrerDomain.includes("instagram")) return { source: "instagram", medium: "social" }
      return { source: referrerDomain, medium: "referral" }
    } catch {
      return { source: "unknown", medium: "referral" }
    }
  }

  return {
    source: utmSource || "direct",
    medium: utmMedium || "none",
  }
}

// Mappa degli step del configuratore
const STEP_NAMES = {
  1: "tipo_pergola",
  2: "dimensioni",
  3: "colore",
  4: "copertura",
  5: "pavimentazione",
  6: "accessori",
  7: "contatti",
  8: "riepilogo",
}

// Funzione per inviare eventi a GA4
function sendGAEvent(eventName: string, parameters: GAEventParams) {
  if (typeof window !== "undefined" && window.gtag) {
    console.log(`[GA4] Tracking event: ${eventName}`, parameters)
    window.gtag("event", eventName, parameters)
  }
}

// Tracking avanzamento step
export function trackConfiguratorStep(stepNumber: number) {
  const trafficData = getTrafficData()
  const stepName = STEP_NAMES[stepNumber as keyof typeof STEP_NAMES] || `step_${stepNumber}`

  sendGAEvent("configurator_step", {
    configurator_name: CONFIGURATOR_NAME,
    step_name: stepName,
    traffic_source: trafficData.source,
    traffic_medium: trafficData.medium,
    step_number: stepNumber,
  })
}

// Tracking submit configurazione finale
export function trackConfiguratorSubmit(configurationData?: any) {
  const trafficData = getTrafficData()

  sendGAEvent("configurator_form_submit", {
    configurator_name: CONFIGURATOR_NAME,
    step_name: "submit_final",
    traffic_source: trafficData.source,
    traffic_medium: trafficData.medium,
    configuration_type: configurationData?.type_name || "unknown",
    service_type: configurationData?.service_type || "unknown",
  })
}

// Tracking abbandono configuratore
export function trackConfiguratorAbandon(currentStep: number) {
  const trafficData = getTrafficData()
  const stepName = STEP_NAMES[currentStep as keyof typeof STEP_NAMES] || `step_${currentStep}`

  sendGAEvent("configurator_abandon", {
    configurator_name: CONFIGURATOR_NAME,
    step_name: stepName,
    traffic_source: trafficData.source,
    traffic_medium: trafficData.medium,
    abandon_step: currentStep,
  })
}

// Hook per gestire l'abbandono della pagina
export function useConfiguratorAbandonTracking(currentStep: number) {
  if (typeof window !== "undefined") {
    const handleBeforeUnload = () => {
      trackConfiguratorAbandon(currentStep)
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }
}

// Dichiarazione globale per TypeScript
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
  }
}
