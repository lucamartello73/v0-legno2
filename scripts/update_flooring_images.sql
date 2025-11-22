-- ============================================================================
-- UPDATE FLOORING IMAGES
-- Aggiorna le immagini delle pavimentazioni con immagini da Supabase Storage
-- NOTA: Queste immagini sono già presenti nel database, questo script serve
--       solo come riferimento o per ripristinare i valori corretti
-- ============================================================================

-- Aggiorna TERRA/GIARDINO
UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/terra-giardino.jpg',
    description = 'Installazione diretta sul terreno naturale con livellamento e preparazione del sottofondo.'
WHERE name = 'TERRA/GIARDINO';

-- Aggiorna TERRAZZA
UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/terrazza.jpg',
    description = 'Montaggio su pavimentazione esistente, ideale per balconi e terrazze già finite.'
WHERE name = 'TERRAZZA';

-- Aggiorna CEMENTO
UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/cemento.jpg',
    description = 'Installazione su massetto cementizio, soluzione robusta e duratura.'
WHERE name = 'CEMENTO';

-- Aggiorna LEGNO/WPC
UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/legno-wpc.jpg',
    description = 'Installazione su pavimentazione in legno o decking preesistente.'
WHERE name = 'LEGNO/WPC';

-- Aggiorna GRES/MATTONELLE
UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/gres-mattonelle.jpg',
    description = 'Posa su pavimento in gres porcellanato con fissaggi adeguati.'
WHERE name = 'GRES/MATTONELLE';

-- Aggiorna RESINA
UPDATE configuratorelegno_flooring_types
SET image_url = 'https://diymukpvccuauohylrnz.supabase.co/storage/v1/object/public/flooring-images/resina.jpg',
    description = 'Montaggio su pavimento in resina continua, moderno e impermeabile.'
WHERE name = 'RESINA';

-- Verifica aggiornamento
SELECT 
  name,
  description,
  image_url,
  CASE 
    WHEN image_url LIKE '%supabase.co/storage%' THEN '✅ Supabase Storage'
    WHEN image_url LIKE 'https://images.unsplash.com/%' THEN '⚠️ Unsplash (vecchio)'
    WHEN image_url LIKE '/placeholder.svg%' THEN '❌ Placeholder'
    ELSE '❓ Altro'
  END as stato
FROM configuratorelegno_flooring_types
ORDER BY created_at;
