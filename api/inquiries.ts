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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = getTurso();

    // GET /api/inquiries - Fetch all inquiries for CMS
    if (req.method === 'GET') {
      const result = await db.execute('SELECT * FROM inquiries ORDER BY createdAt DESC');
      const rows = result.rows.map((row: any) => ({
        id: row.id,
        fullName: row.fullName,
        email: row.email,
        phone: row.phone,
        country: row.country || '',
        investmentBudget: row.investmentBudget || '',
        preferredAssetType: row.preferredAssetType || '',
        preferredCommunity: row.preferredCommunity || '',
        timeframe: row.timeframe || '',
        notes: row.notes || '',
        status: row.status || 'New',
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
        sql: `INSERT INTO inquiries (
          id, fullName, email, phone, country, investmentBudget,
          preferredAssetType, preferredCommunity, timeframe, notes, status, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          fullName = excluded.fullName,
          email = excluded.email,
          phone = excluded.phone,
          country = excluded.country,
          investmentBudget = excluded.investmentBudget,
          preferredAssetType = excluded.preferredAssetType,
          preferredCommunity = excluded.preferredCommunity,
          timeframe = excluded.timeframe,
          notes = excluded.notes,
          status = excluded.status`,
        args: [
          id,
          data.fullName || '',
          data.email || '',
          data.phone || '',
          data.country || '',
          data.investmentBudget || '',
          data.preferredAssetType || '',
          data.preferredCommunity || '',
          data.timeframe || '',
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
      const { id, status, notes } = data;

      if (!id) {
        return res.status(400).json({ error: 'id is required' });
      }

      if (status && notes !== undefined) {
        await db.execute({
          sql: 'UPDATE inquiries SET status = ?, notes = ? WHERE id = ?',
          args: [status, notes, id],
        });
      } else if (status) {
        await db.execute({
          sql: 'UPDATE inquiries SET status = ? WHERE id = ?',
          args: [status, id],
        });
      } else if (notes !== undefined) {
        await db.execute({
          sql: 'UPDATE inquiries SET notes = ? WHERE id = ?',
          args: [notes, id],
        });
      }

      return res.status(200).json({ success: true });
    }

    // DELETE /api/inquiries - Delete inquiry in CMS
    if (req.method === 'DELETE') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const id = req.query?.id || data.id;

      if (!id) {
        return res.status(400).json({ error: 'Inquiry id is required' });
      }

      await db.execute({
        sql: 'DELETE FROM inquiries WHERE id = ?',
        args: [id],
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Turso inquiries API error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
