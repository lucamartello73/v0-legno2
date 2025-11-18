# Gmail SMTP Setup Guide

Questa guida spiega come configurare il sistema di invio email con Gmail SMTP per il progetto LEGNO Configuratore.

## 📋 Panoramica

Il progetto è stato migrato da **SendWith** a **Gmail SMTP** usando **nodemailer** per:

- ✅ Zero costi - Gmail SMTP gratuito
- ✅ Account aziendale - Email inviate dal dominio personalizzato
- ✅ Controllo completo - Tutta la cronologia visibile in Gmail
- ✅ Affidabilità - Nessun limite API di terze parti
- ✅ Tracciabilità - Email salvate in "Posta inviata"

## 🔧 Requisiti

1. Account Gmail o Google Workspace
2. Autenticazione a due fattori abilitata
3. App Password generata

## 📝 Step 1: Generare App Password Google

⚠️ **IMPORTANTE**: NON usare la password Gmail normale, ma una **App Password** dedicata.

### Procedura:

1. Vai su [Google Account Security](https://myaccount.google.com/security)
2. Abilita **2-Step Verification** se non già attiva
3. Cerca **App passwords** nella barra di ricerca
4. Seleziona "Mail" come app e il tuo dispositivo
5. Google genererà una password di 16 caratteri: `xxxx xxxx xxxx xxxx`
6. Copia questa password (NON includerà spazi nel file .env)

## 🔐 Step 2: Configurare variabili ambiente

### Sviluppo locale (.env.local)

Crea un file `.env.local` nella root del progetto:

```bash
# Gmail SMTP Configuration
GMAIL_USER=preventivi@martello1930.net
GMAIL_APP_PASSWORD=abcdefghijklmnop
GMAIL_FROM_NAME=MARTELLO 1930
```

⚠️ **Nota**: Inserisci la App Password SENZA spazi (es: `abcdefghijklmnop`)

### Produzione (Vercel)

1. Vai su [Vercel Dashboard](https://vercel.com/dashboard)
2. Seleziona il progetto `v0-legno`
3. Vai in **Settings** → **Environment Variables**
4. Aggiungi le seguenti variabili:

| Nome | Valore | Ambiente |
|------|--------|----------|
| `GMAIL_USER` | `preventivi@martello1930.net` | Production, Preview, Development |
| `GMAIL_APP_PASSWORD` | `abcdefghijklmnop` | Production, Preview, Development |
| `GMAIL_FROM_NAME` | `MARTELLO 1930` | Production, Preview, Development |

5. Clicca **Save**
6. Redeploy il progetto per applicare le modifiche

## 🏗️ Architettura implementata

```
Frontend (Configuratore)
    ↓ POST /api/send-email
Backend API Route (Next.js)
    ↓ 1. Salva configurazione in Supabase
    ↓ 2. createGmailTransport()
    ↓ 3. sendGmailEmail() → Cliente
    ↓ 4. sendGmailEmail() → Admin
    ↓ 5. Return success/error
Frontend
    ↓ Toast successo/errore
```

## 📁 File modificati

### Nuovi file creati:

1. **`lib/email/gmail-transport.ts`**
   - Configurazione nodemailer per Gmail SMTP
   - Funzioni helper per invio email singole e multiple
   - Logging dettagliato con emoji

### File refactorati:

2. **`app/api/send-email/route.tsx`**
   - Sostituito `sendEmailWithSendWith()` con `sendEmailWithGmail()`
   - Aggiornati i metodi di logging
   - Migliorata gestione errori

3. **`app/api/test-email/route.tsx`**
   - Sostituito SendWith API con `sendGmailEmail()`
   - Aggiunto template HTML responsive
   - Migliorati messaggi di errore

### File di configurazione:

4. **`.env.example`**
   - Template per variabili ambiente necessarie

5. **`package.json`**
   - Aggiunto `@types/nodemailer` in devDependencies

## 🧪 Step 3: Testare il sistema

### Test locale

1. Assicurati che `.env.local` sia configurato
2. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

3. Testa l'API test-email:
   ```bash
   curl -X POST http://localhost:3000/api/test-email \
     -H "Content-Type: application/json" \
     -d '{
       "email": "tua-email@example.com",
       "subject": "Test Gmail SMTP",
       "message": "Questo è un test del nuovo sistema Gmail"
     }'
   ```

4. Verifica l'output dei log nella console:
   ```
   📧 [Test] Sending test email...
   📧 [Test] To: tua-email@example.com
   📝 [Test] Subject: Test Gmail SMTP
   🔑 GMAIL_USER: ✓ Set
   🔑 GMAIL_APP_PASSWORD: ✓ Set
   📤 Sending email to: tua-email@example.com
   ✅ Email sent successfully!
   📬 Message ID: <...@gmail.com>
   ```

5. Controlla la tua casella email

### Test nel configuratore

1. Completa una configurazione pergola
2. Vai alla pagina "Contatti"
3. Compila il form e invia
4. Verifica che ricevi l'email di conferma

## 🔍 Troubleshooting

### ❌ Errore: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Causa**: Password errata o non è una App Password

**Soluzione**:
- Verifica di aver generato una App Password (non la password normale)
- Controlla che non ci siano spazi nella password
- Rigenera una nuova App Password

### ❌ Errore: "Missing Gmail credentials"

**Causa**: Variabili ambiente non configurate

**Soluzione**:
- Verifica che `.env.local` esista e contenga `GMAIL_USER` e `GMAIL_APP_PASSWORD`
- In Vercel, controlla che le variabili siano salvate correttamente
- Redeploy dopo aver aggiunto le variabili

### ❌ Email non arriva

**Possibili cause**:

1. **Finita nella spam**: Controlla la cartella spam
2. **Dominio non verificato**: Se usi dominio personalizzato, verifica SPF/DKIM
3. **Rate limit Gmail**: Gmail ha limiti di invio (500 email/giorno per account gratuito)

### ❌ Timeout durante l'invio

**Causa**: Porta 587 bloccata dal firewall

**Soluzione**:
- Verifica che la porta 587 (TLS) sia aperta
- Prova a usare porta 465 (SSL) modificando il transport:
  ```typescript
  port: 465,
  secure: true,
  ```

## 📊 Logging e monitoring

Il sistema include logging dettagliato con emoji per facile debugging:

```
📧 [Gmail] Attempting to send email to: cliente@example.com
📝 [Gmail] Subject: Conferma Richiesta Preventivo
🔑 GMAIL_USER: ✓ Set
🔑 GMAIL_APP_PASSWORD: ✓ Set
📤 Sending email to: cliente@example.com
✅ [Gmail] Email sent successfully!
📬 [Gmail] Message ID: <abc123@gmail.com>
```

Errori:
```
❌ [Gmail] Email error: Invalid credentials
```

## 🚀 Deploy in produzione

1. Configura variabili ambiente in Vercel (vedi Step 2)
2. Committa le modifiche:
   ```bash
   git add .
   git commit -m "feat: migrazione da SendWith a Gmail SMTP"
   git push origin main
   ```
3. Vercel deploierà automaticamente
4. Testa l'API in produzione:
   ```bash
   curl -X POST https://your-domain.vercel.app/api/test-email \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "subject": "Test Production",
       "message": "Test Gmail SMTP in produzione"
     }'
   ```

## 📚 Riferimenti API

### `createGmailTransport()`

Crea un transporter nodemailer configurato per Gmail SMTP.

**Returns**: `nodemailer.Transporter`

**Throws**: Error se `GMAIL_USER` o `GMAIL_APP_PASSWORD` non sono configurati

### `sendGmailEmail(to, subject, html, text?)`

Invia una singola email.

**Parameters**:
- `to`: string - Indirizzo destinatario
- `subject`: string - Oggetto email
- `html`: string - Body HTML
- `text`: string (optional) - Body testo plain

**Returns**: `Promise<{ success: boolean, messageId: string }>`

### `sendMultipleGmailEmails(emails)`

Invia multiple email in parallelo.

**Parameters**:
- `emails`: Array<{ to, subject, html, text? }>

**Returns**: `Promise<Array<{ to, success, messageId?, error? }>>`

## 🔒 Sicurezza

- ✅ Credenziali mai esposte nel frontend
- ✅ App Password invece di password reale
- ✅ Connessione TLS (porta 587)
- ✅ Variabili ambiente in Vercel (encrypted)
- ✅ Logging non mostra credenziali complete

## 📞 Supporto

Per problemi o domande:
- Email: info@martello1930.net
- Documentazione nodemailer: https://nodemailer.com/
- Google App Passwords: https://support.google.com/accounts/answer/185833

---

**Data migrazione**: 2025-11-16  
**Versione**: 1.0.0  
**Provider precedente**: SendWith  
**Provider attuale**: Gmail SMTP via nodemailer
