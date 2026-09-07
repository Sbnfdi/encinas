import { createClient } from '@libsql/client';
import fs from 'node:fs';
import { INITIAL_PROPERTIES, INITIAL_TIMELINE_SCENES, INITIAL_INQUIRIES } from '../src/data/initialData';

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

const client = createClient({
  url: envVars.TURSO_DATABASE_URL,
  authToken: envVars.TURSO_AUTH_TOKEN,
});

async function main() {
  console.log('Rebuilding CRM schema in Turso...');

  // 1. Properties Table
  await client.execute(`DROP TABLE IF EXISTS properties;`);
  await client.execute(`
    CREATE TABLE properties (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      tagline TEXT,
      developer TEXT NOT NULL,
      community TEXT NOT NULL,
      type TEXT NOT NULL,
      priceAED REAL NOT NULL,
      priceUSD TEXT,
      startingPriceText TEXT,
      bedrooms TEXT,
      builtUpAreaSqFt TEXT,
      completionDate TEXT,
      status TEXT NOT NULL,
      featuredImage TEXT NOT NULL,
      gallery TEXT,
      description TEXT,
      architectureNarrative TEXT,
      amenities TEXT,
      keyFeatures TEXT,
      paymentPlan TEXT,
      isFeaturedInTimeline INTEGER DEFAULT 0
    );
  `);
  console.log('✓ Created properties table');

  // 2. Timeline Scenes Table
  await client.execute(`DROP TABLE IF EXISTS timeline_scenes;`);
  await client.execute(`
    CREATE TABLE timeline_scenes (
      id TEXT PRIMARY KEY,
      slug TEXT,
      title TEXT NOT NULL,
      subtitle TEXT,
      description TEXT,
      sceneType TEXT NOT NULL,
      sceneOrder INTEGER NOT NULL,
      image TEXT,
      video TEXT,
      propertyId TEXT,
      communityId TEXT,
      developerId TEXT,
      ctaLabel TEXT,
      ctaUrl TEXT,
      animationMode TEXT,
      durationWeight REAL,
      isActive INTEGER DEFAULT 1,
      accentColor TEXT,
      metaBadge TEXT,
      stats TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );
  `);
  console.log('✓ Created timeline_scenes table');

  // 3. Inquiries Table
  await client.execute(`DROP TABLE IF EXISTS inquiries;`);
  await client.execute(`
    CREATE TABLE inquiries (
      id TEXT PRIMARY KEY,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      country TEXT,
      investmentBudget TEXT,
      preferredAssetType TEXT,
      preferredCommunity TEXT,
      timeframe TEXT,
      notes TEXT,
      status TEXT DEFAULT 'New',
      createdAt TEXT NOT NULL
    );
  `);
  console.log('✓ Created inquiries table');

  // Seed Properties
  console.log(`Seeding ${INITIAL_PROPERTIES.length} luxury properties...`);
  for (const p of INITIAL_PROPERTIES) {
    await client.execute({
      sql: `INSERT INTO properties (
        id, title, tagline, developer, community, type, priceAED, priceUSD,
        startingPriceText, bedrooms, builtUpAreaSqFt, completionDate, status,
        featuredImage, gallery, description, architectureNarrative, amenities,
        keyFeatures, paymentPlan, isFeaturedInTimeline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        p.id,
        p.title,
        p.tagline || '',
        p.developer,
        p.community,
        p.type,
        p.priceAED,
        p.priceUSD,
        p.startingPriceText,
        p.bedrooms,
        p.builtUpAreaSqFt,
        p.completionDate,
        p.status,
        p.featuredImage,
        JSON.stringify(p.gallery || []),
        p.description,
        p.architectureNarrative,
        JSON.stringify(p.amenities || []),
        JSON.stringify(p.keyFeatures || []),
        JSON.stringify(p.paymentPlan || {}),
        p.isFeaturedInTimeline ? 1 : 0,
      ],
    });
  }

  // Seed Timeline Scenes
  console.log(`Seeding ${INITIAL_TIMELINE_SCENES.length} timeline scenes...`);
  for (const s of INITIAL_TIMELINE_SCENES) {
    await client.execute({
      sql: `INSERT INTO timeline_scenes (
        id, slug, title, subtitle, description, sceneType, sceneOrder,
        image, video, propertyId, communityId, developerId, ctaLabel, ctaUrl,
        animationMode, durationWeight, isActive, accentColor, metaBadge, stats,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        s.id,
        s.slug || '',
        s.title,
        s.subtitle || '',
        s.description || '',
        s.sceneType,
        s.order,
        s.image || '',
        s.video || '',
        s.propertyId || '',
        s.communityId || '',
        s.developerId || '',
        s.ctaLabel || '',
        s.ctaUrl || '',
        s.animationMode || 'cinematic-zoom',
        s.durationWeight || 1.0,
        s.isActive ? 1 : 0,
        s.accentColor || '',
        s.metaBadge || '',
        JSON.stringify(s.stats || []),
        s.createdAt || new Date().toISOString(),
        s.updatedAt || new Date().toISOString(),
      ],
    });
  }

  // Seed initial inquiries if empty
  const inqCheck = await client.execute('SELECT count(*) as c FROM inquiries');
  if (Number(inqCheck.rows[0].c) === 0) {
    console.log(`Seeding ${INITIAL_INQUIRIES.length} initial CRM inquiries...`);
    for (const inq of INITIAL_INQUIRIES) {
      await client.execute({
        sql: `INSERT INTO inquiries (
          id, fullName, email, phone, country, investmentBudget, preferredAssetType,
          preferredCommunity, timeframe, notes, status, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          inq.id,
          inq.fullName,
          inq.email,
          inq.phone,
          inq.country || '',
          inq.investmentBudget || '',
          inq.preferredAssetType || '',
          inq.preferredCommunity || '',
          inq.timeframe || '',
          inq.notes || '',
          inq.status || 'New',
          inq.createdAt,
        ],
      });
    }
  }

  // Summary counts
  const pCount = await client.execute('SELECT count(*) as c FROM properties');
  const sCount = await client.execute('SELECT count(*) as c FROM timeline_scenes');
  const iCount = await client.execute('SELECT count(*) as c FROM inquiries');

  console.log('====================================');
  console.log('✓ TURSO DATABASE FULLY INITIALIZED!');
  console.log(`Properties in DB:     ${pCount.rows[0].c}`);
  console.log(`Timeline scenes in DB: ${sCount.rows[0].c}`);
  console.log(`CRM Inquiries in DB:  ${iCount.rows[0].c}`);
  console.log('====================================');
}

main().catch((err) => {
  console.error('Fatal seeding error:', err);
  process.exit(1);
});
