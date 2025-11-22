# ⚡ Setup Email Completo - 4 Variabili Necessarie

## 📋 Variabili Ambiente Richieste

Per far funzionare l'invio email, devi configurare **4 variabili** in Vercel:

| # | Variabile | Valore | Obbligatoria | Descrizione |
|---|-----------|--------|--------------|-------------|
| 1 | `GMAIL_USER` | `tua-email@gmail.com` | ✅ Sì | Account Gmail mittente |
| 2 | `GMAIL_APP_PASSWORD` | `xxxx xxxx xxxx xxxx` | ✅ Sì | App Password Gmail (16 char) |
| 3 | `GMAIL_FROM_NAME` | `MARTELLO 1930` | ⚠️ No | Nome mittente (default: "MARTELLO 1930") |
| 4 | `ADMIN_EMAIL` | `preventivi@martello1930.net` | ✅ Sì | Email destinatario notifiche admin |

---

## 🚀 Setup Rapido (Dashboard Vercel)

### Passo 1: Vai alla Dashboard
1. Apri: https://vercel.com/dashboard
2. Seleziona progetto: **webapp** (o il tuo progetto configuratore)
3. Vai a: **Settings** → **Environment Variables**

### Passo 2: Aggiungi le 4 Variabili

#### Variabile 1: GMAIL_USER
```
Name: GMAIL_USER
Value: [tua-email@gmail.com]
Environments: ✅ Production ✅ Preview ✅ Development
```
Clicca **Save**

#### Variabile 2: GMAIL_APP_PASSWORD
```
Name: GMAIL_APP_PASSWORD
Value: [xxxx xxxx xxxx xxxx] (16 caratteri, rimuovi spazi)
Environments: ✅ Production ✅ Preview ✅ Development
```
Clicca **Save**

#### Variabile 3: GMAIL_FROM_NAME
```
Name: GMAIL_FROM_NAME
Value: MARTELLO 1930
Environments: ✅ Production ✅ Preview ✅ Development
```
Clicca **Save**

#### Variabile 4: ADMIN_EMAIL (⭐ NUOVA!)
```
Name: ADMIN_EMAIL
Value: preventivi@martello1930.net
Environments: ✅ Production ✅ Preview ✅ Development
```
Clicca **Save**

### Passo 3: Rideploy
1. Vai a **Deployments**
2. Clicca sui **3 puntini** dell'ultimo deployment
3. Clicca **Redeploy**
4. Oppure usa CLI:
```bash
npx vercel --prod --token 4vqyCW9kl80g3RsrpgzqnSEn
```

---

## 🔧 Setup Rapido (CLI Vercel)

```bash
# 1. GMAIL_USER
npx vercel env add GMAIL_USER production preview development --token 4vqyCW9kl80g3RsrpgzqnSEn
# Inserisci: tua-email@gmail.com

# 2. GMAIL_APP_PASSWORD
npx vercel env add GMAIL_APP_PASSWORD production preview development --token 4vqyCW9kl80g3RsrpgzqnSEn
# Inserisci: xxxxxxxxxxxxxxxx (16 caratteri, NO spazi)

# 3. GMAIL_FROM_NAME
npx vercel env add GMAIL_FROM_NAME production preview development --token 4vqyCW9kl80g3RsrpgzqnSEn
# Inserisci: MARTELLO 1930

# 4. ADMIN_EMAIL (NUOVA!)
npx vercel env add ADMIN_EMAIL production preview development --token 4vqyCW9kl80g3RsrpgzqnSEn
# Inserisci: preventivi@martello1930.net

# 5. Verifica
npx vercel env ls --token 4vqyCW9kl80g3RsrpgzqnSEn

# 6. Rideploy
npx vercel --prod --token 4vqyCW9kl80g3RsrpgzqnSmsI
```

---

## 🔑 Come Ottenere Gmail App Password

Se non hai già la App Password:

### Step 1: Abilita Verifica in 2 Passaggi
1. Vai su: https://myaccount.google.com/security
2. Cerca **"Verifica in 2 passaggi"**
3. Clicca **Attiva** se non è già abilitata
4. Completa la configurazione

### Step 2: Genera App Password
1. Nella pagina Sicurezza, cerca **"Password per le app"**
2. Clicca su **Password per le app**
3. Seleziona:
   - **App**: Posta
   - **Dispositivo**: Altro (nome personalizzato) → Scrivi: `Vercel Configuratore`
4. Clicca **Genera**
5. Copia la **password di 16 caratteri** (formato: `xxxx xxxx xxxx xxxx`)
6. **IMPORTANTE**: Rimuovi gli spazi quando la inserisci in Vercel

---

## 📧 Come Funziona il Sistema Email

### Quando un cliente invia una richiesta:

#### Email 1: Al Cliente
```
Da: GMAIL_FROM_NAME <GMAIL_USER>
A: [email cliente]
Oggetto: Conferma Richiesta Preventivo - MARTELLO 1930
```
Contiene:
- Riepilogo configurazione
- Codice preventivo
- Messaggio conferma

#### Email 2: All'Admin (TU!)
```
Da: GMAIL_FROM_NAME <GMAIL_USER>
A: ADMIN_EMAIL (preventivi@martello1930.net)
Oggetto: Nuova Richiesta Preventivo - [Nome Cliente]
```
Contiene:
- Codice preventivo
- Dati cliente completi
- Dettagli configurazione
- Preferenza contatto

---

## ✅ Checklist Completa

### Prima di Testare
- [ ] `GMAIL_USER` configurata in Vercel
- [ ] `GMAIL_APP_PASSWORD` configurata in Vercel
- [ ] `GMAIL_FROM_NAME` configurata in Vercel (opzionale)
- [ ] `ADMIN_EMAIL` configurata in Vercel ⭐ **NUOVA**
- [ ] Verifica in 2 passaggi Gmail abilitata
- [ ] App Password Gmail generata
- [ ] Rideploy eseguito dopo configurazione variabili

### Dopo il Deploy
- [ ] Apri configuratore in produzione
- [ ] Completa una configurazione test
- [ ] Invia richiesta preventivo
- [ ] Verifica email cliente ricevuta
- [ ] **Verifica email admin ricevuta a `preventivi@martello1930.net`** ⭐

---

## 🧪 Test Completo

### 1. Test Endpoint Diretto (Opzionale)
```bash
# Test email generico
curl "https://tuo-dominio.vercel.app/api/test-email?email=test@example.com"
```

### 2. Test Configuratore Completo
1. Apri: `https://tuo-dominio.vercel.app`
2. Completa configurazione pergola
3. Inserisci dati contatto (usa email reale)
4. Invia richiesta
5. Controlla inbox:
   - ✅ Email cliente
   - ✅ Email admin a `preventivi@martello1930.net`

### 3. Verifica Log Vercel
1. Dashboard Vercel → **Deployments**
2. Clicca ultimo deployment → **View Function Logs**
3. Cerca:
   ```
   📧 [Gmail] Initiating admin notification email sending process...
   📧 [Gmail] Admin email target: preventivi@martello1930.net
   ✅ [Gmail] Admin notification email sent successfully
   ```

---

## 🐛 Troubleshooting

### Email non arrivano

**1. Verifica variabili configurate:**
```bash
npx vercel env ls --token 4vqyCW9kl80g3RsrpgzqnSEn
```
Dovresti vedere tutte e 4 le variabili.

**2. Controlla log Vercel per errori:**
- Cerca: `❌ [Gmail]` o `Missing Gmail credentials`

**3. Verifica App Password:**
- Deve essere 16 caratteri
- Rimuovi spazi
- NON usare password Gmail normale

**4. Controlla spam folder**

### Email cliente OK, admin NO

**Verifica `ADMIN_EMAIL`:**
```bash
# Controlla che sia configurata
npx vercel env ls --token 4vqyCW9kl80g3RsrpgzqnSEn | grep ADMIN_EMAIL

# Se mancante, aggiungila:
npx vercel env add ADMIN_EMAIL production preview development --token 4vqyCW9kl80g3RsrpgzqnSEn
```

**Controlla log Vercel:**
```
📧 [Gmail] Admin email target: preventivi@martello1930.net
```
Deve mostrare l'email corretta.

### "Missing Gmail credentials"

Rideploy dopo aver configurato le variabili:
```bash
npx vercel --prod --force --token 4vqyCW9kl80g3RsrpgzqnSEn
```

---

## 📊 Riepilogo Modifiche

### Codice Aggiornato (Commit 9684c3c)

**File**: `app/api/send-email/route.tsx`

**Prima**:
```typescript
const adminEmailResult = await sendEmailWithGmail(
  "preventivi@martello1930.net",  // ❌ Hardcoded
  // ...
)
```

**Ora**:
```typescript
const adminEmail = process.env.ADMIN_EMAIL || "preventivi@martello1930.net"
console.log("📧 [Gmail] Admin email target:", adminEmail)

const adminEmailResult = await sendEmailWithGmail(
  adminEmail,  // ✅ Configurabile
  // ...
)
```

### Benefici
- ✅ Email admin configurabile da dashboard Vercel
- ✅ Nessuna modifica codice per cambiarla
- ✅ Fallback sicuro se non configurata
- ✅ Log mostra destinatario per debug
- ✅ Ambienti diversi possono usare email diverse

---

## ��� Riepilogo Rapido

**4 Variabili Necessarie:**
1. ✅ `GMAIL_USER` - Account Gmail mittente
2. ✅ `GMAIL_APP_PASSWORD` - Password App Gmail
3. ⚠️ `GMAIL_FROM_NAME` - Nome mittente (opzionale)
4. ✅ `ADMIN_EMAIL` - Email destinatario admin ⭐ **NUOVA**

**Azione Immediata:**
```bash
# Aggiungi ADMIN_EMAIL se manca
npx vercel env add ADMIN_EMAIL production preview development --token 4vqyCW9kl80g3RsrpgzqnSEn
# Inserisci: preventivi@martello1930.net

# Rideploy
npx vercel --prod --token 4vqyCW9kl80g3RsrpgzqnSEn

# Testa!
```

---

**Tutto pronto! Configura le 4 variabili, rideploy e testa!** 🚀

**Data**: 2025-11-17  
**Commit**: 9684c3c  
**PR**: https://github.com/lucamartello73/v0-legno2/pull/1
