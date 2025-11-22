#!/usr/bin/env node

/**
 * Script per migrare immagini pavimentazioni da URL esterne a Supabase Storage
 * 
 * Questo script:
 * 1. Scarica le immagini da URL esterne
 * 2. Le carica su Supabase Storage bucket 'flooring-images'
 * 3. Aggiorna il database con i nuovi URL Supabase
 * 
 * Uso: node scripts/migrate-flooring-images.js
 */

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');
const { basename } = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://diymukpvccuauohylrnz.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ ERRORE: SUPABASE_SERVICE_ROLE_KEY non configurata!');
  console.error('   Esporta la variabile: export SUPABASE_SERVICE_ROLE_KEY=your-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = 'flooring-images';
const TABLE_NAME = 'configuratorelegno_flooring_types';

/**
 * Scarica un'immagine da URL
 */
async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    console.log(`   ⬇️  Scaricamento da: ${url}`);
    
    const req = client.get(url, { 
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SupabaseMigration/1.0)',
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Redirect
        return downloadImage(res.headers.location).then(resolve).catch(reject);
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const contentType = res.headers['content-type'] || 'image/jpeg';
        console.log(`   ✅ Scaricati ${buffer.length} bytes (${contentType})`);
        resolve({ buffer, contentType });
      });
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

/**
 * Genera nome file sicuro da URL
 */
function generateFileName(originalUrl, flooringName) {
  const ext = originalUrl.match(/\.(jpg|jpeg|png|webp)(\?|$)/i)?.[1] || 'jpg';
  const safeName = flooringName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const hash = crypto.createHash('md5').update(originalUrl).digest('hex').substring(0, 8);
  return `${safeName}-${hash}.${ext}`;
}

/**
 * Carica immagine su Supabase Storage
 */
async function uploadToSupabase(buffer, fileName, contentType) {
  console.log(`   ⬆️  Upload su Supabase Storage: ${fileName}`);
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, buffer, {
      contentType,
      cacheControl: '31536000', // 1 anno
      upsert: false
    });

  if (error) {
    throw error;
  }

  // Ottieni URL pubblico
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  console.log(`   ✅ Caricato: ${urlData.publicUrl}`);
  return urlData.publicUrl;
}

/**
 * Aggiorna record nel database
 */
async function updateDatabase(id, newImageUrl) {
  console.log(`   💾 Aggiornamento database...`);
  
  const { error } = await supabase
    .from(TABLE_NAME)
    .update({ image_url: newImageUrl })
    .eq('id', id);

  if (error) {
    throw error;
  }

  console.log(`   ✅ Database aggiornato`);
}

/**
 * Verifica e crea bucket se necessario
 */
async function ensureBucketExists() {
  console.log(`🗄️  Verifica bucket '${BUCKET_NAME}'...`);
  
  // Lista bucket esistenti
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    throw listError;
  }

  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);

  if (!bucketExists) {
    console.log(`   📦 Creazione bucket '${BUCKET_NAME}'...`);
    
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    });

    if (createError) {
      throw createError;
    }

    console.log(`   ✅ Bucket creato!`);
  } else {
    console.log(`   ✅ Bucket già esistente`);
  }
}

/**
 * Migra singola pavimentazione
 */
async function migrateFlooring(flooring) {
  const { id, name, image_url } = flooring;
  
  console.log(`\n📦 Migrazione: ${name}`);
  console.log(`   ID: ${id}`);
  console.log(`   URL originale: ${image_url}`);

  // Controlla se è già su Supabase
  if (image_url && image_url.includes('supabase.co/storage')) {
    console.log(`   ⏭️  GIÀ MIGRATA - Skipping`);
    return { success: true, skipped: true };
  }

  if (!image_url || image_url === '/placeholder.svg') {
    console.log(`   ⚠️  NESSUNA URL - Skipping`);
    return { success: true, skipped: true };
  }

  try {
    // 1. Scarica immagine
    const { buffer, contentType } = await downloadImage(image_url);

    // 2. Genera nome file
    const fileName = generateFileName(image_url, name);

    // 3. Upload su Supabase
    const newUrl = await uploadToSupabase(buffer, fileName, contentType);

    // 4. Aggiorna database
    await updateDatabase(id, newUrl);

    console.log(`   ✅ MIGRAZIONE COMPLETATA!`);
    return { success: true, skipped: false, newUrl };

  } catch (error) {
    console.error(`   ❌ ERRORE: ${error.message}`);
    return { success: false, skipped: false, error: error.message };
  }
}

/**
 * Main function
 */
async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('🚀 MIGRAZIONE IMMAGINI PAVIMENTAZIONI');
  console.log('   Da URL esterne → Supabase Storage');
  console.log('═══════════════════════════════════════════════════\n');

  try {
    // 1. Verifica/crea bucket
    await ensureBucketExists();

    // 2. Fetch tutti i tipi di pavimentazione
    console.log(`\n📋 Caricamento pavimentazioni dal database...`);
    const { data: flooringTypes, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at');

    if (error) throw error;

    if (!flooringTypes || flooringTypes.length === 0) {
      console.log('⚠️  Nessuna pavimentazione trovata!');
      return;
    }

    console.log(`✅ Trovate ${flooringTypes.length} pavimentazioni\n`);

    // 3. Migra ciascuna
    const results = {
      total: flooringTypes.length,
      success: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };

    for (const flooring of flooringTypes) {
      const result = await migrateFlooring(flooring);
      
      if (result.skipped) {
        results.skipped++;
      } else if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push({ name: flooring.name, error: result.error });
      }

      // Pausa tra richieste per evitare rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 4. Report finale
    console.log('\n═══════════════════════════════════════════════════');
    console.log('📊 REPORT MIGRAZIONE');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ Totale:     ${results.total}`);
    console.log(`✅ Migrate:    ${results.success}`);
    console.log(`⏭️  Skippate:   ${results.skipped}`);
    console.log(`❌ Fallite:    ${results.failed}`);

    if (results.errors.length > 0) {
      console.log('\n❌ ERRORI:');
      results.errors.forEach(({ name, error }) => {
        console.log(`   - ${name}: ${error}`);
      });
    }

    console.log('\n═══════════════════════════════════════════════════');
    
    if (results.failed > 0) {
      console.log('⚠️  Alcune migrazioni sono fallite. Controlla gli errori sopra.');
      process.exit(1);
    } else {
      console.log('🎉 MIGRAZIONE COMPLETATA CON SUCCESSO!');
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ ERRORE FATALE:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Esegui
main();
