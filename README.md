# LEGNO - Configuratore Pergole MARTELLO 1930

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/lucamartello73-4767s-projects/v0-legno)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/55gkDHAlE95)

## Overview

Configuratore interattivo per pergole in legno MARTELLO 1930. Permette ai clienti di:
- Configurare dimensioni, colori e coperture
- Aggiungere pavimentazioni e accessori
- Scegliere tra servizio fai-da-te o installazione completa
- Ricevere preventivi personalizzati via email

## ✨ Features

- 🎨 Configuratore visuale interattivo
- 📧 Sistema di invio email con Gmail SMTP
- 💾 Salvataggio configurazioni in Supabase
- 📊 Dashboard amministrativa per gestione richieste
- 📱 Design responsive e accessibile
- 🔒 Autenticazione sicura per admin

## 🚀 Quick Start

### Prerequisiti

- Node.js 18+ installato
- Account Supabase
- Account Gmail (o Google Workspace) per invio email

### Installazione

```bash
# Clona il repository
git clone https://github.com/your-username/v0-legno.git
cd v0-legno

# Installa dipendenze
npm install

# Copia file ambiente
cp .env.example .env.local

# Configura variabili ambiente (vedi sotto)
```

### Configurazione

1. **Supabase**: Crea un progetto su [Supabase](https://supabase.com)
2. **Gmail SMTP**: Segui la guida completa in [GMAIL_SETUP.md](./GMAIL_SETUP.md)

File `.env.local`:

```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Gmail SMTP (REQUIRED)
GMAIL_USER=preventivi@martello1930.net
GMAIL_APP_PASSWORD=your_16_char_app_password
GMAIL_FROM_NAME=MARTELLO 1930
```

### Avvio

```bash
# Sviluppo
npm run dev

# Build produzione
npm run build

# Start produzione
npm start
```

## 📧 Email System

Il progetto usa **Gmail SMTP con nodemailer** per l'invio email:

- ✅ Zero costi vs provider terze parti
- ✅ Email inviate dal dominio aziendale
- ✅ Controllo completo e tracciabilità
- ✅ Cronologia email in Gmail "Posta inviata"

**Setup completo**: Leggi [GMAIL_SETUP.md](./GMAIL_SETUP.md)

### Test invio email

```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "subject": "Test",
    "message": "Test message"
  }'
```

## 📁 Struttura Progetto

```
.
├── app/
│   ├── api/                    # API Routes
│   │   ├── send-email/        # Endpoint invio preventivi
│   │   ├── test-email/        # Endpoint test email
│   │   └── ...                # Altri endpoint
│   ├── configurator/          # Pagine configuratore
│   └── admin/                 # Dashboard admin
├── components/                # Componenti React
├── lib/
│   ├── email/                 # Modulo email
│   │   └── gmail-transport.ts # Gmail SMTP config
│   ├── supabase/              # Client Supabase
│   └── ...                    # Altri utils
├── styles/                    # CSS globali
├── public/                    # Asset statici
├── .env.example              # Template variabili ambiente
├── GMAIL_SETUP.md            # Guida setup Gmail
└── package.json
```

## 🔧 Stack Tecnologico

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Email**: nodemailer + Gmail SMTP
- **Deployment**: Vercel
- **TypeScript**: Tipizzazione completa

## 🌐 Deployment

Your project is live at:

**[https://vercel.com/lucamartello73-4767s-projects/v0-legno](https://vercel.com/lucamartello73-4767s-projects/v0-legno)**

### Deploy su Vercel

1. Importa il repository in Vercel
2. Configura le variabili ambiente (incluse `GMAIL_USER` e `GMAIL_APP_PASSWORD`)
3. Deploy automatico ad ogni push su `main`

## 🛠️ Development

### v0.app Integration

Continue building your app on:

**[https://v0.app/chat/projects/55gkDHAlE95](https://v0.app/chat/projects/55gkDHAlE95)**

### Come funziona

1. Crea e modifica su [v0.app](https://v0.app)
2. Deploy dalle chat v0
3. Modifiche pushate automaticamente su questo repository
4. Vercel deploya l'ultima versione

## 📝 Changelog

### v1.0.0 (2025-11-16)
- ✅ Migrazione da SendWith a Gmail SMTP
- ✅ Implementazione nodemailer transport
- ✅ Refactor API routes per nuovo sistema email
- ✅ Documentazione completa setup Gmail
- ✅ Logging migliorato con emoji
- ✅ Template email HTML responsive

## 📞 Support

- **Email**: info@martello1930.net
- **Issues**: [GitHub Issues](https://github.com/your-username/v0-legno/issues)

## 📄 License

Copyright © 2025 MARTELLO 1930 - Tutti i diritti riservati
