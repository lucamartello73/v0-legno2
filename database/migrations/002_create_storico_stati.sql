-- =====================================================
-- MIGRAZIONE: Storico Cambiamenti Stati Richieste
-- Data: 2025-11-16
-- Descrizione: Tabella audit per tracciare ogni cambio stato delle richieste
-- =====================================================

-- =====================================================
-- STEP 1: Creazione Tabella Storico Stati
-- =====================================================

CREATE TABLE IF NOT EXISTS configuratorelegno_richieste_storico_stati (
  -- ========================================
  -- PRIMARY KEY
  -- ========================================
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- ========================================
  -- FOREIGN KEY A RICHIESTA
  -- ========================================
  richiesta_id UUID NOT NULL REFERENCES configuratorelegno_richieste(id) ON DELETE CASCADE,
  
  -- ========================================
  -- DATI CAMBIO STATO
  -- ========================================
  stato_precedente VARCHAR(50),
  stato_nuovo VARCHAR(50) NOT NULL,
  
  -- ========================================
  -- MOTIVO E NOTE
  -- ========================================
  motivo_cambio TEXT,                    -- "Cliente ha confermato ordine telefonicamente"
  note TEXT,                             -- Note aggiuntive sul cambio
  
  -- ========================================
  -- CHI HA EFFETTUATO IL CAMBIO
  -- ========================================
  modificato_da_user_id UUID,           -- FK a profiles
  modificato_da_nome VARCHAR(255),      -- Nome utente/agente
  modificato_da_tipo VARCHAR(50),       -- "admin", "agente", "automatico", "sistema"
  
  -- ========================================
  -- TIMESTAMP
  -- ========================================
  cambiato_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- STEP 2: Indici
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_storico_richiesta 
  ON configuratorelegno_richieste_storico_stati(richiesta_id);

CREATE INDEX IF NOT EXISTS idx_storico_stato_nuovo 
  ON configuratorelegno_richieste_storico_stati(stato_nuovo);

CREATE INDEX IF NOT EXISTS idx_storico_data 
  ON configuratorelegno_richieste_storico_stati(cambiato_at DESC);

CREATE INDEX IF NOT EXISTS idx_storico_user 
  ON configuratorelegno_richieste_storico_stati(modificato_da_user_id) 
  WHERE modificato_da_user_id IS NOT NULL;

-- =====================================================
-- STEP 3: Trigger per Registrare Cambio Stato
-- =====================================================

CREATE OR REPLACE FUNCTION log_richiesta_stato_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Registra solo se lo stato è effettivamente cambiato
  IF OLD.stato IS DISTINCT FROM NEW.stato THEN
    INSERT INTO configuratorelegno_richieste_storico_stati (
      richiesta_id,
      stato_precedente,
      stato_nuovo,
      motivo_cambio,
      modificato_da_tipo
    ) VALUES (
      NEW.id,
      OLD.stato,
      NEW.stato,
      CASE 
        WHEN NEW.stato = 'da_contattare' THEN 'Cambio automatico dopo creazione'
        WHEN NEW.stato = 'completata' THEN 'Ordine completato e chiuso'
        WHEN NEW.stato = 'annullata' THEN 'Richiesta annullata'
        ELSE 'Cambio stato manuale'
      END,
      'automatico'  -- Può essere sovrascritto dall'applicazione
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER richieste_log_stato_change
  AFTER UPDATE ON configuratorelegno_richieste
  FOR EACH ROW
  EXECUTE FUNCTION log_richiesta_stato_change();

-- =====================================================
-- STEP 4: Trigger per Registrare Creazione
-- =====================================================

CREATE OR REPLACE FUNCTION log_richiesta_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Registra creazione richiesta
  INSERT INTO configuratorelegno_richieste_storico_stati (
    richiesta_id,
    stato_precedente,
    stato_nuovo,
    motivo_cambio,
    modificato_da_tipo
  ) VALUES (
    NEW.id,
    NULL,
    NEW.stato,
    'Richiesta creata tramite ' || COALESCE(NEW.fonte_richiesta, 'sconosciuta'),
    'sistema'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER richieste_log_creation
  AFTER INSERT ON configuratorelegno_richieste
  FOR EACH ROW
  EXECUTE FUNCTION log_richiesta_creation();

-- =====================================================
-- STEP 5: Funzioni Utility per Query Storico
-- =====================================================

-- Funzione: Ottieni storico completo di una richiesta
CREATE OR REPLACE FUNCTION get_richiesta_storico(richiesta_uuid UUID)
RETURNS TABLE (
  id UUID,
  stato_da VARCHAR(50),
  stato_a VARCHAR(50),
  motivo TEXT,
  modificato_da VARCHAR(255),
  data TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.stato_precedente AS stato_da,
    s.stato_nuovo AS stato_a,
    s.motivo_cambio AS motivo,
    s.modificato_da_nome AS modificato_da,
    s.cambiato_at AS data
  FROM configuratorelegno_richieste_storico_stati s
  WHERE s.richiesta_id = richiesta_uuid
  ORDER BY s.cambiato_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Funzione: Tempo medio per stato
CREATE OR REPLACE FUNCTION get_tempo_medio_per_stato(stato_target VARCHAR(50))
RETURNS INTERVAL AS $$
DECLARE
  tempo_medio INTERVAL;
BEGIN
  SELECT AVG(
    COALESCE(
      CASE stato_target
        WHEN 'contattata' THEN data_primo_contatto - data_richiesta
        WHEN 'preventivo_inviato' THEN data_preventivo_inviato - data_richiesta
        WHEN 'confermata' THEN data_conferma_ordine - data_richiesta
        WHEN 'completata' THEN data_chiusura - data_richiesta
        ELSE NULL
      END,
      INTERVAL '0'
    )
  )
  INTO tempo_medio
  FROM configuratorelegno_richieste
  WHERE stato = stato_target;
  
  RETURN tempo_medio;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 6: View per Dashboard Metriche
-- =====================================================

CREATE OR REPLACE VIEW configuratorelegno_richieste_metriche AS
SELECT 
  -- Conteggi per stato
  COUNT(*) FILTER (WHERE stato = 'nuova') as totale_nuove,
  COUNT(*) FILTER (WHERE stato = 'da_contattare') as totale_da_contattare,
  COUNT(*) FILTER (WHERE stato = 'contattata') as totale_contattate,
  COUNT(*) FILTER (WHERE stato = 'preventivo_inviato') as totale_preventivi_inviati,
  COUNT(*) FILTER (WHERE stato = 'in_negoziazione') as totale_in_negoziazione,
  COUNT(*) FILTER (WHERE stato = 'confermata') as totale_confermate,
  COUNT(*) FILTER (WHERE stato IN ('in_produzione', 'pronta_consegna', 'in_spedizione')) as totale_in_lavorazione,
  COUNT(*) FILTER (WHERE stato = 'completata') as totale_completate,
  COUNT(*) FILTER (WHERE stato = 'annullata') as totale_annullate,
  COUNT(*) FILTER (WHERE stato = 'persa') as totale_perse,
  
  -- Conteggi per priorità
  COUNT(*) FILTER (WHERE priorita = 'urgente') as totale_urgenti,
  COUNT(*) FILTER (WHERE priorita = 'alta') as totale_alta_priorita,
  
  -- Metriche temporali
  AVG(data_primo_contatto - data_richiesta) FILTER (WHERE data_primo_contatto IS NOT NULL) as tempo_medio_primo_contatto,
  AVG(data_chiusura - data_richiesta) FILTER (WHERE data_chiusura IS NOT NULL) as tempo_medio_completamento,
  
  -- Metriche commerciali
  SUM(prezzo_finale) FILTER (WHERE stato IN ('confermata', 'in_produzione', 'pronta_consegna', 'in_spedizione', 'installata', 'completata')) as valore_totale_ordini,
  AVG(prezzo_finale) FILTER (WHERE stato IN ('confermata', 'in_produzione', 'pronta_consegna', 'in_spedizione', 'installata', 'completata')) as valore_medio_ordine,
  
  -- Tasso conversione
  ROUND(
    (COUNT(*) FILTER (WHERE stato IN ('confermata', 'in_produzione', 'pronta_consegna', 'in_spedizione', 'installata', 'completata'))::NUMERIC / 
     NULLIF(COUNT(*), 0)) * 100, 
    2
  ) as tasso_conversione_percentuale,
  
  -- Totali
  COUNT(*) as totale_richieste,
  
  -- Periodo
  MIN(data_richiesta) as prima_richiesta,
  MAX(data_richiesta) as ultima_richiesta
FROM configuratorelegno_richieste;

-- =====================================================
-- STEP 7: View per Richieste Attive
-- =====================================================

CREATE OR REPLACE VIEW configuratorelegno_richieste_attive AS
SELECT 
  r.id,
  r.codice_preventivo,
  r.cliente_nome,
  r.cliente_cognome,
  r.cliente_email,
  r.cliente_telefono,
  r.stato,
  r.priorita,
  r.prezzo_configuratore,
  r.prezzo_finale,
  r.assegnato_a_nome,
  r.data_richiesta,
  r.created_at,
  r.updated_at,
  
  -- Aggiungi dati configurazione
  c.type_name as tipo_pergola,
  c.width,
  c.depth,
  c.height,
  c.color_name,
  c.coverage_name,
  c.total_price as prezzo_originale,
  
  -- Calcola giorni dall'ultima modifica
  EXTRACT(DAY FROM (now() - r.updated_at)) as giorni_ultima_modifica,
  
  -- Calcola giorni dalla richiesta
  EXTRACT(DAY FROM (now() - r.data_richiesta)) as giorni_dalla_richiesta
  
FROM configuratorelegno_richieste r
LEFT JOIN configuratorelegno_configurations c ON r.configurazione_id = c.id
WHERE r.stato NOT IN ('completata', 'annullata', 'persa')
ORDER BY 
  CASE r.priorita
    WHEN 'urgente' THEN 1
    WHEN 'alta' THEN 2
    WHEN 'normale' THEN 3
    WHEN 'bassa' THEN 4
  END,
  r.data_richiesta ASC;

-- =====================================================
-- STEP 8: Commenti
-- =====================================================

COMMENT ON TABLE configuratorelegno_richieste_storico_stati IS 
'Audit log completo di tutti i cambiamenti di stato delle richieste per tracciabilità';

COMMENT ON VIEW configuratorelegno_richieste_metriche IS 
'Dashboard metriche aggregate per analisi performance commerciale e operativa';

COMMENT ON VIEW configuratorelegno_richieste_attive IS 
'Richieste in lavorazione (esclude completate/annullate/perse) con dati configurazione';

-- =====================================================
-- FINE MIGRAZIONE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Migrazione 002_create_storico_stati completata!';
  RAISE NOTICE '📊 Tabella storico stati creata';
  RAISE NOTICE '📈 View metriche e richieste attive create';
  RAISE NOTICE '⚙️  Funzioni utility disponibili:';
  RAISE NOTICE '   - get_richiesta_storico(uuid)';
  RAISE NOTICE '   - get_tempo_medio_per_stato(stato)';
END $$;
