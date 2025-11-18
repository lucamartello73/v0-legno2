-- ============================================================================
-- TABELLA: pergole_configurazioni_tracking
-- Descrizione: Traccia tutte le sessioni di configurazione pergole (complete e parziali)
-- VERSIONE CORRETTA: senza dipendenza da tabella "profiles"
-- ============================================================================

CREATE TABLE IF NOT EXISTS pergole_configurazioni_tracking (
  -- Identificatori
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_fingerprint TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- UTM Tracking (Campagne Marketing)
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  landing_page TEXT,
  
  -- Device Information
  device_type TEXT,
  browser TEXT,
  os TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  
  -- Progress Tracking
  step_reached INTEGER DEFAULT 1,
  
  -- STEP 1: Tipo Pergola
  tipo_pergola_id TEXT,
  tipo_pergola_nome TEXT,
  
  -- STEP 2: Dimensioni
  dimensioni_larghezza DECIMAL(10,2),
  dimensioni_profondita DECIMAL(10,2),
  dimensioni_altezza DECIMAL(10,2),
  dimensioni_area_mq DECIMAL(10,2),
  
  -- STEP 3: Colori
  colore_struttura_id TEXT,
  colore_struttura_nome TEXT,
  colore_struttura_value TEXT,
  colore_tetto_id TEXT,
  colore_tetto_nome TEXT,
  colore_tetto_value TEXT,
  colore_telo_id TEXT,
  colore_telo_nome TEXT,
  colore_telo_value TEXT,
  
  -- STEP 4: Copertura
  copertura_id TEXT,
  copertura_nome TEXT,
  copertura_prezzo DECIMAL(10,2),
  
  -- STEP 5: Pavimentazione
  pavimentazione_ids TEXT[],
  pavimentazione_nomi TEXT[],
  pavimentazione_count INTEGER DEFAULT 0,
  
  -- STEP 6: Accessori
  accessori_ids TEXT[],
  accessori_nomi TEXT[],
  accessori_count INTEGER DEFAULT 0,
  accessori_prezzo_totale DECIMAL(10,2),
  
  -- STEP 7: Contatti (se completato)
  cliente_nome TEXT,
  cliente_email TEXT,
  cliente_telefono TEXT,
  cliente_citta TEXT,
  cliente_note TEXT,
  
  -- Prezzo Finale
  prezzo_configurazione DECIMAL(10,2),
  
  -- Status
  status TEXT DEFAULT 'in_progress',
  time_spent_seconds INTEGER,
  
  -- Relazione Campagna
  campagna_id UUID,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  CONSTRAINT valid_step CHECK (step_reached BETWEEN 1 AND 8)
);

-- ============================================================================
-- INDICI
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_config_session 
  ON pergole_configurazioni_tracking(session_id);

CREATE INDEX IF NOT EXISTS idx_config_created 
  ON pergole_configurazioni_tracking(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_config_status 
  ON pergole_configurazioni_tracking(status);

CREATE INDEX IF NOT EXISTS idx_config_step 
  ON pergole_configurazioni_tracking(step_reached);

CREATE INDEX IF NOT EXISTS idx_config_campagna 
  ON pergole_configurazioni_tracking(campagna_id);

CREATE INDEX IF NOT EXISTS idx_config_utm_source 
  ON pergole_configurazioni_tracking(utm_source) 
  WHERE utm_source IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_config_device 
  ON pergole_configurazioni_tracking(device_type);

CREATE INDEX IF NOT EXISTS idx_config_completed 
  ON pergole_configurazioni_tracking(completed_at DESC) 
  WHERE completed_at IS NOT NULL;

-- ============================================================================
-- TRIGGER: Auto-update timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_pergole_config_tracking_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pergole_config_tracking
  BEFORE UPDATE ON pergole_configurazioni_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_pergole_config_tracking_timestamp();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - VERSIONE SEMPLIFICATA SENZA "profiles"
-- ============================================================================

ALTER TABLE pergole_configurazioni_tracking ENABLE ROW LEVEL SECURITY;

-- Policy: Chiunque può inserire (per tracking anonimo)
CREATE POLICY "Allow anonymous insert" 
  ON pergole_configurazioni_tracking
  FOR INSERT 
  WITH CHECK (true);

-- Policy: Chiunque può aggiornare (per tracking durante configurazione)
CREATE POLICY "Allow anonymous update" 
  ON pergole_configurazioni_tracking
  FOR UPDATE 
  USING (true);

-- Policy: Solo utenti autenticati possono leggere
-- Se vuoi che anche anonimi possano leggere, cambia in: USING (true)
CREATE POLICY "Authenticated users can read" 
  ON pergole_configurazioni_tracking
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- COMMENTI
-- ============================================================================

COMMENT ON TABLE pergole_configurazioni_tracking IS 
  'Tracciamento completo di tutte le sessioni di configurazione pergole';

COMMENT ON COLUMN pergole_configurazioni_tracking.session_id IS 
  'ID univoco di sessione generato dal client (localStorage)';

COMMENT ON COLUMN pergole_configurazioni_tracking.user_fingerprint IS 
  'Browser fingerprint per identificare utenti unici';

COMMENT ON COLUMN pergole_configurazioni_tracking.step_reached IS 
  'Ultimo step raggiunto dall utente (1-8)';

COMMENT ON COLUMN pergole_configurazioni_tracking.status IS 
  'Stato configurazione: in_progress, completed, abandoned';
