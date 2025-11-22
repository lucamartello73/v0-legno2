"use client"

import { track } from '@vercel/analytics'

// ============================================
// VERCEL ANALYTICS - CUSTOM EVENTS
// ============================================
// Traccia eventi specifici del configuratore
// con dati dettagliati per analytics avanzato

// Interfaccia per dati configurazione
interface ConfigurationData {
  type_name?: string
  width?: number
  depth?: number
  height?: number
  color_name?: string
  coverage_name?: string
  flooring_names?: string[]
  accessory_names?: string[]
  total_price?: number
  service_type?: string
}

// ============================================
// TRACKING INIZIO CONFIGURATORE
// ============================================
export function trackConfiguratorStart() {
  track('configurator_started', {
    timestamp: new Date().toISOString(),
    configurator_type: 'pergole_legno',
  })
  console.log('📊 [Vercel Analytics] Configuratore iniziato')
}

// ============================================
// TRACKING AVANZAMENTO STEP
// ============================================
export function trackStepCompleted(stepNumber: number, stepName: string, stepData?: any) {
  track('configurator_step_completed', {
    step_number: stepNumber,
    step_name: stepName,
    step_data: JSON.stringify(stepData),
    timestamp: new Date().toISOString(),
  })
  console.log(`📊 [Vercel Analytics] Step ${stepNumber} (${stepName}) completato:`, stepData)
}

// ============================================
// TRACKING SCELTE SPECIFICHE
// ============================================

// Step 1: Tipo Pergola
export function trackPergolaTypeSelected(pergolaType: string) {
  track('pergola_type_selected', {
    type: pergolaType,
    step: 1,
    timestamp: new Date().toISOString(),
  })
  console.log('📊 [Vercel Analytics] Tipo pergola selezionato:', pergolaType)
}

// Step 2: Dimensioni
export function trackDimensionsSelected(dimensions: { width: number; depth: number; height: number }) {
  const area = dimensions.width * dimensions.depth
  const volume = area * dimensions.height

  track('dimensions_selected', {
    width: dimensions.width,
    depth: dimensions.depth,
    height: dimensions.height,
    area: area,
    volume: volume,
    step: 2,
    timestamp: new Date().toISOString(),
  })
  console.log('📊 [Vercel Analytics] Dimensioni selezionate:', dimensions)
}

// Step 3: Colore
export function trackColorSelected(colorName: string, colorCategory?: string) {
  track('color_selected', {
    color_name: colorName,
    color_category: colorCategory || 'unknown',
    step: 3,
    timestamp: new Date().toISOString(),
  })
  console.log('📊 [Vercel Analytics] Colore selezionato:', colorName)
}

// Step 4: Copertura
export function trackCoverageSelected(coverageName: string, coveragePrice?: number) {
  track('coverage_selected', {
    coverage_name: coverageName,
    coverage_price: coveragePrice || 0,
    step: 4,
    timestamp: new Date().toISOString(),
  })
  console.log('📊 [Vercel Analytics] Copertura selezionata:', coverageName)
}

// Step 5: Pavimentazioni
export function trackFlooringSelected(flooringTypes: string[]) {
  track('flooring_selected', {
    flooring_types: flooringTypes.join(', '),
    flooring_count: flooringTypes.length,
    step: 5,
    timestamp: new Date().toISOString(),
  })
  console.log('📊 [Vercel Analytics] Pavimentazioni selezionate:', flooringTypes)
}

// Step 6: Accessori
export function trackAccessoriesSelected(accessories: string[], totalAccessoryPrice?: number) {
  track('accessories_selected', {
    accessories: accessories.join(', '),
    accessory_count: accessories.length,
    total_accessory_price: totalAccessoryPrice || 0,
    step: 6,
    timestamp: new Date().toISOString(),
  })
  console.log('📊 [Vercel Analytics] Accessori selezionati:', accessories)
}

// ============================================
// TRACKING PREZZI
// ============================================
export function trackPriceCalculation(price: number, configuration: Partial<ConfigurationData>) {
  track('price_calculated', {
    total_price: price,
    price_range: getPriceRange(price),
    has_flooring: (configuration.flooring_names?.length || 0) > 0,
    has_accessories: (configuration.accessory_names?.length || 0) > 0,
    service_type: configuration.service_type || 'unknown',
    timestamp: new Date().toISOString(),
  })
  console.log('📊 [Vercel Analytics] Prezzo calcolato:', price)
}

// Helper: Fascia prezzo
function getPriceRange(price: number): string {
  if (price < 3000) return '< 3000€'
  if (price < 5000) return '3000-5000€'
  if (price < 8000) return '5000-8000€'
  if (price < 12000) return '8000-12000€'
  return '> 12000€'
}

// ============================================
// TRACKING ABBANDONO
// ============================================
export function trackConfiguratorAbandoned(
  currentStep: number,
  currentStepName: string,
  partialData?: Partial<ConfigurationData>,
) {
  track('configurator_abandoned', {
    abandoned_at_step: currentStep,
    abandoned_at_step_name: currentStepName,
    partial_config: JSON.stringify(partialData),
    timestamp: new Date().toISOString(),
  })
  console.log(`📊 [Vercel Analytics] Configuratore abbandonato allo step ${currentStep} (${currentStepName})`)
}

// ============================================
// TRACKING SUBMIT FINALE
// ============================================
export function trackConfiguratorSubmitted(configuration: ConfigurationData, contactData: any) {
  track('configurator_submitted', {
    // Dati configurazione
    type_name: configuration.type_name,
    dimensions: `${configuration.width}x${configuration.depth}x${configuration.height}`,
    color: configuration.color_name,
    coverage: configuration.coverage_name,
    flooring_count: configuration.flooring_names?.length || 0,
    flooring_types: configuration.flooring_names?.join(', ') || 'none',
    accessory_count: configuration.accessory_names?.length || 0,
    accessories: configuration.accessory_names?.join(', ') || 'none',
    total_price: configuration.total_price,
    price_range: getPriceRange(configuration.total_price || 0),
    service_type: configuration.service_type,

    // Dati contatto
    contact_preference: contactData.contact_preference || 'unknown',
    has_note: !!contactData.note,

    // Metadata
    timestamp: new Date().toISOString(),
  })
  console.log('📊 [Vercel Analytics] Configuratore inviato con successo!', configuration)
}

// ============================================
// TRACKING INTERAZIONI UI
// ============================================

// Click su "Avanti"
export function trackNextButtonClick(fromStep: number, fromStepName: string) {
  track('next_button_clicked', {
    from_step: fromStep,
    from_step_name: fromStepName,
    timestamp: new Date().toISOString(),
  })
}

// Click su "Indietro"
export function trackBackButtonClick(fromStep: number, toStep: number) {
  track('back_button_clicked', {
    from_step: fromStep,
    to_step: toStep,
    timestamp: new Date().toISOString(),
  })
}

// Visualizzazione riepilogo
export function trackSummaryViewed(configuration: Partial<ConfigurationData>) {
  track('summary_viewed', {
    total_price: configuration.total_price,
    has_flooring: (configuration.flooring_names?.length || 0) > 0,
    has_accessories: (configuration.accessory_names?.length || 0) > 0,
    timestamp: new Date().toISOString(),
  })
  console.log('📊 [Vercel Analytics] Riepilogo visualizzato')
}

// ============================================
// TRACKING TEMPO
// ============================================
let stepStartTime: number | null = null

export function startStepTimer() {
  stepStartTime = Date.now()
}

export function trackStepDuration(stepNumber: number, stepName: string) {
  if (stepStartTime) {
    const duration = Date.now() - stepStartTime
    track('step_duration', {
      step_number: stepNumber,
      step_name: stepName,
      duration_seconds: Math.round(duration / 1000),
      timestamp: new Date().toISOString(),
    })
    console.log(`📊 [Vercel Analytics] Step ${stepNumber} durata: ${Math.round(duration / 1000)}s`)
    stepStartTime = null
  }
}

// ============================================
// TRACKING ERRORI
// ============================================
export function trackError(errorType: string, errorMessage: string, step?: number) {
  track('configurator_error', {
    error_type: errorType,
    error_message: errorMessage,
    step: step || 0,
    timestamp: new Date().toISOString(),
  })
  console.error('📊 [Vercel Analytics] Errore:', errorType, errorMessage)
}

// ============================================
// HOOK PER ABBANDONO PAGINA
// ============================================
export function useAbandonTracking(
  currentStep: number,
  currentStepName: string,
  partialData?: Partial<ConfigurationData>,
) {
  if (typeof window !== 'undefined') {
    const handleBeforeUnload = () => {
      // Solo se non è l'ultimo step (summary già inviato)
      if (currentStep < 8) {
        trackConfiguratorAbandoned(currentStep, currentStepName, partialData)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }
}

// ============================================
// EXPORT TIPO PER TYPESCRIPT
// ============================================
export type { ConfigurationData }
