/**
 * Componente per tracciare abbandono configurazione
 * Da inserire nel layout del configuratore
 */

'use client'

import { useEffect } from 'react'
import { abandonConfigurationTracking, isTrackingActive } from '@/lib/configuration-tracking'
import { VercelAnalytics } from '@/lib/vercel-analytics-integration'
import { usePathname } from 'next/navigation'

export function TrackingAbandonmentHandler() {
  const pathname = usePathname()
  
  useEffect(() => {
    // Solo se siamo nel configuratore
    if (!pathname?.startsWith('/configurator')) return
    
    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      // Verifica se il tracking è ancora attivo (non completato)
      if (isTrackingActive()) {
        // Non bloccare l'utente, traccia solo
        abandonConfigurationTracking()
        
        // Estrai step number dalla URL per Vercel Analytics
        const stepMatch = pathname.match(/\/configurator\/(\w+)/)
        const stepMap: Record<string, number> = {
          'type': 1,
          'dimensions': 2,
          'color': 3,
          'coverage': 4,
          'flooring': 5,
          'accessories': 6,
          'contacts': 7,
          'summary': 8,
        }
        
        const step = stepMatch ? stepMap[stepMatch[1]] || 1 : 1
        VercelAnalytics.trackConfiguratorAbandoned(step)
      }
    }
    
    // Aggiungi listener
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [pathname])
  
  return null // Componente invisibile
}
