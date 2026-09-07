import { createClient } from '@libsql/client';
import fs from 'node:fs';

const envContent = fs.readFileSync('.env', 'utf-8');
const envVars = Object.fromEntries(
  envContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const url = envVars.TURSO_DATABASE_URL;
const authToken = envVars.TURSO_AUTH_TOKEN;

const client = createClient({ url, authToken });

async function seed() {
  console.log('Connecting to Turso...');

  // 1. Inquiries table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      preferredCommunity TEXT,
      capitalAllocation TEXT,
      timeline TEXT,
      notes TEXT,
      status TEXT DEFAULT 'New',
      createdAt TEXT NOT NULL
    );
  `);
  console.log('✓ inquiries table verified');

  // 2. Properties table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      tagline TEXT,
      developer TEXT NOT NULL,
      community TEXT NOT NULL,
      type TEXT,
      priceAED REAL NOT NULL,
      priceUSD TEXT,
      startingPriceText TEXT,
      bedrooms TEXT,
      builtUpAreaSqFt TEXT,
      completionDate TEXT,
      status TEXT,
      featuredImage TEXT,
      gallery TEXT,
      description TEXT,
      architectureNarrative TEXT,
      investmentThesis TEXT,
      amenities TEXT,
      paymentPlan TEXT,
      coordinates TEXT
    );
  `);
  console.log('✓ properties table verified');

  // 3. Timeline Scenes table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS timeline_scenes (
      id TEXT PRIMARY KEY,
      slug TEXT,
      title TEXT NOT NULL,
      subtitle TEXT,
      description TEXT,
      sceneType TEXT NOT NULL,
      propertyId TEXT,
      sceneOrder INTEGER NOT NULL,
      image TEXT,
      ctaLabel TEXT,
      ctaUrl TEXT,
      animationMode TEXT,
      durationWeight REAL,
      isActive INTEGER DEFAULT 1,
      metaBadge TEXT,
      stats TEXT
    );
  `);
  console.log('✓ timeline_scenes table verified');


  // Check existing properties count
  const propCount = await client.execute('SELECT count(*) as c FROM properties');
  console.log('Current properties in Turso:', propCount.rows[0].c);

  // Check existing scenes count
  const sceneCount = await client.execute('SELECT count(*) as c FROM timeline_scenes');
  console.log('Current scenes in Turso:', sceneCount.rows[0].c);

  console.log('✓ Full CRM database structure ready in Turso!');
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
