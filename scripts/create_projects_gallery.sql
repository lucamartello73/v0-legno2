-- Create projects gallery table
CREATE TABLE IF NOT EXISTS configuratorelegno_projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  completion_date DATE,
  pergola_type VARCHAR(100),
  dimensions VARCHAR(50),
  main_image_url TEXT,
  gallery_images TEXT[], -- Array of image URLs
  features TEXT[], -- Array of features/highlights
  client_testimonial TEXT,
  client_name VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample projects
INSERT INTO configuratorelegno_projects (
  title, description, location, completion_date, pergola_type, dimensions,
  main_image_url, features, client_testimonial, client_name, is_featured
) VALUES 
(
  'Pergola Moderna con Illuminazione LED',
  'Una splendida pergola in legno lamellare con sistema di illuminazione LED integrato e tende da sole laterali motorizzate.',
  'Milano, Lombardia',
  '2024-08-15',
  'Pergola Bioclimatica',
  '6x4x3 metri',
  '/placeholder.svg?height=400&width=600',
  ARRAY['Illuminazione LED integrata', 'Tende laterali motorizzate', 'Legno lamellare certificato', 'Sistema bioclimatico'],
  'Siamo rimasti estremamente soddisfatti del lavoro svolto. La pergola ha trasformato completamente il nostro giardino.',
  'Marco R.',
  true
),
(
  'Pergola Rustica per Agriturismo',
  'Pergola in legno massello realizzata per un agriturismo in Toscana, con copertura in policarbonato e pavimentazione in pietra.',
  'Siena, Toscana',
  '2024-07-20',
  'Pergola Tradizionale',
  '8x6x3.5 metri',
  '/placeholder.svg?height=400&width=600',
  ARRAY['Legno massello di castagno', 'Copertura in policarbonato', 'Pavimentazione in pietra', 'Design rustico'],
  'La pergola si integra perfettamente con lo stile del nostro agriturismo. Qualità eccellente!',
  'Famiglia Bianchi',
  true
),
(
  'Pergola Contemporanea con Spa',
  'Pergola moderna con area relax e spa, dotata di riscaldatori infrarossi e sistema audio integrato.',
  'Roma, Lazio',
  '2024-06-10',
  'Pergola Design',
  '5x5x3 metri',
  '/placeholder.svg?height=400&width=600',
  ARRAY['Riscaldatori infrarossi', 'Sistema audio Bluetooth', 'Area spa integrata', 'Design contemporaneo'],
  'Un vero angolo di paradiso nel nostro giardino. Professionalità e qualità al top.',
  'Giulia M.',
  false
),
(
  'Pergola per Ristorante',
  'Grande pergola per dehor ristorante con sistema di nebulizzazione e illuminazione scenografica.',
  'Firenze, Toscana',
  '2024-05-25',
  'Pergola Commerciale',
  '12x8x4 metri',
  '/placeholder.svg?height=400&width=600',
  ARRAY['Sistema nebulizzazione', 'Illuminazione scenografica', 'Struttura rinforzata', 'Uso commerciale'],
  'I nostri clienti adorano cenare sotto questa pergola. Ha aumentato notevolmente i nostri coperti.',
  'Ristorante Da Vinci',
  true
)
;
