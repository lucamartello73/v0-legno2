-- =====================================================
-- MIGRAZIONE: Sistema Tracking Richieste Pergole
-- Data: 2025-11-16
-- Descrizione: Aggiunge tracciamento completo workflow per richieste preventivo
-- =====================================================

-- =====================================================
-- STEP 1: Creazione Tabella Richieste con Tracking
-- =====================================================

CREATE TABLE IF NOT EXISTS configuratorelegno_richieste (
  -- ========================================
  -- PRIMARY KEY
  -- ========================================
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- ========================================
  -- FOREIGN KEY A CONFIGURAZIONE
  -- ========================================
  configurazione_id UUID REFERENCES configuratorelegno_configurations(id) ON DELETE CASCADE,
  
  -- ========================================
  -- DATI CLIENTE (Copiati da contact_data al momento della richiesta)
  -- ========================================
  cliente_nome VARCHAR(255) NOT NULL,
  cliente_cognome VARCHAR(255),
  cliente_email VARCHAR(255) NOT NULL,
  cliente_telefono VARCHAR(50),
  cliente_azienda VARCHAR(255),
  cliente_piva VARCHAR(50),
  
  -- ========================================
  -- TIPO RICHIESTA E SERVIZI
  -- ========================================
  tipo_richiesta VARCHAR(50) DEFAULT 'preventivo',
  /* Valori possibili:
     - preventivo: solo richiesta prezzo
     - ordine: intende ordinare subito
     - informazioni: vuole solo info
     - urgente: richiesta prioritaria
  */
  
  servizio_richiesto VARCHAR(50),
  /* Copiato da service_type:
     - fai_da_te: solo prodotto
     - installazione_completa: prodotto + installazione
  */
  
  necessita_installazione BOOLEAN DEFAULT false,
  necessita_sopralluogo BOOLEAN DEFAULT false,
  necessita_progetto_tecnico BOOLEAN DEFAULT false,
  necessita_permessi_comunali BOOLEAN DEFAULT false,
  
  -- ========================================
  -- INDIRIZZO (Consegna/Installazione)
  -- ========================================
  indirizzo TEXT,
  citta VARCHAR(100),
  provincia VARCHAR(50),
  cap VARCHAR(10),
  nazione VARCHAR(100) DEFAULT 'Italia',
  
  -- Coordinate geografiche (opzionale, per calcolo distanze)
  latitudine NUMERIC(10, 8),
  longitudine NUMERIC(11, 8),
  
  -- ========================================
  -- PREFERENZE CONTATTO
  -- ========================================
  preferenza_contatto VARCHAR(50),
  /* Valori da contact_preference:
     - email
     - telefono
     - whatsapp
  */
  
  -- ========================================
  -- TEMPISTICHE
  -- ========================================
  data_consegna_richiesta DATE,
  urgenza VARCHAR(50) DEFAULT 'normale',
  /* Valori possibili:
     - normale: nessuna fretta (2-4 settimane)
     - urgente: entro 1-2 settimane
     - programmata: data specifica
  */
  
  -- ========================================
  -- NOTE
  -- ========================================
  note_cliente TEXT,                     -- Note scritte dal cliente nel form
  note_interne TEXT,                     -- Note uso interno (invisibili al cliente)
  note_commerciale TEXT,                 -- Note dell'agente assegnato
  note_produzione TEXT,                  -- Note per reparto produzione
  
  -- ========================================
  -- WORKFLOW E STATI
  -- ========================================
  stato VARCHAR(50) DEFAULT 'nuova',
  /* Workflow pergole MARTELLO 1930:
     - nuova: appena ricevuta (auto)
     - da_contattare: in attesa primo contatto (auto dopo 5min)
     - contattata: cliente contattato, in attesa risposta
     - preventivo_inviato: preventivo dettagliato inviato
     - in_negoziazione: cliente sta valutando/contrattando
     - confermata: ordine confermato dal cliente
     - pagamento_acconto: acconto ricevuto
     - pagamento_completo: saldo completato
     - in_produzione: pergola in lavorazione
     - pronta_consegna: prodotto completato
     - in_spedizione: partita per consegna/installazione
     - installazione_programmata: data installazione fissata
     - installata: installazione completata
     - completata: processo chiuso con successo
     - annullata: cliente ha annullato
     - persa: vinto da competitor
     - sospesa: in attesa info/decisione cliente
  */
  
  stato_precedente VARCHAR(50),          -- Per tracking cambiamenti stato
  
  priorita VARCHAR(50) DEFAULT 'normale',
  /* Valori:
     - bassa: non urgente
     - normale: standard (default)
     - alta: importante
     - urgente: massima priorità
  */
  
  -- ========================================
  -- PRICING E COMMERCIALE
  -- ========================================
  prezzo_configuratore NUMERIC(10,2),    -- Prezzo automatico da configuratore
  prezzo_quotato NUMERIC(10,2),          -- Prezzo manuale dopo verifica commerciale
  prezzo_finale NUMERIC(10,2),           -- Prezzo dopo trattativa/sconto
  
  sconto_percentuale NUMERIC(5,2) DEFAULT 0,
  sconto_importo NUMERIC(10,2) DEFAULT 0,
  sconto_motivo TEXT,                    -- "Cliente fedele", "Promozione", ecc.
  
  margine_percentuale NUMERIC(5,2),      -- Margine commerciale (uso interno)
  costo_produzione NUMERIC(10,2),        -- Costo di produzione (uso interno)
  
  -- Dettaglio pricing (JSONB flessibile)
  dettaglio_pricing JSONB,
  /* Esempio struttura:
  {
    "prezzo_base": 2500.00,
    "costo_materiali": 350.00,
    "costo_manodopera": 800.00,
    "costo_trasporto": 120.00,
    "costo_installazione": 500.00,
    "totale_costi": 1770.00,
    "margine": 730.00,
    "margine_percentuale": 29.2,
    "sconto_applicato": 150.00,
    "prezzo_finale": 2350.00
  }
  */
  
  -- ========================================
  -- ASSEGNAZIONE E GESTIONE
  -- ========================================
  assegnato_a_user_id UUID,             -- FK a profiles (se esistente)
  assegnato_a_nome VARCHAR(255),        -- Nome agente/operatore
  team VARCHAR(100),                    -- "Commerciale Nord", "Produzione", ecc.
  fonte_richiesta VARCHAR(100) DEFAULT 'Configuratore Web',
  
  -- ========================================
  -- TRACKING TEMPORALE COMPLETO
  -- ========================================
  data_richiesta TIMESTAMPTZ DEFAULT now(),
  data_primo_contatto TIMESTAMPTZ,
  data_preventivo_inviato TIMESTAMPTZ,
  data_conferma_ordine TIMESTAMPTZ,
  data_pagamento_acconto TIMESTAMPTZ,
  data_pagamento_saldo TIMESTAMPTZ,
  data_inizio_produzione TIMESTAMPTZ,
  data_fine_produzione TIMESTAMPTZ,
  data_spedizione TIMESTAMPTZ,
  data_consegna_effettiva TIMESTAMPTZ,
  data_installazione TIMESTAMPTZ,
  data_chiusura TIMESTAMPTZ,
  
  -- ========================================
  -- INTEGRAZIONI ESTERNE
  -- ========================================
  codice_ordine_erp VARCHAR(100),        -- ID ordine in gestionale esterno
  codice_preventivo VARCHAR(100) UNIQUE, -- Numero preventivo ufficiale (es: PRV-2024-001234)
  codice_spedizione VARCHAR(100),        -- Tracking spedizioniere
  link_tracking_spedizione TEXT,
  
  id_fattura VARCHAR(100),               -- Riferimento fattura
  id_pagamento VARCHAR(100),             -- ID transazione pagamento
  
  -- ========================================
  -- DOCUMENTI ALLEGATI
  -- ========================================
  documenti_urls TEXT[],                 -- Array URL documenti (contratti, progetti, foto, ecc.)
  
  -- ========================================
  -- STATISTICHE E METRICHE
  -- ========================================
  numero_contatti INTEGER DEFAULT 0,     -- Quante volte contattato il cliente
  numero_modifiche INTEGER DEFAULT 0,    -- Quante volte modificata la richiesta
  numero_email_inviate INTEGER DEFAULT 0, -- Quante email mandate
  numero_chiamate INTEGER DEFAULT 0,     -- Quante chiamate effettuate
  
  -- ========================================
  -- METADATI
  -- ========================================
  ip_address INET,                       -- IP cliente (per analytics)
  user_agent TEXT,                       -- Browser cliente
  
  -- ========================================
  -- TIMESTAMP
  -- ========================================
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- STEP 2: Indici per Performance
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_richieste_configurazione 
  ON configuratorelegno_richieste(configurazione_id);

CREATE INDEX IF NOT EXISTS idx_richieste_email 
  ON configuratorelegno_richieste(cliente_email);

CREATE INDEX IF NOT EXISTS idx_richieste_stato 
  ON configuratorelegno_richieste(stato);

CREATE INDEX IF NOT EXISTS idx_richieste_stato_priorita 
  ON configuratorelegno_richieste(stato, priorita);

CREATE INDEX IF NOT EXISTS idx_richieste_data 
  ON configuratorelegno_richieste(data_richiesta DESC);

CREATE INDEX IF NOT EXISTS idx_richieste_assegnato 
  ON configuratorelegno_richieste(assegnato_a_user_id) 
  WHERE assegnato_a_user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_richieste_codice_preventivo 
  ON configuratorelegno_richieste(codice_preventivo) 
  WHERE codice_preventivo IS NOT NULL;

-- Indice per ricerca full-text su note e dati cliente
CREATE INDEX IF NOT EXISTS idx_richieste_search 
  ON configuratorelegno_richieste 
  USING gin(to_tsvector('italian', 
    coalesce(cliente_nome, '') || ' ' ||
    coalesce(cliente_cognome, '') || ' ' ||
    coalesce(cliente_email, '') || ' ' ||
    coalesce(note_cliente, '') || ' ' ||
    coalesce(note_interne, '')
  ));

-- =====================================================
-- STEP 3: Trigger per Updated At
-- =====================================================

CREATE OR REPLACE FUNCTION update_richieste_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER richieste_updated_at_trigger
  BEFORE UPDATE ON configuratorelegno_richieste
  FOR EACH ROW
  EXECUTE FUNCTION update_richieste_updated_at();

-- =====================================================
-- STEP 4: Trigger per Contare Modifiche
-- =====================================================

CREATE OR REPLACE FUNCTION increment_richieste_modifiche()
RETURNS TRIGGER AS $$
BEGIN
  -- Incrementa solo se ci sono cambiamenti reali (escluso updated_at)
  IF OLD.* IS DISTINCT FROM NEW.* AND 
     (OLD.stato IS DISTINCT FROM NEW.stato OR
      OLD.note_interne IS DISTINCT FROM NEW.note_interne OR
      OLD.note_commerciale IS DISTINCT FROM NEW.note_commerciale OR
      OLD.prezzo_finale IS DISTINCT FROM NEW.prezzo_finale OR
      OLD.assegnato_a_user_id IS DISTINCT FROM NEW.assegnato_a_user_id) THEN
    
    NEW.numero_modifiche = OLD.numero_modifiche + 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER richieste_count_modifiche
  BEFORE UPDATE ON configuratorelegno_richieste
  FOR EACH ROW
  EXECUTE FUNCTION increment_richieste_modifiche();

-- =====================================================
-- STEP 5: Trigger per Tracking Cambio Stato
-- =====================================================

CREATE OR REPLACE FUNCTION track_richieste_stato_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Salva stato precedente quando cambia
  IF OLD.stato IS DISTINCT FROM NEW.stato THEN
    NEW.stato_precedente = OLD.stato;
    
    -- Aggiorna automaticamente timestamp basati sullo stato
    CASE NEW.stato
      WHEN 'contattata' THEN
        IF NEW.data_primo_contatto IS NULL THEN
          NEW.data_primo_contatto = now();
          NEW.numero_contatti = OLD.numero_contatti + 1;
        END IF;
      
      WHEN 'preventivo_inviato' THEN
        IF NEW.data_preventivo_inviato IS NULL THEN
          NEW.data_preventivo_inviato = now();
          NEW.numero_email_inviate = OLD.numero_email_inviate + 1;
        END IF;
      
      WHEN 'confermata' THEN
        IF NEW.data_conferma_ordine IS NULL THEN
          NEW.data_conferma_ordine = now();
        END IF;
      
      WHEN 'pagamento_acconto' THEN
        IF NEW.data_pagamento_acconto IS NULL THEN
          NEW.data_pagamento_acconto = now();
        END IF;
      
      WHEN 'pagamento_completo' THEN
        IF NEW.data_pagamento_saldo IS NULL THEN
          NEW.data_pagamento_saldo = now();
        END IF;
      
      WHEN 'in_produzione' THEN
        IF NEW.data_inizio_produzione IS NULL THEN
          NEW.data_inizio_produzione = now();
        END IF;
      
      WHEN 'pronta_consegna' THEN
        IF NEW.data_fine_produzione IS NULL THEN
          NEW.data_fine_produzione = now();
        END IF;
      
      WHEN 'in_spedizione' THEN
        IF NEW.data_spedizione IS NULL THEN
          NEW.data_spedizione = now();
        END IF;
      
      WHEN 'installata' THEN
        IF NEW.data_installazione IS NULL THEN
          NEW.data_installazione = now();
        END IF;
      
      WHEN 'completata' THEN
        IF NEW.data_chiusura IS NULL THEN
          NEW.data_chiusura = now();
        END IF;
      
      WHEN 'annullata', 'persa' THEN
        IF NEW.data_chiusura IS NULL THEN
          NEW.data_chiusura = now();
        END IF;
      
      ELSE
        NULL;
    END CASE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER richieste_track_stato_change
  BEFORE UPDATE ON configuratorelegno_richieste
  FOR EACH ROW
  EXECUTE FUNCTION track_richieste_stato_change();

-- =====================================================
-- STEP 6: Funzione per Generare Codice Preventivo
-- =====================================================

CREATE OR REPLACE FUNCTION generate_codice_preventivo()
RETURNS TRIGGER AS $$
DECLARE
  anno VARCHAR(4);
  progressivo INTEGER;
  nuovo_codice VARCHAR(100);
BEGIN
  -- Genera codice solo se non esiste già
  IF NEW.codice_preventivo IS NULL THEN
    anno := TO_CHAR(NEW.created_at, 'YYYY');
    
    -- Trova ultimo progressivo dell'anno
    SELECT COALESCE(MAX(
      CAST(SPLIT_PART(codice_preventivo, '-', 3) AS INTEGER)
    ), 0) + 1
    INTO progressivo
    FROM configuratorelegno_richieste
    WHERE codice_preventivo LIKE 'PRV-' || anno || '-%';
    
    -- Genera codice formato: PRV-2024-001234
    nuovo_codice := 'PRV-' || anno || '-' || LPAD(progressivo::TEXT, 6, '0');
    
    NEW.codice_preventivo = nuovo_codice;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER richieste_generate_codice
  BEFORE INSERT ON configuratorelegno_richieste
  FOR EACH ROW
  EXECUTE FUNCTION generate_codice_preventivo();

-- =====================================================
-- STEP 7: Commenti Descrittivi
-- =====================================================

COMMENT ON TABLE configuratorelegno_richieste IS 
'Richieste preventivo/ordine per pergole con tracking completo workflow e metriche commerciali';

COMMENT ON COLUMN configuratorelegno_richieste.stato IS 
'Stato workflow richiesta. Valori: nuova, da_contattare, contattata, preventivo_inviato, in_negoziazione, confermata, pagamento_acconto, pagamento_completo, in_produzione, pronta_consegna, in_spedizione, installata, completata, annullata, persa, sospesa';

COMMENT ON COLUMN configuratorelegno_richieste.codice_preventivo IS 
'Codice preventivo univoco generato automaticamente (formato: PRV-YYYY-NNNNNN)';

COMMENT ON COLUMN configuratorelegno_richieste.dettaglio_pricing IS 
'Dettaglio completo calcolo prezzi in formato JSON per tracciabilità';

-- =====================================================
-- STEP 8: RLS (Row Level Security) - Opzionale
-- =====================================================

-- Abilita RLS sulla tabella (se necessario per sicurezza multi-tenant)
-- ALTER TABLE configuratorelegno_richieste ENABLE ROW LEVEL SECURITY;

-- Policy esempio: Admin vedono tutto
-- CREATE POLICY "Admin full access" ON configuratorelegno_richieste
--   FOR ALL
--   USING (auth.jwt() ->> 'role' = 'admin');

-- Policy esempio: Agenti vedono solo le loro richieste
-- CREATE POLICY "Agents see own requests" ON configuratorelegno_richieste
--   FOR SELECT
--   USING (assegnato_a_user_id = auth.uid());

-- =====================================================
-- FINE MIGRAZIONE
-- =====================================================

-- Test di verifica
DO $$
BEGIN
  RAISE NOTICE '✅ Migrazione 001_create_richieste_tracking completata con successo!';
  RAISE NOTICE '📊 Tabella configuratorelegno_richieste creata';
  RAISE NOTICE '🔍 % indici creati', (
    SELECT count(*) 
    FROM pg_indexes 
    WHERE tablename = 'configuratorelegno_richieste'
  );
  RAISE NOTICE '⚡ % trigger attivi', (
    SELECT count(*) 
    FROM pg_trigger 
    WHERE tgrelid = 'configuratorelegno_richieste'::regclass
  );
END $$;
