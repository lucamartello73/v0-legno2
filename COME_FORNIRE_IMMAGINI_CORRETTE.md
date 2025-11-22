# 🖼️ Come Fornire le Immagini Corrette delle Pavimentazioni

## 🔴 Problema Attuale

Le immagini attuali sono **placeholder generici** da Unsplash, NON sono collegate alle vere descrizioni:

| Pavimentazione | Immagine Attuale | Problema |
|---------------|-----------------|----------|
| TERRA/GIARDINO | Foto generica prato | ❌ Non rappresenta il prodotto reale |
| TERRAZZA | Foto generica terrazza | ❌ Non rappresenta il prodotto reale |
| CEMENTO | Foto generica cemento | ❌ Non rappresenta il prodotto reale |
| LEGNO/WPC | Foto generica legno | ❌ Non rappresenta il prodotto reale |
| GRES/MATTONELLE | Foto generica gres | ❌ Non rappresenta il prodotto reale |
| RESINA | Foto generica resina | ❌ Non rappresenta il prodotto reale |

---

## ✅ Soluzione: Fornire Immagini Corrette

### **Opzione 1: Hai le Immagini in Locale?**

Se hai le immagini corrette sul tuo computer:

1. **Mettile in una cartella** (es. `immagini_pavimentazioni/`)
2. **Nominale chiaramente**:
   ```
   terra-giardino.jpg
   terrazza.jpg
   cemento.jpg
   legno-wpc.jpg
   gres-mattonelle.jpg
   resina.jpg
   ```
3. **Forniscimele** tramite:
   - Upload su Google Drive/Dropbox e mandami il link
   - Oppure caricale direttamente nel progetto nella cartella `public/`

### **Opzione 2: Hai gli URL Corretti?**

Se conosci gli URL dove si trovano le immagini corrette (anche se danno 404 ora, forse esistono da qualche parte):

1. **Mandami gli URL esatti** per ogni pavimentazione
2. **Oppure** mandami il link al sito del fornitore dove posso trovare le foto giuste

### **Opzione 3: Vuoi Usare Foto da Cataloghi Fornitori?**

Se vuoi che scarichi le foto dai siti dei tuoi fornitori:

1. **Mandami i link ai prodotti specifici** con le foto giuste
2. **Oppure** mandami i PDF dei cataloghi con le foto

### **Opzione 4: Creare Nuove Foto?**

Se hai bisogno di foto nuove:

1. **Scatta foto** dei pavimenti/materiali reali
2. **Oppure** procurati foto professionali dai fornitori
3. **Oppure** usa stock photos che rappresentino bene ogni tipo

---

## 📋 Cosa Devo Sapere per Ogni Immagine

Per ogni delle 6 pavimentazioni, dimmi:

### **TERRA/GIARDINO**
- Descrizione: _________________________________
- Link immagine / File: _________________________________
- Note specifiche: _________________________________

### **TERRAZZA**
- Descrizione: _________________________________
- Link immagine / File: _________________________________
- Note specifiche: _________________________________

### **CEMENTO**
- Descrizione: _________________________________
- Link immagine / File: _________________________________
- Note specifiche: _________________________________

### **LEGNO/WPC**
- Descrizione: _________________________________
- Link immagine / File: _________________________________
- Note specifiche: _________________________________

### **GRES/MATTONELLE**
- Descrizione: _________________________________
- Link immagine / File: _________________________________
- Note specifiche: _________________________________

### **RESINA**
- Descrizione: _________________________________
- Link immagine / File: _________________________________
- Note specifiche: _________________________________

---

## 🚀 Processo di Caricamento

Una volta che mi fornisci le immagini corrette, io:

1. ✅ Le carico su Supabase Storage bucket `flooring-images`
2. ✅ Aggiorno il database con i nuovi URL
3. ✅ Verifico che si caricano correttamente
4. ✅ Testo nel configuratore in produzione

---

## 📝 Note Tecniche

**Formato Preferito**:
- Formato: JPG o PNG
- Dimensioni: 800x600px (o simile, aspect ratio 4:3 o 16:9)
- Peso: < 200KB per immagine (per performance)
- Qualità: Alta (per visualizzazione professionale)

**Naming Convention**:
```
terra-giardino.jpg       → TERRA/GIARDINO
terrazza.jpg            → TERRAZZA
cemento.jpg             → CEMENTO
legno-wpc.jpg           → LEGNO/WPC
gres-mattonelle.jpg     → GRES/MATTONELLE
resina.jpg              → RESINA
```

---

## ❓ Domande Frequenti

### "Non ho le immagini originali, cosa faccio?"

Puoi:
1. Scaricare foto rappresentative dai siti dei fornitori
2. Usare foto stock di alta qualità
3. Scattare nuove foto dei materiali
4. **Lasciare i placeholder attuali** (funzionano, ma sono generici)

### "Gli URL esterni erano giusti, ma ora danno 404"

Significa che i siti hanno:
- Spostato le immagini
- Cancellato le immagini
- Cambiato struttura URL

**Soluzione**: Devi trovare le nuove posizioni delle immagini o scaricare nuove foto.

### "Posso modificare le immagini direttamente su Supabase?"

Sì! Puoi:
1. Andare su Supabase Dashboard → Storage → `flooring-images`
2. Cancellare i file attuali
3. Caricare i nuovi file **con gli stessi nomi**
4. Le URL rimangono identiche, le immagini si aggiornano automaticamente

---

## 📞 Prossimo Step

**Dimmi quale opzione preferisci** e come vuoi procedere:

- [ ] Ho le immagini in locale (mandami il link o caricale in `public/`)
- [ ] Conosco gli URL corretti (mandami i link)
- [ ] Voglio usare foto dai cataloghi (mandami i link ai prodotti)
- [ ] Lascio i placeholder attuali (funzionano ma sono generici)
- [ ] Altro: ___________________________________

---

**Una volta che mi dai le indicazioni, aggiorno le immagini in ~5 minuti!** ⚡
