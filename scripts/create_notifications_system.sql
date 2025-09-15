-- Create notifications table
CREATE TABLE IF NOT EXISTS configuratorelegno_notifications (
  id SERIAL PRIMARY KEY,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('admin', 'client')),
  recipient_email VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('new_configuration', 'status_update', 'new_feedback', 'system_alert')),
  related_id INTEGER, -- Can reference configuration_id, feedback_id, etc.
  is_read BOOLEAN DEFAULT false,
  is_sent BOOLEAN DEFAULT false,
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP,
  sent_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_type ON configuratorelegno_notifications(user_type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON configuratorelegno_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON configuratorelegno_notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON configuratorelegno_notifications(created_at);

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS configuratorelegno_notification_preferences (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) UNIQUE NOT NULL,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  notification_types TEXT[] DEFAULT ARRAY['new_configuration', 'status_update', 'new_feedback'],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin notification preferences
INSERT INTO configuratorelegno_notification_preferences (
  user_email, email_notifications, push_notifications, notification_types
) VALUES (
  'admin@martello1930.net', 
  true, 
  true, 
  ARRAY['new_configuration', 'status_update', 'new_feedback', 'system_alert']
) ON CONFLICT (user_email) DO NOTHING;

-- Insert sample notifications
INSERT INTO configuratorelegno_notifications (
  user_type, recipient_email, title, message, type, priority
) VALUES 
(
  'admin',
  'admin@martello1930.net',
  'Nuova Configurazione Ricevuta',
  'È stata ricevuta una nuova richiesta di preventivo per una pergola bioclimatica.',
  'new_configuration',
  'normal'
),
(
  'admin',
  'admin@martello1930.net',
  'Nuovo Feedback Cliente',
  'Un cliente ha lasciato una recensione a 5 stelle per il progetto completato.',
  'new_feedback',
  'normal'
),
(
  'client',
  'cliente@example.com',
  'Preventivo in Lavorazione',
  'Il tuo preventivo è ora in fase di lavorazione. Ti contatteremo presto con i dettagli.',
  'status_update',
  'normal'
);
