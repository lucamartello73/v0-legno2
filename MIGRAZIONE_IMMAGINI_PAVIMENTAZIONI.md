# 🖼️ Migrazione Immagini Pavimentazioni

## 🔍 Problema Identificato

Le immagini delle pavimentazioni nello **Step 5** non si caricano perché sono **URL esterne** da siti di terze parti:

| Pavimentazione | URL Esterna | Problema |
|----------------|-------------|----------|
| TERRA/GIARDINO | opulandscape.com | ❌ CORS, può fallire |
| TERRAZZA | kronosceramiche.com | ❌ CORS, può fallire |
| CEMENTO | mmgmarble.com | ❌ CORS, può fallire |
| LEGNO/WPC | unifloorwpc.com | ❌ CORS, può fallire |
| GRES/MATTONELLE | novoceram.com | ❌ CORS, può fallire |
| RESINA | exteriorcoatings.com | ❌ CORS, può fallire |

### ⚠️ Problemi con URL Esterne:
1. **CORS** (Cross-Origin Resource Sharing) - i browser bloccano il caricamento
2. **Affidabilità** - le immagini possono essere spostate o eliminate
3. **Performance** - caricamento lento da server esterni
4. **Controllo** - nessun controllo su disponibilità e dimensioni

---

## ✅ Soluzione: Migrazione su Supabase Storage

Migrare tutte le immagini su **Supabase Storage** per:
- ✅ **Nessun problema CORS** - stesso dominio
- ✅ **Affidabilità 100%** - totale controllo
- ✅ **Performance** - CDN globale Supabase
- ✅ **Sicurezza** - gestione accessi granulare

---

## 🚀 Come Migrare le Immagini

### Opzione 1: Script Automatico (CONSIGLIATO) ⭐

Lo script automatico:
1. Scarica tutte le immagini da URL esterne
2. Le carica su Supabase Storage bucket `flooring-images`
3. Aggiorna automaticamente il database con i nuovi URL

#### Prerequisiti:
```bash
# Necessaria la Service Role Key di Supabase
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Come trovare la Service Role Key:**
1. Vai su **Supabase Dashboard** → https://supabase.com/dashboard
2. Seleziona il progetto
3. Vai a **Settings** → **API**
4. Copia **service_role** key (⚠️ SEGRETA - non committare!)

#### Esecuzione:
```bash
cd /home/user/webapp

# Imposta la service key
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Esegui migrazione
node scripts/migrate-flooring-images.js
```

#### Output Atteso:
```
═══════════════════════════════════════════════════
🚀 MIGRAZIONE IMMAGINI PAVIMENTAZIONI
   Da URL esterne → Supabase Storage
═══════════════════════════════════════════════════

🗄️  Verifica bucket 'flooring-images'...
   ✅ Bucket già esistente

📋 Caricamento pavimentazioni dal database...
✅ Trovate 6 pavimentazioni

📦 Migrazione: TERRA/GIARDINO
   ⬇️  Scaricamento da: https://www.opulandscape.com/...
   ✅ Scaricati 245678 bytes
   ⬆️  Upload su Supabase Storage: terra-giardino-abc123.jpg
   ✅ Caricato: https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/...
   💾 Aggiornamento database...
   ✅ Database aggiornato
   ✅ MIGRAZIONE COMPLETATA!

[... continua per tutte le 6 pavimentazioni ...]

═══════════════════════════════════════════════════
📊 REPORT MIGRAZIONE
═══════════════════════════════════════════════════
✅ Totale:     6
✅ Migrate:    6
⏭️  Skippate:   0
❌ Fallite:    0

🎉 MIGRAZIONE COMPLETATA CON SUCCESSO!
```

---

### Opzione 2: Migrazione Manuale (Dashboard Supabase)

Se preferisci fare manualmente:

#### Step 1: Crea il Bucket
1. Vai su **Supabase Dashboard** → **Storage**
2. Clicca **New bucket**
3. Nome: `flooring-images`
4. Public bucket: ✅ Abilita
5. File size limit: `5 MB`
6. Allowed MIME types: `image/jpeg, image/png, image/webp`
7. Clicca **Create bucket**

#### Step 2: Upload Immagini
1. Scarica manualmente le 6 immagini dai link esterni
2. Rinominale con nomi descrittivi (es: `terra-giardino.jpg`, `terrazza.jpg`, ecc.)
3. Carica nel bucket `flooring-images`
4. Copia gli URL pubblici generati

#### Step 3: Aggiorna Database
Esegui questo SQL nell'Editor SQL di Supabase:

```sql
-- Aggiorna URL immagini con quelle caricate su Supabase Storage
UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/terra-giardino.jpg'
WHERE name = 'TERRA/GIARDINO';

UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/terrazza.jpg'
WHERE name = 'TERRAZZA';

UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/cemento.jpg'
WHERE name = 'CEMENTO';

UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/legno-wpc.jpg'
WHERE name = 'LEGNO/WPC';

UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/gres-mattonelle.jpg'
WHERE name = 'GRES/MATTONELLE';

UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/resina.jpg'
WHERE name = 'RESINA';
```

---

## 🧪 Test Prima della Migrazione

Per vedere quali immagini esterne attualmente caricano/falliscono:

```bash
# Apri il tool di test HTML nel browser
open scripts/test-flooring-images.html

# Oppure serve il file con un server locale:
cd /home/user/webapp
python3 -m http.server 8080

# Poi apri nel browser:
# http://localhost:8080/scripts/test-flooring-images.html
```

Il tool mostrerà:
- ✅ **Immagini caricate con successo** (verde)
- ❌ **Immagini fallite** (rosso)
- 📊 **Statistiche** (tasso successo, totali, ecc.)

---

## ✅ Verifica Dopo la Migrazione

### 1. Controlla Database
```bash
curl -s 'https://diymukpvccuauohylrnz.supabase.co/rest/v1/configuratorelegno_flooring_types?select=name,image_url' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpeW11a3B2Y2N1YXVvaHlscm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NTQwNzEsImV4cCI6MjA3MzIzMDA3MX0.fjkbrlQ_H2zYtAI2dKju611yUzve8orkhU2P5ydTJcY" | jq
```

Verifica che tutti gli `image_url` contengano `supabase.co/storage`.

### 2. Testa il Configuratore
1. Vai all'applicazione: `http://localhost:3000/configurator/flooring`
2. Verifica che tutte le 6 immagini si carichino correttamente
3. Non dovrebbero esserci più errori CORS nella console del browser

### 3. Test Tool HTML
Riapri `scripts/test-flooring-images.html` - tutte le immagini dovrebbero essere **verdi** (caricate).

---

## 🔐 Sicurezza Service Role Key

⚠️ **ATTENZIONE**: La `SUPABASE_SERVICE_ROLE_KEY` è una chiave **MOLTO SENSIBILE**.

### ✅ Best Practices:
- ✅ **MAI committare** la key nel codice
- ✅ **Usa solo localmente** o in CI/CD sicuro
- ✅ **Esporta come variabile ambiente** temporanea
- ✅ **Cancella dalla history** dopo l'uso: `history -c`
- ✅ **Rigenera la key** se esposta accidentalmente

### ❌ NON FARE:
- ❌ Non inserire nel codice sorgente
- ❌ Non commitare in `.env` o `.env.local`
- ❌ Non condividere pubblicamente
- ❌ Non usare nel frontend (solo backend/script)

---

## 🐛 Troubleshooting

### Errore: "SUPABASE_SERVICE_ROLE_KEY non configurata"
```bash
# Soluzione:
export SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
node scripts/migrate-flooring-images.js
```

### Errore: "Bucket already exists"
Non è un errore! Lo script verifica e usa il bucket esistente.

### Errore: "HTTP 403" durante download
Alcuni siti esterni potrebbero bloccare il download. Opzioni:
1. Usa Opzione 2 (migrazione manuale)
2. Scarica l'immagine manualmente e sostituisci nel database

### Errore: "Network timeout"
Aumenta il timeout nello script o scarica manualmente.

### Le immagini non si vedono dopo migrazione
1. Verifica bucket sia **pubblico**: Storage → flooring-images → Settings → Public bucket: ON
2. Verifica URL nel database contengano `/storage/v1/object/public/`
3. Pulisci cache browser (Ctrl+Shift+R)

---

## 📊 Stato Attuale

### Database Supabase:
- ✅ **6 pavimentazioni** presenti
- ❌ **6 URL esterne** (da migrare)
- ⚠️ **Immagini potrebbero non caricarsi** per CORS

### Codice Applicazione:
- ✅ **Fallback automatico** implementato (mostra placeholder se fallisce)
- ✅ **Lazy loading** per performance
- ✅ **Error handling** con console warning

### Prossimi Passi:
1. ⏳ **Eseguire migrazione** con lo script automatico
2. ⏳ **Verificare** che tutte le immagini si caricano
3. ⏳ **Testare** Step 5 nel configuratore

---

## 🎯 Riepilogo Comandi Rapidi

```bash
# 1. Imposta Service Role Key
export SUPABASE_SERVICE_ROLE_KEY=your-key-here

# 2. Esegui migrazione
cd /home/user/webapp
node scripts/migrate-flooring-images.js

# 3. Verifica database
curl -s 'https://diymukpvccuauohylrnz.supabase.co/rest/v1/configuratorelegno_flooring_types?select=name,image_url' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpeW11a3B2Y2N1YXVvaHlscm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NTQwNzEsImV4cCI6MjA3MzIzMDA3MX0.fjkbrlQ_H2zYtAI2dKju611yUzve8orkhU2P5ydTJcY" | jq

# 4. Testa applicazione
npm run dev
# Vai a: http://localhost:3000/configurator/flooring
```

---

## 📚 File Correlati

- **`scripts/migrate-flooring-images.js`** - Script automatico migrazione
- **`scripts/test-flooring-images.html`** - Tool test HTML
- **`FLOORING_IMAGES_FIX.md`** - Documentazione fix precedente
- **`app/configurator/flooring/page.tsx`** - Pagina Step 5

---

**Creato**: 2025-11-17
**Autore**: GenSpark AI Developer
**Stato**: ⏳ Migrazione in attesa di esecuzione
