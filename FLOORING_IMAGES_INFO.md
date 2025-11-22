# 🖼️ Immagini Pavimentazioni - Riferimento

## 📋 Immagini Configurate per Step 5 (Pavimentazione)

### 1️⃣ **TERRA/GIARDINO**
- **Nome**: TERRA/GIARDINO
- **Descrizione**: Installazione diretta sul terreno naturale con livellamento e preparazione del sottofondo.
- **Immagine**: `https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/terra-giardino.jpg`
- **Contenuto**: Installazione su terreno naturale per giardini
- **Tipo**: Installazione diretta su terra
- **Stile**: Naturale, rustico, da giardino

### 2️⃣ **TERRAZZA**
- **Nome**: TERRAZZA
- **Descrizione**: Montaggio su pavimentazione esistente, ideale per balconi e terrazze già finite.
- **Immagine**: `https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/terrazza.jpg`
- **Contenuto**: Montaggio su pavimento esistente
- **Tipo**: Sovrapposizione su pavimento finito
- **Stile**: Pratico, veloce, non invasivo

### 3️⃣ **CEMENTO**
- **Nome**: CEMENTO
- **Descrizione**: Installazione su massetto cementizio, soluzione robusta e duratura.
- **Immagine**: `https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/cemento.jpg`
- **Contenuto**: Installazione su massetto in cemento
- **Tipo**: Base cementizia robusta
- **Stile**: Industriale, resistente, duraturo

### 4️⃣ **LEGNO/WPC**
- **Nome**: LEGNO/WPC
- **Descrizione**: Installazione su pavimentazione in legno o decking preesistente.
- **Immagine**: `https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/legno-wpc.jpg`
- **Contenuto**: Installazione su decking in legno o WPC
- **Tipo**: Su pavimento in legno composito
- **Stile**: Caldo, naturale, elegante

### 5️⃣ **GRES/MATTONELLE**
- **Nome**: GRES/MATTONELLE
- **Descrizione**: Posa su pavimento in gres porcellanato con fissaggi adeguati.
- **Immagine**: `https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/gres-mattonelle.jpg`
- **Contenuto**: Installazione su piastrelle in gres
- **Tipo**: Su pavimento piastrellato
- **Stile**: Moderno, pulito, elegante

### 6️⃣ **RESINA**
- **Nome**: RESINA
- **Descrizione**: Montaggio su pavimento in resina continua, moderno e impermeabile.
- **Immagine**: `https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/resina.jpg`
- **Contenuto**: Installazione su pavimento in resina
- **Tipo**: Su pavimento resinato continuo
- **Stile**: Contemporaneo, impermeabile, minimal

---

## 🎯 Caratteristiche Immagini

### Specifiche Tecniche:
- **Fonte**: Supabase Storage (immagini caricate nel tuo bucket)
- **Formato**: JPEG/JPG
- **Storage**: `flooring-images` bucket (pubblico)
- **URL Base**: `https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/`
- **Aspect Ratio**: Variabile (ottimizzato per card)

### Vantaggi:
- ✅ Immagini reali professionali
- ✅ Alta qualità visiva
- ✅ Coordinate con le descrizioni pergole
- ✅ Coerenti nello stile
- ✅ Nel tuo storage (controllo completo)
- ✅ 6 opzioni diverse (più scelta per clienti)

---

## 🔄 Stato Database

### ✅ Immagini Già Configurate
Le immagini sono **già presenti e configurate** nel database Supabase. Non serve eseguire script di update.

### 📋 Dati Attuali
Il database contiene già le 6 pavimentazioni con le immagini corrette:

```sql
SELECT name, image_url 
FROM configuratorelegno_flooring_types 
ORDER BY created_at;
```

Risultato atteso:
1. TERRA/GIARDINO → terra-giardino.jpg ✅
2. TERRAZZA → terrazza.jpg ✅
3. CEMENTO → cemento.jpg ✅
4. LEGNO/WPC → legno-wpc.jpg ✅
5. GRES/MATTONELLE → gres-mattonelle.jpg ✅
6. RESINA → resina.jpg ✅

### 🔧 Se Serve Ripristinare
Solo in caso di problemi, esegui `scripts/update_flooring_images.sql` per ripristinare i valori corretti.

---

## 📸 URL Immagini Complete

### 1. TERRA/GIARDINO
```
https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/terra-giardino.jpg
```

### 2. TERRAZZA
```
https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/terrazza.jpg
```

### 3. CEMENTO
```
https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/cemento.jpg
```

### 4. LEGNO/WPC
```
https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/legno-wpc.jpg
```

### 5. GRES/MATTONELLE
```
https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/gres-mattonelle.jpg
```

### 6. RESINA
```
https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/resina.jpg
```

---

## ✅ Checklist Implementazione

- [x] Immagini caricate su Supabase Storage
- [x] Database aggiornato con 6 pavimentazioni
- [x] URL corretti configurati
- [x] Script SQL aggiornato (`update_flooring_images.sql`)
- [x] Seed data aggiornato (`002_seed_data.sql`)
- [x] Documentazione aggiornata (questo file)
- [x] Immagini verificate accessibili (HTTP 200)
- [x] Progetto aggiornato con nuovi dati
- [ ] Verifica visiva su frontend (testa ora!)
- [ ] Test selezione + auto-navigazione

---

## 🚀 Prossimi Passi

1. **Esegui lo script SQL** su Supabase Dashboard
2. **Ricarica la pagina** `/configurator/flooring`
3. **Verifica** che le immagini siano visibili
4. **Testa** la selezione con auto-navigazione

---

## 📝 Note

- Le immagini Unsplash sono servite via CDN (veloce e affidabile)
- I parametri `w`, `h`, `fit`, `q` ottimizzano automaticamente le immagini
- Se un'immagine non carica, il componente ha fallback a placeholder
- Le immagini sono lazy-loaded (caricano solo quando visibili)
