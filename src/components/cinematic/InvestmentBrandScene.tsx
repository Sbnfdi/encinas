import type { TimelineScene } from '../../types';
import type { FC } from 'react';
import { Award, DollarSign, Globe, KeyRound, Lock, ShieldCheck } from 'lucide-react';

interface InvestmentBrandSceneProps {
  scene: TimelineScene;
  progress?: number; // 0.0 to 1.0 within track
  onOpenConsultation: () => void;
}

export const InvestmentBrandScene: FC<InvestmentBrandSceneProps> = ({
  scene,
  progress: _progress,
  onOpenConsultation,
}) => {
  const isBrand = scene.sceneType === 'BRAND';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 clamp(1rem, 4vw, 3.5rem)',
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1300px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {/* Section Header */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '0.8rem',
            fontSize: '0.72rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--gold-primary)',
          }}
        >
          <ShieldCheck size={14} />
          <span>{scene.metaBadge || (isBrand ? 'ENCINAS PHILOSOPHY' : 'CAPITAL & STRATEGY')}</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4.2vw, 3.8rem)',
            lineHeight: 1.12,
            fontWeight: 700,
            letterSpacing: '0.03em',
            marginBottom: '1rem',
            maxWidth: '900px',
          }}
          className="gold-gradient-text"
        >
          {scene.title}
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            color: 'var(--gold-light)',
            marginBottom: '1.75rem',
            letterSpacing: '0.04em',
          }}
        >
          {scene.subtitle}
        </p>

        <p
          style={{
            fontSize: '0.98rem',
            lineHeight: 1.8,
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            marginBottom: '2.5rem',
          }}
        >
          {scene.description}
        </p>

        {/* Dynamic Cards Grid */}
        {!isBrand ? (
          /* INVESTMENT PILLARS */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: 'clamp(1rem, 2.5vw, 1.5rem)',
              marginBottom: '2.5rem',
            }}
          >
            <div
              className="glass-panel-gold"
              style={{ padding: 'clamp(1.25rem, 2.5vw, 1.75rem)', borderRadius: '4px' }}
            >
              <div style={{ color: 'var(--gold-primary)', marginBottom: '1rem' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFF', marginBottom: '0.5rem' }}>
                0% Sovereign Tax
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Zero personal income tax, zero capital gains tax, and zero corporate inheritance taxes for foreign property holders.
              </p>
            </div>

            <div
              className="glass-panel"
              style={{ padding: 'clamp(1.25rem, 2.5vw, 1.75rem)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div style={{ color: 'var(--gold-primary)', marginBottom: '1rem' }}>
                <KeyRound size={28} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFF', marginBottom: '0.5rem' }}>
                10-Year Golden Visa
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Real estate investment of AED 2M+ qualifies families for unconditional 10-year renewable UAE Golden Residency.
              </p>
            </div>

            <div
              className="glass-panel"
              style={{ padding: 'clamp(1.25rem, 2.5vw, 1.75rem)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div style={{ color: 'var(--gold-primary)', marginBottom: '1rem' }}>
                <DollarSign size={28} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFF', marginBottom: '0.5rem' }}>
                USD Pegged Stability
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                AED has maintained a fixed 3.6725 peg with the US Dollar since 1997, protecting against international currency swings.
              </p>
            </div>
          </div>
        ) : (
          /* BRAND PHILOSOPHY PILLARS */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: 'clamp(1rem, 2.5vw, 1.5rem)',
              marginBottom: '2.5rem',
            }}
          >
            <div
              className="glass-panel-gold"
              style={{ padding: 'clamp(1.25rem, 2.5vw, 1.75rem)', borderRadius: '4px' }}
            >
              <div style={{ color: 'var(--gold-primary)', marginBottom: '1rem' }}>
                <Lock size={28} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFF', marginBottom: '0.5rem' }}>
                Boardroom Confidentiality
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                All high-net-worth acquisitions are protected under bilateral NDAs, ensuring complete discretion and privacy.
              </p>
            </div>

            <div
              className="glass-panel"
              style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div style={{ color: 'var(--gold-primary)', marginBottom: '1rem' }}>
                <Globe size={28} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFF', marginBottom: '0.5rem' }}>
                Global Multi-Family Desks
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Direct coverage across Dubai (DIFC), London (Mayfair), Zurich, and Singapore for cross-border capital structuring.
              </p>
            </div>

            <div
              className="glass-panel"
              style={{ padding: '1.75rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div style={{ color: 'var(--gold-primary)', marginBottom: '1rem' }}>
                <Award size={28} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFF', marginBottom: '0.5rem' }}>
                Trophy Allocation Access
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Direct access to top-floor penthouses and prime waterfront plots before public broker distribution.
              </p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={onOpenConsultation}
            aria-label={scene.ctaLabel || 'Schedule Private Consultation'}
            className="btn-gold"
          >
            <span>{scene.ctaLabel || 'SCHEDULE PRIVATE CONSULTATION'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
