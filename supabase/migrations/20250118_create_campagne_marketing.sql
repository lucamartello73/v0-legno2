-- ============================================================================
-- TABELLA: pergole_campagne_marketing
-- Descrizione: Gestione campagne marketing con tracking UTM e metriche
-- ============================================================================

CREATE TABLE IF NOT EXISTS pergole_campagne_marketing (
  -- Identificatori
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Info Campagna
  nome TEXT NOT NULL,
  codice TEXT UNIQUE NOT NULL, -- es: "META_PERGOLE_DIC2024"
  descrizione TEXT,
  
  -- Piattaforma e Tipo
  piattaforma TEXT NOT NULL, -- google, meta, tiktok, youtube, linkedin, altro
  tipo_contenuto TEXT, -- video, foto, carousel, stories, reel, altro
  
  -- Budget e Obiettivi
  budget_euro DECIMAL(10,2),
  obiettivo_conversioni INTEGER,
  
  -- Date
  data_inizio DATE NOT NULL,
  data_fine DATE,
  stato TEXT DEFAULT 'attiva', -- attiva, completata, in_pausa, cancellata
  
  -- Parametri UTM
  utm_source TEXT NOT NULL,
  utm_medium TEXT NOT NULL,
  utm_campaign TEXT NOT NULL,
  utm_term TEXT,
  utm_content TEXT,
  
  -- Link Tracciato
  link_tracciato TEXT,
  
  -- Metriche Piattaforma (inserite manualmente o via API)
  impressions INTEGER DEFAULT 0,
  click INTEGER DEFAULT 0,
  costo_totale DECIMAL(10,2) DEFAULT 0,
  ctr DECIMAL(5,2), -- Click-through rate
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Constraints
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
-- TRIGGER: Auto-update timestamp
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
-- VIEW: Campagne con Statistiche Aggregate
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
  
  -- Statistiche da tracking
  COUNT(t.id) AS totale_configurazioni,
  COUNT(t.id) FILTER (WHERE t.status = 'completed') AS configurazioni_completate,
  COUNT(t.id) FILTER (WHERE t.status = 'abandoned') AS configurazioni_abbandonate,
  COUNT(t.id) FILTER (WHERE t.status = 'in_progress') AS configurazioni_in_corso,
  
  -- Tasso conversione
  CASE 
    WHEN COUNT(t.id) > 0 THEN 
      ROUND((COUNT(t.id) FILTER (WHERE t.status = 'completed')::DECIMAL / COUNT(t.id)::DECIMAL * 100), 2)
    ELSE 0 
  END AS tasso_conversione_percentuale,
  
  -- Tempo medio
  AVG(t.time_spent_seconds) FILTER (WHERE t.status = 'completed') AS tempo_medio_completamento_secondi,
  
  -- Prezzo medio
  AVG(t.prezzo_configurazione) FILTER (WHERE t.status = 'completed') AS prezzo_medio_configurazione,
  SUM(t.prezzo_configurazione) FILTER (WHERE t.status = 'completed') AS valore_totale_configurazioni,
  
  -- CPA (Costo Per Acquisizione)
  CASE 
    WHEN COUNT(t.id) FILTER (WHERE t.status = 'completed') > 0 AND c.costo_totale > 0 THEN 
      ROUND((c.costo_totale / COUNT(t.id) FILTER (WHERE t.status = 'completed')), 2)
    ELSE NULL 
  END AS cpa_euro,
  
  -- ROI stimato (se budget e valore sono disponibili)
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
-- RLS
-- ============================================================================

ALTER TABLE pergole_campagne_marketing ENABLE ROW LEVEL SECURITY;

-- Solo admin possono gestire campagne
CREATE POLICY "Admin full access campagne" 
  ON pergole_campagne_marketing
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================================================
-- COMMENTI
-- ============================================================================

COMMENT ON TABLE pergole_campagne_marketing IS 
  'Gestione campagne marketing con tracking UTM e metriche performance';

COMMENT ON VIEW pergole_campagne_stats IS 
  'Vista aggregata con statistiche complete per ogni campagna marketing';

COMMENT ON COLUMN pergole_campagne_marketing.codice IS 
  'Codice univoco campagna (es: META_PERGOLE_DIC2024)';

COMMENT ON COLUMN pergole_campagne_marketing.link_tracciato IS 
  'URL completo con parametri UTM per condivisione';
