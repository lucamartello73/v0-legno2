-- ============================================================================
-- TABELLA: pergole_tracking_snapshots
-- Descrizione: Snapshot storici di dati tracking prima di reset/archivio
-- ============================================================================

CREATE TABLE IF NOT EXISTS pergole_tracking_snapshots (
  -- Identificatori
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Info Snapshot
  nome TEXT NOT NULL,
  descrizione TEXT,
  
  -- Periodo Analizzato
  data_inizio TIMESTAMPTZ NOT NULL,
  data_fine TIMESTAMPTZ NOT NULL,
  
  -- Relazione Campagna (opzionale)
  campagna_id UUID REFERENCES pergole_campagne_marketing(id) ON DELETE SET NULL,
  campagna_nome TEXT, -- Denormalizzato per storico
  
  -- Metriche Aggregate
  totale_configurazioni INTEGER NOT NULL,
  configurazioni_completate INTEGER NOT NULL,
  configurazioni_abbandonate INTEGER NOT NULL,
  configurazioni_in_corso INTEGER NOT NULL,
  
  tasso_conversione_percentuale DECIMAL(5,2),
  tempo_medio_completamento_secondi INTEGER,
  prezzo_medio_configurazione DECIMAL(10,2),
  valore_totale_configurazioni DECIMAL(12,2),
  
  -- Distribuzione Step (JSON)
  step_distribution JSONB, 
  -- Esempio: {"step_1": 245, "step_2": 238, "step_3": 225, ...}
  
  -- Top Selections (JSON)
  top_pergola_types JSONB,
  -- Esempio: [{"nome": "Addossata", "count": 134}, {"nome": "Autoportante", "count": 89}]
  
  top_colori JSONB,
  -- Esempio: {"struttura": [...], "tetto": [...], "telo": [...]}
  
  top_coperture JSONB,
  top_pavimentazioni JSONB,
  top_accessori JSONB,
  
  -- Device Breakdown (JSON)
  device_breakdown JSONB,
  -- Esempio: {"mobile": 145, "desktop": 89, "tablet": 11}
  
  -- Referrer Sources (JSON)
  top_referrers JSONB,
  -- Esempio: [{"referrer": "google.com", "count": 98}, ...]
  
  -- UTM Sources (JSON)
  utm_sources JSONB,
  -- Esempio: [{"source": "meta", "count": 67}, ...]
  
  -- Configurazioni Archiviate (FULL DATA)
  configurazioni_archiviate JSONB,
  -- Array completo di tutte le configurazioni nel periodo
  
  -- Metriche Marketing (se collegato a campagna)
  costo_campagna DECIMAL(10,2),
  cpa_euro DECIMAL(10,2),
  roi_percentuale DECIMAL(10,2),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ============================================================================
-- INDICI
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_snapshots_created 
  ON pergole_tracking_snapshots(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_snapshots_campagna 
  ON pergole_tracking_snapshots(campagna_id);

CREATE INDEX IF NOT EXISTS idx_snapshots_date_range 
  ON pergole_tracking_snapshots(data_inizio, data_fine);

-- ============================================================================
-- FUNCTION: Crea Snapshot Automatico
-- ============================================================================

CREATE OR REPLACE FUNCTION create_tracking_snapshot(
  p_nome TEXT,
  p_descrizione TEXT,
  p_data_inizio TIMESTAMPTZ,
  p_data_fine TIMESTAMPTZ,
  p_campagna_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_snapshot_id UUID;
  v_campagna_nome TEXT;
  v_total INTEGER;
  v_completed INTEGER;
  v_abandoned INTEGER;
  v_in_progress INTEGER;
  v_conversion_rate DECIMAL(5,2);
  v_avg_time INTEGER;
  v_avg_price DECIMAL(10,2);
  v_total_value DECIMAL(12,2);
  v_step_dist JSONB;
  v_device_dist JSONB;
  v_all_configs JSONB;
BEGIN
  -- Get campagna nome se esiste
  IF p_campagna_id IS NOT NULL THEN
    SELECT nome INTO v_campagna_nome 
    FROM pergole_campagne_marketing 
    WHERE id = p_campagna_id;
  END IF;
  
  -- Calculate aggregate metrics
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'completed'),
    COUNT(*) FILTER (WHERE status = 'abandoned'),
    COUNT(*) FILTER (WHERE status = 'in_progress')
  INTO v_total, v_completed, v_abandoned, v_in_progress
  FROM pergole_configurazioni_tracking
  WHERE created_at BETWEEN p_data_inizio AND p_data_fine
    AND (p_campagna_id IS NULL OR campagna_id = p_campagna_id);
  
  -- Conversion rate
  IF v_total > 0 THEN
    v_conversion_rate := ROUND((v_completed::DECIMAL / v_total::DECIMAL * 100), 2);
  ELSE
    v_conversion_rate := 0;
  END IF;
  
  -- Average time
  SELECT AVG(time_spent_seconds)::INTEGER
  INTO v_avg_time
  FROM pergole_configurazioni_tracking
  WHERE created_at BETWEEN p_data_inizio AND p_data_fine
    AND status = 'completed'
    AND (p_campagna_id IS NULL OR campagna_id = p_campagna_id);
  
  -- Average and total price
  SELECT 
    AVG(prezzo_configurazione),
    SUM(prezzo_configurazione)
  INTO v_avg_price, v_total_value
  FROM pergole_configurazioni_tracking
  WHERE created_at BETWEEN p_data_inizio AND p_data_fine
    AND status = 'completed'
    AND (p_campagna_id IS NULL OR campagna_id = p_campagna_id);
  
  -- Step distribution
  SELECT jsonb_object_agg('step_' || step_reached, step_count)
  INTO v_step_dist
  FROM (
    SELECT step_reached, COUNT(*) as step_count
    FROM pergole_configurazioni_tracking
    WHERE created_at BETWEEN p_data_inizio AND p_data_fine
      AND (p_campagna_id IS NULL OR campagna_id = p_campagna_id)
    GROUP BY step_reached
    ORDER BY step_reached
  ) sub;
  
  -- Device distribution
  SELECT jsonb_object_agg(device_type, device_count)
  INTO v_device_dist
  FROM (
    SELECT 
      COALESCE(device_type, 'unknown') as device_type, 
      COUNT(*) as device_count
    FROM pergole_configurazioni_tracking
    WHERE created_at BETWEEN p_data_inizio AND p_data_fine
      AND (p_campagna_id IS NULL OR campagna_id = p_campagna_id)
    GROUP BY device_type
  ) sub;
  
  -- Archive all configurations
  SELECT jsonb_agg(to_jsonb(t.*))
  INTO v_all_configs
  FROM pergole_configurazioni_tracking t
  WHERE t.created_at BETWEEN p_data_inizio AND p_data_fine
    AND (p_campagna_id IS NULL OR t.campagna_id = p_campagna_id);
  
  -- Insert snapshot
  INSERT INTO pergole_tracking_snapshots (
    nome,
    descrizione,
    data_inizio,
    data_fine,
    campagna_id,
    campagna_nome,
    totale_configurazioni,
    configurazioni_completate,
    configurazioni_abbandonate,
    configurazioni_in_corso,
    tasso_conversione_percentuale,
    tempo_medio_completamento_secondi,
    prezzo_medio_configurazione,
    valore_totale_configurazioni,
    step_distribution,
    device_breakdown,
    configurazioni_archiviate,
    created_by
  ) VALUES (
    p_nome,
    p_descrizione,
    p_data_inizio,
    p_data_fine,
    p_campagna_id,
    v_campagna_nome,
    v_total,
    v_completed,
    v_abandoned,
    v_in_progress,
    v_conversion_rate,
    v_avg_time,
    v_avg_price,
    v_total_value,
    v_step_dist,
    v_device_dist,
    v_all_configs,
    auth.uid()
  )
  RETURNING id INTO v_snapshot_id;
  
  RETURN v_snapshot_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- RLS
-- ============================================================================

ALTER TABLE pergole_tracking_snapshots ENABLE ROW LEVEL SECURITY;

-- Solo admin possono gestire snapshot
CREATE POLICY "Admin full access snapshots" 
  ON pergole_tracking_snapshots
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

COMMENT ON TABLE pergole_tracking_snapshots IS 
  'Snapshot storici archivio dati tracking con metriche aggregate';

COMMENT ON FUNCTION create_tracking_snapshot IS 
  'Crea snapshot automatico di tutti i dati tracking nel periodo specificato';

COMMENT ON COLUMN pergole_tracking_snapshots.configurazioni_archiviate IS 
  'JSONB array completo di tutte le configurazioni archiviate (full backup)';
