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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = getTurso();

    // Ensure inquiries table exists
    await db.execute(`
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

    // GET /api/inquiries - Fetch all inquiries for CMS
    if (req.method === 'GET') {
      const result = await db.execute('SELECT * FROM inquiries ORDER BY createdAt DESC');
      const rows = result.rows.map((row: any) => ({
        id: row.id,
        fullName: row.fullName,
        email: row.email,
        phone: row.phone,
        preferredCommunity: row.preferredCommunity,
        capitalAllocation: row.capitalAllocation,
        timeline: row.timeline,
        notes: row.notes,
        status: row.status,
        createdAt: row.createdAt,
      }));
      return res.status(200).json(rows);
    }

    // POST /api/inquiries - Create new VIP consultation lead
    if (req.method === 'POST') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const id = data.id || `inq-${Date.now()}`;
      const createdAt = data.createdAt || new Date().toISOString();
      const status = data.status || 'New';

      await db.execute({
        sql: `INSERT INTO inquiries (id, fullName, email, phone, preferredCommunity, capitalAllocation, timeline, notes, status, createdAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          data.fullName || '',
          data.email || '',
          data.phone || '',
          data.preferredCommunity || '',
          data.capitalAllocation || '',
          data.timeline || '',
          data.notes || '',
          status,
          createdAt,
        ],
      });

      return res.status(201).json({ success: true, id });
    }

    // PATCH /api/inquiries - Update inquiry status in CMS
    if (req.method === 'PATCH') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, status } = data;

      if (!id || !status) {
        return res.status(400).json({ error: 'id and status are required' });
      }

      await db.execute({
        sql: 'UPDATE inquiries SET status = ? WHERE id = ?',
        args: [status, id],
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Turso API error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
