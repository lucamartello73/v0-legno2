-- Create feedback table
CREATE TABLE IF NOT EXISTS configuratorelegno_feedback (
  id SERIAL PRIMARY KEY,
  configuration_id INTEGER REFERENCES configuratorelegno_configurations(id),
  client_name VARCHAR(100) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title VARCHAR(255),
  comment TEXT,
  service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
  would_recommend BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  admin_response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON configuratorelegno_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_feedback_approved ON configuratorelegno_feedback(is_approved);
CREATE INDEX IF NOT EXISTS idx_feedback_featured ON configuratorelegno_feedback(is_featured);

-- Insert sample feedback
INSERT INTO configuratorelegno_feedback (
  client_name, client_email, rating, title, comment, 
  service_rating, quality_rating, delivery_rating, 
  would_recommend, is_approved, is_featured
) VALUES 
(
  'Marco Rossi',
  'marco.rossi@email.com',
  5,
  'Servizio eccellente e pergola perfetta',
  'Sono rimasto estremamente soddisfatto del servizio ricevuto. La pergola è stata realizzata esattamente come desiderato e il team è stato molto professionale durante tutto il processo.',
  5, 5, 5, true, true, true
),
(
  'Laura Bianchi',
  'laura.bianchi@email.com',
  4,
  'Ottima qualità, consigliato',
  'Pergola di ottima qualità e installazione precisa. Unico piccolo ritardo nella consegna, ma il risultato finale è fantastico.',
  4, 5, 3, true, true, false
),
(
  'Giuseppe Verdi',
  'giuseppe.verdi@email.com',
  5,
  'Trasformazione completa del giardino',
  'La pergola ha completamente trasformato il nostro spazio esterno. Materiali di prima qualità e design perfetto per le nostre esigenze.',
  5, 5, 4, true, true, true
),
(
  'Anna Ferrari',
  'anna.ferrari@email.com',
  4,
  'Buon rapporto qualità-prezzo',
  'Soddisfatta dell\'acquisto. La pergola è robusta e ben fatta. Il servizio clienti è stato sempre disponibile per ogni domanda.',
  4, 4, 4, true, true, false
);
