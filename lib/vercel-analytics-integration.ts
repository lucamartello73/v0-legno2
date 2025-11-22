/**
 * ============================================================================
 * VERCEL ANALYTICS INTEGRATION (OPZIONALE)
 * ============================================================================
 * 
 * Integrazione opzionale con Vercel Analytics API per:
 * - Fetch dati analytics da Vercel
 * - Sincronizzazione con il nostro sistema
 * - Invio custom events a Vercel (già gestito da @vercel/analytics)
 * 
 * NOTA: Questa integrazione è OPZIONALE
 * Il nostro sistema di tracking funziona indipendentemente da Vercel Analytics
 */

'use client'

// ============================================================================
// TYPES
// ============================================================================

export interface VercelAnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: string
}

// ============================================================================
// CLIENT-SIDE: Custom Events per Vercel Analytics
// ============================================================================

/**
 * Track custom event su Vercel Analytics
 * Wrapper per window.va() con fallback sicuro
 */
export function trackVercelEvent(
  eventName: string, 
  properties?: Record<string, any>
): void {
  if (typeof window === 'undefined') return
  
  try {
    // @ts-ignore - window.va viene iniettato da @vercel/analytics
    if (window.va) {
      // @ts-ignore
      window.va('event', eventName, properties)
      console.log('📊 Vercel Analytics:', eventName, properties)
    }
  } catch (error) {
    console.error('Error tracking Vercel event:', error)
  }
}

// ============================================================================
// EVENTI SPECIFICI CONFIGURATORE
// ============================================================================

/**
 * Track inizio configurazione
 */
export function trackConfiguratorStarted() {
  trackVercelEvent('configurator_started', {
    timestamp: new Date().toISOString(),
    configurator_type: 'pergole_legno',
  })
}

/**
 * Track step raggiunto
 */
export function trackStepReached(step: number, stepName: string) {
  trackVercelEvent('step_reached', {
    step,
    step_name: stepName,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track tipo pergola selezionato
 */
export function trackPergolaTypeSelected(typeName: string) {
  trackVercelEvent('pergola_type_selected', {
    pergola_type: typeName,
    step: 1,
  })
}

/**
 * Track dimensioni inserite
 */
export function trackDimensionsSelected(dimensions: {
  width: number
  depth: number
  height: number
}) {
  const area = dimensions.width * dimensions.depth
  
  trackVercelEvent('dimensions_selected', {
    width: dimensions.width,
    depth: dimensions.depth,
    height: dimensions.height,
    area: area,
    step: 2,
  })
}

/**
 * Track colore selezionato
 */
export function trackColorSelected(colorName: string, category: string) {
  trackVercelEvent('color_selected', {
    color_name: colorName,
    category: category, // struttura, tetto, telo
    step: 3,
  })
}

/**
 * Track copertura selezionata
 */
export function trackCoverageSelected(coverageName: string, price?: number) {
  trackVercelEvent('coverage_selected', {
    coverage_type: coverageName,
    price: price || 0,
    step: 4,
  })
}

/**
 * Track pavimentazione selezionata
 */
export function trackFlooringSelected(flooringTypes: string[]) {
  trackVercelEvent('flooring_selected', {
    flooring_types: flooringTypes,
    count: flooringTypes.length,
    step: 5,
  })
}

/**
 * Track accessori selezionati
 */
export function trackAccessoriesSelected(
  accessories: Array<{name: string, price: number}>,
  totalPrice: number
) {
  trackVercelEvent('accessories_selected', {
    accessories: accessories.map(a => a.name),
    count: accessories.length,
    total_price: totalPrice,
    step: 6,
  })
}

/**
 * Track completamento configurazione
 */
export function trackConfiguratorCompleted(
  finalPrice: number,
  configuration: Record<string, any>
) {
  trackVercelEvent('configurator_completed', {
    final_price: finalPrice,
    price_range: getPriceRange(finalPrice),
    step: 8,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track abbandono configurazione
 */
export function trackConfiguratorAbandoned(lastStep: number) {
  trackVercelEvent('configurator_abandoned', {
    last_step: lastStep,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track durata step
 */
export function trackStepDuration(
  stepNumber: number,
  stepName: string,
  durationSeconds: number
) {
  trackVercelEvent('step_duration', {
    step_number: stepNumber,
    step_name: stepName,
    duration_seconds: durationSeconds,
  })
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Categorizza prezzo in range
 */
function getPriceRange(price: number): string {
  if (price < 5000) return 'low'
  if (price < 10000) return 'medium'
  if (price < 20000) return 'high'
  return 'premium'
}

// ============================================================================
// SERVER-SIDE: Vercel Analytics API (per dashboard admin)
// ============================================================================

/**
 * NOTA: Queste funzioni devono essere chiamate SERVER-SIDE
 * Usarle in API routes, non nel client
 */

export interface VercelAnalyticsAPIOptions {
  teamId: string
  projectId: string
  token: string
}

/**
 * Fetch analytics data da Vercel API
 * DA USARE SOLO SERVER-SIDE (API Routes)
 */
export async function fetchVercelAnalyticsData(
  options: VercelAnalyticsAPIOptions,
  startDate: Date,
  endDate: Date
) {
  try {
    const response = await fetch(
      `https://vercel.com/api/web/insights/stats?teamId=${options.teamId}&projectId=${options.projectId}&from=${startDate.getTime()}&to=${endDate.getTime()}`,
      {
        headers: {
          Authorization: `Bearer ${options.token}`,
        },
      }
    )
    
    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching Vercel Analytics:', error)
    return null
  }
}

/**
 * Fetch custom events da Vercel API
 * DA USARE SOLO SERVER-SIDE (API Routes)
 */
export async function fetchVercelCustomEvents(
  options: VercelAnalyticsAPIOptions,
  startDate: Date,
  endDate: Date
) {
  try {
    const response = await fetch(
      `https://vercel.com/api/web/insights/events?teamId=${options.teamId}&projectId=${options.projectId}&from=${startDate.getTime()}&to=${endDate.getTime()}`,
      {
        headers: {
          Authorization: `Bearer ${options.token}`,
        },
      }
    )
    
    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching Vercel custom events:', error)
    return null
  }
}

/**
 * Utility per sincronizzare dati Vercel con nostro DB
 * DA USARE SOLO SERVER-SIDE
 */
export async function syncVercelAnalyticsToSupabase(
  options: VercelAnalyticsAPIOptions,
  supabaseClient: any
) {
  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7) // Ultimi 7 giorni
    
    const events = await fetchVercelCustomEvents(options, startDate, endDate)
    
    if (!events) {
      console.warn('No events fetched from Vercel')
      return
    }
    
    // Processa ed eventualmente salva in Supabase
    // Implementare logica specifica se necessario
    
    console.log('✅ Vercel Analytics synced')
  } catch (error) {
    console.error('Error syncing Vercel Analytics:', error)
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const VercelAnalytics = {
  // Client-side
  trackEvent: trackVercelEvent,
  trackConfiguratorStarted,
  trackStepReached,
  trackPergolaTypeSelected,
  trackDimensionsSelected,
  trackColorSelected,
  trackCoverageSelected,
  trackFlooringSelected,
  trackAccessoriesSelected,
  trackConfiguratorCompleted,
  trackConfiguratorAbandoned,
  trackStepDuration,
  
  // Server-side (per API routes)
  fetchData: fetchVercelAnalyticsData,
  fetchEvents: fetchVercelCustomEvents,
  sync: syncVercelAnalyticsToSupabase,
}
