import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import type { TimelineScene, Property, Community, Developer, ConsultationInquiry, SceneType } from '../../types';
import {
  Check,
  Edit,
  Eye,
  EyeOff,
  Film,
  Layers,
  LogOut,
  Mail,
  MoveDown,
  MoveUp,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import { BrandLogo } from '../brand/BrandLogo';
import {
  savePropertyToTurso,
  deletePropertyFromTurso,
  saveSceneToTurso,
  deleteSceneFromTurso,
  updateInquiryStatusInTurso,
} from '../../lib/tursoClient';

interface AdminPortalProps {
  timelineScenes: TimelineScene[];
  properties: Property[];
  communities: Community[];
  developers: Developer[];
  inquiries: ConsultationInquiry[];
  onUpdateScenes: (scenes: TimelineScene[]) => void;
  onUpdateProperties: (properties: Property[]) => void;
  onUpdateInquiries: (inquiries: ConsultationInquiry[]) => void;
  onCloseAdmin: () => void;
  onLogout: () => void;
  onPreviewScene: (sceneIndex: number) => void;
}

export const AdminPortal: FC<AdminPortalProps> = ({
  timelineScenes,
  properties,
  communities,
  developers,
  inquiries,
  onUpdateScenes,
  onUpdateProperties,
  onUpdateInquiries,
  onCloseAdmin,
  onLogout,
  onPreviewScene,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'inventory' | 'leads'>('timeline');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCloseAdmin]);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Timeline Editing state
  const [editingScene, setEditingScene] = useState<TimelineScene | null>(null);
  const [isCreatingScene, setIsCreatingScene] = useState(false);

  // Property Editing state
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isCreatingProperty, setIsCreatingProperty] = useState(false);
  const [propertySearch, setPropertySearch] = useState('');

  // Filter state for inquiries
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('ALL');

  // Reorder scene helper
  const moveScene = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= timelineScenes.length) return;

    const updated = [...timelineScenes];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    const reordered = updated.map((s, idx) => ({ ...s, order: idx + 1 }));
    onUpdateScenes(reordered);
    showToast(`Scene moved ${direction}`);
  };

  const toggleSceneActive = (id: string) => {
    const target = timelineScenes.find((s) => s.id === id);
    if (target) {
      const updatedScene = { ...target, isActive: !target.isActive };
      saveSceneToTurso(updatedScene).catch((err) => console.warn('Turso scene sync error:', err));
    }
    const updated = timelineScenes.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    onUpdateScenes(updated);
    showToast('Scene visibility toggled');
  };

  const deleteScene = (id: string) => {
    if (window.confirm('Are you sure you want to remove this scene from the cinematic timeline?')) {
      deleteSceneFromTurso(id).catch((err) => console.warn('Turso scene delete error:', err));
      const updated = timelineScenes.filter((s) => s.id !== id).map((s, idx) => ({ ...s, order: idx + 1 }));
      onUpdateScenes(updated);
      showToast('Scene removed from timeline');
    }
  };

  const saveScene = (e: FormEvent) => {
    e.preventDefault();
    if (!editingScene) return;

    let updated: TimelineScene[];
    let targetScene: TimelineScene;
    if (isCreatingScene) {
      targetScene = {
        ...editingScene,
        id: `scene-${Date.now()}`,
        order: timelineScenes.length + 1,
        isActive: true,
      };
      updated = [...timelineScenes, targetScene];
      showToast('New timeline scene created');
    } else {
      targetScene = editingScene;
      updated = timelineScenes.map((s) => (s.id === editingScene.id ? editingScene : s));
      showToast('Timeline scene updated');
    }

    // Sync to Turso
    saveSceneToTurso(targetScene).catch((err) => console.warn('Turso save scene error:', err));

    onUpdateScenes(updated);
    setEditingScene(null);
    setIsCreatingScene(false);
  };

  // Property CRUD Handlers
  const deleteProperty = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this property allocation?')) {
      deletePropertyFromTurso(id).catch((err) => console.warn('Turso property delete error:', err));
      const updated = properties.filter((p) => p.id !== id);
      onUpdateProperties(updated);
      showToast('Property deleted from portfolio');
    }
  };

  const saveProperty = (e: FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    let updated: Property[];
    let targetProp: Property;
    if (isCreatingProperty) {
      targetProp = {
        ...editingProperty,
        id: `prop-${Date.now()}`,
      };
      updated = [targetProp, ...properties];
      showToast('New ultra-luxury property added');
    } else {
      targetProp = editingProperty;
      updated = properties.map((p) => (p.id === editingProperty.id ? editingProperty : p));
      showToast('Property details updated');
    }

    // Sync to Turso
    savePropertyToTurso(targetProp).catch((err) => console.warn('Turso save property error:', err));

    onUpdateProperties(updated);
    setEditingProperty(null);
    setIsCreatingProperty(false);
  };

  const handleInquiryStatusChange = (id: string, newStatus: ConsultationInquiry['status']) => {
    updateInquiryStatusInTurso(id, newStatus).catch((err) => console.warn('Turso status update error:', err));
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq));
    onUpdateInquiries(updated);
    showToast(`Inquiry status updated to ${newStatus}`);
  };

  const filteredProperties = properties.filter((p) => {
    if (!propertySearch) return true;
    const q = propertySearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.developer.toLowerCase().includes(q) ||
      p.community.toLowerCase().includes(q)
    );
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Encinas Operational CMS Master Desk"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: '#070707',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '4.5rem',
            right: '2rem',
            zIndex: 300,
            background: 'rgba(14, 13, 12, 0.95)',
            border: '1px solid var(--gold-primary)',
            color: 'var(--gold-pale)',
            padding: '0.65rem 1.25rem',
            borderRadius: '2px',
            fontSize: '0.8rem',
            letterSpacing: '0.08em',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 15px rgba(197, 168, 128, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <Check size={14} color="var(--gold-primary)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Luxury Admin Top Navigation Header */}
      <header
        style={{
          height: '64px',
          backgroundColor: '#0C0C0C',
          borderBottom: '1px solid var(--border-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <BrandLogo variant="icon" color="gold" size={24} />
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 800,
                letterSpacing: '0.16em',
                color: '#FFF',
                fontSize: '1.05rem',
              }}
            >
              ENCINAS
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                backgroundColor: 'rgba(197, 168, 128, 0.12)',
                border: '1px solid var(--border-gold)',
                color: 'var(--gold-light)',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontWeight: 600,
                letterSpacing: '0.14em',
              }}
            >
              CMS MASTER DESK
            </span>
          </div>

          <div style={{ height: '22px', width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />

          {/* Navigation Tabs */}
          <nav role="tablist" aria-label="CMS Management Sections" style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              role="tab"
              aria-selected={activeTab === 'timeline'}
              onClick={() => setActiveTab('timeline')}
              style={{
                background: activeTab === 'timeline' ? 'rgba(197, 168, 128, 0.15)' : 'transparent',
                color: activeTab === 'timeline' ? 'var(--gold-light)' : 'var(--text-secondary)',
                border: activeTab === 'timeline' ? '1px solid var(--border-gold)' : '1px solid transparent',
                padding: '0.5rem 1rem',
                borderRadius: '2px',
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              <Film size={14} color="var(--gold-primary)" aria-hidden="true" />
              <span>TIMELINE BUILDER</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  color: 'var(--text-primary)',
                }}
              >
                {timelineScenes.length}
              </span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'inventory'}
              onClick={() => setActiveTab('inventory')}
              style={{
                background: activeTab === 'inventory' ? 'rgba(197, 168, 128, 0.15)' : 'transparent',
                color: activeTab === 'inventory' ? 'var(--gold-light)' : 'var(--text-secondary)',
                border: activeTab === 'inventory' ? '1px solid var(--border-gold)' : '1px solid transparent',
                padding: '0.5rem 1rem',
                borderRadius: '2px',
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              <Layers size={14} color="var(--gold-primary)" aria-hidden="true" />
              <span>PROPERTY INVENTORY</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  color: 'var(--text-primary)',
                }}
              >
                {properties.length}
              </span>
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'leads'}
              onClick={() => setActiveTab('leads')}
              style={{
                background: activeTab === 'leads' ? 'rgba(197, 168, 128, 0.15)' : 'transparent',
                color: activeTab === 'leads' ? 'var(--gold-light)' : 'var(--text-secondary)',
                border: activeTab === 'leads' ? '1px solid var(--border-gold)' : '1px solid transparent',
                padding: '0.5rem 1rem',
                borderRadius: '2px',
                fontSize: '0.78rem',
                letterSpacing: '0.1em',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              <Mail size={14} color="var(--gold-primary)" aria-hidden="true" />
              <span>VIP MANDATES</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  backgroundColor: inquiries.filter((i) => i.status === 'New').length > 0 ? '#C5A880' : 'rgba(255,255,255,0.08)',
                  color: inquiries.filter((i) => i.status === 'New').length > 0 ? '#000' : 'var(--text-primary)',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '10px',
                }}
              >
                {inquiries.filter((i) => i.status === 'New').length}
              </span>
            </button>
          </nav>
        </div>

        {/* Right Header Actions: Return to Website + Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={onCloseAdmin}
            aria-label="Close CMS and view live portal"
            className="btn-gold"
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.74rem',
              letterSpacing: '0.14em',
            }}
          >
            <Eye size={14} aria-hidden="true" />
            <span>VIEW LIVE PORTAL</span>
          </button>

          <button
            onClick={onLogout}
            aria-label="Sign out of CMS session"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(218, 54, 51, 0.1)',
              border: '1px solid rgba(218, 54, 51, 0.3)',
              color: '#FF7B72',
              padding: '0.45rem 0.9rem',
              borderRadius: '2px',
              fontSize: '0.74rem',
              letterSpacing: '0.1em',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            title="Sign out of CMS session"
          >
            <LogOut size={13} aria-hidden="true" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Viewport */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 3vw', backgroundColor: '#070707' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          {/* ================================================================ */}
          {/* TAB 1: TIMELINE STORY BUILDER                                   */}
          {/* ================================================================ */}
          {activeTab === 'timeline' && (
            <div>
              {/* Header Controls */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  marginBottom: '2rem',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  paddingBottom: '1.25rem',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.68rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'var(--gold-primary)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    SCROLL SEQUENCE & CINEMATIC CAMERA REEL
                  </div>
                  <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', fontWeight: 700, color: '#FFF' }}>
                    Timeline Story Architecture
                  </h1>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Reorder scenes, adjust duration weights, and tune camera animation modes. Public narrative reflects updates in real-time.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingScene({
                      id: '',
                      slug: 'new-scene',
                      title: 'NEW TIMELINE SCENE',
                      subtitle: 'SUBTITLE PROSPECTUS',
                      description: 'Architectural narrative description.',
                      sceneType: 'PROPERTY',
                      order: timelineScenes.length + 1,
                      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070',
                      ctaLabel: 'EXPLORE RESIDENCES',
                      ctaUrl: '#inquiry',
                      animationMode: 'cinematic-zoom',
                      durationWeight: 1.0,
                      isActive: true,
                    });
                    setIsCreatingScene(true);
                  }}
                  className="btn-gold"
                  style={{ padding: '0.55rem 1.15rem', fontSize: '0.74rem' }}
                >
                  <Plus size={15} />
                  <span>ADD TIMELINE SCENE</span>
                </button>
              </div>

              {/* Luxury Timeline Scenes Table */}
              <div
                className="glass-panel"
                style={{
                  borderRadius: '3px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-gold)',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(14, 13, 12, 0.95)', color: 'var(--text-dim)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th style={{ padding: '0.9rem 1.25rem', width: '80px', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Order</th>
                      <th style={{ padding: '0.9rem 1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Scene Entity</th>
                      <th style={{ padding: '0.9rem 1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Type</th>
                      <th style={{ padding: '0.9rem 1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Animation Mode</th>
                      <th style={{ padding: '0.9rem 1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Weight</th>
                      <th style={{ padding: '0.9rem 1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Status</th>
                      <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timelineScenes.map((scene, idx) => (
                      <tr
                        key={scene.id}
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          backgroundColor: scene.isActive ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                        }}
                      >
                        {/* Order & Reorder Arrows */}
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--gold-light)', width: '24px' }}>
                              {scene.order.toString().padStart(2, '0')}
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <button
                                disabled={idx === 0}
                                onClick={() => moveScene(idx, 'up')}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: idx === 0 ? 'rgba(255,255,255,0.1)' : 'var(--gold-primary)',
                                  cursor: idx === 0 ? 'default' : 'pointer',
                                  padding: 0,
                                }}
                                title="Move scene up"
                              >
                                <MoveUp size={12} />
                              </button>
                              <button
                                disabled={idx === timelineScenes.length - 1}
                                onClick={() => moveScene(idx, 'down')}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: idx === timelineScenes.length - 1 ? 'rgba(255,255,255,0.1)' : 'var(--gold-primary)',
                                  cursor: idx === timelineScenes.length - 1 ? 'default' : 'pointer',
                                  padding: 0,
                                }}
                                title="Move scene down"
                              >
                                <MoveDown size={12} />
                              </button>
                            </div>
                          </div>
                        </td>

                        {/* Scene Name & Subtitle */}
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img
                              src={scene.image}
                              alt=""
                              style={{ width: '56px', height: '38px', objectFit: 'cover', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                            <div>
                              <div style={{ fontWeight: 600, color: '#FFF' }}>{scene.title}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>{scene.subtitle}</div>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span
                            style={{
                              padding: '3px 9px',
                              borderRadius: '2px',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              letterSpacing: '0.08em',
                              backgroundColor: 'rgba(197, 168, 128, 0.1)',
                              color: 'var(--gold-light)',
                              border: '1px solid var(--border-gold)',
                            }}
                          >
                            {scene.sceneType}
                          </span>
                        </td>

                        {/* Animation Mode */}
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.76rem' }}>
                          {scene.animationMode}
                        </td>

                        {/* Duration Weight */}
                        <td style={{ padding: '1rem 1.25rem', color: 'var(--text-dim)' }}>
                          {scene.durationWeight.toFixed(1)}x
                        </td>

                        {/* Status */}
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <button
                            onClick={() => toggleSceneActive(scene.id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              background: scene.isActive ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 81, 73, 0.1)',
                              color: scene.isActive ? '#4ADE80' : '#F85149',
                              border: `1px solid ${scene.isActive ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 81, 73, 0.3)'}`,
                              padding: '3px 9px',
                              borderRadius: '9999px',
                              fontSize: '0.7rem',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            {scene.isActive ? <Eye size={11} /> : <EyeOff size={11} />}
                            <span>{scene.isActive ? 'Active' : 'Hidden'}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => onPreviewScene(idx)}
                              className="btn-secondary"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem' }}
                              title="Preview scene in continuous journey"
                            >
                              <Eye size={12} />
                              <span>Preview</span>
                            </button>

                            <button
                              onClick={() => {
                                setEditingScene({ ...scene });
                                setIsCreatingScene(false);
                              }}
                              className="btn-secondary"
                              style={{ padding: '0.35rem 0.65rem' }}
                              title="Edit scene parameters"
                            >
                              <Edit size={12} />
                            </button>

                            <button
                              onClick={() => deleteScene(scene.id)}
                              style={{
                                background: 'transparent',
                                border: '1px solid rgba(248, 81, 73, 0.25)',
                                color: '#F85149',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '2px',
                                cursor: 'pointer',
                              }}
                              title="Delete scene"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 2: INVENTORY & PROPERTIES MANAGEMENT (COMPLETE CRUD)         */}
          {/* ================================================================ */}
          {activeTab === 'inventory' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  marginBottom: '2rem',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  paddingBottom: '1.25rem',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.68rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'var(--gold-primary)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    SOVEREIGN ASSET DIRECTORY & ALLOCATIONS
                  </div>
                  <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', fontWeight: 700, color: '#FFF' }}>
                    Ultra-Prime Property Inventory
                  </h1>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Manage off-plan pricing, floorplans, handover milestones, and high-floor penthouse inventory.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Search Bar */}
                  <div style={{ position: 'relative', width: '260px' }}>
                    <input
                      type="text"
                      placeholder="Search title, developer, community..."
                      value={propertySearch}
                      onChange={(e) => setPropertySearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.9rem 0.55rem 2.2rem',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border-gold)',
                        borderRadius: '2px',
                        color: '#FFF',
                        fontSize: '0.8rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <Search size={13} color="var(--gold-primary)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>

                  <button
                    onClick={() => {
                      setEditingProperty({
                        id: '',
                        title: 'NEW LUXURY RESIDENCE',
                        tagline: 'COMMANDING WATERFRONT SANCTUARY',
                        developer: developers[0]?.name || 'DAMAC Properties',
                        community: communities[0]?.name || 'Palm Jumeirah',
                        type: 'Waterfront Villa',
                        priceAED: 12500000,
                        priceUSD: '$3,400,000',
                        startingPriceText: 'AED 12.5M ($3.4M)',
                        bedrooms: '4 - 6 Bedroom Mansions',
                        builtUpAreaSqFt: '7,800 - 14,500 Sq.Ft.',
                        completionDate: 'Q4 2028',
                        status: 'Off-Plan Exclusive',
                        featuredImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071',
                        gallery: [
                          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071',
                          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070',
                        ],
                        description: 'Architectural masterpiece crafted with travertine marble and floor-to-ceiling panoramic glass.',
                        architectureNarrative: 'Curated by world-renowned international architects to maximize panoramic coastal views.',
                        amenities: ['Private Beach Access', 'Infinity Pool', 'Private Yacht Slipway', 'Smart Home System'],
                        keyFeatures: ['Direct Lagoon Frontage', 'Private Elevator', 'Double Height Ceilings'],
                        paymentPlan: {
                          downPayment: '20% On Booking',
                          duringConstruction: '50% Linked to Construction',
                          onHandover: '30% Upon Key Handover',
                        },
                      });
                      setIsCreatingProperty(true);
                    }}
                    className="btn-gold"
                    style={{ padding: '0.55rem 1.15rem', fontSize: '0.74rem' }}
                  >
                    <Plus size={15} />
                    <span>ADD PROPERTY ALLOCATION</span>
                  </button>
                </div>
              </div>

              {/* Properties Table */}
              <div
                className="glass-panel"
                style={{
                  borderRadius: '3px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-gold)',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(14, 13, 12, 0.95)', color: 'var(--text-dim)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th style={{ padding: '0.9rem 1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Property</th>
                      <th style={{ padding: '0.9rem 1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Developer & Enclave</th>
                      <th style={{ padding: '0.9rem 1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Specs</th>
                      <th style={{ padding: '0.9rem 1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Price (AED)</th>
                      <th style={{ padding: '0.9rem 1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Handover</th>
                      <th style={{ padding: '0.9rem 1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Status</th>
                      <th style={{ padding: '0.9rem 1.25rem', textAlign: 'right', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProperties.map((prop) => (
                      <tr key={prop.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img
                              src={prop.featuredImage}
                              alt=""
                              style={{ width: '56px', height: '38px', objectFit: 'cover', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.1)' }}
                            />
                            <div>
                              <div style={{ fontWeight: 600, color: '#FFF' }}>{prop.title}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>{prop.type}</div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ color: 'var(--gold-light)', fontWeight: 500 }}>{prop.developer}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{prop.community}</div>
                        </td>

                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ color: 'var(--text-primary)' }}>{prop.bedrooms}</div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>{prop.builtUpAreaSqFt}</div>
                        </td>

                        <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--gold-pale)', fontFamily: 'var(--font-serif)' }}>
                          {prop.startingPriceText}
                        </td>

                        <td style={{ padding: '1rem 1.25rem', color: 'var(--text-dim)' }}>
                          {prop.completionDate}
                        </td>

                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '9999px',
                              fontSize: '0.7rem',
                              backgroundColor: 'rgba(197, 168, 128, 0.1)',
                              color: 'var(--gold-light)',
                              border: '1px solid var(--border-gold)',
                            }}
                          >
                            {prop.status}
                          </span>
                        </td>

                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => {
                                setEditingProperty({ ...prop });
                                setIsCreatingProperty(false);
                              }}
                              className="btn-secondary"
                              style={{ padding: '0.35rem 0.65rem' }}
                              title="Edit property parameters"
                            >
                              <Edit size={12} />
                            </button>

                            <button
                              onClick={() => deleteProperty(prop.id)}
                              style={{
                                background: 'transparent',
                                border: '1px solid rgba(248, 81, 73, 0.25)',
                                color: '#F85149',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '2px',
                                cursor: 'pointer',
                              }}
                              title="Delete property allocation"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 3: VIP INQUIRIES & LEADS PIPELINE                           */}
          {/* ================================================================ */}
          {activeTab === 'leads' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  marginBottom: '2rem',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  paddingBottom: '1.25rem',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.68rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'var(--gold-primary)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    SOVEREIGN WEALTH MANDATES
                  </div>
                  <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', fontWeight: 700, color: '#FFF' }}>
                    Private Consultations & Inbound Mandates
                  </h1>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Client inquiries protected under bilateral non-disclosure agreements. Update pipeline status in real-time.
                  </p>
                </div>

                <select
                  value={inquiryStatusFilter}
                  onChange={(e) => setInquiryStatusFilter(e.target.value)}
                  style={{
                    backgroundColor: '#141414',
                    border: '1px solid var(--border-gold)',
                    color: '#FFF',
                    padding: '0.55rem 1rem',
                    borderRadius: '2px',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                >
                  <option value="ALL">All Pipeline Stages</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="VIP Portfolio Sent">VIP Portfolio Sent</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Inquiries Table */}
              <div
                className="glass-panel"
                style={{
                  borderRadius: '3px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-gold)',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(14, 13, 12, 0.95)', color: 'var(--text-dim)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <th style={{ padding: '0.9rem 1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Client Name</th>
                      <th style={{ padding: '0.9rem 1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Contact Details</th>
                      <th style={{ padding: '0.9rem 1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Investment Budget</th>
                      <th style={{ padding: '0.9rem 1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Target Asset / Enclave</th>
                      <th style={{ padding: '0.9rem 1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Timeframe</th>
                      <th style={{ padding: '0.9rem 1.25rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>Pipeline Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries
                      .filter((inq) => inquiryStatusFilter === 'ALL' || inq.status === inquiryStatusFilter)
                      .map((inq) => (
                        <tr key={inq.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ fontWeight: 600, color: '#FFF' }}>{inq.fullName}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--gold-primary)', marginTop: '2px' }}>{inq.country}</div>
                          </td>

                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ color: 'var(--text-primary)' }}>{inq.email}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>{inq.phone}</div>
                          </td>

                          <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#4ADE80' }}>
                            {inq.investmentBudget}
                          </td>

                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ color: '#FFF' }}>{inq.preferredAssetType}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--gold-light)', marginTop: '2px' }}>{inq.preferredCommunity}</div>
                          </td>

                          <td style={{ padding: '1rem 1.25rem', color: 'var(--text-dim)' }}>
                            {inq.timeframe}
                          </td>

                          <td style={{ padding: '1rem 1.25rem' }}>
                            <select
                              value={inq.status}
                              onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value as any)}
                              style={{
                                backgroundColor:
                                  inq.status === 'New' ? 'rgba(218, 54, 51, 0.2)' :
                                  inq.status === 'VIP Portfolio Sent' ? 'rgba(197, 168, 128, 0.2)' :
                                  inq.status === 'Scheduled' ? 'rgba(74, 222, 128, 0.2)' : '#141414',
                                color:
                                  inq.status === 'New' ? '#FF7B72' :
                                  inq.status === 'VIP Portfolio Sent' ? 'var(--gold-light)' :
                                  inq.status === 'Scheduled' ? '#4ADE80' : 'var(--text-secondary)',
                                border: '1px solid var(--border-gold)',
                                borderRadius: '2px',
                                padding: '0.4rem 0.75rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                outline: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="VIP Portfolio Sent">VIP Portfolio Sent</option>
                              <option value="Scheduled">Scheduled</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ================================================================ */}
      {/* MODAL: EDIT / CREATE TIMELINE SCENE                             */}
      {/* ================================================================ */}
      {editingScene && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 250,
            backgroundColor: 'rgba(5, 5, 5, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            className="glass-panel-gold"
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '88vh',
              overflowY: 'auto',
              padding: '2rem',
              borderRadius: '4px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.68rem', letterSpacing: '0.18em', color: 'var(--gold-primary)', textTransform: 'uppercase' }}>
                  {isCreatingScene ? 'Add New Scene' : 'Modify Parameters'}
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: '#FFF' }}>
                  {isCreatingScene ? 'Create Timeline Sequence' : editingScene.title}
                </h2>
              </div>
              <button
                onClick={() => setEditingScene(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveScene} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
                  Scene Title
                </label>
                <input
                  type="text"
                  required
                  value={editingScene.title}
                  onChange={(e) => setEditingScene({ ...editingScene, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    backgroundColor: '#111',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '2px',
                    color: '#FFF',
                    fontSize: '0.86rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
                  Subtitle / Prospectus
                </label>
                <input
                  type="text"
                  value={editingScene.subtitle}
                  onChange={(e) => setEditingScene({ ...editingScene, subtitle: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    backgroundColor: '#111',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '2px',
                    color: '#FFF',
                    fontSize: '0.86rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
                    Scene Type
                  </label>
                  <select
                    value={editingScene.sceneType}
                    onChange={(e) => setEditingScene({ ...editingScene, sceneType: e.target.value as SceneType })}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      backgroundColor: '#111',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '2px',
                      color: '#FFF',
                      fontSize: '0.86rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="HERO">HERO</option>
                    <option value="PROPERTY">PROPERTY</option>
                    <option value="COMMUNITY">COMMUNITY</option>
                    <option value="DEVELOPER">DEVELOPER</option>
                    <option value="SERVICES">SERVICES</option>
                    <option value="INVESTMENT">INVESTMENT</option>
                    <option value="BRAND">BRAND</option>
                    <option value="CTA">CTA</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
                    Animation Mode
                  </label>
                  <select
                    value={editingScene.animationMode}
                    onChange={(e) => setEditingScene({ ...editingScene, animationMode: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      backgroundColor: '#111',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '2px',
                      color: '#FFF',
                      fontSize: '0.86rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="cinematic-zoom">cinematic-zoom</option>
                    <option value="horizontal-glide">horizontal-glide</option>
                    <option value="depth-reveal">depth-reveal</option>
                    <option value="ambient-drift">ambient-drift</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
                  Backdrop Image URL
                </label>
                <input
                  type="text"
                  required
                  value={editingScene.image}
                  onChange={(e) => setEditingScene({ ...editingScene, image: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    backgroundColor: '#111',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '2px',
                    color: '#FFF',
                    fontSize: '0.86rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
                  Description Narrative
                </label>
                <textarea
                  rows={3}
                  value={editingScene.description}
                  onChange={(e) => setEditingScene({ ...editingScene, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    backgroundColor: '#111',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '2px',
                    color: '#FFF',
                    fontSize: '0.86rem',
                    resize: 'none',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingScene(null)}
                  className="btn-secondary"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-gold"
                  style={{ padding: '0.65rem 1.5rem', fontSize: '0.75rem' }}
                >
                  Save Timeline Scene
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* MODAL: EDIT / CREATE PROPERTY INVENTORY                         */}
      {/* ================================================================ */}
      {editingProperty && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 250,
            backgroundColor: 'rgba(5, 5, 5, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            className="glass-panel-gold"
            style={{
              width: '100%',
              maxWidth: '780px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2.25rem',
              borderRadius: '4px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.68rem', letterSpacing: '0.18em', color: 'var(--gold-primary)', textTransform: 'uppercase' }}>
                  {isCreatingProperty ? 'Add New Property Allocation' : 'Modify Property Portfolio'}
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 700, color: '#FFF' }}>
                  {isCreatingProperty ? 'Create Property Entry' : editingProperty.title}
                </h2>
              </div>
              <button
                onClick={() => setEditingProperty(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveProperty} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
                    Property Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProperty.title}
                    onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      backgroundColor: '#111',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '2px',
                      color: '#FFF',
                      fontSize: '0.86rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
                    Classification
                  </label>
                  <select
                    value={editingProperty.type}
                    onChange={(e) => setEditingProperty({ ...editingProperty, type: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      backgroundColor: '#111',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '2px',
                      color: '#FFF',
                      fontSize: '0.86rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Waterfront Villa">Waterfront Villa</option>
                    <option value="Sky Penthouse">Sky Penthouse</option>
                    <option value="Branded Residence">Branded Residence</option>
                    <option value="Private Island Mansion">Private Island Mansion</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
                  Tagline / Architectural Concept
                </label>
                <input
                  type="text"
                  value={editingProperty.tagline}
                  onChange={(e) => setEditingProperty({ ...editingProperty, tagline: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    backgroundColor: '#111',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '2px',
                    color: '#FFF',
                    fontSize: '0.86rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
                    Developer
                  </label>
                  <select
                    value={editingProperty.developer}
                    onChange={(e) => setEditingProperty({ ...editingProperty, developer: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      backgroundColor: '#111',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '2px',
                      color: '#FFF',
                      fontSize: '0.86rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    {developers.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
                    Community
                  </label>
                  <select
                    value={editingProperty.community}
                    onChange={(e) => setEditingProperty({ ...editingProperty, community: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      backgroundColor: '#111',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '2px',
                      color: '#FFF',
                      fontSize: '0.86rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    {communities.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
                    Price (AED)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProperty.priceAED}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const usdEstimate = `$${(val / 3.6725 / 1000000).toFixed(1)}M`;
                      const aedFormatted = `AED ${(val / 1000000).toFixed(1)}M`;
                      setEditingProperty({
                        ...editingProperty,
                        priceAED: val,
                        priceUSD: usdEstimate,
                        startingPriceText: `${aedFormatted} (${usdEstimate})`,
                      });
                    }}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      backgroundColor: '#111',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '2px',
                      color: '#FFF',
                      fontSize: '0.86rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
                    Bedrooms
                  </label>
                  <input
                    type="text"
                    value={editingProperty.bedrooms}
                    onChange={(e) => setEditingProperty({ ...editingProperty, bedrooms: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      backgroundColor: '#111',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '2px',
                      color: '#FFF',
                      fontSize: '0.86rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
                    Handover Milestone
                  </label>
                  <input
                    type="text"
                    value={editingProperty.completionDate}
                    onChange={(e) => setEditingProperty({ ...editingProperty, completionDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      backgroundColor: '#111',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '2px',
                      color: '#FFF',
                      fontSize: '0.86rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
                  Featured Image URL
                </label>
                <input
                  type="text"
                  required
                  value={editingProperty.featuredImage}
                  onChange={(e) => setEditingProperty({ ...editingProperty, featuredImage: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    backgroundColor: '#111',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '2px',
                    color: '#FFF',
                    fontSize: '0.86rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
                  Property Description
                </label>
                <textarea
                  rows={3}
                  value={editingProperty.description}
                  onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    backgroundColor: '#111',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '2px',
                    color: '#FFF',
                    fontSize: '0.86rem',
                    resize: 'none',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingProperty(null)}
                  className="btn-secondary"
                  style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-gold"
                  style={{ padding: '0.65rem 1.5rem', fontSize: '0.75rem' }}
                >
                  <Sparkles size={14} />
                  <span>Save Property Allocation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
