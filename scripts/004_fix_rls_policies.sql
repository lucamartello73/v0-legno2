-- Fix RLS policies to allow admin operations without Supabase auth
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow all for authenticated pergola_types" ON configuratorelegno_pergola_types;
DROP POLICY IF EXISTS "Allow all for authenticated coverage_types" ON configuratorelegno_coverage_types;
DROP POLICY IF EXISTS "Allow all for authenticated flooring_types" ON configuratorelegno_flooring_types;
DROP POLICY IF EXISTS "Allow all for authenticated accessories" ON configuratorelegno_accessories;
DROP POLICY IF EXISTS "Allow all for authenticated homepage_settings" ON configuratorelegno_homepage_settings;
DROP POLICY IF EXISTS "Allow all for authenticated configurations" ON configuratorelegno_configurations;

-- Create new policies that allow all operations (admin panel has its own password protection)
CREATE POLICY "Allow all operations pergola_types" ON configuratorelegno_pergola_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations coverage_types" ON configuratorelegno_coverage_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations flooring_types" ON configuratorelegno_flooring_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations accessories" ON configuratorelegno_accessories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations homepage_settings" ON configuratorelegno_homepage_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations configurations" ON configuratorelegno_configurations FOR ALL USING (true) WITH CHECK (true);
