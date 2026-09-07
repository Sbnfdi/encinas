import type { ConsultationInquiry, Property } from '../types';

/**
 * Client-side integration with Turso via Vercel Serverless Endpoints
 */

// 1. Submit consultation inquiry
export async function submitInquiryToTurso(
  inquiry: Omit<ConsultationInquiry, 'id' | 'createdAt' | 'status'> & { id?: string; createdAt?: string; status?: string }
): Promise<boolean> {
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry),
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not sync inquiry to Turso API (using local persistence):', err);
    return false;
  }
}

// 2. Fetch inquiries for CMS Master Desk
export async function fetchInquiriesFromTurso(): Promise<ConsultationInquiry[] | null> {
  try {
    const res = await fetch('/api/inquiries');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Could not fetch inquiries from Turso API:', err);
    return null;
  }
}

// 3. Update inquiry status
export async function updateInquiryStatusInTurso(id: string, status: string): Promise<boolean> {
  try {
    const res = await fetch('/api/inquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not update inquiry status in Turso API:', err);
    return false;
  }
}

// 4. Fetch properties
export async function fetchPropertiesFromTurso(): Promise<Property[] | null> {
  try {
    const res = await fetch('/api/properties');
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch properties from Turso API:', err);
    return null;
  }
}

// 5. Save/Update property in Turso
export async function savePropertyToTurso(property: Property): Promise<boolean> {
  try {
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(property),
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not save property to Turso API:', err);
    return false;
  }
}
