-- Add status and admin notes fields to configurations table
ALTER TABLE configuratorelegno_configurations 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_configurations_status ON configuratorelegno_configurations(status);

-- Update existing records to have pending status
UPDATE configuratorelegno_configurations 
SET status = 'pending' 
WHERE status IS NULL;
