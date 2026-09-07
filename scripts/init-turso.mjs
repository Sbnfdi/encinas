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

console.log('Connecting to Turso DB:', url);

const client = createClient({
  url,
  authToken,
});

async function main() {
  try {
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
    console.log('✓ inquiries table verified / created');

    // 2. Properties table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS properties (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        developer TEXT NOT NULL,
        community TEXT NOT NULL,
        priceAed REAL NOT NULL,
        bedrooms INTEGER,
        propertyType TEXT,
        status TEXT,
        featuredImage TEXT,
        galleryImages TEXT,
        description TEXT,
        features TEXT,
        specs TEXT,
        views TEXT,
        architecturalStyle TEXT,
        completionDate TEXT,
        handoverStatus TEXT
      );
    `);
    console.log('✓ properties table verified / created');

    // Test a basic query
    const res = await client.execute('SELECT count(*) as count FROM inquiries;');
    console.log('✓ Connection successful! Inquiries count:', res.rows[0].count);

  } catch (err) {
    console.error('Error connecting to Turso:', err);
    process.exit(1);
  }
}

main();
