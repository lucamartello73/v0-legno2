# 📧 Fix: Email Admin a preventivi@martello1930.net

## 🔍 Problema Rilevato

Le email di notifica per nuove richieste preventivo venivano inviate a:
- ❌ **info@martello1930.net** (indirizzo generico)

Ma dovevano andare a:
- ✅ **preventivi@martello1930.net** (reparto specifico)

---

## ✅ Soluzione Implementata

### File Modificato
**`app/api/send-email/route.tsx`**

### Modifiche Applicate

#### 1. Email Admin (riga 265-269)
```typescript
// PRIMA:
const adminEmailResult = await sendEmailWithGmail(
  "info@martello1930.net",  // ❌ Email sbagliata
  `Nuova Richiesta Preventivo - ${body.contact_data?.nome} ${body.contact_data?.cognome}`,
  adminNotificationContent,
)

// DOPO:
const adminEmailResult = await sendEmailWithGmail(
  "preventivi@martello1930.net",  // ✅ Email corretta
  `Nuova Richiesta Preventivo - ${body.contact_data?.nome} ${body.contact_data?.cognome}`,
  adminNotificationContent,
)
```

#### 2. Notifica Database (riga 293-310)
```typescript
// PRIMA:
await supabase.from("configuratorelegno_notifications").insert({
  // ...
  recipient_email: "info@martello1930.net",  // ❌ Email sbagliata
  // ...
})

// DOPO:
await supabase.from("configuratorelegno_notifications").insert({
  // ...
  recipient_email: "preventivi@martello1930.net",  // ✅ Email corretta
  // ...
})
```

---

## 📊 Flusso Email Completo

Quando un cliente invia una richiesta preventivo:

### 1. **Email al Cliente**
- **Destinatario**: Email inserita dal cliente nel form
- **Oggetto**: `Conferma Richiesta Preventivo - MARTELLO 1930`
- **Contenuto**: 
  - Riepilogo configurazione
  - Codice preventivo
  - Conferma che verrà ricontattato entro 24h

### 2. **Email Admin** ✅ CORRETTO
- **Destinatario**: `preventivi@martello1930.net`
- **Oggetto**: `Nuova Richiesta Preventivo - [Nome Cliente]`
- **Contenuto**:
  - Dati cliente (nome, email, telefono)
  - Codice preventivo
  - Dettagli configurazione completi
  - Preferenza di contatto
  - ID configurazione database

### 3. **Notifica Database**
- Salvata nella tabella `configuratorelegno_notifications`
- Visibile nel pannello admin
- Collegata alla richiesta con tracking

---

## ⚠️ IMPORTANTE: Prerequisiti

Per far funzionare l'invio email, devi prima:

### 1. Configurare Variabili Ambiente Gmail in Vercel

```bash
# Opzione 1: Dashboard Vercel (consigliato)
1. Vai su https://vercel.com/dashboard
2. Seleziona progetto "webapp"
3. Settings → Environment Variables
4. Aggiungi:
   - GMAIL_USER = tua-email@gmail.com
   - GMAIL_APP_PASSWORD = xxxx xxxx xxxx xxxx
   - GMAIL_FROM_NAME = MARTELLO 1930

# Opzione 2: CLI Vercel
npx vercel env add GMAIL_USER production preview development
npx vercel env add GMAIL_APP_PASSWORD production preview development
npx vercel env add GMAIL_FROM_NAME production preview development
```

### 2. Generare Gmail App Password

Se non hai già una App Password:

1. Vai su: https://myaccount.google.com/security
2. Abilita **Verifica in 2 passaggi**
3. Vai a **Password per le app**
4. Genera nuova password per "Posta" / "Altro"
5. Copia la password di 16 caratteri
6. Usa questa in `GMAIL_APP_PASSWORD`

**⚠️ NON usare la password Gmail normale!**

### 3. Rideploy su Vercel

```bash
# Dopo aver configurato le variabili ambiente
npx vercel --prod --token 4vqyCW9kl80g3RsrpgzqnSEn
```

---

## 🧪 Come Testare

### Test in Locale (Dev)

1. Crea file `.env.local` nella root del progetto:
```bash
GMAIL_USER=tua-email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
GMAIL_FROM_NAME=MARTELLO 1930

SUPABASE_URL=https://diymukpvccuauohylrnz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_URL=https://diymukpvccuauohylrnz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

2. Avvia dev server:
```bash
npm run dev
```

3. Apri: `http://localhost:3000`

4. Completa una configurazione pergola e invia richiesta

5. Verifica:
   - ✅ Console mostra: `✅ [Gmail] Admin notification email sent successfully`
   - ✅ Email ricevuta a `preventivi@martello1930.net`
   - ✅ Email cliente ricevuta (se hai inserito email reale)

### Test Endpoint Diretto

```bash
# Test endpoint email diretto
curl -X POST http://localhost:3000/api/test-email?email=tua-email@test.com

# Oppure apri nel browser:
http://localhost:3000/api/test-email?email=tua-email@test.com
```

### Test in Produzione (Vercel)

1. Configura variabili ambiente (vedi sopra)
2. Deploy: `npx vercel --prod`
3. Apri il configuratore in produzione
4. Invia richiesta preventivo
5. Controlla inbox di `preventivi@martello1930.net`

---

## 📋 Checklist Completa

### Setup Gmail SMTP
- [ ] Abilitata Verifica in 2 passaggi su Gmail
- [ ] Generata App Password
- [ ] `GMAIL_USER` configurata in Vercel
- [ ] `GMAIL_APP_PASSWORD` configurata in Vercel  
- [ ] `GMAIL_FROM_NAME` configurata in Vercel

### Test Funzionalità
- [ ] Test locale funziona (email ricevute)
- [ ] Deploy produzione completato
- [ ] Test produzione funziona
- [ ] Email arriva a `preventivi@martello1930.net`
- [ ] Email cliente ricevuta correttamente
- [ ] Codice preventivo incluso in entrambe le email

### Verifica Database
- [ ] Configurazioni salvate correttamente
- [ ] Richieste tracking create con codice preventivo
- [ ] Notifiche admin salvate nel database

---

## 🐛 Troubleshooting

### Email Non Ricevute

**Problema**: Nessuna email ricevuta

**Soluzioni**:
1. Verifica variabili ambiente configurate in Vercel:
   ```bash
   npx vercel env ls --token 4vqyCW9kl80g3RsrpgzqnSEn
   ```

2. Controlla log Vercel per errori:
   - Dashboard Vercel → Deployments → Latest → View Function Logs
   - Cerca: `❌ [Gmail]` o `Error`

3. Verifica App Password corretta:
   - Deve essere 16 caratteri senza spazi
   - Non deve essere la password Gmail normale

4. Controlla spam folder di `preventivi@martello1930.net`

### Email Cliente OK, Admin NO

**Problema**: Email cliente ricevuta ma admin no

**Soluzioni**:
1. Verifica che `preventivi@martello1930.net` esista e sia attiva
2. Controlla log per errori specifici email admin
3. Testa invio manuale a quell'indirizzo:
   ```bash
   curl "http://localhost:3000/api/test-email?email=preventivi@martello1930.net"
   ```

### Errore "Authentication failed"

**Problema**: `535 Authentication failed` nei log

**Soluzioni**:
1. Rigenera App Password su Gmail
2. Verifica Verifica in 2 passaggi abilitata
3. Controlla `GMAIL_USER` corrisponda all'account che ha generato l'App Password
4. Rimuovi spazi da `GMAIL_APP_PASSWORD`

---

## 📚 Documentazione Correlata

- **`GMAIL_SETUP.md`** - Guida completa setup Gmail SMTP
- **`VERCEL_ENV_SETUP.md`** - Configurazione variabili ambiente Vercel
- **`VERCEL_COMMANDS.md`** - Comandi rapidi Vercel CLI
- **`DEPLOYMENT_CHECKLIST.md`** - Checklist deployment produzione

---

## 🔗 Commit e PR

**Commit**: `3a7037d`  
**Branch**: `genspark_ai_developer`  
**PR**: https://github.com/lucamartello73/v0-legno2/pull/1

**Modifiche**:
- ✅ Email admin → `preventivi@martello1930.net`
- ✅ Notification database → `preventivi@martello1930.net`
- ✅ Documentazione aggiornata

---

## 🎯 Riepilogo

**Problema**: Email admin andavano a `info@martello1930.net`  
**Soluzione**: Cambiate a `preventivi@martello1930.net`  
**Stato**: ✅ Fixato e pushato  
**Azione Richiesta**: Configurare Gmail SMTP in Vercel  
**Test**: Completare richiesta preventivo e verificare email

---

**Data**: 2025-11-17  
**Autore**: GenSpark AI Developer  
**Stato**: ✅ Completato - In attesa configurazione Gmail SMTP
