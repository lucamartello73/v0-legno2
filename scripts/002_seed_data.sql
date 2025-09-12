-- Seed data for LEGNO Pergola Configurator

-- Insert pergola types
INSERT INTO configuratorelegno_pergola_types (name, description, image_url) VALUES
('Pergola Addossata', 'Pergola appoggiata alla parete esistente, ideale per terrazzi e spazi limitati', '/placeholder.svg?height=300&width=400'),
('Pergola Libera', 'Pergola autoportante a 4 pilastri, perfetta per giardini e spazi aperti', '/placeholder.svg?height=300&width=400')
ON CONFLICT (name) DO NOTHING;

-- Insert coverage types
INSERT INTO configuratorelegno_coverage_types (name, description, image_url) VALUES
('Lamelle Orientabili', 'Copertura con lamelle regolabili per controllo luce e ventilazione', '/placeholder.svg?height=200&width=300'),
('Telo Impermeabile', 'Copertura impermeabile per protezione completa dalle intemperie', '/placeholder.svg?height=200&width=300'),
('Vetro Temperato', 'Copertura in vetro temperato per massima luminosità e protezione', '/placeholder.svg?height=200&width=300')
ON CONFLICT (name) DO NOTHING;

-- Insert flooring types
INSERT INTO configuratorelegno_flooring_types (name, description, image_url) VALUES
('Decking in Legno', 'Pavimentazione in legno naturale trattato per esterni', '/placeholder.svg?height=200&width=300'),
('Piastrelle Gres', 'Pavimentazione in gres porcellanato antiscivolo', '/placeholder.svg?height=200&width=300'),
('Ghiaia Decorativa', 'Pavimentazione in ghiaia colorata drenante', '/placeholder.svg?height=200&width=300')
ON CONFLICT (name) DO NOTHING;

-- Insert accessories with prices
INSERT INTO configuratorelegno_accessories (name, description, price, image_url) VALUES
('Illuminazione LED', 'Sistema di illuminazione LED integrato con dimmer', 299.00, '/placeholder.svg?height=200&width=300'),
('Tende Laterali', 'Tende laterali scorrevoli per maggiore privacy', 199.00, '/placeholder.svg?height=200&width=300'),
('Riscaldatore Infrarossi', 'Riscaldatore infrarossi per uso invernale', 399.00, '/placeholder.svg?height=200&width=300'),
('Ventilatore da Soffitto', 'Ventilatore da soffitto per circolazione aria', 149.00, '/placeholder.svg?height=200&width=300')
ON CONFLICT (name) DO NOTHING;

-- Insert default homepage settings
INSERT INTO configuratorelegno_homepage_settings (
  hero_title, 
  hero_subtitle, 
  hero_image_url,
  dimensions_addossata_image,
  dimensions_libera_image
) VALUES (
  'Configuratore Pergole MARTELLO 1930',
  'Progetta la tua pergola ideale in legno con il nostro configuratore avanzato. Scegli dimensioni, colori, coperture e accessori per creare la soluzione perfetta per il tuo spazio esterno.',
  '/placeholder.svg?height=600&width=800',
  '/placeholder.svg?height=400&width=600',
  '/placeholder.svg?height=400&width=600'
)
ON CONFLICT DO NOTHING;
