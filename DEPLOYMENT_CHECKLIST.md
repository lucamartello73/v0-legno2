# 🚀 Deployment Checklist - Configuratore Pergole LEGNO

Checklist completa per il deployment in produzione del progetto con nuove features.

---

## ✅ Pre-Deployment Checklist

### 1. Code & Build

- [x] ✅ **Build production completato** - `npm run build` senza errori
- [x] ✅ **Codice committato** - 2 commit su branch `genspark_ai_developer`
- [x] ✅ **Pull Request creata** - PR #1 su GitHub
- [x] ✅ **Documentazione completa** - README, GMAIL_SETUP, TRACKING_IMPLEMENTATION

### 2. Features Implementate

#### A. Gmail SMTP Email System ✅

- [x] Modulo `lib/email/gmail-transport.ts` creato
- [x] API `/api/send-email` refactorata
- [x] API `/api/test-email` refactorata
- [x] Template HTML email responsive
- [x] Documentazione `GMAIL_SETUP.md`

#### B. Sistema Tracking Richieste ✅

- [x] Schema database completo (2 migrations SQL)
- [x] Trigger automatici (5 funzioni PostgreSQL)
- [x] API `/api/richieste` (GET, POST, PATCH, DELETE)
- [x] API `/api/richieste/metriche`
- [x] API `/api/richieste/[id]/storico`
- [x] View database per metriche
- [x] Documentazione `TRACKING_IMPLEMENTATION.md`

---

## 🔧 Deployment Steps

### Step 1: Review e Merge PR

```bash
# 1. Vai su GitHub PR #1
https://github.com/lucamartello73/v0-legno2/pull/1

# 2. Review changes
# 3. Approve PR
# 4. Merge to main
```

### Step 2: Configurare Variabili Ambiente Vercel

Vai su [Vercel Dashboard](https://vercel.com/lucamartello73-4767s-projects/v0-legno) → Settings → Environment Variables

#### Variabili ESISTENTI (già configurate):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Variabili NUOVE da aggiungere:

| Nome | Valore | Ambiente | Note |
|------|--------|----------|------|
| `GMAIL_USER` | `preventivi@martello1930.net` | Production, Preview, Development | Email mittente Gmail |
| `GMAIL_APP_PASSWORD` | `[16 caratteri]` | Production, Preview, Development | App Password Google (NO password normale) |
| `GMAIL_FROM_NAME` | `MARTELLO 1930` | Production, Preview, Development | Nome mittente visualizzato |

**⚠️ IMPORTANTE**: Genera App Password da [Google Account Security](https://myaccount.google.com/security)

### Step 3: Applicare Database Migrations

#### Opzione A: Supabase Dashboard (Consigliato)

1. Vai su [Supabase Dashboard](https://app.supabase.com)
2. Seleziona progetto
3. Vai in **SQL Editor**
4. Copia e esegui in ordine:
   - `database/migrations/001_create_richieste_tracking.sql`
   - `database/migrations/002_create_storico_stati.sql`

#### Opzione B: Supabase CLI

```bash
# Installa CLI
npm install -g supabase

# Login
supabase login

# Link progetto
supabase link --project-ref [your-project-ref]

# Applica migrations
supabase db push database/migrations/001_create_richieste_tracking.sql
supabase db push database/migrations/002_create_storico_stati.sql
```

### Step 4: Verifica Deployment Vercel

Dopo il merge, Vercel deploierà automaticamente:

1. **Monitoraggio Deploy**
   ```
   https://vercel.com/lucamartello73-4767s-projects/v0-legno/deployments
   ```

2. **Check Logs**
   - Verifica build logs
   - Verifica runtime logs
   - Controlla errori

3. **Test Deployment**
   ```bash
   # URL produzione
   https://v0-legno-[hash].vercel.app
   
   # Test health check
   curl https://your-domain.vercel.app/api/richieste/metriche
   ```

### Step 5: Test Funzionalità

#### A. Test Email System

```bash
# Test API email
curl -X POST https://your-domain.vercel.app/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "subject": "Test Gmail SMTP Production",
    "message": "Test email in produzione"
  }'

# Verifica:
# - Email arrivata
# - No errori in logs Vercel
# - Email in Gmail "Posta inviata"
```

#### B. Test Configuratore + Tracking

1. Vai sul configuratore web
2. Completa configurazione pergola
3. Compila form contatti
4. Invia richiesta preventivo

**Verifica:**
- Email ricevuta dal cliente
- Email ricevuta da admin
- Codice preventivo generato (formato: `PRV-2024-NNNNNN`)
- Richiesta salvata in database
- Storico stati creato

#### C. Test API Richieste

```bash
# Lista richieste
curl https://your-domain.vercel.app/api/richieste

# Metriche
curl https://your-domain.vercel.app/api/richieste/metriche

# Storico (sostituisci {id})
curl https://your-domain.vercel.app/api/richieste/{id}/storico
```

### Step 6: Verifica Database

```sql
-- Connetti a Supabase e verifica tabelle
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE 'configuratorelegno_richieste%';

-- Verifica trigger
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE event_object_table LIKE 'configuratorelegno_richieste%';

-- Verifica view
SELECT table_name 
FROM information_schema.views 
WHERE table_name LIKE 'configuratorelegno_richieste%';

-- Test dati
SELECT 
  codice_preventivo,
  cliente_nome,
  cliente_email,
  stato,
  created_at
FROM configuratorelegno_richieste
ORDER BY created_at DESC
LIMIT 5;
```

---

## 🐛 Troubleshooting

### Problema: Build fallisce su Vercel

**Causa**: Variabili ambiente mancanti

**Soluzione**:
1. Verifica tutte le env vars in Vercel Settings
2. Redeploy dopo aver aggiunto variabili
3. Check logs per errori specifici

### Problema: Email non partono

**Causa**: GMAIL_APP_PASSWORD errata o non impostata

**Soluzione**:
1. Verifica che `GMAIL_APP_PASSWORD` sia App Password (16 caratteri)
2. Non usare password Gmail normale
3. Rigenera App Password se necessario
4. Verifica logs Vercel per errori SMTP

### Problema: Database migrations falliscono

**Causa**: Tabelle già esistenti o permessi

**Soluzione**:
```sql
-- Verifica tabelle esistenti
SELECT * FROM configuratorelegno_richieste LIMIT 1;

-- Se già esiste, elimina (ATTENZIONE: perdi dati!)
DROP TABLE IF EXISTS configuratorelegno_richieste_storico_stati CASCADE;
DROP TABLE IF EXISTS configuratorelegno_richieste CASCADE;

-- Poi riapplica migrations
```

### Problema: API 500 Internal Server Error

**Causa**: Credenziali Supabase errate

**Soluzione**:
1. Verifica `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` in Vercel
2. Controlla Supabase project settings
3. Verifica che service role key sia corretta
4. Test connessione con client Supabase

---

## 📊 Post-Deployment Monitoring

### Metriche da Monitorare

1. **Performance**
   - Response time API
   - Build time
   - Cold start time

2. **Email System**
   - Tasso successo invii
   - Bounce rate
   - Tempo medio invio

3. **Database**
   - Query performance
   - Storage usage
   - Connection pool

4. **Business Metrics**
   - Numero richieste/giorno
   - Tasso conversione
   - Valore medio ordini

### Tools Monitoring

- **Vercel Analytics**: https://vercel.com/analytics
- **Vercel Logs**: https://vercel.com/logs
- **Supabase Dashboard**: https://app.supabase.com
- **Gmail SMTP Logs**: Gmail "Posta inviata"

---

## 🎯 Success Criteria

Deploy è considerato **SUCCESSO** se:

- [x] Build Vercel completato senza errori
- [ ] Tutte le env vars configurate
- [ ] Database migrations applicate
- [ ] Email test ricevute correttamente
- [ ] Configuratore funziona end-to-end
- [ ] Richieste salvate in DB con codice preventivo
- [ ] API `/api/richieste` rispondono 200 OK
- [ ] Metriche dashboard visualizzabili
- [ ] No errori critici in logs Vercel
- [ ] No errori in Supabase logs

---

## 📅 Timeline Deployment

| Step | Durata Stimata | Status |
|------|----------------|--------|
| Review PR | 10 min | ⏳ Pending |
| Merge PR | 1 min | ⏳ Pending |
| Config Vercel Env Vars | 5 min | ⏳ Pending |
| Apply DB Migrations | 10 min | ⏳ Pending |
| Vercel Auto-Deploy | 5 min | ⏳ Pending |
| Test Funzionalità | 15 min | ⏳ Pending |
| Monitoring Setup | 10 min | ⏳ Pending |
| **TOTALE** | **~1 ora** | ⏳ Pending |

---

## 📚 Documentazione Riferimento

- **Setup Gmail**: [GMAIL_SETUP.md](./GMAIL_SETUP.md)
- **Tracking System**: [TRACKING_IMPLEMENTATION.md](./TRACKING_IMPLEMENTATION.md)
- **Database Guide**: [database/README.md](./database/README.md)
- **Pull Request**: https://github.com/lucamartello73/v0-legno2/pull/1

---

## 🔒 Rollback Plan

Se qualcosa va storto:

### Rollback Code

```bash
# Su Vercel Dashboard
# 1. Vai in Deployments
# 2. Trova ultimo deployment funzionante
# 3. Click "Promote to Production"
```

### Rollback Database

```sql
-- Elimina tabelle nuove
DROP TABLE IF EXISTS configuratorelegno_richieste_storico_stati CASCADE;
DROP TABLE IF EXISTS configuratorelegno_richieste CASCADE;
DROP VIEW IF EXISTS configuratorelegno_richieste_metriche CASCADE;
DROP VIEW IF EXISTS configuratorelegno_richieste_attive CASCADE;

-- Il sistema tornerà a usare solo configuratorelegno_configurations
```

### Rollback Email

```typescript
// Rimuovi env vars Gmail da Vercel
// L'API send-email continuerà a salvare in DB ma non invierà email
// Opzionale: ripristina SendWith API key
```

---

## ✅ Final Checklist

Prima di considerare il deployment **COMPLETATO**:

- [ ] PR merged
- [ ] Vercel deployed successfully
- [ ] Gmail env vars configurate
- [ ] Database migrations applicate
- [ ] Test email ricevute
- [ ] Test configuratore end-to-end completato
- [ ] API richieste funzionanti
- [ ] Metriche visibili
- [ ] No errori critici in logs
- [ ] Stakeholder notificati
- [ ] Documentazione aggiornata
- [ ] Backup database fatto

---

**Versione**: 1.0.0  
**Data**: 2025-11-16  
**Preparato da**: GenSpark AI Developer  
**Status**: ✅ Ready for Production
