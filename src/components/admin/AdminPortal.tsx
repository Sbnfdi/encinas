import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import type { TimelineScene, Property, Community, Developer, ConsultationInquiry, SceneType } from '../../types';
import {
  Edit,
  Eye,
  EyeOff,
  Film,
  Layers,
  Mail,
  MoveDown,
  MoveUp,
  Plus,
  Trash2,
  X
} from 'lucide-react';

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
  onPreviewScene: (sceneIndex: number) => void;
}

export const AdminPortal: FC<AdminPortalProps> = ({
  timelineScenes,
  properties,
  communities: _communities,
  developers: _developers,
  inquiries,
  onUpdateScenes,
  onUpdateProperties: _onUpdateProperties,
  onUpdateInquiries,
  onCloseAdmin,
  onPreviewScene,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'inventory' | 'leads' | 'overview'>('timeline');

  // Timeline Editing state
  const [editingScene, setEditingScene] = useState<TimelineScene | null>(null);
  const [isCreatingScene, setIsCreatingScene] = useState(false);

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

    // Recalculate order property
    const reordered = updated.map((s, idx) => ({ ...s, order: idx + 1 }));
    onUpdateScenes(reordered);
  };

  const toggleSceneActive = (id: string) => {
    const updated = timelineScenes.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    onUpdateScenes(updated);
  };

  const deleteScene = (id: string) => {
    if (confirm('Are you sure you want to remove this scene from the cinematic timeline?')) {
      const updated = timelineScenes.filter((s) => s.id !== id).map((s, idx) => ({ ...s, order: idx + 1 }));
      onUpdateScenes(updated);
    }
  };

  const saveScene = (e: FormEvent) => {
    e.preventDefault();
    if (!editingScene) return;

    let updated: TimelineScene[];
    if (isCreatingScene) {
      const newScene: TimelineScene = {
        ...editingScene,
        id: `scene-${Date.now()}`,
        order: timelineScenes.length + 1,
        isActive: true,
      };
      updated = [...timelineScenes, newScene];
    } else {
      updated = timelineScenes.map((s) => (s.id === editingScene.id ? editingScene : s));
    }

    onUpdateScenes(updated);
    setEditingScene(null);
    setIsCreatingScene(false);
  };

  const handleInquiryStatusChange = (id: string, newStatus: ConsultationInquiry['status']) => {
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq));
    onUpdateInquiries(updated);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: '#0E1116',
        color: '#E6EDF3',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Dense Professional Admin Top Header */}
      <header
        style={{
          height: '56px',
          backgroundColor: '#161B22',
          borderBottom: '1px solid #30363D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.1rem' }}>⚜️</span>
            <span style={{ fontWeight: 700, letterSpacing: '0.12em', color: '#F0F6FC', fontSize: '0.95rem' }}>
              ENCINAS CMS
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                backgroundColor: '#21262D',
                border: '1px solid #30363D',
                color: '#C5A880',
                padding: '2px 8px',
                borderRadius: '12px',
                fontWeight: 600,
              }}
            >
              OPERATIONAL PORTAL
            </span>
          </div>

          <div style={{ height: '20px', width: '1px', backgroundColor: '#30363D' }} />

          {/* Navigation Tabs */}
          <nav style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={() => setActiveTab('timeline')}
              style={{
                background: activeTab === 'timeline' ? '#21262D' : 'transparent',
                color: activeTab === 'timeline' ? '#58A6FF' : '#8B949E',
                border: 'none',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <Film size={15} />
              <span>Timeline Story Builder</span>
              <span style={{ fontSize: '0.7rem', backgroundColor: '#30363D', padding: '1px 6px', borderRadius: '10px', color: '#C9D1D9' }}>
                {timelineScenes.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              style={{
                background: activeTab === 'inventory' ? '#21262D' : 'transparent',
                color: activeTab === 'inventory' ? '#58A6FF' : '#8B949E',
                border: 'none',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <Layers size={15} />
              <span>Inventory & Properties</span>
              <span style={{ fontSize: '0.7rem', backgroundColor: '#30363D', padding: '1px 6px', borderRadius: '10px', color: '#C9D1D9' }}>
                {properties.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              style={{
                background: activeTab === 'leads' ? '#21262D' : 'transparent',
                color: activeTab === 'leads' ? '#58A6FF' : '#8B949E',
                border: 'none',
                padding: '0.45rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <Mail size={15} />
              <span>VIP Enquiries</span>
              <span style={{ fontSize: '0.7rem', backgroundColor: '#DA3633', padding: '1px 6px', borderRadius: '10px', color: '#FFF' }}>
                {inquiries.filter((i) => i.status === 'New').length}
              </span>
            </button>
          </nav>
        </div>

        {/* Right Header Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button
            onClick={onCloseAdmin}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#238636',
              border: '1px solid rgba(240, 246, 252, 0.1)',
              color: '#FFF',
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Eye size={14} />
            <span>Switch to Cinematic Experience</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' }}>
        {/* ================================================================ */}
        {/* TAB 1: TIMELINE STORY BUILDER                                   */}
        {/* ================================================================ */}
        {activeTab === 'timeline' && (
          <div>
            {/* Header controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#F0F6FC' }}>
                  Timeline Story Architecture
                </h1>
                <p style={{ fontSize: '0.84rem', color: '#8B949E', marginTop: '0.2rem' }}>
                  Configure scroll sequence, camera transitions, and storytelling order. Changes update the public timeline in real-time.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingScene({
                    id: '',
                    slug: 'new-scene',
                    title: 'NEW TIMELINE SCENE',
                    subtitle: 'SUBTITLE PROSPECTUS',
                    description: 'Description of architectural sequence.',
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#1F6FEB',
                  color: '#FFF',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Plus size={15} />
                <span>Add Timeline Scene</span>
              </button>
            </div>

            {/* Dense Professional Table */}
            <div
              style={{
                backgroundColor: '#161B22',
                border: '1px solid #30363D',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#21262D', color: '#8B949E', borderBottom: '1px solid #30363D' }}>
                    <th style={{ padding: '0.75rem 1rem', width: '70px' }}>Order</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Scene Entity</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Type</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Animation Mode</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Scroll Weight</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {timelineScenes.map((scene, idx) => (
                    <tr
                      key={scene.id}
                      style={{
                        borderBottom: '1px solid #21262D',
                        backgroundColor: scene.isActive ? 'transparent' : 'rgba(218, 54, 51, 0.05)',
                      }}
                    >
                      {/* Order & Move buttons */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 700, color: '#F0F6FC', width: '20px' }}>
                            {scene.order.toString().padStart(2, '0')}
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <button
                              disabled={idx === 0}
                              onClick={() => moveScene(idx, 'up')}
                              style={{ background: 'none', border: 'none', color: idx === 0 ? '#30363D' : '#8B949E', cursor: idx === 0 ? 'default' : 'pointer', padding: '1px' }}
                              title="Move scene up"
                            >
                              <MoveUp size={12} />
                            </button>
                            <button
                              disabled={idx === timelineScenes.length - 1}
                              onClick={() => moveScene(idx, 'down')}
                              style={{ background: 'none', border: 'none', color: idx === timelineScenes.length - 1 ? '#30363D' : '#8B949E', cursor: idx === timelineScenes.length - 1 ? 'default' : 'pointer', padding: '1px' }}
                              title="Move scene down"
                            >
                              <MoveDown size={12} />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Scene Name & Subtitle */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <img
                            src={scene.image}
                            alt=""
                            style={{ width: '48px', height: '34px', objectFit: 'cover', borderRadius: '3px', border: '1px solid #30363D' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: '#F0F6FC' }}>{scene.title}</div>
                            <div style={{ fontSize: '0.74rem', color: '#8B949E' }}>{scene.subtitle}</div>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            backgroundColor:
                              scene.sceneType === 'HERO' ? '#238636' :
                              scene.sceneType === 'PROPERTY' ? '#1F6FEB' :
                              scene.sceneType === 'COMMUNITY' ? '#8957E5' :
                              scene.sceneType === 'DEVELOPER' ? '#D29922' : '#30363D',
                            color: '#FFF',
                          }}
                        >
                          {scene.sceneType}
                        </span>
                      </td>

                      {/* Animation mode */}
                      <td style={{ padding: '0.85rem 1rem', color: '#C9D1D9', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                        {scene.animationMode}
                      </td>

                      {/* Scroll weight */}
                      <td style={{ padding: '0.85rem 1rem', color: '#8B949E' }}>
                        {scene.durationWeight.toFixed(1)}x
                      </td>

                      {/* Status */}
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <button
                          onClick={() => toggleSceneActive(scene.id)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: scene.isActive ? 'rgba(35, 134, 54, 0.15)' : 'rgba(218, 54, 51, 0.15)',
                            color: scene.isActive ? '#3FB950' : '#F85149',
                            border: `1px solid ${scene.isActive ? 'rgba(35, 134, 54, 0.4)' : 'rgba(218, 54, 51, 0.4)'}`,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          {scene.isActive ? <Eye size={11} /> : <EyeOff size={11} />}
                          <span>{scene.isActive ? 'Live' : 'Disabled'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => onPreviewScene(idx)}
                            style={{
                              background: '#21262D',
                              border: '1px solid #30363D',
                              color: '#58A6FF',
                              padding: '0.35rem 0.65rem',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                            title="Preview this scene in the cinematic timeline"
                          >
                            <Eye size={12} />
                            <span>Preview</span>
                          </button>

                          <button
                            onClick={() => {
                              setEditingScene({ ...scene });
                              setIsCreatingScene(false);
                            }}
                            style={{
                              background: '#21262D',
                              border: '1px solid #30363D',
                              color: '#C9D1D9',
                              padding: '0.35rem 0.65rem',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                            }}
                            title="Edit scene parameters"
                          >
                            <Edit size={12} />
                          </button>

                          <button
                            onClick={() => deleteScene(scene.id)}
                            style={{
                              background: '#21262D',
                              border: '1px solid #30363D',
                              color: '#F85149',
                              padding: '0.35rem 0.65rem',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
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
        {/* TAB 2: INVENTORY & PROPERTIES                                   */}
        {/* ================================================================ */}
        {activeTab === 'inventory' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#F0F6FC' }}>
                  Ultra-Prime Inventory Master
                </h1>
                <p style={{ fontSize: '0.84rem', color: '#8B949E', marginTop: '0.2rem' }}>
                  Manage verified allocations, off-plan payment structures, and high-floor penthouse inventory.
                </p>
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#161B22',
                border: '1px solid #30363D',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#21262D', color: '#8B949E', borderBottom: '1px solid #30363D' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Property</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Developer</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Community</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Bedrooms</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Price (AED / USD)</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Handover</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((prop) => (
                    <tr key={prop.id} style={{ borderBottom: '1px solid #21262D' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <img
                            src={prop.featuredImage}
                            alt=""
                            style={{ width: '48px', height: '34px', objectFit: 'cover', borderRadius: '3px', border: '1px solid #30363D' }}
                          />
                          <div>
                            <div style={{ fontWeight: 600, color: '#F0F6FC' }}>{prop.title}</div>
                            <div style={{ fontSize: '0.72rem', color: '#8B949E' }}>{prop.type}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#C9D1D9' }}>{prop.developer}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#C9D1D9' }}>{prop.community}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#8B949E' }}>{prop.bedrooms}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#C5A880' }}>
                        {prop.startingPriceText}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#8B949E' }}>{prop.completionDate}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            backgroundColor: 'rgba(31, 111, 235, 0.15)',
                            color: '#58A6FF',
                            border: '1px solid rgba(31, 111, 235, 0.3)',
                          }}
                        >
                          {prop.status}
                        </span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#F0F6FC' }}>
                  Private Advisory Consultations & VIP Leads
                </h1>
                <p style={{ fontSize: '0.84rem', color: '#8B949E', marginTop: '0.2rem' }}>
                  Inbound high-net-worth client mandates with bilateral non-disclosure agreement protection.
                </p>
              </div>

              {/* Status filter */}
              <select
                value={inquiryStatusFilter}
                onChange={(e) => setInquiryStatusFilter(e.target.value)}
                style={{
                  backgroundColor: '#21262D',
                  border: '1px solid #30363D',
                  color: '#F0F6FC',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                }}
              >
                <option value="ALL">All Statuses</option>
                <option value="New">New</option>
                <option value="VIP Portfolio Sent">VIP Portfolio Sent</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div
              style={{
                backgroundColor: '#161B22',
                border: '1px solid #30363D',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#21262D', color: '#8B949E', borderBottom: '1px solid #30363D' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Client Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Contact Details</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Investment Budget</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Target Asset / Enclave</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Timeframe</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Pipeline Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries
                    .filter((inq) => inquiryStatusFilter === 'ALL' || inq.status === inquiryStatusFilter)
                    .map((inq) => (
                      <tr key={inq.id} style={{ borderBottom: '1px solid #21262D' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: 600, color: '#F0F6FC' }}>{inq.fullName}</div>
                          <div style={{ fontSize: '0.72rem', color: '#8B949E' }}>{inq.country}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ color: '#58A6FF' }}>{inq.email}</div>
                          <div style={{ fontSize: '0.74rem', color: '#8B949E' }}>{inq.phone}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#3FB950' }}>
                          {inq.investmentBudget}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ color: '#C9D1D9' }}>{inq.preferredAssetType}</div>
                          <div style={{ fontSize: '0.72rem', color: '#8B949E' }}>{inq.preferredCommunity}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', color: '#8B949E' }}>{inq.timeframe}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <select
                            value={inq.status}
                            onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value as any)}
                            style={{
                              backgroundColor:
                                inq.status === 'New' ? '#3B1F20' :
                                inq.status === 'VIP Portfolio Sent' ? '#1F3447' :
                                inq.status === 'Scheduled' ? '#1C3829' : '#21262D',
                              color:
                                inq.status === 'New' ? '#F85149' :
                                inq.status === 'VIP Portfolio Sent' ? '#58A6FF' :
                                inq.status === 'Scheduled' ? '#3FB950' : '#8B949E',
                              border: '1px solid #30363D',
                              borderRadius: '4px',
                              padding: '0.3rem 0.6rem',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              outline: 'none',
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
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#161B22',
              border: '1px solid #30363D',
              borderRadius: '8px',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #30363D', paddingBottom: '0.75rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#F0F6FC' }}>
                {isCreatingScene ? 'Create New Timeline Scene' : `Edit Scene: ${editingScene.title}`}
              </h2>
              <button
                onClick={() => setEditingScene(null)}
                style={{ background: 'none', border: 'none', color: '#8B949E', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveScene} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#8B949E', marginBottom: '0.3rem' }}>
                  Scene Title
                </label>
                <input
                  type="text"
                  required
                  value={editingScene.title}
                  onChange={(e) => setEditingScene({ ...editingScene, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    backgroundColor: '#0D1117',
                    border: '1px solid #30363D',
                    borderRadius: '4px',
                    color: '#F0F6FC',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#8B949E', marginBottom: '0.3rem' }}>
                  Subtitle / Prospectus
                </label>
                <input
                  type="text"
                  value={editingScene.subtitle}
                  onChange={(e) => setEditingScene({ ...editingScene, subtitle: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    backgroundColor: '#0D1117',
                    border: '1px solid #30363D',
                    borderRadius: '4px',
                    color: '#F0F6FC',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#8B949E', marginBottom: '0.3rem' }}>
                    Scene Type
                  </label>
                  <select
                    value={editingScene.sceneType}
                    onChange={(e) => setEditingScene({ ...editingScene, sceneType: e.target.value as SceneType })}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      backgroundColor: '#0D1117',
                      border: '1px solid #30363D',
                      borderRadius: '4px',
                      color: '#F0F6FC',
                      fontSize: '0.85rem',
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
                  <label style={{ display: 'block', fontSize: '0.76rem', color: '#8B949E', marginBottom: '0.3rem' }}>
                    Animation Mode
                  </label>
                  <select
                    value={editingScene.animationMode}
                    onChange={(e) => setEditingScene({ ...editingScene, animationMode: e.target.value as any })}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      backgroundColor: '#0D1117',
                      border: '1px solid #30363D',
                      borderRadius: '4px',
                      color: '#F0F6FC',
                      fontSize: '0.85rem',
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
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#8B949E', marginBottom: '0.3rem' }}>
                  Backdrop Image URL
                </label>
                <input
                  type="text"
                  required
                  value={editingScene.image}
                  onChange={(e) => setEditingScene({ ...editingScene, image: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    backgroundColor: '#0D1117',
                    border: '1px solid #30363D',
                    borderRadius: '4px',
                    color: '#F0F6FC',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#8B949E', marginBottom: '0.3rem' }}>
                  Description Narrative
                </label>
                <textarea
                  rows={3}
                  value={editingScene.description}
                  onChange={(e) => setEditingScene({ ...editingScene, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem',
                    backgroundColor: '#0D1117',
                    border: '1px solid #30363D',
                    borderRadius: '4px',
                    color: '#F0F6FC',
                    fontSize: '0.85rem',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingScene(null)}
                  style={{
                    backgroundColor: '#21262D',
                    border: '1px solid #30363D',
                    color: '#C9D1D9',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    backgroundColor: '#238636',
                    border: 'none',
                    color: '#FFF',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save Timeline Scene
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
