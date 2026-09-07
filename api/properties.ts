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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = getTurso();

    // GET /api/properties - Fetch all properties
    if (req.method === 'GET') {
      const result = await db.execute('SELECT * FROM properties');
      const rows = result.rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        tagline: row.tagline || '',
        developer: row.developer,
        community: row.community,
        type: row.type,
        priceAED: Number(row.priceAED),
        priceUSD: row.priceUSD || '',
        startingPriceText: row.startingPriceText || '',
        bedrooms: row.bedrooms || '',
        builtUpAreaSqFt: row.builtUpAreaSqFt || '',
        completionDate: row.completionDate || '',
        status: row.status,
        featuredImage: row.featuredImage,
        gallery: row.gallery ? JSON.parse(row.gallery) : [],
        description: row.description || '',
        architectureNarrative: row.architectureNarrative || '',
        amenities: row.amenities ? JSON.parse(row.amenities) : [],
        keyFeatures: row.keyFeatures ? JSON.parse(row.keyFeatures) : [],
        paymentPlan: row.paymentPlan ? JSON.parse(row.paymentPlan) : {},
        isFeaturedInTimeline: Boolean(row.isFeaturedInTimeline),
      }));
      return res.status(200).json(rows);
    }

    // POST /api/properties - Create or update a property
    if (req.method === 'POST') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const id = data.id || `prop-${Date.now()}`;

      await db.execute({
        sql: `INSERT INTO properties (
          id, title, tagline, developer, community, type, priceAED, priceUSD,
          startingPriceText, bedrooms, builtUpAreaSqFt, completionDate, status,
          featuredImage, gallery, description, architectureNarrative, amenities,
          keyFeatures, paymentPlan, isFeaturedInTimeline
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          title = excluded.title,
          tagline = excluded.tagline,
          developer = excluded.developer,
          community = excluded.community,
          type = excluded.type,
          priceAED = excluded.priceAED,
          priceUSD = excluded.priceUSD,
          startingPriceText = excluded.startingPriceText,
          bedrooms = excluded.bedrooms,
          builtUpAreaSqFt = excluded.builtUpAreaSqFt,
          completionDate = excluded.completionDate,
          status = excluded.status,
          featuredImage = excluded.featuredImage,
          gallery = excluded.gallery,
          description = excluded.description,
          architectureNarrative = excluded.architectureNarrative,
          amenities = excluded.amenities,
          keyFeatures = excluded.keyFeatures,
          paymentPlan = excluded.paymentPlan,
          isFeaturedInTimeline = excluded.isFeaturedInTimeline`,
        args: [
          id,
          data.title || '',
          data.tagline || '',
          data.developer || '',
          data.community || '',
          data.type || 'Waterfront Villa',
          Number(data.priceAED) || 0,
          data.priceUSD || '',
          data.startingPriceText || '',
          data.bedrooms || '',
          data.builtUpAreaSqFt || '',
          data.completionDate || '',
          data.status || 'Off-Plan Exclusive',
          data.featuredImage || '',
          JSON.stringify(data.gallery || []),
          data.description || '',
          data.architectureNarrative || '',
          JSON.stringify(data.amenities || []),
          JSON.stringify(data.keyFeatures || []),
          JSON.stringify(data.paymentPlan || {}),
          data.isFeaturedInTimeline ? 1 : 0,
        ],
      });

      return res.status(200).json({ success: true, id });
    }

    // DELETE /api/properties - Delete property
    if (req.method === 'DELETE') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const id = req.query?.id || data.id;

      if (!id) {
        return res.status(400).json({ error: 'Property id is required' });
      }

      await db.execute({
        sql: 'DELETE FROM properties WHERE id = ?',
        args: [id],
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Turso properties API error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
