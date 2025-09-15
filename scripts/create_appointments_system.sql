-- Create appointments table
CREATE TABLE IF NOT EXISTS configuratorelegno_appointments (
  id SERIAL PRIMARY KEY,
  configuration_id INTEGER REFERENCES configuratorelegno_configurations(id),
  client_name VARCHAR(100) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(20),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  appointment_type VARCHAR(50) NOT NULL CHECK (appointment_type IN ('consultation', 'site_visit', 'installation', 'follow_up')),
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
  location VARCHAR(255),
  notes TEXT,
  admin_notes TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create appointment availability table
CREATE TABLE IF NOT EXISTS configuratorelegno_availability (
  id SERIAL PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  max_appointments INTEGER DEFAULT 4,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create appointment time slots table
CREATE TABLE IF NOT EXISTS configuratorelegno_time_slots (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  is_blocked BOOLEAN DEFAULT false,
  max_bookings INTEGER DEFAULT 1,
  current_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON configuratorelegno_appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON configuratorelegno_appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_client_email ON configuratorelegno_appointments(client_email);
CREATE INDEX IF NOT EXISTS idx_time_slots_date ON configuratorelegno_time_slots(date);

-- Insert default availability (Monday to Friday, 9:00-17:00)
INSERT INTO configuratorelegno_availability (day_of_week, start_time, end_time, max_appointments) VALUES
(1, '09:00', '17:00', 4), -- Monday
(2, '09:00', '17:00', 4), -- Tuesday
(3, '09:00', '17:00', 4), -- Wednesday
(4, '09:00', '17:00', 4), -- Thursday
(5, '09:00', '17:00', 4), -- Friday
(6, '09:00', '13:00', 2)  -- Saturday (half day)
ON CONFLICT DO NOTHING;

-- Insert sample appointments
INSERT INTO configuratorelegno_appointments (
  client_name, client_email, client_phone, appointment_date, appointment_time,
  appointment_type, status, location, notes
) VALUES 
(
  'Marco Rossi',
  'marco.rossi@email.com',
  '+39 333 1234567',
  CURRENT_DATE + INTERVAL '3 days',
  '10:00',
  'consultation',
  'scheduled',
  'Milano, Via Roma 123',
  'Prima consulenza per pergola bioclimatica'
),
(
  'Laura Bianchi',
  'laura.bianchi@email.com',
  '+39 334 7654321',
  CURRENT_DATE + INTERVAL '5 days',
  '14:00',
  'site_visit',
  'confirmed',
  'Roma, Via del Corso 45',
  'Sopralluogo per installazione pergola'
),
(
  'Giuseppe Verdi',
  'giuseppe.verdi@email.com',
  '+39 335 9876543',
  CURRENT_DATE + INTERVAL '7 days',
  '11:00',
  'installation',
  'scheduled',
  'Firenze, Piazza della Signoria 1',
  'Installazione pergola tradizionale'
);
