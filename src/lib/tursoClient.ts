import type { ConsultationInquiry, Property, TimelineScene } from '../types';

/**
 * Client-side integration with Turso via Vercel Serverless Endpoints
 */

// ==========================================
// 1. INQUIRIES (VIP Mandates)
// ==========================================

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

export async function updateInquiryStatusInTurso(id: string, status: string, notes?: string): Promise<boolean> {
  try {
    const res = await fetch('/api/inquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, notes }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not update inquiry status in Turso API:', err);
    return false;
  }
}

export async function deleteInquiryFromTurso(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/inquiries?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not delete inquiry from Turso API:', err);
    return false;
  }
}

// ==========================================
// 2. PROPERTIES (Real Estate Inventory)
// ==========================================

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

export async function deletePropertyFromTurso(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/properties?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not delete property from Turso API:', err);
    return false;
  }
}

// ==========================================
// 3. TIMELINE SCENES (Story Builder)
// ==========================================

export async function fetchScenesFromTurso(): Promise<TimelineScene[] | null> {
  try {
    const res = await fetch('/api/scenes');
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch scenes from Turso API:', err);
    return null;
  }
}

export async function saveSceneToTurso(scene: TimelineScene): Promise<boolean> {
  try {
    const res = await fetch('/api/scenes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scene),
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not save scene to Turso API:', err);
    return false;
  }
}

export async function deleteSceneFromTurso(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/scenes?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not delete scene from Turso API:', err);
    return false;
  }
}
