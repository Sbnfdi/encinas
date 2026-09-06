
import type { Property } from '../../types';
import { useState } from 'react';
import type { FC } from 'react';
import { ArrowRight, Bed, Eye, Layers, MapPin, Sparkles } from 'lucide-react';

interface PropertyReelSceneProps {
  properties: Property[];
  progress: number; // 0.0 to 1.0 within Property Reel track
  onSelectProperty: (property: Property) => void;
  onInquire: (property: Property) => void;
}

export const PropertyReelScene: FC<PropertyReelSceneProps> = ({
  properties,
  progress,
  onSelectProperty,
  onInquire,
}) => {
  // Use first 3 featured properties
  const featured = properties.slice(0, 3);
  const count = featured.length;

  const [userSelectedIdx, setUserSelectedIdx] = useState<number | null>(null);

  const rawIndex = progress * (count - 1);
  const computedIdx = Math.min(count - 1, Math.max(0, Math.floor(rawIndex)));
  const activeIdx = userSelectedIdx !== null ? userSelectedIdx : computedIdx;
  const transitionFrac = userSelectedIdx !== null ? 0 : (rawIndex - computedIdx);

  // Active property data
  const currentProp = featured[activeIdx] || featured[0];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '0 4vw',
      }}
    >
      {/* Background ambient glow according to property */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '30%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 168, 128, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />

      {/* Top Section Header Narrative */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2rem',
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto 2rem auto',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: '1rem',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.72rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--gold-primary)',
              marginBottom: '0.4rem',
            }}
          >
            <Sparkles size={12} />
            <span>02 / 08 • CURATED RESIDENCES REEL</span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.6rem, 3.2vw, 2.8rem)',
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            THE ARCHITECTURAL PORTFOLIO
          </h2>
        </div>

        {/* Reel Position Tracker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--gold-light)' }}>
            0{activeIdx + 1} <span style={{ opacity: 0.35, fontSize: '0.8rem' }}>/ 0{count}</span>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => setUserSelectedIdx(i)}
                style={{
                  width: i === activeIdx ? '32px' : '8px',
                  height: '6px',
                  backgroundColor: i === activeIdx ? 'var(--gold-primary)' : 'rgba(255,255,255,0.18)',
                  borderRadius: '3px',
                  transition: 'all 0.4s ease',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
                title={`View Property 0${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal Cinematic Stage Inside Vertical Scroll */}
      <div
        style={{
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(1.75rem, 4vw, 3.5rem)',
            alignItems: 'center',
          }}
        >
          {/* LEFT: Large Transforming Cinematic Image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/10',
              borderRadius: '4px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
              border: '1px solid rgba(197, 168, 128, 0.22)',
            }}
          >
            {featured.map((prop, idx) => {
              const isCurrent = idx === activeIdx;
              const isNext = idx === activeIdx + 1;
              let opacity = 0;
              let scale = 1.08;
              let translateX = 30;

              if (isCurrent) {
                opacity = 1 - transitionFrac;
                scale = 1.0 + transitionFrac * 0.08;
                translateX = -transitionFrac * 40;
              } else if (isNext) {
                opacity = transitionFrac;
                scale = 1.08 - transitionFrac * 0.08;
                translateX = 40 * (1 - transitionFrac);
              }

              return (
                <div
                  key={prop.id}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity,
                    transform: `translateX(${translateX}px) scale(${scale})`,
                    transition: 'opacity 0.1s linear, transform 0.1s linear',
                    pointerEvents: isCurrent ? 'auto' : 'none',
                  }}
                >
                  <img
                    src={prop.featuredImage}
                    alt={prop.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  {/* Subtle glass reflection gradient */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(7,7,7,0.92) 0%, rgba(7,7,7,0.1) 50%, transparent 100%)',
                    }}
                  />

                  {/* Status badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '1.25rem',
                      left: '1.25rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.4rem 0.95rem',
                      borderRadius: '9999px',
                      background: 'rgba(7,7,7,0.8)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid var(--border-gold)',
                      fontSize: '0.68rem',
                      letterSpacing: '0.16em',
                      color: 'var(--gold-light)',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ADE80' }} />
                    <span>{prop.status}</span>
                  </div>

                  {/* Price Tag Over Image */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '1.25rem',
                      left: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-dim)' }}>
                      Starting Investment
                    </span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--gold-pale)', fontWeight: 600 }}>
                      {prop.startingPriceText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Internal Staged Property Timeline Metadata */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Developer & Community */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                marginBottom: '0.8rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.72rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--gold-primary)',
                  fontWeight: 600,
                }}
              >
                {currentProp.developer}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  color: 'var(--text-secondary)',
                }}
              >
                <MapPin size={12} color="var(--gold-primary)" />
                {currentProp.community}
              </span>
            </div>

            {/* Project Title */}
            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.9rem, 3.5vw, 3rem)',
                lineHeight: 1.15,
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '1rem',
              }}
            >
              {currentProp.title}
            </h3>

            {/* Tagline / Subtitle */}
            <p
              style={{
                fontSize: '1.05rem',
                fontFamily: 'var(--font-display)',
                color: 'var(--gold-light)',
                marginBottom: '1.25rem',
                letterSpacing: '0.04em',
              }}
            >
              {currentProp.tagline}
            </p>

            {/* Description Narrative */}
            <p
              style={{
                fontSize: '0.9rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                marginBottom: '1.75rem',
                maxWidth: '520px',
              }}
            >
              {currentProp.description}
            </p>

            {/* Key Specs Matrix */}
            <div
              className="glass-panel"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                padding: '1.1rem 1.25rem',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.07)',
                marginBottom: '2rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-dim)', fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  <Bed size={12} />
                  <span>Residences</span>
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '0.3rem' }}>
                  {currentProp.bedrooms}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-dim)', fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  <Layers size={12} />
                  <span>Area</span>
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '0.3rem' }}>
                  {currentProp.builtUpAreaSqFt}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-dim)', fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  <Sparkles size={12} />
                  <span>Handover</span>
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.88rem', color: 'var(--gold-light)', marginTop: '0.3rem' }}>
                  {currentProp.completionDate}
                </div>
              </div>
            </div>

            {/* Interactive CTAs */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onSelectProperty(currentProp)}
                className="btn-gold"
                style={{ flex: 1, minWidth: '180px' }}
              >
                <span>EXPLORE ARCHITECTURE</span>
                <Eye size={15} />
              </button>

              <button
                onClick={() => onInquire(currentProp)}
                className="btn-secondary"
                style={{ flex: 1, minWidth: '180px' }}
              >
                <span>ALLOCATION BRIEF</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
