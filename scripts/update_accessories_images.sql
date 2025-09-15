-- Script to update existing accessories with appropriate images based on their descriptions

-- Update accessories with generated images based on their descriptions
UPDATE configuratorelegno_accessories 
SET image_url = '/placeholder.svg?height=300&width=400&query=' || REPLACE(LOWER(name || ' ' || description), ' ', '+')
WHERE image_url IS NULL OR image_url = '';

-- If you want to update all accessories regardless of existing images, use this instead:
-- UPDATE configuratorelegno_accessories 
-- SET image_url = '/placeholder.svg?height=300&width=400&query=' || REPLACE(LOWER(name || ' ' || description), ' ', '+');
