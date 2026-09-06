import React from 'react';
import type { TimelineScene } from '../../types';
import { ArrowDown, Sparkles } from 'lucide-react';

interface HeroTimelineSceneProps {
  scene: TimelineScene;
  progress: number;
  onExploreClick: () => void;
}

export const HeroTimelineScene: React.FC<HeroTimelineSceneProps> = ({
  scene,
  progress,
  onExploreClick,
}) => {
  // Zoom and depth progression as user scrolls
  const cameraScale = 1.0 + progress * 0.18;
  const contentTranslateY = -progress * 40;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 4vw 4rem 4vw',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Architectural blueprint grid texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(197, 168, 128, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(197, 168, 128, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '70px 70px',
          opacity: 0.8,
          pointerEvents: 'none',
        }}
      />

      {/* Emerging Dubai Skyline Backdrop with dynamic subtle scale */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(ellipse at center, rgba(7,7,7,0.45) 0%, rgba(7,7,7,0.92) 80%), url(${scene.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          opacity: 0.65,
          transform: `scale(${cameraScale})`,
          transition: 'transform 0.1s linear',
        }}
      />

      {/* Hero Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          maxWidth: '1050px',
          width: '100%',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          transform: `translateY(${contentTranslateY}px)`,
          transition: 'transform 0.1s linear',
        }}
      >
        {/* Small Label Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.4rem 1.1rem',
            borderRadius: '9999px',
            border: '1px solid var(--border-gold)',
            background: 'rgba(14, 13, 12, 0.82)',
            backdropFilter: 'blur(12px)',
            marginBottom: '1.25rem',
          }}
        >
          <Sparkles size={13} color="var(--gold-primary)" />
          <span
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--gold-light)',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
            }}
          >
            DUBAI REAL ESTATE ARCHITECTURAL TIMELINE
          </span>
        </div>

        {/* Main Stately Typography */}
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.2rem, 5vw, 4.4rem)',
            lineHeight: 1.15,
            fontWeight: 700,
            letterSpacing: '0.04em',
            textAlign: 'center',
            marginBottom: '1.25rem',
            maxWidth: '920px',
          }}
        >
          <span className="gold-gradient-text">REAL ESTATE WITHOUT COMPROMISE.</span>
        </h1>

        {/* Supporting Narrative */}
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)',
            color: 'var(--text-secondary)',
            maxWidth: '660px',
            lineHeight: 1.65,
            fontWeight: 400,
            marginBottom: '2rem',
          }}
        >
          Where sovereign capital commands private crystal archipelagoes, sky-high penthouses, and irreplaceable trophy estates. Scroll to experience the continuous architectural story.
        </p>

        {/* CTA Button */}
        <div style={{ marginBottom: '2.5rem' }}>
          <button
            onClick={onExploreClick}
            className="btn-gold"
            style={{ minWidth: '220px' }}
          >
            <span>ENTER ARCHITECTURAL REEL</span>
            <ArrowDown size={15} />
          </button>
        </div>

        {/* Telemetry Metrics Bar */}
        <div
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(1.5rem, 4vw, 3.5rem)',
            padding: '0.9rem 2.5rem',
            borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {scene.stats?.map((stat, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--gold-light)',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '0.65rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-dim)',
                  marginTop: '3px',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
