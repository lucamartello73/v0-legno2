# 🖼️ Guida Migrazione Manuale Immagini Pavimentazioni

## 🔍 Problema Attuale

Le 6 pavimentazioni hanno immagini da **URL esterne** che falliscono per CORS:

| Pavimentazione | URL Esterna | Problema |
|----------------|-------------|----------|
| TERRA/GIARDINO | opulandscape.com | ❌ CORS |
| TERRAZZA | kronosceramiche.com | ❌ CORS |
| CEMENTO | mmgmarble.com | ❌ CORS |
| LEGNO/WPC | unifloorwpc.com | ❌ CORS |
| GRES/MATTONELLE | novoceram.com | ❌ CORS |
| RESINA | exteriorcoatings.com | ❌ CORS |

**Risultato**: Le immagini NON si caricano nel configuratore (Step 5).

---

## ✅ Soluzione: Migrazione Manuale su Supabase Storage

### Step 1: Scarica le Immagini (Localmente)

Scarica manualmente le 6 immagini dai link originali:

#### 1. TERRA/GIARDINO
```
https://www.opulandscape.com/wp-content/uploads/2021/03/Natural-Lawn-Installation-3-1024x768.jpg
```
Salva come: `terra-giardino.jpg`

#### 2. TERRAZZA
```
https://kronosceramiche.com/app/uploads/2022/09/Timeless_Wood_Cover_Esterno-1536x960.jpg
```
Salva come: `terrazza.jpg`

#### 3. CEMENTO
```
https://mmgmarble.com/wp-content/uploads/2022/01/Concreto-Grey-Porcelain-Pavers-2048x2048.jpg
```
Salva come: `cemento.jpg`

#### 4. LEGNO/WPC
```
https://www.unifloorwpc.com/uploads/20240104/a8feeb88c3df6cb23b1a9fa92f2a00b9.jpg
```
Salva come: `legno-wpc.jpg`

#### 5. GRES/MATTONELLE
```
https://www.novoceram.com/media/cache/resolve/large/uploads/media/5e64398d16eb6/outdoor-porcelain-tiles-novoceram.jpg
```
Salva come: `gres-mattonelle.jpg`

#### 6. RESINA
```
https://exteriorcoatings.com/wp-content/uploads/2020/06/E1016-Anti-Slip-Epoxy-Floor-Coating-Gray.jpg
```
Salva come: `resina.jpg`

---

### Step 2: Crea Bucket su Supabase

1. Vai su **Supabase Dashboard**: https://supabase.com/dashboard
2. Seleziona il progetto
3. Nel menu laterale, clicca **Storage**
4. Clicca **New bucket**
5. Compila:
   - **Name**: `flooring-images`
   - **Public bucket**: ✅ **Abilita** (importante!)
   - **File size limit**: `5 MB`
   - **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp`
6. Clicca **Create bucket**

---

### Step 3: Carica le Immagini

1. Nel bucket `flooring-images`, clicca **Upload**
2. Seleziona e carica tutte le 6 immagini:
   - `terra-giardino.jpg`
   - `terrazza.jpg`
   - `cemento.jpg`
   - `legno-wpc.jpg`
   - `gres-mattonelle.jpg`
   - `resina.jpg`
3. Aspetta che il caricamento sia completato

---

### Step 4: Copia gli URL delle Immagini

Dopo il caricamento, ogni immagine avrà un URL pubblico come:
```
https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/terra-giardino.jpg
```

Per ogni immagine:
1. Clicca sull'immagine
2. Clicca **Copy URL** o **Get public URL**
3. Copia l'URL completo

---

### Step 5: Aggiorna Database con Nuovi URL

#### Opzione A: Tramite Dashboard Supabase (SQL Editor)

1. Vai su **SQL Editor** nella dashboard Supabase
2. Clicca **New query**
3. Incolla questo SQL (sostituisci gli URL con quelli veri):

```sql
-- Aggiorna TERRA/GIARDINO
UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/terra-giardino.jpg'
WHERE id = 'ab222afc-b446-4ddf-baa3-8916583d292c';

-- Aggiorna TERRAZZA
UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/terrazza.jpg'
WHERE id = '2d401a77-79c5-4ee5-9430-2d8ac7b99b03';

-- Aggiorna CEMENTO
UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/cemento.jpg'
WHERE id = 'ce722700-b0da-48f2-accc-bb656ad7a335';

-- Aggiorna LEGNO/WPC
UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/legno-wpc.jpg'
WHERE id = 'ee7fa9f8-748c-4fc9-96c4-87ad4e2b294f';

-- Aggiorna GRES/MATTONELLE
UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/gres-mattonelle.jpg'
WHERE id = '2a8e3e92-f65b-4311-bc06-71069909bb4b';

-- Aggiorna RESINA
UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/resina.jpg'
WHERE id = 'c0ceec83-8736-4f4a-9f11-983bd7746fe3';

-- Verifica risultato
SELECT name, image_url FROM configuratorelegno_flooring_types ORDER BY name;
```

4. Clicca **Run** (o Ctrl+Enter)
5. Verifica che tutte le 6 righe siano state aggiornate

#### Opzione B: Tramite Admin Panel (Se hai interfaccia admin)

Se hai un'interfaccia admin nel configuratore:
1. Vai su Admin → Pavimentazioni
2. Per ogni pavimentazione:
   - Clicca **Modifica**
   - Sostituisci l'URL immagine con il nuovo URL Supabase
   - Salva

---

### Step 6: Verifica nel Configuratore

1. Apri il configuratore: `https://v0-legno-dwl78df0t-lucamartello73-4767s-projects.vercel.app`
2. Vai allo **Step 5: Pavimentazioni**
3. Verifica che **tutte le 6 immagini** si caricano correttamente
4. Controlla la **console browser** (F12) per eventuali errori

---

## 🎯 Formato URL Corretto

Gli URL finali devono essere nel formato:
```
https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/[nome-file].jpg
```

Esempi:
- ✅ `https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/terra-giardino.jpg`
- ✅ `https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/cemento.jpg`
- ❌ `https://www.opulandscape.com/...` (URL esterna, NON funziona)

---

## ✅ Checklist Completa

### Preparazione
- [ ] Scaricate tutte le 6 immagini dai link originali
- [ ] Rinominate con nomi descrittivi (es: `terra-giardino.jpg`)
- [ ] Verifica dimensioni ragionevoli (< 2MB ciascuna)

### Supabase Storage
- [ ] Bucket `flooring-images` creato
- [ ] Bucket impostato come **pubblico**
- [ ] Tutte le 6 immagini caricate
- [ ] URL pubblici copiati per ogni immagine

### Database
- [ ] Query SQL eseguita con successo
- [ ] Verificate 6 righe aggiornate
- [ ] Query SELECT conferma nuovi URL

### Test
- [ ] Configuratore aperto
- [ ] Step 5 Pavimentazioni visualizzato
- [ ] Tutte le 6 immagini visibili
- [ ] Nessun errore in console browser

---

## 🐛 Troubleshooting

### Immagini ancora non visibili

**Problema 1: Bucket non pubblico**
- Soluzione: Storage → flooring-images → Settings → Public bucket: ON

**Problema 2: URL sbagliato**
- Verifica formato: `/storage/v1/object/public/flooring-images/[nome-file]`
- NON deve contenere `/sign/` o altri token

**Problema 3: CORS ancora presente**
- Verifica che gli URL siano davvero Supabase, non esterni
- Controlla console browser per errori specifici

**Problema 4: Immagine non trovata (404)**
- Verifica nome file esatto nel bucket
- Controlla maiuscole/minuscole nel nome file

### Cache browser

Se le vecchie immagini sono in cache:
1. Apri Dev Tools (F12)
2. Fai click destro su Refresh
3. Seleziona **Empty Cache and Hard Reload**

---

## 📊 ID Database per Reference

Usa questi ID nel query SQL:

```
TERRA/GIARDINO:   ab222afc-b446-4ddf-baa3-8916583d292c
TERRAZZA:         2d401a77-79c5-4ee5-9430-2d8ac7b99b03
CEMENTO:          ce722700-b0da-48f2-accc-bb656ad7a335
LEGNO/WPC:        ee7fa9f8-748c-4fc9-96c4-87ad4e2b294f
GRES/MATTONELLE:  2a8e3e92-f65b-4311-bc06-71069909bb4b
RESINA:           c0ceec83-8736-4f4a-9f11-983bd7746fe3
```

---

## 🎉 Risultato Finale

Dopo la migrazione:
- ✅ Tutte le immagini su Supabase Storage
- ✅ Nessun problema CORS
- ✅ Caricamento veloce (CDN Supabase)
- ✅ Controllo totale sulle immagini
- ✅ Affidabilità 100%

---

## 🚀 Alternative Automatiche

Se preferisci, posso creare uno script che:
1. Scarica automaticamente le 6 immagini
2. Le carica su Supabase Storage
3. Aggiorna il database

Ma richiede credenziali Supabase Service Role valide.

---

**Tempo stimato**: 15-20 minuti per migrazione manuale completa.

**Data**: 2025-11-18  
**Stato**: Guida pronta - Esecuzione manuale richiesta
