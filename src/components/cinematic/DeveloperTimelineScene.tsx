import type { Developer } from '../../types';
import type { FC } from 'react';
import { Award, ChevronRight, Crown } from 'lucide-react';

interface DeveloperTimelineSceneProps {
  developers: Developer[];
  progress: number; // 0.0 to 1.0 within Developer timeline track
  onSelectDeveloper: (developer: Developer) => void;
}

export const DeveloperTimelineScene: FC<DeveloperTimelineSceneProps> = ({
  developers,
  progress,
  onSelectDeveloper,
}) => {
  const count = developers.length;
  const rawIdx = progress * (count - 1);
  const activeIdx = Math.min(count - 1, Math.max(0, Math.floor(rawIdx)));
  const frac = rawIdx - activeIdx;

  const currentDev = developers[activeIdx] || developers[0];

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
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {/* Section Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '0.6rem',
            fontSize: '0.72rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--gold-primary)',
          }}
        >
          <Crown size={14} />
          <span>04 / 08 • TIER-1 INSTITUTIONAL DEVELOPERS</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.8rem, 3.4vw, 3rem)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            marginBottom: '2rem',
          }}
        >
          THE ARCHITECTS OF DUBAI
        </h2>

        {/* Developer Chronological Rail */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '3rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            paddingBottom: '1.5rem',
          }}
        >
          {developers.map((dev, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={dev.id}
                onClick={() => onSelectDeveloper(dev)}
                style={{
                  background: isActive ? 'rgba(197, 168, 128, 0.08)' : 'transparent',
                  border: isActive ? '1px solid var(--border-gold)' : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '2px',
                  padding: '0.85rem 1rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ fontSize: '0.65rem', color: isActive ? 'var(--gold-primary)' : 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-serif)' }}>
                  0{idx + 1}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: isActive ? 'var(--gold-light)' : 'rgba(255,255,255,0.5)',
                    marginTop: '0.2rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  {dev.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Developer Stage Focus */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
          }}
        >
          {/* Developer Credentials & Value */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                background: 'rgba(197, 168, 128, 0.1)',
                border: '1px solid var(--border-gold)',
                borderRadius: '9999px',
                fontSize: '0.68rem',
                letterSpacing: '0.14em',
                color: 'var(--gold-light)',
                textTransform: 'uppercase',
                marginBottom: '1rem',
              }}
            >
              <Award size={13} />
              <span>{currentDev.tier}</span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 3.8vw, 3.4rem)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '0.8rem',
              }}
            >
              {currentDev.name}
            </h3>

            <div
              style={{
                fontSize: '0.95rem',
                color: 'var(--gold-light)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.04em',
                marginBottom: '1.25rem',
              }}
            >
              Flagship Icon: {currentDev.heroProject}
            </div>

            <p
              style={{
                fontSize: '0.92rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                marginBottom: '1.5rem',
              }}
            >
              {currentDev.description}
            </p>

            <p
              style={{
                fontSize: '0.88rem',
                lineHeight: 1.6,
                color: 'var(--gold-primary)',
                fontStyle: 'italic',
                marginBottom: '2rem',
                borderLeft: '2px solid var(--gold-primary)',
                paddingLeft: '1rem',
              }}
            >
              "{currentDev.reputation}"
            </p>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem' }}>
              <div>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.12em' }}>
                  Track Record
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--gold-light)', marginTop: '0.2rem' }}>
                  {currentDev.totalDeliveredUnits}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.12em' }}>
                  Established
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {currentDev.founded}
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectDeveloper(currentDev)}
              className="btn-gold"
            >
              <span>DIRECT BOARDROOM ALLOCATION</span>
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Architectural Image Showcase */}
          <div
            style={{
              position: 'relative',
              borderRadius: '4px',
              overflow: 'hidden',
              aspectRatio: '4/3',
              boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
              border: '1px solid rgba(197, 168, 128, 0.25)',
            }}
          >
            <img
              src={currentDev.image}
              alt={currentDev.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${1.04 - frac * 0.04})`,
                transition: 'transform 0.2s ease',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(7,7,7,0.85) 0%, transparent 60%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '1.5rem',
                right: '1.5rem',
              }}
            >
              <div style={{ fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold-light)' }}>
                Specialty Architecture
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#FFF', fontWeight: 600, marginTop: '0.3rem' }}>
                {currentDev.specialty}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
