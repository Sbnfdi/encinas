import { useState } from 'react';
import type { FC } from 'react';
import type { Property, Currency } from '../../types';
import { formatPriceInCurrency } from '../../types';
import { ArrowRight, Bed, Eye, Layers, MapPin } from 'lucide-react';

interface PropertyReelSceneProps {
  properties: Property[];
  progress: number; // 0.0 to 1.0 within Property Reel track
  currency?: Currency;
  onSelectProperty: (property: Property) => void;
  onInquire: (property: Property) => void;
}

export const PropertyReelScene: FC<PropertyReelSceneProps> = ({
  properties,
  progress,
  currency = 'AED',
  onSelectProperty,
  onInquire,
}) => {
  const featured = properties.slice(0, 3);
  const count = featured.length;

  const [userSelectedIdx, setUserSelectedIdx] = useState<number | null>(null);

  const rawIndex = progress * (count - 1);
  const computedIdx = Math.min(count - 1, Math.max(0, Math.floor(rawIndex)));
  const activeIdx = userSelectedIdx !== null ? userSelectedIdx : computedIdx;
  const transitionFrac = userSelectedIdx !== null ? 0 : (rawIndex - computedIdx);

  const currentProp = featured[activeIdx] || featured[0];

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
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '30%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(197, 168, 128, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />

      {/* Clean Luxury Section Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: '1rem',
          maxWidth: '1300px',
          width: '100%',
          margin: '0 auto 2rem auto',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: '1.25rem',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: 'var(--gold-primary)',
              marginBottom: '0.35rem',
              fontWeight: 600,
            }}
          >
            FEATURED TROPHY ALLOCATIONS
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: '#FFF',
            }}
          >
            CURATED RESIDENCES
          </h2>
        </div>

        {/* Elegant Minimalist Step Indicator with generous touch targets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', color: 'var(--gold-light)' }}>
            0{activeIdx + 1} <span style={{ opacity: 0.35, fontSize: '0.75rem' }}>/ 0{count}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {featured.map((_, i) => (
              <button
                key={i}
                onClick={() => setUserSelectedIdx(i)}
                style={{
                  width: i === activeIdx ? '32px' : '16px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
                title={`Residence 0${i + 1}`}
                aria-label={`View Residence 0${i + 1}: ${featured[i]?.title}`}
                aria-pressed={i === activeIdx}
              >
                <span
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '8px',
                    backgroundColor: i === activeIdx ? 'var(--gold-primary)' : 'rgba(255,255,255,0.25)',
                    borderRadius: '4px',
                    transition: 'all 0.35s ease',
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stage */}
      <div
        style={{
          maxWidth: '1300px',
          width: '100%',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(1.5rem, 3.5vw, 3.5rem)',
            alignItems: 'center',
          }}
        >
          {/* LEFT: Large Transforming Cinematic Image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/10',
              borderRadius: '2px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
              border: '1px solid var(--border-gold)',
            }}
          >
            {featured.map((prop, idx) => {
              const isCurrent = idx === activeIdx;
              const isNext = idx === activeIdx + 1;
              let opacity = 0;
              let scale = 1.06;
              let translateX = 25;

              if (isCurrent) {
                opacity = 1 - transitionFrac;
                scale = 1.0 + transitionFrac * 0.06;
                translateX = -transitionFrac * 30;
              } else if (isNext) {
                opacity = transitionFrac;
                scale = 1.06 - transitionFrac * 0.06;
                translateX = 30 * (1 - transitionFrac);
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
                      padding: '0.35rem 0.85rem',
                      borderRadius: '9999px',
                      background: 'rgba(7,7,7,0.85)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid var(--border-gold)',
                      fontSize: '0.66rem',
                      letterSpacing: '0.14em',
                      color: 'var(--gold-light)',
                    }}
                  >
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#4ADE80' }} />
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
                    <span style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--text-dim)' }}>
                      Starting Investment ({currency})
                    </span>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--gold-pale)', fontWeight: 600 }}>
                      {formatPriceInCurrency(prop.priceAED, currency)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: Staged Property Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.75rem',
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
                  letterSpacing: '0.12em',
                  color: 'var(--text-secondary)',
                }}
              >
                <MapPin size={12} color="var(--gold-primary)" />
                {currentProp.community}
              </span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 3.4vw, 2.8rem)',
                lineHeight: 1.15,
                fontWeight: 700,
                color: '#FFF',
                marginBottom: '0.85rem',
              }}
            >
              {currentProp.title}
            </h3>

            <p
              style={{
                fontSize: '1.05rem',
                fontFamily: 'var(--font-display)',
                color: 'var(--gold-light)',
                marginBottom: '1rem',
                letterSpacing: '0.04em',
              }}
            >
              {currentProp.tagline}
            </p>

            <p
              style={{
                fontSize: '0.88rem',
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
                padding: '1rem 1.25rem',
                borderRadius: '2px',
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: '2rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-dim)', fontSize: '0.64rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  <Bed size={12} />
                  <span>Residences</span>
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {currentProp.bedrooms}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-dim)', fontSize: '0.64rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  <Layers size={12} />
                  <span>Area</span>
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                  {currentProp.builtUpAreaSqFt}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-dim)', fontSize: '0.64rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  <span>Handover</span>
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: '0.86rem', color: 'var(--gold-light)', marginTop: '0.25rem' }}>
                  {currentProp.completionDate}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onSelectProperty(currentProp)}
                aria-label={`Explore architectural narrative for ${currentProp.title}`}
                className="btn-gold"
                style={{ flex: 1, minWidth: '170px', padding: '0.8rem 1.4rem' }}
              >
                <span>EXPLORE ARCHITECTURE</span>
                <Eye size={14} aria-hidden="true" />
              </button>

              <button
                onClick={() => onInquire(currentProp)}
                aria-label={`Inquire about private allocation for ${currentProp.title}`}
                className="btn-secondary"
                style={{ flex: 1, minWidth: '170px', padding: '0.8rem 1.4rem' }}
              >
                <span>ALLOCATION BRIEF</span>
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
