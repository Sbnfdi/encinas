import { createClient } from '@libsql/client';

export const config = {
  runtime: 'nodejs',
};

function getTurso() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be configured');
  }

  return createClient({ url, authToken });
}

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = getTurso();

    // Ensure properties table exists
    await db.execute(`
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

    // GET /api/properties - Fetch all properties
    if (req.method === 'GET') {
      const result = await db.execute('SELECT * FROM properties');
      const rows = result.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        developer: row.developer,
        community: row.community,
        priceAed: Number(row.priceAed),
        bedrooms: Number(row.bedrooms),
        propertyType: row.propertyType,
        status: row.status,
        featuredImage: row.featuredImage,
        galleryImages: row.galleryImages ? JSON.parse(row.galleryImages) : [],
        description: row.description,
        features: row.features ? JSON.parse(row.features) : [],
        specs: row.specs ? JSON.parse(row.specs) : {},
        views: row.views ? JSON.parse(row.views) : [],
        architecturalStyle: row.architecturalStyle,
        completionDate: row.completionDate,
        handoverStatus: row.handoverStatus,
      }));
      return res.status(200).json(rows);
    }

    // POST /api/properties - Create or update a property
    if (req.method === 'POST') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const id = data.id || `prop-${Date.now()}`;

      await db.execute({
        sql: `INSERT INTO properties (
                id, title, developer, community, priceAed, bedrooms, propertyType, status,
                featuredImage, galleryImages, description, features, specs, views,
                architecturalStyle, completionDate, handoverStatus
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(id) DO UPDATE SET
                title = excluded.title,
                developer = excluded.developer,
                community = excluded.community,
                priceAed = excluded.priceAed,
                bedrooms = excluded.bedrooms,
                propertyType = excluded.propertyType,
                status = excluded.status,
                featuredImage = excluded.featuredImage,
                galleryImages = excluded.galleryImages,
                description = excluded.description,
                features = excluded.features,
                specs = excluded.specs,
                views = excluded.views,
                architecturalStyle = excluded.architecturalStyle,
                completionDate = excluded.completionDate,
                handoverStatus = excluded.handoverStatus`,
        args: [
          id,
          data.title || '',
          data.developer || '',
          data.community || '',
          data.priceAed || 0,
          data.bedrooms || 0,
          data.propertyType || '',
          data.status || 'Active',
          data.featuredImage || '',
          JSON.stringify(data.galleryImages || []),
          data.description || '',
          JSON.stringify(data.features || []),
          JSON.stringify(data.specs || {}),
          JSON.stringify(data.views || []),
          data.architecturalStyle || '',
          data.completionDate || '',
          data.handoverStatus || '',
        ],
      });

      return res.status(200).json({ success: true, id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Turso properties API error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
