/**
 * ============================================================================
 * CONFIGURATION TRACKING LIBRARY
 * ============================================================================
 * 
 * Sistema completo di tracking per configurazioni pergole:
 * - Session management con localStorage
 * - Browser fingerprinting per identificazione utenti
 * - UTM parameters capture e persistenza
 * - Device detection (mobile/desktop/tablet, browser, OS)
 * - Tracking completo di tutti gli step del configuratore
 * - Gestione stati: in_progress, completed, abandoned
 * 
 * Usage:
 * 1. startConfigurationTracking() - Chiamare all'inizio del configuratore
 * 2. updateConfigurationTracking(data) - Chiamare ad ogni cambio step/selezione
 * 3. completeConfigurationTracking(clientData) - Chiamare al submit finale
 * 4. abandonConfigurationTracking() - Chiamare su beforeunload se non completato
 */

'use client'

import { createClient } from '@/lib/supabase/client'

// ============================================================================
// TYPES
// ============================================================================

export interface TrackingData {
  // Step tracking
  step_reached?: number
  
  // Step 1: Tipo Pergola
  tipo_pergola_id?: string
  tipo_pergola_nome?: string
  
  // Step 2: Dimensioni
  dimensioni_larghezza?: number
  dimensioni_profondita?: number
  dimensioni_altezza?: number
  dimensioni_area_mq?: number
  
  // Step 3: Colori
  colore_struttura_id?: string
  colore_struttura_nome?: string
  colore_struttura_value?: string
  colore_tetto_id?: string
  colore_tetto_nome?: string
  colore_tetto_value?: string
  colore_telo_id?: string
  colore_telo_nome?: string
  colore_telo_value?: string
  
  // Step 4: Copertura
  copertura_id?: string
  copertura_nome?: string
  copertura_prezzo?: number
  
  // Step 5: Pavimentazione
  pavimentazione_ids?: string[]
  pavimentazione_nomi?: string[]
  pavimentazione_count?: number
  
  // Step 6: Accessori
  accessori_ids?: string[]
  accessori_nomi?: string[]
  accessori_count?: number
  accessori_prezzo_totale?: number
  
  // Prezzo finale
  prezzo_configurazione?: number
  
  // Metadata
  [key: string]: any
}

export interface ClientData {
  cliente_nome?: string
  cliente_email?: string
  cliente_telefono?: string
  cliente_citta?: string
  cliente_note?: string
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
  SESSION_ID: 'pergole_session_id',
  TRACKING_ID: 'pergole_tracking_id',
  UTM_PARAMS: 'pergole_utm_params',
  START_TIME: 'pergole_start_time',
} as const

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

let trackingId: string | null = null
let startTime: number = Date.now()

/**
 * Genera o recupera session ID univoco
 */
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID)
  
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId)
  }
  
  return sessionId
}

/**
 * Recupera tracking ID corrente
 */
function getTrackingId(): string | null {
  if (trackingId) return trackingId
  if (typeof window === 'undefined') return null
  return localStorage.getItem(STORAGE_KEYS.TRACKING_ID)
}

/**
 * Salva tracking ID
 */
function setTrackingId(id: string) {
  trackingId = id
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.TRACKING_ID, id)
  }
}

/**
 * Pulisce tracking ID (dopo completamento/abbandono)
 */
function clearTrackingId() {
  trackingId = null
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.TRACKING_ID)
  }
}

// ============================================================================
// UTM PARAMETERS
// ============================================================================

/**
 * Estrae parametri UTM dalla URL corrente
 */
export function getUTMParameters() {
  if (typeof window === 'undefined') return {}
  
  const params = new URLSearchParams(window.location.search)
  
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_term: params.get('utm_term'),
    utm_content: params.get('utm_content'),
  }
}

/**
 * Salva parametri UTM in localStorage per persistenza
 */
export function saveUTMParameters() {
  const utmParams = getUTMParameters()
  
  // Salva solo se almeno un parametro UTM è presente
  if (Object.values(utmParams).some(v => v !== null)) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.UTM_PARAMS, JSON.stringify(utmParams))
    }
  }
}

/**
 * Recupera parametri UTM salvati
 */
function getSavedUTMParameters() {
  if (typeof window === 'undefined') return {}
  
  const saved = localStorage.getItem(STORAGE_KEYS.UTM_PARAMS)
  return saved ? JSON.parse(saved) : {}
}

// ============================================================================
// DEVICE DETECTION
// ============================================================================

/**
 * Rileva informazioni dispositivo, browser, OS
 */
export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return {
      device_type: 'unknown',
      browser: 'unknown',
      os: 'unknown',
      screen_width: 0,
      screen_height: 0,
    }
  }
  
  const ua = navigator.userAgent
  
  // Device type
  let deviceType = 'desktop'
  if (/mobile/i.test(ua)) deviceType = 'mobile'
  else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet'
  
  // Browser
  let browser = 'unknown'
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'chrome'
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'safari'
  else if (ua.includes('Firefox')) browser = 'firefox'
  else if (ua.includes('Edg')) browser = 'edge'
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'opera'
  
  // Operating System
  let os = 'unknown'
  if (ua.includes('Windows')) os = 'windows'
  else if (ua.includes('Mac OS')) os = 'macos'
  else if (ua.includes('Linux')) os = 'linux'
  else if (ua.includes('Android')) os = 'android'
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'ios'
  
  return {
    device_type: deviceType,
    browser,
    os,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
  }
}

// ============================================================================
// BROWSER FINGERPRINTING
// ============================================================================

/**
 * Genera fingerprint browser semi-univoco per tracking utenti
 * Combina: User Agent, Language, Screen Resolution, Canvas fingerprint
 */
export function getBrowserFingerprint(): string {
  if (typeof window === 'undefined') return 'server-side'
  
  try {
    // Canvas fingerprint
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    let canvasData = ''
    
    if (ctx) {
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.textBaseline = 'alphabetic'
      ctx.fillStyle = '#f60'
      ctx.fillRect(0, 0, 125, 1)
      ctx.fillStyle = '#069'
      ctx.fillText('Browser Fingerprint 🔍', 2, 15)
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
      ctx.fillText('Browser Fingerprint 🔍', 4, 17)
      canvasData = canvas.toDataURL()
    }
    
    // Combina vari elementi
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      canvasData.substring(0, 100), // Primi 100 char canvas
    ].join('|')
    
    // Genera hash
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(36)
  } catch (error) {
    console.error('Error generating fingerprint:', error)
    return 'error-' + Date.now().toString(36)
  }
}

// ============================================================================
// TIME TRACKING
// ============================================================================

/**
 * Calcola secondi trascorsi dall'inizio
 */
function getTimeSpentSeconds(): number {
  if (typeof window === 'undefined') return 0
  
  const savedStartTime = localStorage.getItem(STORAGE_KEYS.START_TIME)
  const actualStartTime = savedStartTime ? parseInt(savedStartTime, 10) : startTime
  
  return Math.floor((Date.now() - actualStartTime) / 1000)
}

/**
 * Resetta timer di inizio
 */
function resetStartTime() {
  startTime = Date.now()
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.START_TIME, startTime.toString())
  }
}

// ============================================================================
// MAIN TRACKING FUNCTIONS
// ============================================================================

/**
 * Inizia tracking configurazione
 * Chiamare all'ingresso del configuratore (Step 1)
 */
export async function startConfigurationTracking(): Promise<string | null> {
  try {
    // Salva UTM parameters se presenti
    saveUTMParameters()
    
    const sessionId = getOrCreateSessionId()
    const supabase = createClient()
    
    const utmParams = getSavedUTMParameters()
    const deviceInfo = getDeviceInfo()
    
    // Crea nuovo record tracking
    const { data, error } = await supabase
      .from('pergole_configurazioni_tracking')
      .insert({
        session_id: sessionId,
        user_fingerprint: getBrowserFingerprint(),
        referrer: typeof window !== 'undefined' ? document.referrer || null : null,
        landing_page: typeof window !== 'undefined' ? window.location.pathname : null,
        ...utmParams,
        ...deviceInfo,
        step_reached: 1,
        status: 'in_progress',
      })
      .select('id')
      .single()
    
    if (error) {
      console.error('Error starting tracking:', error)
      return null
    }
    
    setTrackingId(data.id)
    resetStartTime()
    
    console.log('✅ Configuration tracking started:', data.id)
    
    return data.id
  } catch (error) {
    console.error('Error in startConfigurationTracking:', error)
    return null
  }
}

/**
 * Aggiorna tracking configurazione
 * Chiamare ad ogni cambio step o selezione
 */
export async function updateConfigurationTracking(data: TrackingData): Promise<void> {
  try {
    let currentTrackingId = getTrackingId()
    
    // Se non esiste tracking, inizializzalo
    if (!currentTrackingId) {
      currentTrackingId = await startConfigurationTracking()
      if (!currentTrackingId) return
    }
    
    const supabase = createClient()
    const timeSpent = getTimeSpentSeconds()
    
    const { error } = await supabase
      .from('pergole_configurazioni_tracking')
      .update({
        ...data,
        time_spent_seconds: timeSpent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentTrackingId)
    
    if (error) {
      console.error('Error updating tracking:', error)
    }
  } catch (error) {
    console.error('Error in updateConfigurationTracking:', error)
  }
}

/**
 * Completa tracking configurazione
 * Chiamare al submit finale del form contatti
 */
export async function completeConfigurationTracking(
  clientData: ClientData,
  finalData?: TrackingData
): Promise<void> {
  try {
    const currentTrackingId = getTrackingId()
    if (!currentTrackingId) {
      console.warn('No tracking ID found for completion')
      return
    }
    
    const supabase = createClient()
    const timeSpent = getTimeSpentSeconds()
    
    const { error } = await supabase
      .from('pergole_configurazioni_tracking')
      .update({
        ...clientData,
        ...finalData,
        status: 'completed',
        completed_at: new Date().toISOString(),
        time_spent_seconds: timeSpent,
        step_reached: 8, // Step finale
      })
      .eq('id', currentTrackingId)
    
    if (error) {
      console.error('Error completing tracking:', error)
      return
    }
    
    console.log('✅ Configuration tracking completed:', currentTrackingId)
    
    // Pulisci session
    clearTrackingId()
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.START_TIME)
      // NON rimuovere SESSION_ID per permettere tracking multi-configurazione
    }
  } catch (error) {
    console.error('Error in completeConfigurationTracking:', error)
  }
}

/**
 * Marca tracking come abbandonato
 * Chiamare su beforeunload se configurazione non completata
 */
export async function abandonConfigurationTracking(): Promise<void> {
  try {
    const currentTrackingId = getTrackingId()
    if (!currentTrackingId) return
    
    const supabase = createClient()
    const timeSpent = getTimeSpentSeconds()
    
    // Check se già completato (evita overwrite)
    const { data: existing } = await supabase
      .from('pergole_configurazioni_tracking')
      .select('status')
      .eq('id', currentTrackingId)
      .single()
    
    if (existing && existing.status === 'completed') {
      // Non sovrascrivere se già completato
      return
    }
    
    const { error } = await supabase
      .from('pergole_configurazioni_tracking')
      .update({
        status: 'abandoned',
        time_spent_seconds: timeSpent,
      })
      .eq('id', currentTrackingId)
    
    if (error) {
      console.error('Error abandoning tracking:', error)
      return
    }
    
    console.log('⚠️ Configuration tracking abandoned:', currentTrackingId)
    
    // Pulisci tracking ID
    clearTrackingId()
  } catch (error) {
    console.error('Error in abandonConfigurationTracking:', error)
  }
}

/**
 * Recupera tracking ID corrente (per debug/monitoring)
 */
export function getCurrentTrackingId(): string | null {
  return getTrackingId()
}

/**
 * Check se tracking è attivo
 */
export function isTrackingActive(): boolean {
  return getTrackingId() !== null
}

/**
 * Utility: Log tracking status (per debug)
 */
export function logTrackingStatus() {
  if (typeof window === 'undefined') return
  
  console.group('📊 Tracking Status')
  console.log('Tracking ID:', getTrackingId())
  console.log('Session ID:', getOrCreateSessionId())
  console.log('Fingerprint:', getBrowserFingerprint())
  console.log('Time Spent:', getTimeSpentSeconds(), 'seconds')
  console.log('UTM Params:', getSavedUTMParameters())
  console.log('Device Info:', getDeviceInfo())
  console.groupEnd()
}
