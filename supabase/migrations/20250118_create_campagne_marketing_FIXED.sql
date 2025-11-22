-- ============================================================================
-- TABELLA: pergole_campagne_marketing
-- VERSIONE CORRETTA: senza dipendenza da tabella "profiles"
-- ============================================================================

CREATE TABLE IF NOT EXISTS pergole_campagne_marketing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Info Campagna
  nome TEXT NOT NULL,
  codice TEXT UNIQUE NOT NULL,
  descrizione TEXT,
  
  -- Piattaforma
  piattaforma TEXT NOT NULL,
  tipo_contenuto TEXT,
  
  -- Budget
  budget_euro DECIMAL(10,2),
  obiettivo_conversioni INTEGER,
  
  -- Date
  data_inizio DATE NOT NULL,
  data_fine DATE,
  stato TEXT DEFAULT 'attiva',
  
  -- UTM
  utm_source TEXT NOT NULL,
  utm_medium TEXT NOT NULL,
  utm_campaign TEXT NOT NULL,
  utm_term TEXT,
  utm_content TEXT,
  
  -- Link
  link_tracciato TEXT,
  
  -- Metriche
  impressions INTEGER DEFAULT 0,
  click INTEGER DEFAULT 0,
  costo_totale DECIMAL(10,2) DEFAULT 0,
  ctr DECIMAL(5,2),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  metadata JSONB DEFAULT '{}'::jsonb,
  
  CONSTRAINT valid_stato CHECK (stato IN ('attiva', 'completata', 'in_pausa', 'cancellata')),
  CONSTRAINT valid_piattaforma CHECK (piattaforma IN ('google', 'meta', 'tiktok', 'youtube', 'linkedin', 'altro'))
);

-- ============================================================================
-- INDICI
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_campagne_codice 
  ON pergole_campagne_marketing(codice);

CREATE INDEX IF NOT EXISTS idx_campagne_stato 
  ON pergole_campagne_marketing(stato);

CREATE INDEX IF NOT EXISTS idx_campagne_data_inizio 
  ON pergole_campagne_marketing(data_inizio DESC);

CREATE INDEX IF NOT EXISTS idx_campagne_piattaforma 
  ON pergole_campagne_marketing(piattaforma);

CREATE INDEX IF NOT EXISTS idx_campagne_utm 
  ON pergole_campagne_marketing(utm_source, utm_medium, utm_campaign);

-- ============================================================================
-- TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION update_campagne_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_campagne
  BEFORE UPDATE ON pergole_campagne_marketing
  FOR EACH ROW
  EXECUTE FUNCTION update_campagne_timestamp();

-- ============================================================================
-- FOREIGN KEY
-- ============================================================================

ALTER TABLE pergole_configurazioni_tracking
  ADD CONSTRAINT fk_campagna
  FOREIGN KEY (campagna_id) 
  REFERENCES pergole_campagne_marketing(id) 
  ON DELETE SET NULL;

-- ============================================================================
-- VIEW: Statistiche
-- ============================================================================

CREATE OR REPLACE VIEW pergole_campagne_stats AS
SELECT 
  c.id,
  c.nome,
  c.codice,
  c.piattaforma,
  c.stato,
  c.data_inizio,
  c.data_fine,
  c.budget_euro,
  c.obiettivo_conversioni,
  c.impressions,
  c.click,
  c.costo_totale,
  c.ctr,
  
  COUNT(t.id) AS totale_configurazioni,
  COUNT(t.id) FILTER (WHERE t.status = 'completed') AS configurazioni_completate,
  COUNT(t.id) FILTER (WHERE t.status = 'abandoned') AS configurazioni_abbandonate,
  COUNT(t.id) FILTER (WHERE t.status = 'in_progress') AS configurazioni_in_corso,
  
  CASE 
    WHEN COUNT(t.id) > 0 THEN 
      ROUND((COUNT(t.id) FILTER (WHERE t.status = 'completed')::DECIMAL / COUNT(t.id)::DECIMAL * 100), 2)
    ELSE 0 
  END AS tasso_conversione_percentuale,
  
  AVG(t.time_spent_seconds) FILTER (WHERE t.status = 'completed') AS tempo_medio_completamento_secondi,
  AVG(t.prezzo_configurazione) FILTER (WHERE t.status = 'completed') AS prezzo_medio_configurazione,
  SUM(t.prezzo_configurazione) FILTER (WHERE t.status = 'completed') AS valore_totale_configurazioni,
  
  CASE 
    WHEN COUNT(t.id) FILTER (WHERE t.status = 'completed') > 0 AND c.costo_totale > 0 THEN 
      ROUND((c.costo_totale / COUNT(t.id) FILTER (WHERE t.status = 'completed')), 2)
    ELSE NULL 
  END AS cpa_euro,
  
  CASE 
    WHEN c.costo_totale > 0 AND SUM(t.prezzo_configurazione) FILTER (WHERE t.status = 'completed') > 0 THEN
      ROUND((
        (SUM(t.prezzo_configurazione) FILTER (WHERE t.status = 'completed') - c.costo_totale) 
        / c.costo_totale * 100
      ), 2)
    ELSE NULL 
  END AS roi_percentuale,
  
  c.created_at,
  c.updated_at

FROM pergole_campagne_marketing c
LEFT JOIN pergole_configurazioni_tracking t 
  ON t.campagna_id = c.id
  OR (
    t.utm_source = c.utm_source 
    AND t.utm_medium = c.utm_medium 
    AND t.utm_campaign = c.utm_campaign
  )
GROUP BY 
  c.id, c.nome, c.codice, c.piattaforma, c.stato, c.data_inizio, c.data_fine,
  c.budget_euro, c.obiettivo_conversioni, c.impressions, c.click, c.costo_totale,
  c.ctr, c.created_at, c.updated_at;

-- ============================================================================
-- RLS - VERSIONE SEMPLIFICATA
-- ============================================================================

ALTER TABLE pergole_campagne_marketing ENABLE ROW LEVEL SECURITY;

-- Solo utenti autenticati possono gestire campagne
CREATE POLICY "Authenticated users full access campagne" 
  ON pergole_campagne_marketing
  USING (auth.uid() IS NOT NULL);

COMMENT ON TABLE pergole_campagne_marketing IS 
  'Gestione campagne marketing con tracking UTM';
