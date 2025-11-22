-- ============================================================================
-- UPDATE FLOORING IMAGES
-- Aggiorna le immagini delle pavimentazioni con immagini reali coordinate
-- ============================================================================

-- Aggiorna Decking in Legno
UPDATE configuratorelegno_flooring_types
SET image_url = 'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=800&h=600&fit=crop&q=80'
WHERE name = 'Decking in Legno';

-- Aggiorna Piastrelle Gres
UPDATE configuratorelegno_flooring_types
SET image_url = 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=800&h=600&fit=crop&q=80'
WHERE name = 'Piastrelle Gres';

-- Aggiorna Ghiaia Decorativa
UPDATE configuratorelegno_flooring_types
SET image_url = 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop&q=80'
WHERE name = 'Ghiaia Decorativa';

-- Verifica aggiornamento
SELECT 
  name,
  description,
  image_url,
  CASE 
    WHEN image_url LIKE 'https://images.unsplash.com/%' THEN '✅ Aggiornata'
    ELSE '❌ Placeholder'
  END as stato
FROM configuratorelegno_flooring_types
ORDER BY name;
