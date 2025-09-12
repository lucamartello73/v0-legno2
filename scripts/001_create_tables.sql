-- LEGNO Pergola Configurator Database Schema
-- Create all tables with proper prefixes and RLS

-- Tipi di pergola
CREATE TABLE IF NOT EXISTS configuratorelegno_pergola_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tipi di copertura
CREATE TABLE IF NOT EXISTS configuratorelegno_coverage_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tipi di pavimentazione
CREATE TABLE IF NOT EXISTS configuratorelegno_flooring_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Accessori con prezzi
CREATE TABLE IF NOT EXISTS configuratorelegno_accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Configurazioni salvate
CREATE TABLE IF NOT EXISTS configuratorelegno_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_name VARCHAR(100),
  width INTEGER,
  depth INTEGER,
  height INTEGER,
  color_category VARCHAR(50),
  color_name VARCHAR(100),
  coverage_name VARCHAR(100),
  flooring_names TEXT[],
  accessory_names TEXT[],
  service_type VARCHAR(20),
  contact_preference VARCHAR(20),
  contact_data JSONB,
  total_price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Impostazioni homepage
CREATE TABLE IF NOT EXISTS configuratorelegno_homepage_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hero_title VARCHAR(200),
  hero_subtitle TEXT,
  hero_image_url TEXT,
  dimensions_addossata_image TEXT,
  dimensions_libera_image TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on all tables (public access for configurator)
ALTER TABLE configuratorelegno_pergola_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuratorelegno_coverage_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuratorelegno_flooring_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuratorelegno_accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuratorelegno_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuratorelegno_homepage_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (configurator needs to read data)
CREATE POLICY "Allow public read pergola_types" ON configuratorelegno_pergola_types FOR SELECT USING (true);
CREATE POLICY "Allow public read coverage_types" ON configuratorelegno_coverage_types FOR SELECT USING (true);
CREATE POLICY "Allow public read flooring_types" ON configuratorelegno_flooring_types FOR SELECT USING (true);
CREATE POLICY "Allow public read accessories" ON configuratorelegno_accessories FOR SELECT USING (true);
CREATE POLICY "Allow public read homepage_settings" ON configuratorelegno_homepage_settings FOR SELECT USING (true);

-- Allow public insert for configurations (users can save their configurations)
CREATE POLICY "Allow public insert configurations" ON configuratorelegno_configurations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read configurations" ON configuratorelegno_configurations FOR SELECT USING (true);

-- Allow all operations for authenticated users (admin panel)
CREATE POLICY "Allow all for authenticated pergola_types" ON configuratorelegno_pergola_types FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated coverage_types" ON configuratorelegno_coverage_types FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated flooring_types" ON configuratorelegno_flooring_types FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated accessories" ON configuratorelegno_accessories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated homepage_settings" ON configuratorelegno_homepage_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all for authenticated configurations" ON configuratorelegno_configurations FOR ALL USING (auth.role() = 'authenticated');
