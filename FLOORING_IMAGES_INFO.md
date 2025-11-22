# 🖼️ Immagini Pavimentazioni - Riferimento

## 📋 Immagini Aggiornate per Step 5 (Pavimentazione)

### 1️⃣ **Decking in Legno**
- **Nome**: Decking in Legno
- **Descrizione**: Pavimentazione in legno naturale trattato per esterni
- **Immagine**: `https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=800&h=600&fit=crop&q=80`
- **Contenuto**: Pavimento in legno naturale per esterni, perfetto per terrazze e pergole
- **Colore dominante**: Marrone legno naturale
- **Stile**: Naturale, caldo, accogliente

### 2️⃣ **Piastrelle Gres**
- **Nome**: Piastrelle Gres
- **Descrizione**: Pavimentazione in gres porcellanato antiscivolo
- **Immagine**: `https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800&h=600&fit=crop&q=80`
- **Contenuto**: Pavimento in piastrelle moderne di gres porcellanato
- **Colore dominante**: Grigio/beige moderno
- **Stile**: Contemporaneo, elegante, pulito

### 3️⃣ **Ghiaia Decorativa**
- **Nome**: Ghiaia Decorativa
- **Descrizione**: Pavimentazione in ghiaia colorata drenante
- **Immagine**: `https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&q=80`
- **Contenuto**: Ghiaia decorativa bianca/grigia per giardini
- **Colore dominante**: Bianco/grigio chiaro
- **Stile**: Zen, minimalista, drenante

---

## 🎯 Caratteristiche Immagini

### Specifiche Tecniche:
- **Fonte**: Unsplash (immagini royalty-free ad alta qualità)
- **Dimensioni**: 800x600px (ottimizzate per web)
- **Formato**: JPEG ottimizzato
- **Qualità**: 80% (bilanciamento qualità/dimensione)
- **Aspect Ratio**: 4:3 (ideale per card)

### Vantaggi:
- ✅ Immagini reali professionali
- ✅ Alta qualità visiva
- ✅ Coordinate con le descrizioni
- ✅ Coerenti nello stile
- ✅ Ottimizzate per caricamento veloce
- ✅ Royalty-free (Unsplash License)

---

## 🔄 Come Aggiornare il Database

### Opzione 1: Script SQL Diretto
Esegui il file `scripts/update_flooring_images.sql` su Supabase:

```sql
-- Copia/incolla il contenuto nel SQL Editor di Supabase
-- Clicca "Run"
```

### Opzione 2: Update Manuale
Vai su Supabase Dashboard → Table Editor → `configuratorelegno_flooring_types`

Aggiorna manualmente ogni riga:
1. **Decking in Legno**: copia URL da riga 19 del seed file
2. **Piastrelle Gres**: copia URL da riga 20 del seed file
3. **Ghiaia Decorativa**: copia URL da riga 21 del seed file

---

## 📸 Preview Immagini

### Decking in Legno
![Decking](https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=400&h=300&fit=crop&q=80)
*Pavimento in legno naturale per esterni*

### Piastrelle Gres
![Gres](https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=300&fit=crop&q=80)
*Piastrelle in gres porcellanato moderno*

### Ghiaia Decorativa
![Ghiaia](https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop&q=80)
*Ghiaia decorativa per giardini*

---

## ✅ Checklist Implementazione

- [x] Immagini selezionate (Unsplash)
- [x] URL ottimizzati con parametri (w=800, h=600, q=80)
- [x] Script SQL creato (`update_flooring_images.sql`)
- [x] Seed data aggiornato (`002_seed_data.sql`)
- [x] Documentazione creata (questo file)
- [ ] Script SQL eseguito su Supabase
- [ ] Verifica visiva su frontend
- [ ] Test caricamento immagini

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
