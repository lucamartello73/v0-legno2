# ✅ Configurazione Email - Stato Attuale

## 📊 Variabili Ambiente Vercel

### Già Configurate ✅
Hai già impostato queste variabili (visibili nella dashboard Vercel):

1. ✅ **GMAIL_USER**
   - Descrizione: L'indirizzo Gmail da cui inviare le email
   - Esempio: `preventivi@martello1930.net` o altro account Gmail
   - Stato: **CONFIGURATA** (aggiunta 22 minuti fa)

2. ✅ **GMAIL_APP_PASSWORD**
   - Descrizione: Password App Gmail (16 caratteri)
   - Formato: `xxxx xxxx xxxx xxxx` (senza spazi quando inserita)
   - Stato: **CONFIGURATA** (aggiunta 21 minuti fa)

### Opzionale (ma Raccomandata) ⚠️

3. ⚠️ **GMAIL_FROM_NAME** (OPZIONALE)
   - Descrizione: Nome mittente visualizzato nelle email
   - Default se non impostata: `MARTELLO 1930`
   - Esempio: `MARTELLO 1930` o `Martello 1930 - Pergole`
   - Stato: **NON CONFIGURATA** (usa default)
   - **Azione**: Puoi aggiungerla per personalizzare il nome mittente

### NON Necessarie ❌

4. ❌ **ADMIN_EMAIL** - **NON SERVE!**
   - L'indirizzo admin (`preventivi@martello1930.net`) è hardcodato nel codice
   - Non è una variabile ambiente
   - È fisso nel file `app/api/send-email/route.tsx` riga 266

---

## 📧 Come Funziona l'Invio Email

### Email Mittente (FROM)
```
Nome: GMAIL_FROM_NAME (o "MARTELLO 1930" di default)
Email: GMAIL_USER (l'account Gmail configurato)
```

**Esempio visibile al destinatario:**
```
Da: MARTELLO 1930 <preventivi@martello1930.net>
```

### Email Destinatari

#### 1. Email al Cliente
```typescript
A: [email inserita dal cliente nel form]
Oggetto: "Conferma Richiesta Preventivo - MARTELLO 1930"
```

#### 2. Email Admin (HARDCODED)
```typescript
A: preventivi@martello1930.net  // ← Fisso nel codice
Oggetto: "Nuova Richiesta Preventivo - [Nome Cliente]"
```

---

## ⚙️ Come Aggiungere GMAIL_FROM_NAME (Opzionale)

Se vuoi personalizzare il nome mittente:

### Opzione 1: Dashboard Vercel
1. Vai su: https://vercel.com/dashboard
2. Seleziona progetto: **webapp**
3. **Settings** → **Environment Variables**
4. Clicca **Add New**
5. Compila:
   - **Key**: `GMAIL_FROM_NAME`
   - **Value**: `MARTELLO 1930` (o il nome che preferisci)
   - **Environments**: Seleziona tutti (Production, Preview, Development)
6. Clicca **Save**

### Opzione 2: CLI Vercel
```bash
npx vercel env add GMAIL_FROM_NAME production preview development --token 4vqyCW9kl80g3RsrpgzqnSEn
# Quando richiesto, inserisci: MARTELLO 1930
```

---

## 🧪 Test Setup Attuale

### Verifica Variabili

```bash
# Controlla quali variabili sono impostate
npx vercel env ls --token 4vqyCW9kl80g3RsrpgzqnSEn

# Dovresti vedere:
# GMAIL_USER              (Production, Preview, Development)
# GMAIL_APP_PASSWORD      (Production, Preview, Development)
# GMAIL_FROM_NAME         (Production, Preview, Development) ← opzionale
```

### Test Invio Email

#### Test Endpoint Diretto
```bash
# Se in locale con .env.local configurato
npm run dev

# Test endpoint in locale
curl "http://localhost:3000/api/test-email?email=tuo-indirizzo@test.com"

# Oppure apri nel browser:
# http://localhost:3000/api/test-email?email=tuo-indirizzo@test.com
```

#### Test Produzione Completo

1. **Rideploy dopo configurazione variabili**:
```bash
npx vercel --prod --token 4vqyCW9kl80g3RsrpgzqnSEn
```

2. **Vai al configuratore in produzione**

3. **Completa una configurazione e invia**

4. **Verifica email ricevute**:
   - Cliente → email inserita nel form
   - Admin → `preventivi@martello1930.net`

---

## 🔍 Verifica Configurazione Corretta

### Checklist Variabili
- [x] `GMAIL_USER` configurata
- [x] `GMAIL_APP_PASSWORD` configurata
- [ ] `GMAIL_FROM_NAME` configurata (opzionale, usa default se manca)
- [ ] ❌ `ADMIN_EMAIL` - NON NECESSARIA

### Checklist Codice
- [x] Email admin hardcoded: `preventivi@martello1930.net`
- [x] Codice Gmail SMTP implementato
- [x] Fallback gestito correttamente
- [x] Commit pushato su branch

### Checklist Deployment
- [x] Variabili configurate in Vercel
- [ ] Deployment produzione eseguito dopo config variabili
- [ ] Test invio email completato
- [ ] Email ricevuta a `preventivi@martello1930.net`

---

## 🐛 Troubleshooting

### "No Environment Variables found" dal CLI

**Problema**: `npx vercel env ls` dice che non ci sono variabili

**Possibili Cause**:
1. Le variabili sono state aggiunte ma il comando non le vede (bug CLI)
2. Le variabili sono in un progetto diverso
3. Le variabili sono state aggiunte ma non sincronizzate

**Soluzioni**:
1. **Verifica nella Dashboard** (più affidabile):
   - Vai su Vercel Dashboard → webapp → Settings → Environment Variables
   - Dovresti vedere `GMAIL_USER` e `GMAIL_APP_PASSWORD`

2. **Pull variabili localmente**:
   ```bash
   cd /home/user/webapp
   npx vercel env pull .env.production --token 4vqyCW9kl80g3RsrpgzqnSEn
   cat .env.production
   ```

3. **Rideploy per sincronizzare**:
   ```bash
   npx vercel --prod --token 4vqyCW9kl80g3RsrpgzqnSEn
   ```

### Email non inviate dopo deployment

**Verifica**:
1. Controlla log deployment Vercel:
   - Dashboard → Deployments → Latest → View Function Logs
   - Cerca: `📧 [Gmail]` o errori

2. Verifica variabili durante runtime:
   ```bash
   # Controlla log della function
   # Dovresti vedere:
   # 🔑 GMAIL_USER: ✓ Set
   # 🔑 GMAIL_APP_PASSWORD: ✓ Set
   ```

3. Test endpoint test-email:
   ```bash
   curl "https://tuo-dominio.vercel.app/api/test-email?email=test@example.com"
   ```

### "Missing Gmail credentials" error

**Causa**: Variabili ambiente non accessibili al runtime

**Soluzioni**:
1. Verifica variabili impostate per **Production**
2. Rideploy dopo aver configurato variabili
3. Verifica spelling esatto:
   - `GMAIL_USER` (non `GMAIL_USERNAME`)
   - `GMAIL_APP_PASSWORD` (non `GMAIL_PASSWORD`)

---

## 📋 Prossimi Passi

### Obbligatori ✅
1. [x] Configurare `GMAIL_USER` - **FATTO**
2. [x] Configurare `GMAIL_APP_PASSWORD` - **FATTO**
3. [ ] **Rideploy produzione**:
   ```bash
   npx vercel --prod --token 4vqyCW9kl80g3RsrpgzqnSEn
   ```
4. [ ] **Testare invio email** (configuratore completo)
5. [ ] **Verificare email a `preventivi@martello1930.net`**

### Opzionali 💡
1. [ ] Aggiungere `GMAIL_FROM_NAME` per nome mittente personalizzato
2. [ ] Testare endpoint `/api/test-email` in produzione
3. [ ] Verificare log Vercel per debugging

---

## 🎯 Riepilogo Rapido

### Configurazione Attuale
- ✅ `GMAIL_USER` configurata (22 min fa)
- ✅ `GMAIL_APP_PASSWORD` configurata (21 min fa)
- ⚠️ `GMAIL_FROM_NAME` non configurata (usa "MARTELLO 1930" di default)
- ❌ `ADMIN_EMAIL` **NON SERVE** (indirizzo hardcoded nel codice)

### Email Admin
- 📧 Destinatario: `preventivi@martello1930.net` (hardcoded)
- 📍 Location codice: `app/api/send-email/route.tsx:266`
- ✅ Già corretto e pushato

### Azione Immediata
```bash
# 1. Rideploy con nuove variabili
npx vercel --prod --token 4vqyCW9kl80g3RsrpgzqnSEn

# 2. Testa il configuratore
# 3. Verifica email ricevuta a preventivi@martello1930.net
```

---

## 📚 Documentazione Completa

- **`FIX_EMAIL_ADMIN.md`** - Fix email admin a preventivi@
- **`GMAIL_SETUP.md`** - Setup Gmail SMTP completo
- **`VERCEL_ENV_SETUP.md`** - Configurazione Vercel dettagliata
- **`VERCEL_COMMANDS.md`** - Comandi CLI reference

---

**Tutto è pronto!** Le email funzioneranno dopo il rideploy. 🚀

**Data**: 2025-11-17  
**Stato**: ✅ Variabili configurate - Pronto per deploy e test
