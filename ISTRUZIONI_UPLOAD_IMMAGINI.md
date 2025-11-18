# 📸 Istruzioni Upload Immagini Pavimentazioni

## ✅ Bucket Creato con Successo!

Il bucket **`flooring-images`** è stato creato su Supabase Storage ed è pronto per le immagini.

---

## ❌ Problema: URL Esterne Tutte 404

Tutte le 6 immagini esterne danno **errore 404** (cancellate o spostate):
- ❌ TERRA/GIARDINO: opulandscape.com → 404
- ❌ TERRAZZA: kronosceramiche.com → 404
- ❌ CEMENTO: mmgmarble.com → 404
- ❌ LEGNO/WPC: unifloorwpc.com → 404
- ❌ GRES/MATTONELLE: novoceram.com → 404
- ❌ RESINA: exteriorcoatings.com → 404

---

## 📋 Soluzione: Carica Nuove Immagini

### Step 1: Prepara 6 Immagini

Procurati 6 immagini rappresentative delle pavimentazioni:

1. **TERRA/GIARDINO** - Prato/terreno naturale
2. **TERRAZZA** - Pavimentazione terrazzo/balcone
3. **CEMENTO** - Pavimento cemento
4. **LEGNO/WPC** - Decking legno/composito
5. **GRES/MATTONELLE** - Piastrelle gres porcellanato
6. **RESINA** - Pavimento in resina

**Formato consigliato**: JPG, dimensione 800x600px o simile, max 1-2MB ciascuna

**Nomi file suggeriti**:
- `terra-giardino.jpg`
- `terrazza.jpg`
- `cemento.jpg`
- `legno-wpc.jpg`
- `gres-mattonelle.jpg`
- `resina.jpg`

---

### Step 2: Carica su Supabase Storage

#### Opzione A: Dashboard Supabase (CONSIGLIATO)

1. Vai su: **https://supabase.com/dashboard**
2. Seleziona il progetto
3. Menu laterale → **Storage**
4. Clicca sul bucket **`flooring-images`** (già creato!)
5. Clicca **Upload**
6. Seleziona le 6 immagini
7. Clicca **Upload**
8. Aspetta completamento

#### Opzione B: Tramite Admin Panel

Se hai un pannello admin nel configuratore:
1. Vai su Admin → Pavimentazioni
2. Per ogni pavimentazione clicca Modifica
3. Carica la nuova immagine
4. Salva

---

### Step 3: Ottieni gli URL

Dopo l'upload, ogni immagine avrà un URL come:
```
https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/terra-giardino.jpg
```

Per ogni immagine:
1. Clicca sull'immagine nel bucket
2. Clicca **Copy URL** o nota l'URL pubblico
3. Salva l'URL

---

### Step 4: Aggiorna Database

#### Opzione A: SQL Editor (Veloce)

1. Vai su **SQL Editor** nella dashboard
2. Esegui questo SQL (sostituisci con i tuoi URL):

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

-- Verifica
SELECT name, image_url FROM configuratorelegno_flooring_types ORDER BY name;
```

#### Opzione B: Table Editor

1. Vai su **Table Editor** → `configuratorelegno_flooring_types`
2. Per ogni riga, clicca **Edit**
3. Aggiorna il campo `image_url` con il nuovo URL Supabase
4. Salva

---

### Step 5: Testa nel Configuratore

1. Apri: `https://v0-legno.vercel.app` (o il tuo dominio)
2. Vai allo **Step 5: Pavimentazioni**
3. Verifica che **tutte le 6 immagini** si caricano
4. Controlla console browser (F12) per eventuali errori

---

## 📊 Riferimento ID Database

```
TERRA/GIARDINO:   ab222afc-b446-4ddf-baa3-8916583d292c
TERRAZZA:         2d401a77-79c5-4ee5-9430-2d8ac7b99b03
CEMENTO:          ce722700-b0da-48f2-accc-bb656ad7a335
LEGNO/WPC:        ee7fa9f8-748c-4fc9-96c4-87ad4e2b294f
GRES/MATTONELLE:  2a8e3e92-f65b-4311-bc06-71069909bb4b
RESINA:           c0ceec83-8736-4f4a-9f11-983bd7746fe3
```

---

## 💡 Suggerimenti per Trovare Immagini

### Fonti Gratuite:
- **Unsplash**: https://unsplash.com/s/photos/flooring
- **Pexels**: https://www.pexels.com/search/floor/
- **Pixabay**: https://pixabay.com/images/search/flooring/

### Parole chiave di ricerca:
- "outdoor flooring"
- "garden paving"
- "concrete floor"
- "wooden decking"
- "porcelain tiles outdoor"
- "resin flooring"

### Dimensioni consigliate:
- Larghezza: 800-1200px
- Formato: 16:9 o 4:3
- Peso: < 500KB per immagine

---

## ✅ Checklist

- [ ] 6 immagini preparate e rinominate
- [ ] Immagini caricate nel bucket `flooring-images`
- [ ] URL pubblici copiati
- [ ] Query SQL eseguita nel SQL Editor
- [ ] Verificato 6 righe aggiornate
- [ ] Testato Step 5 nel configuratore
- [ ] Tutte le immagini visibili

---

## 🎯 Formato URL Finale

Gli URL devono essere nel formato:
```
https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/[nome-file].jpg
```

**NON** usare:
- ❌ URL con `/sign/` o token temporanei
- ❌ URL di siti esterni
- ❌ Percorsi locali

---

## 🐛 Troubleshooting

### Immagine non visibile (404)
- Verifica nome file esatto nel bucket
- Controlla maiuscole/minuscole
- Verifica bucket sia pubblico

### Immagine visibile ma sfocata
- Carica immagine a risoluzione più alta
- Riduci compressione JPEG

### Cache browser
- Forza refresh: Ctrl+Shift+R
- Oppure cancella cache del sito

---

## 🎉 Risultato Finale

Dopo il completamento:
- ✅ Bucket `flooring-images` creato su Supabase
- ✅ 6 immagini caricate
- ✅ Database aggiornato con nuovi URL
- ✅ Step 5 funzionante con tutte le immagini visibili
- ✅ Nessun problema CORS
- ✅ Velocità ottimale (CDN Supabase)

---

**Tempo stimato**: 10-15 minuti

**Data**: 2025-11-18  
**Bucket**: `flooring-images` ✅ CREATO  
**Stato**: Pronto per upload immagini
