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

    // Ensure timeline_scenes table exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS timeline_scenes (
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

    // GET /api/scenes - Fetch all timeline scenes
    if (req.method === 'GET') {
      const result = await db.execute('SELECT * FROM timeline_scenes ORDER BY sceneOrder ASC');
      const rows = result.rows.map((row: any) => ({
        id: row.id,
        slug: row.slug || '',
        title: row.title,
        subtitle: row.subtitle || '',
        description: row.description || '',
        sceneType: row.sceneType,
        order: Number(row.sceneOrder),
        image: row.image || '',
        video: row.video || '',
        propertyId: row.propertyId || '',
        communityId: row.communityId || '',
        developerId: row.developerId || '',
        ctaLabel: row.ctaLabel || '',
        ctaUrl: row.ctaUrl || '',
        animationMode: row.animationMode || 'cinematic-zoom',
        durationWeight: Number(row.durationWeight) || 1.0,
        isActive: Boolean(row.isActive),
        accentColor: row.accentColor || '',
        metaBadge: row.metaBadge || '',
        stats: row.stats ? JSON.parse(row.stats) : [],
        createdAt: row.createdAt || '',
        updatedAt: row.updatedAt || '',
      }));
      return res.status(200).json(rows);
    }

    // POST /api/scenes - Insert or update scene
    if (req.method === 'POST') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const id = data.id || `scene-${Date.now()}`;

      await db.execute({
        sql: `INSERT INTO timeline_scenes (
          id, slug, title, subtitle, description, sceneType, sceneOrder,
          image, video, propertyId, communityId, developerId, ctaLabel, ctaUrl,
          animationMode, durationWeight, isActive, accentColor, metaBadge, stats,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          slug = excluded.slug,
          title = excluded.title,
          subtitle = excluded.subtitle,
          description = excluded.description,
          sceneType = excluded.sceneType,
          sceneOrder = excluded.sceneOrder,
          image = excluded.image,
          video = excluded.video,
          propertyId = excluded.propertyId,
          communityId = excluded.communityId,
          developerId = excluded.developerId,
          ctaLabel = excluded.ctaLabel,
          ctaUrl = excluded.ctaUrl,
          animationMode = excluded.animationMode,
          durationWeight = excluded.durationWeight,
          isActive = excluded.isActive,
          accentColor = excluded.accentColor,
          metaBadge = excluded.metaBadge,
          stats = excluded.stats,
          updatedAt = excluded.updatedAt`,
        args: [
          id,
          data.slug || '',
          data.title || '',
          data.subtitle || '',
          data.description || '',
          data.sceneType || 'HERO',
          data.order || 1,
          data.image || '',
          data.video || '',
          data.propertyId || '',
          data.communityId || '',
          data.developerId || '',
          data.ctaLabel || '',
          data.ctaUrl || '',
          data.animationMode || 'cinematic-zoom',
          data.durationWeight || 1.0,
          data.isActive ? 1 : 0,
          data.accentColor || '',
          data.metaBadge || '',
          JSON.stringify(data.stats || []),
          data.createdAt || new Date().toISOString(),
          new Date().toISOString(),
        ],
      });

      return res.status(200).json({ success: true, id });
    }

    // DELETE /api/scenes - Delete scene
    if (req.method === 'DELETE') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const id = req.query?.id || data.id;

      if (!id) {
        return res.status(400).json({ error: 'Scene id is required' });
      }

      await db.execute({
        sql: 'DELETE FROM timeline_scenes WHERE id = ?',
        args: [id],
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Turso timeline_scenes API error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
