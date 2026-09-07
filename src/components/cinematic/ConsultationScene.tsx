import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import type { TimelineScene, ConsultationInquiry } from '../../types';
import { CheckCircle, Lock, Mail, MapPin, Phone, Send, ShieldCheck, Sparkles, User } from 'lucide-react';

interface ConsultationSceneProps {
  scene: TimelineScene;
  onSubmitInquiry: (inquiry: Omit<ConsultationInquiry, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
}

export const ConsultationScene: FC<ConsultationSceneProps> = ({
  scene: _scene,
  onSubmitInquiry,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    investmentBudget: '$2,000,000 - $5,000,000',
    preferredAssetType: 'Waterfront Villa',
    preferredCommunity: 'Palm Jumeirah',
    timeframe: 'Immediate (within 30 days)',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) return;

    setIsSubmitting(true);
    const ok = await onSubmitInquiry(formData);
    setIsSubmitting(false);

    if (ok) {
      setIsSuccess(true);
    }
  };

  return (
    <div
      id="consultation"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 4vw',
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Narrative & Sovereign Trust */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                marginBottom: '1rem',
                fontSize: '0.72rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--gold-primary)',
              }}
            >
              <Sparkles size={13} />
              <span>THE FINAL CONVERSION • PRIVATE ADVISORY</span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.2rem, 4.4vw, 4rem)',
                lineHeight: 1.1,
                fontWeight: 700,
                letterSpacing: '0.03em',
                marginBottom: '1.25rem',
              }}
              className="gold-gradient-text"
            >
              ACQUIRE DUBAI ON YOUR TERMS
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                color: 'var(--gold-light)',
                marginBottom: '1.5rem',
                letterSpacing: '0.04em',
              }}
            >
              Strictly confidential boardroom representation for ultra-high-net-worth acquisitions.
            </p>

            <p
              style={{
                fontSize: '0.94rem',
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
                marginBottom: '2.5rem',
              }}
            >
              Whether allocating capital into off-plan trophy developments, procuring private island parcels, or establishing UAE residency through the Golden Visa program, our senior partners represent your interests exclusively.
            </p>

            {/* Guarantees */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <ShieldCheck size={18} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  Bilateral Non-Disclosure Agreement (NDA) on all inquiries
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Lock size={18} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  0% Buyer Commission on Tier-1 Developer off-plan allocations
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <MapPin size={18} color="var(--gold-primary)" />
                <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  DIFC Gate Precinct Head Office & Global Private Concierge
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: High-End Interactive Form */}
          <div
            className="glass-panel-gold"
            style={{
              padding: '2.5rem',
              borderRadius: '4px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            }}
          >
            {isSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(197, 168, 128, 0.15)', color: 'var(--gold-light)', marginBottom: '1.25rem' }}>
                  <CheckCircle size={40} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#FFF', marginBottom: '0.8rem' }}>
                  Briefing Received
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  A Senior Managing Partner has been assigned to your private mandate. Expect our confidential encrypted dispatch within 4 business hours.
                </p>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setFormData({
                      fullName: '',
                      email: '',
                      phone: '',
                      country: '',
                      investmentBudget: '$2,000,000 - $5,000,000',
                      preferredAssetType: 'Waterfront Villa',
                      preferredCommunity: 'Palm Jumeirah',
                      timeframe: 'Immediate (within 30 days)',
                      notes: '',
                    });
                  }}
                  className="btn-secondary"
                  style={{ width: '100%' }}
                >
                  <span>SUBMIT ANOTHER MANDATE</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.8rem', marginBottom: '0.4rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: '#FFF', letterSpacing: '0.04em' }}>
                    Request Private Consultation
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--gold-light)', marginTop: '0.2rem' }}>
                    Direct boardroom access to off-plan allocations & private viewings
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
                    Full Legal Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Lord Julian Sterling"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 2.5rem',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '2px',
                        color: '#FFF',
                        fontSize: '0.88rem',
                        outline: 'none',
                      }}
                    />
                    <User size={14} color="var(--gold-primary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
                      Email Address *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="client@familyoffice.com"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem 0.75rem 2.5rem',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '2px',
                          color: '#FFF',
                          fontSize: '0.88rem',
                          outline: 'none',
                        }}
                      />
                      <Mail size={14} color="var(--gold-primary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
                      Direct Phone / WhatsApp *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+971 50 000 0000"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem 0.75rem 2.5rem',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          borderRadius: '2px',
                          color: '#FFF',
                          fontSize: '0.88rem',
                          outline: 'none',
                        }}
                      />
                      <Phone size={14} color="var(--gold-primary)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
                      Investment Budget
                    </label>
                    <select
                      value={formData.investmentBudget}
                      onChange={(e) => setFormData({ ...formData, investmentBudget: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#121110',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '2px',
                        color: '#FFF',
                        fontSize: '0.84rem',
                        outline: 'none',
                      }}
                    >
                      <option value="$1,000,000 - $2,000,000">$1M - $2M (AED 3.7M - 7.3M)</option>
                      <option value="$2,000,000 - $5,000,000">$2M - $5M (AED 7.3M - 18.3M)</option>
                      <option value="$5,000,000 - $10,000,000">$5M - $10M (AED 18.3M - 36.7M)</option>
                      <option value="$10,000,000+">$10M+ Super Prime Portfolio</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
                      Preferred Asset Type
                    </label>
                    <select
                      value={formData.preferredAssetType}
                      onChange={(e) => setFormData({ ...formData, preferredAssetType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: '#121110',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '2px',
                        color: '#FFF',
                        fontSize: '0.84rem',
                        outline: 'none',
                      }}
                    >
                      <option value="Waterfront Villa">Waterfront Villa / Island Palace</option>
                      <option value="Sky Penthouse">Sky Penthouse / Duplex</option>
                      <option value="Branded Residence">Branded Luxury Residence</option>
                      <option value="Private Island Mansion">Private Island Parcel</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
                    Specific Acquisition Requirements
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Specific waterfront view, superyacht berth requirements, Golden Visa assistance, or private floor allocation..."
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '2px',
                      color: '#FFF',
                      fontSize: '0.85rem',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  {isSubmitting ? (
                    <span>DISPATCHING MANDATE...</span>
                  ) : (
                    <>
                      <span>CONFIRM PRIVATE BRIEFING</span>
                      <Send size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
