# 🗄️ Database Migrations - Configuratore Pergole

Questa directory contiene le migrazioni SQL per il sistema di tracking richieste del configuratore pergole MARTELLO 1930.

## 📋 Indice

- [Panoramica](#panoramica)
- [Struttura Database](#struttura-database)
- [Come Applicare le Migrations](#come-applicare-le-migrations)
- [Migrations Disponibili](#migrations-disponibili)
- [Workflow Stati](#workflow-stati)
- [Query Utili](#query-utili)
- [Troubleshooting](#troubleshooting)

---

## 📊 Panoramica

Il sistema di tracking è composto da:

1. **`configuratorelegno_richieste`** - Tabella principale con tracking completo workflow
2. **`configuratorelegno_richieste_storico_stati`** - Audit log cambiamenti stato
3. **View `configuratorelegno_richieste_metriche`** - Dashboard metriche aggregate
4. **View `configuratorelegno_richieste_attive`** - Richieste in lavorazione

### Funzionalità Principali

✅ **Tracking Temporale Completo**
- Timestamp automatici per ogni fase del workflow
- Storico completo cambiamenti stato
- Metriche tempo medio per fase

✅ **Workflow Automatizzato**
- Cambio stato automatico con trigger
- Generazione codice preventivo automatica (formato: `PRV-2024-001234`)
- Aggiornamento contatori automatici

✅ **Metriche e Analytics**
- View aggregate per dashboard
- Tasso conversione automatico
- Valore totale ordini in tempo reale

✅ **Sicurezza e Audit**
- Log completo di ogni modifica
- Tracking utente che ha effettuato cambio
- Full-text search su dati cliente e note

---

## 🏗️ Struttura Database

### Tabella: `configuratorelegno_richieste`

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `configurazione_id` | UUID | FK a `configuratorelegno_configurations` |
| `cliente_nome` | VARCHAR(255) | Nome cliente |
| `cliente_email` | VARCHAR(255) | Email cliente |
| `stato` | VARCHAR(50) | Stato workflow (vedi sotto) |
| `priorita` | VARCHAR(50) | Priorità: `bassa`, `normale`, `alta`, `urgente` |
| `codice_preventivo` | VARCHAR(100) | Codice univoco (auto-generato) |
| `prezzo_configuratore` | NUMERIC(10,2) | Prezzo da configuratore web |
| `prezzo_finale` | NUMERIC(10,2) | Prezzo dopo trattativa |
| `data_richiesta` | TIMESTAMPTZ | Data creazione richiesta |
| `data_primo_contatto` | TIMESTAMPTZ | Data primo contatto cliente |
| `data_chiusura` | TIMESTAMPTZ | Data chiusura pratica |
| ... | ... | [Vedi schema completo nel file SQL] |

### Tabella: `configuratorelegno_richieste_storico_stati`

| Campo | Tipo | Descrizione |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `richiesta_id` | UUID | FK a richiesta |
| `stato_precedente` | VARCHAR(50) | Stato prima del cambio |
| `stato_nuovo` | VARCHAR(50) | Nuovo stato |
| `motivo_cambio` | TEXT | Motivo del cambio |
| `modificato_da_nome` | VARCHAR(255) | Chi ha modificato |
| `cambiato_at` | TIMESTAMPTZ | Quando è stato modificato |

---

## 🚀 Come Applicare le Migrations

### Metodo 1: Supabase Dashboard (Consigliato)

1. Vai su [Supabase Dashboard](https://app.supabase.com)
2. Seleziona il progetto
3. Vai in **SQL Editor**
4. Copia il contenuto di ogni migration file
5. Esegui nell'ordine:
   - `001_create_richieste_tracking.sql`
   - `002_create_storico_stati.sql`

### Metodo 2: CLI Supabase

```bash
# Installa Supabase CLI se non l'hai già fatto
npm install -g supabase

# Login
supabase login

# Collega progetto
supabase link --project-ref your-project-ref

# Applica migrations
supabase db push database/migrations/001_create_richieste_tracking.sql
supabase db push database/migrations/002_create_storico_stati.sql
```

### Metodo 3: psql (Per utenti avanzati)

```bash
# Connetti al database
psql "postgresql://user:password@host:port/database"

# Applica migration
\i database/migrations/001_create_richieste_tracking.sql
\i database/migrations/002_create_storico_stati.sql
```

### Verifica Applicazione

```sql
-- Verifica tabelle create
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'configuratorelegno_richieste%';

-- Verifica trigger
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table LIKE 'configuratorelegno_richieste%';

-- Verifica view
SELECT table_name 
FROM information_schema.views 
WHERE table_schema = 'public' 
  AND table_name LIKE 'configuratorelegno_richieste%';
```

---

## 🔄 Workflow Stati

### Stati Disponibili

| Stato | Descrizione | Auto-trigger | Timestamp |
|-------|-------------|--------------|-----------|
| `nuova` | Appena ricevuta | ✅ Creazione | `data_richiesta` |
| `da_contattare` | In attesa primo contatto | ⏱️ Dopo 5min | - |
| `contattata` | Cliente contattato | - | `data_primo_contatto` |
| `preventivo_inviato` | Preventivo inviato | - | `data_preventivo_inviato` |
| `in_negoziazione` | Cliente sta valutando | - | - |
| `confermata` | Ordine confermato | - | `data_conferma_ordine` |
| `pagamento_acconto` | Acconto ricevuto | - | `data_pagamento_acconto` |
| `pagamento_completo` | Saldo ricevuto | - | `data_pagamento_saldo` |
| `in_produzione` | In lavorazione | - | `data_inizio_produzione` |
| `pronta_consegna` | Pronta per spedizione | - | `data_fine_produzione` |
| `in_spedizione` | Partita per consegna | - | `data_spedizione` |
| `installata` | Installazione completata | - | `data_installazione` |
| `completata` | Processo chiuso | ✅ Fine | `data_chiusura` |
| `annullata` | Cliente ha annullato | - | `data_chiusura` |
| `persa` | Vinto da competitor | - | `data_chiusura` |
| `sospesa` | In attesa info cliente | - | - |

### Diagramma Workflow

```
┌─────────┐
│  nuova  │ (Auto)
└────┬────┘
     │
     ▼
┌──────────────┐
│da_contattare │ (Auto dopo 5min)
└──────┬───────┘
       │
       ▼
┌──────────┐     ┌──────────┐
│contattata│────▶│ sospesa  │
└────┬─────┘     └──────────┘
     │
     ▼
┌──────────────────┐
│preventivo_inviato│
└────┬─────────────┘
     │
     ▼
┌───────────────┐     ┌────────┐
│in_negoziazione│────▶│ persa  │
└───────┬───────┘     └────────┘
        │
        ▼
┌──────────┐     ┌───────────┐
│confermata│────▶│ annullata │
└────┬─────┘     └───────────┘
     │
     ▼
┌─────────────────┐
│pagamento_acconto│
└────┬────────────┘
     │
     ▼
┌──────────────────┐
│pagamento_completo│
└────┬─────────────┘
     │
     ▼
┌──────────────┐
│in_produzione │
└──────┬───────┘
       │
       ▼
┌────────────────┐
│pronta_consegna │
└───────┬────────┘
        │
        ▼
┌──────────────┐
│in_spedizione │
└──────┬───────┘
       │
       ▼
┌───────────┐
│installata │
└─────┬─────┘
      │
      ▼
┌───────────┐
│completata │ (Fine)
└───────────┘
```

---

## 📊 Query Utili

### Dashboard Metriche

```sql
-- Metriche generali (usa view predefinita)
SELECT * FROM configuratorelegno_richieste_metriche;

-- Richieste attive (usa view predefinita)
SELECT * FROM configuratorelegno_richieste_attive;
```

### Richieste per Stato

```sql
-- Conta richieste per stato
SELECT 
  stato,
  COUNT(*) as totale,
  AVG(prezzo_finale) as prezzo_medio
FROM configuratorelegno_richieste
GROUP BY stato
ORDER BY totale DESC;
```

### Richieste da Gestire Oggi

```sql
-- Richieste urgenti o non contattate
SELECT 
  codice_preventivo,
  cliente_nome,
  cliente_email,
  stato,
  priorita,
  data_richiesta,
  EXTRACT(HOUR FROM (now() - data_richiesta)) as ore_attesa
FROM configuratorelegno_richieste
WHERE stato IN ('nuova', 'da_contattare')
   OR priorita IN ('urgente', 'alta')
ORDER BY priorita DESC, data_richiesta ASC;
```

### Performance Commerciale

```sql
-- Tasso conversione per mese
SELECT 
  DATE_TRUNC('month', data_richiesta) as mese,
  COUNT(*) as totale_richieste,
  COUNT(*) FILTER (WHERE stato IN ('confermata', 'in_produzione', 'completata')) as ordini,
  ROUND(
    (COUNT(*) FILTER (WHERE stato IN ('confermata', 'in_produzione', 'completata'))::NUMERIC / 
     COUNT(*)) * 100, 
    2
  ) as tasso_conversione_percentuale
FROM configuratorelegno_richieste
GROUP BY DATE_TRUNC('month', data_richiesta)
ORDER BY mese DESC;
```

### Tempo Medio di Risposta

```sql
-- Tempo medio primo contatto
SELECT 
  AVG(data_primo_contatto - data_richiesta) as tempo_medio,
  MIN(data_primo_contatto - data_richiesta) as tempo_minimo,
  MAX(data_primo_contatto - data_richiesta) as tempo_massimo
FROM configuratorelegno_richieste
WHERE data_primo_contatto IS NOT NULL;
```

### Storico Richiesta Specifica

```sql
-- Usa funzione helper
SELECT * FROM get_richiesta_storico('uuid-richiesta-qui');

-- Oppure query manuale
SELECT 
  stato_precedente,
  stato_nuovo,
  motivo_cambio,
  modificato_da_nome,
  cambiato_at
FROM configuratorelegno_richieste_storico_stati
WHERE richiesta_id = 'uuid-richiesta-qui'
ORDER BY cambiato_at ASC;
```

### Top Prodotti Richiesti

```sql
-- Pergole più configurate
SELECT 
  c.type_name,
  COUNT(*) as numero_richieste,
  AVG(r.prezzo_finale) as prezzo_medio,
  SUM(r.prezzo_finale) FILTER (WHERE r.stato IN ('confermata', 'completata')) as valore_totale_ordini
FROM configuratorelegno_richieste r
JOIN configuratorelegno_configurations c ON r.configurazione_id = c.id
GROUP BY c.type_name
ORDER BY numero_richieste DESC;
```

### Richieste Stagnanti

```sql
-- Richieste ferme da più di 7 giorni
SELECT 
  codice_preventivo,
  cliente_nome,
  cliente_email,
  stato,
  EXTRACT(DAY FROM (now() - updated_at)) as giorni_ferma,
  assegnato_a_nome
FROM configuratorelegno_richieste
WHERE stato NOT IN ('completata', 'annullata', 'persa')
  AND updated_at < (now() - INTERVAL '7 days')
ORDER BY updated_at ASC;
```

---

## 🛠️ Troubleshooting

### Problema: Trigger non si attivano

**Soluzione**: Verifica che i trigger siano abilitati:

```sql
-- Lista trigger attivi
SELECT * FROM pg_trigger 
WHERE tgrelid = 'configuratorelegno_richieste'::regclass;

-- Riattiva trigger se disabilitati
ALTER TABLE configuratorelegno_richieste ENABLE TRIGGER ALL;
```

### Problema: Codice preventivo duplicato

**Soluzione**: Il codice è UNIQUE. Se c'è duplicato, verifica:

```sql
-- Trova duplicati
SELECT codice_preventivo, COUNT(*) 
FROM configuratorelegno_richieste 
GROUP BY codice_preventivo 
HAVING COUNT(*) > 1;

-- Rigenera codici unici
UPDATE configuratorelegno_richieste 
SET codice_preventivo = NULL 
WHERE id IN (SELECT id FROM richieste_duplicate);
-- Il trigger genererà nuovi codici univoci
```

### Problema: Performance lente

**Soluzione**: Verifica indici:

```sql
-- Lista indici
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'configuratorelegno_richieste';

-- Reindex se necessario
REINDEX TABLE configuratorelegno_richieste;
```

### Problema: View metriche non aggiornate

**Soluzione**: Le view sono sempre aggiornate (non materializzate). Se ci sono problemi:

```sql
-- Ricrea view
DROP VIEW IF EXISTS configuratorelegno_richieste_metriche CASCADE;
-- Poi esegui di nuovo 002_create_storico_stati.sql
```

---

## 📚 Riferimenti

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Triggers](https://www.postgresql.org/docs/current/sql-createtrigger.html)
- [PostgreSQL Functions](https://www.postgresql.org/docs/current/sql-createfunction.html)

---

## 📞 Support

Per problemi o domande:
- **Email**: info@martello1930.net
- **Documentazione Progetto**: [README.md](../README.md)

---

**Versione**: 1.0.0  
**Data**: 2025-11-16  
**Autore**: GenSpark AI Developer
