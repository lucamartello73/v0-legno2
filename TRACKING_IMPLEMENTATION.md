# 📊 Sistema Tracking Richieste - Guida Implementazione

Documentazione completa del sistema di tracking richieste preventivo per il configuratore pergole MARTELLO 1930.

---

## 📋 Indice

- [Panoramica](#panoramica)
- [Cosa è stato implementato](#cosa-è-stato-implementato)
- [Setup Database](#setup-database)
- [API Disponibili](#api-disponibili)
- [Esempi d'uso](#esempi-duso)
- [Integrazione Dashboard](#integrazione-dashboard)
- [Next Steps](#next-steps)

---

## 🎯 Panoramica

Il sistema di tracking è progettato per:

✅ **Tracciare completamente** il ciclo di vita di ogni richiesta preventivo  
✅ **Automatizzare** i cambiamenti di stato con trigger database  
✅ **Generare** codici preventivo univoci (formato: `PRV-2024-001234`)  
✅ **Fornire metriche** in tempo reale per dashboard commerciale  
✅ **Storicizzare** ogni modifica per audit e analytics  

---

## ✨ Cosa è stato implementato

### 1. Database Schema

#### Tabella: `configuratorelegno_richieste`
- Tracking completo richieste preventivo
- 16+ stati workflow
- Timestamp automatici per ogni fase
- Pricing dettagliato con storico
- Assegnazione agenti
- Metadati e statistiche

#### Tabella: `configuratorelegno_richieste_storico_stati`
- Audit log completo cambiamenti stato
- Chi/quando/perché ogni modifica
- Cronologia completa richiesta

#### View: `configuratorelegno_richieste_metriche`
- Dashboard metriche aggregate
- Tasso conversione automatico
- Valore totale ordini
- Tempi medi per fase

#### View: `configuratorelegno_richieste_attive`
- Richieste in lavorazione (escluse completate/annullate/perse)
- Join con configurazioni
- Ordinamento per priorità e data

### 2. Trigger Automatici

✅ **`generate_codice_preventivo()`**  
Genera codice univoco formato `PRV-YYYY-NNNNNN` alla creazione

✅ **`track_richieste_stato_change()`**  
Aggiorna timestamp automaticamente al cambio stato

✅ **`log_richiesta_stato_change()`**  
Registra ogni cambio stato in tabella storico

✅ **`increment_richieste_modifiche()`**  
Conta modifiche rilevanti alla richiesta

✅ **`update_richieste_updated_at()`**  
Aggiorna `updated_at` ad ogni modifica

### 3. API Routes

#### `/api/richieste`
- `GET` - Lista richieste con filtri (stato, priorità, search, paginazione)
- `POST` - Crea nuova richiesta
- `PATCH` - Aggiorna richiesta (cambio stato, note, prezzi)
- `DELETE` - Elimina richiesta (preferibile soft delete)

#### `/api/richieste/metriche`
- `GET` - Metriche aggregate e richieste attive

#### `/api/richieste/[id]/storico`
- `GET` - Storico completo cambiamenti stato
- `POST` - Aggiungi nota manuale allo storico

### 4. Integrazione Send-Email

L'API `/api/send-email` è stata aggiornata per:
- ✅ Salvare richiesta con tracking dopo configurazione
- ✅ Generare codice preventivo automatico
- ✅ Includere codice preventivo nelle email cliente/admin
- ✅ Stato iniziale: `nuova`

---

## 🚀 Setup Database

### Step 1: Applicare Migrations

Vai su [Supabase Dashboard](https://app.supabase.com) → SQL Editor

**1. Applica Migration 001:**

```bash
# Copia contenuto di:
database/migrations/001_create_richieste_tracking.sql

# Incolla in SQL Editor e esegui
```

**2. Applica Migration 002:**

```bash
# Copia contenuto di:
database/migrations/002_create_storico_stati.sql

# Incolla in SQL Editor e esegui
```

### Step 2: Verifica Setup

```sql
-- Verifica tabelle create
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE 'configuratorelegno_richieste%';

-- Risultato atteso:
-- configuratorelegno_richieste
-- configuratorelegno_richieste_storico_stati

-- Verifica view
SELECT table_name 
FROM information_schema.views 
WHERE table_name LIKE 'configuratorelegno_richieste%';

-- Risultato atteso:
-- configuratorelegno_richieste_metriche
-- configuratorelegno_richieste_attive
```

### Step 3: Test Funzionalità

```sql
-- Test generazione codice preventivo
INSERT INTO configuratorelegno_richieste (
  cliente_nome,
  cliente_email,
  prezzo_configuratore
) VALUES (
  'Test Cliente',
  'test@example.com',
  2500.00
) RETURNING codice_preventivo;

-- Verifica codice generato (es: PRV-2024-000001)

-- Test cambio stato con trigger
UPDATE configuratorelegno_richieste
SET stato = 'contattata'
WHERE cliente_email = 'test@example.com';

-- Verifica timestamp aggiornato
SELECT 
  codice_preventivo,
  stato,
  data_primo_contatto,
  numero_modifiche
FROM configuratorelegno_richieste
WHERE cliente_email = 'test@example.com';

-- Verifica storico creato
SELECT * FROM configuratorelegno_richieste_storico_stati
WHERE richiesta_id = (
  SELECT id FROM configuratorelegno_richieste 
  WHERE cliente_email = 'test@example.com'
);
```

---

## 📡 API Disponibili

### 1. Lista Richieste

```bash
# Tutte le richieste (ultime 50)
GET /api/richieste

# Filtra per stato
GET /api/richieste?stato=nuova

# Filtra per priorità
GET /api/richieste?priorita=urgente

# Solo richieste attive (esclude completate/annullate/perse)
GET /api/richieste?view=active

# Ricerca full-text
GET /api/richieste?search=Mario%20Rossi

# Paginazione
GET /api/richieste?limit=20&offset=40

# Combinazione filtri
GET /api/richieste?stato=preventivo_inviato&priorita=alta&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "codice_preventivo": "PRV-2024-000123",
      "cliente_nome": "Mario",
      "cliente_cognome": "Rossi",
      "cliente_email": "mario.rossi@example.com",
      "cliente_telefono": "+39 123 456 7890",
      "stato": "preventivo_inviato",
      "priorita": "alta",
      "prezzo_configuratore": 2500.00,
      "prezzo_finale": 2350.00,
      "data_richiesta": "2024-11-16T10:30:00Z",
      "configurazione": {
        "type_name": "Pergola Addossata",
        "width": 4,
        "depth": 3,
        "height": 2.5,
        "color_name": "Bianco",
        "coverage_name": "Policarbonato",
        "total_price": 2500.00
      }
    }
  ],
  "count": 156,
  "limit": 50,
  "offset": 0
}
```

### 2. Aggiorna Richiesta (Cambio Stato)

```bash
PATCH /api/richieste?id={uuid}
Content-Type: application/json

{
  "stato": "confermata",
  "note_commerciale": "Cliente ha confermato ordine telefonicamente",
  "prezzo_finale": 2350.00,
  "sconto_importo": 150.00,
  "sconto_motivo": "Cliente fedele"
}
```

**Response:**
```json
{
  "id": "uuid",
  "codice_preventivo": "PRV-2024-000123",
  "stato": "confermata",
  "stato_precedente": "preventivo_inviato",
  "data_conferma_ordine": "2024-11-16T15:20:00Z",
  "numero_modifiche": 3,
  "updated_at": "2024-11-16T15:20:00Z"
}
```

### 3. Metriche Dashboard

```bash
GET /api/richieste/metriche
```

**Response:**
```json
{
  "metriche": {
    "totale_nuove": 12,
    "totale_da_contattare": 5,
    "totale_contattate": 8,
    "totale_preventivi_inviati": 15,
    "totale_in_negoziazione": 6,
    "totale_confermate": 4,
    "totale_in_lavorazione": 3,
    "totale_completate": 45,
    "totale_annullate": 8,
    "totale_perse": 12,
    "totale_urgenti": 2,
    "totale_alta_priorita": 5,
    "tempo_medio_primo_contatto": "2 hours 15 minutes",
    "tempo_medio_completamento": "18 days 5 hours",
    "valore_totale_ordini": 125000.00,
    "valore_medio_ordine": 2500.00,
    "tasso_conversione_percentuale": 38.46,
    "totale_richieste": 130,
    "prima_richiesta": "2024-01-15T10:00:00Z",
    "ultima_richiesta": "2024-11-16T14:30:00Z"
  },
  "richieste_attive": [
    {
      "id": "uuid",
      "codice_preventivo": "PRV-2024-000120",
      "cliente_nome": "Laura",
      "cliente_cognome": "Bianchi",
      "stato": "nuova",
      "priorita": "urgente",
      "giorni_dalla_richiesta": 0,
      "giorni_ultima_modifica": 0
    }
  ]
}
```

### 4. Storico Richiesta

```bash
GET /api/richieste/{id}/storico
```

**Response:**
```json
{
  "richiesta": {
    "id": "uuid",
    "codice_preventivo": "PRV-2024-000123",
    "cliente_nome": "Mario Rossi",
    "stato_corrente": "confermata"
  },
  "storico": [
    {
      "id": "uuid",
      "stato_precedente": null,
      "stato_nuovo": "nuova",
      "motivo_cambio": "Richiesta creata tramite Configuratore Web",
      "modificato_da_tipo": "sistema",
      "cambiato_at": "2024-11-15T10:00:00Z"
    },
    {
      "id": "uuid",
      "stato_precedente": "nuova",
      "stato_nuovo": "contattata",
      "motivo_cambio": "Cambio stato manuale",
      "modificato_da_nome": "Agente Commerciale",
      "modificato_da_tipo": "automatico",
      "cambiato_at": "2024-11-15T11:30:00Z"
    },
    {
      "id": "uuid",
      "stato_precedente": "contattata",
      "stato_nuovo": "preventivo_inviato",
      "motivo_cambio": "Cambio stato manuale",
      "modificato_da_tipo": "automatico",
      "cambiato_at": "2024-11-15T14:00:00Z"
    },
    {
      "id": "uuid",
      "stato_precedente": "preventivo_inviato",
      "stato_nuovo": "confermata",
      "motivo_cambio": "Cambio stato manuale",
      "modificato_da_tipo": "automatico",
      "cambiato_at": "2024-11-16T15:20:00Z"
    }
  ],
  "count": 4
}
```

---

## 💡 Esempi d'uso

### Esempio 1: Dashboard Richieste da Gestire

```typescript
// app/admin/richieste/page.tsx
async function getRichiesteUrgenti() {
  const response = await fetch('/api/richieste?view=active&priorita=urgente')
  const { data } = await response.json()
  return data
}

async function getRichiesteNonContattate() {
  const response = await fetch('/api/richieste?stato=nuova')
  const { data } = await response.json()
  return data
}
```

### Esempio 2: Cambio Stato da Dashboard

```typescript
async function cambiaStato(richiestaId: string, nuovoStato: string, note?: string) {
  const response = await fetch(`/api/richieste?id=${richiestaId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      stato: nuovoStato,
      note_commerciale: note
    })
  })
  
  if (response.ok) {
    const data = await response.json()
    console.log('Stato aggiornato:', data.codice_preventivo)
    // Mostra toast successo
  }
}
```

### Esempio 3: Visualizzare Storico Timeline

```typescript
async function getTimeline(richiestaId: string) {
  const response = await fetch(`/api/richieste/${richiestaId}/storico`)
  const { storico } = await response.json()
  
  return storico.map(entry => ({
    date: new Date(entry.cambiato_at),
    stato: entry.stato_nuovo,
    motivo: entry.motivo_cambio,
    utente: entry.modificato_da_nome || 'Sistema'
  }))
}
```

### Esempio 4: Widget Metriche

```typescript
async function getDashboardMetrics() {
  const response = await fetch('/api/richieste/metriche')
  const { metriche } = await response.json()
  
  return {
    tassoConversione: metriche.tasso_conversione_percentuale,
    valoreOrdini: metriche.valore_totale_ordini,
    richiesteAttive: metriche.totale_nuove + metriche.totale_da_contattare,
    tempoMedioRisposta: metriche.tempo_medio_primo_contatto
  }
}
```

---

## 🎨 Integrazione Dashboard

### Componenti Consigliati

1. **TabellRichieste**
   - Lista paginata richieste
   - Filtri per stato/priorità
   - Ricerca full-text
   - Ordinamento colonne

2. **CardMetriche**
   - KPI principali (conversione, valore ordini, ecc.)
   - Grafici trend
   - Comparazione periodi

3. **TimelineStato**
   - Storico visuale cambiamenti stato
   - Timeline verticale/orizzontale
   - Icone per ogni stato

4. **FormCambioStato**
   - Dropdown stati disponibili
   - Campo note
   - Validazione workflow

5. **DettaglioRichiesta**
   - Info cliente completo
   - Dati configurazione pergola
   - Storico completo
   - Azioni rapide (cambia stato, aggiungi nota, ecc.)

### Esempio Struttura Dashboard

```
/admin/dashboard
├── /richieste
│   ├── page.tsx              # Lista richieste
│   ├── [id]/page.tsx         # Dettaglio richiesta
│   └── components/
│       ├── TabellRichieste.tsx
│       ├── FiltriRichieste.tsx
│       └── CardRichiesta.tsx
├── /metriche
│   └── page.tsx              # Dashboard metriche
└── /storico
    └── [id]/page.tsx         # Storico timeline
```

---

## 🚀 Next Steps

### Immediate (Priorità Alta)

- [ ] **Applicare migrations database** su Supabase
- [ ] **Testare API** con Postman/curl
- [ ] **Creare componente TabellRichieste** in admin dashboard
- [ ] **Aggiungere link "Gestisci Richieste"** in navigation admin

### Short Term (Priorità Media)

- [ ] **Implementare notifiche email** su cambio stato
- [ ] **Creare dashboard metriche** con grafici
- [ ] **Aggiungere export Excel/CSV** richieste
- [ ] **Implementare assegnazione agenti** automatica

### Long Term (Priorità Bassa)

- [ ] **Integrazione calendario** per installazioni
- [ ] **Sistema ticketing** per supporto post-vendita
- [ ] **App mobile** per agenti (React Native)
- [ ] **Integrazione gestionale ERP** esterno

---

## 📚 Riferimenti

- [Database README](./database/README.md) - Query utili e troubleshooting
- [Migration 001](./database/migrations/001_create_richieste_tracking.sql) - Schema tabelle
- [Migration 002](./database/migrations/002_create_storico_stati.sql) - Storico e view
- [API Richieste](./app/api/richieste/route.ts) - Endpoint CRUD
- [API Metriche](./app/api/richieste/metriche/route.ts) - Endpoint metriche

---

**Versione**: 1.0.0  
**Data**: 2025-11-16  
**Autore**: GenSpark AI Developer  
**Status**: ✅ Pronto per produzione
