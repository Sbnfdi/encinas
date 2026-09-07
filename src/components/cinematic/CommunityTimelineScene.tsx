
import { useState } from 'react';
import type { Community } from '../../types';
import type { FC } from 'react';
import { ArrowUpRight, DollarSign, MapPin, Sparkles, TrendingUp } from 'lucide-react';

interface CommunityTimelineSceneProps {
  communities: Community[];
  progress: number; // 0.0 to 1.0 within Community timeline track
  onSelectCommunity: (community: Community) => void;
}

export const CommunityTimelineScene: FC<CommunityTimelineSceneProps> = ({
  communities,
  progress,
  onSelectCommunity,
}) => {
  const [userSelectedIdx, setUserSelectedIdx] = useState<number | null>(null);
  const count = communities.length;
  const rawIdx = progress * (count - 1);
  const scrollComputedIdx = Math.min(count - 1, Math.max(0, Math.floor(rawIdx)));
  const activeIdx = userSelectedIdx !== null ? userSelectedIdx : scrollComputedIdx;
  const frac = userSelectedIdx !== null ? 0 : (rawIdx - scrollComputedIdx);

  const currentComm = communities[activeIdx] || communities[0];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 4vw',
        overflow: 'hidden',
      }}
    >
      {/* Background Transforming Environment Backdrop */}
      {communities.map((comm, idx) => {
        const isCurrent = idx === activeIdx;
        const isNext = idx === activeIdx + 1;
        let opacity = 0;
        let scale = 1.06;

        if (isCurrent) {
          opacity = 1 - frac;
          scale = 1.0 + frac * 0.06;
        } else if (isNext) {
          opacity = frac;
          scale = 1.06 - frac * 0.06;
        }

        return (
          <div
            key={comm.id}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(circle at 60% 40%, rgba(7,7,7,0.3) 0%, rgba(7,7,7,0.92) 85%), url(${comm.featuredImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: opacity * 0.45,
              transform: `scale(${scale})`,
              transition: 'opacity 0.1s linear, transform 0.1s linear',
              pointerEvents: 'none',
              filter: 'grayscale(25%) brightness(0.8)',
            }}
          />
        );
      })}

      {/* Foreground Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {/* Stage Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '0.8rem',
            fontSize: '0.72rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--gold-primary)',
          }}
        >
          <MapPin size={13} />
          <span>ICONIC TERRITORIES</span>
        </div>

        {/* Communities Ribbon Stepper */}
        <div
          style={{
            display: 'flex',
            gap: '1.25rem',
            marginBottom: '2.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            paddingBottom: '1.2rem',
            overflowX: 'auto',
          }}
        >
          {communities.map((c, i) => {
            const isSelected = i === activeIdx;
            return (
              <button
                key={c.id}
                onClick={() => setUserSelectedIdx(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '0.95rem',
                  letterSpacing: '0.08em',
                  color: isSelected ? 'var(--gold-light)' : 'rgba(255,255,255,0.35)',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                  padding: '0.2rem 0',
                }}
              >
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: isSelected ? 'var(--gold-primary)' : 'rgba(255,255,255,0.2)',
                    fontWeight: 600,
                  }}
                >
                  0{i + 1}
                </span>
                <span>{c.name}</span>
                {isSelected && (
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--gold-primary)',
                      boxShadow: '0 0 8px var(--gold-primary)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Grid: Details & Lifestyle Highlights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                color: 'var(--gold-primary)',
                marginBottom: '0.6rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              <MapPin size={13} />
              <span>TERRITORY PROFILE</span>
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 4vw, 3.6rem)',
                lineHeight: 1.12,
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '1rem',
              }}
            >
              {currentComm.name}
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                color: 'var(--gold-light)',
                marginBottom: '1.5rem',
                letterSpacing: '0.03em',
              }}
            >
              {currentComm.tagline}
            </p>

            <p
              style={{
                fontSize: '0.95rem',
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
                marginBottom: '2rem',
                maxWidth: '560px',
              }}
            >
              {currentComm.description}
            </p>

            {/* Financial Telemetry Pills */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <div
                className="glass-panel"
                style={{
                  padding: '0.85rem 1.4rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(197, 168, 128, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  <TrendingUp size={12} color="#4ADE80" />
                  <span>YoY Appreciation</span>
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--gold-light)', marginTop: '0.2rem' }}>
                  {currentComm.capitalAppreciationYoY}
                </div>
              </div>

              <div
                className="glass-panel"
                style={{
                  padding: '0.85rem 1.4rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  <DollarSign size={12} color="var(--gold-primary)" />
                  <span>Avg Price / Sq.Ft</span>
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {currentComm.averagePricePerSqFt}
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectCommunity(currentComm)}
              className="btn-gold"
            >
              <span>INSPECT {currentComm.name} ASSETS</span>
              <ArrowUpRight size={15} />
            </button>
          </div>

          {/* Right Column: Lifestyle Matrix & Signature Developers */}
          <div
            className="glass-panel-gold"
            style={{
              padding: '2.2rem',
              borderRadius: '4px',
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--gold-primary)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Sparkles size={13} />
              <span>LIFESTYLE PRIVILEGES</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {currentComm.lifestyleHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.9rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '2px',
                    borderLeft: '2px solid var(--gold-primary)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.75rem', color: 'var(--gold-primary)' }}>
                    0{idx + 1}
                  </span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                    {highlight}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.6rem' }}>
                Signature Master Developers
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {currentComm.signatureDevelopers.map((dev, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.35rem 0.8rem',
                      background: 'rgba(197, 168, 128, 0.1)',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '2px',
                      color: 'var(--gold-light)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {dev}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
