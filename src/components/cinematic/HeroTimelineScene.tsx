import type { TimelineScene } from '../../types';
import type { FC } from 'react';
import { ArrowDown } from 'lucide-react';

interface HeroTimelineSceneProps {
  scene: TimelineScene;
  progress: number;
  onExploreClick: () => void;
}

export const HeroTimelineScene: FC<HeroTimelineSceneProps> = ({
  scene,
  progress,
  onExploreClick,
}) => {
  const cameraScale = 1.0 + progress * 0.15;
  const contentTranslateY = -progress * 35;

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
        padding: 'clamp(5.5rem, 11vh, 7.5rem) clamp(1rem, 4vw, 2.5rem) clamp(2.5rem, 6vh, 4rem) clamp(1rem, 4vw, 2.5rem)',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Emerging Dubai Skyline Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(ellipse at center, rgba(7,7,7,0.4) 0%, rgba(7,7,7,0.95) 85%), url(${scene.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          opacity: 0.65,
          transform: `scale(${cameraScale})`,
          transition: 'transform 0.1s linear',
        }}
      />

      {/* Hero Editorial Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          maxWidth: '880px',
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
        <div
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--gold-primary)',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            marginBottom: '1.25rem',
          }}
        >
          DUBAI ULTRA-PRIME PORTFOLIO
        </div>

        {/* Monumental Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.85rem, 4.5vw, 3.8rem)',
            lineHeight: 1.15,
            fontWeight: 700,
            letterSpacing: '0.04em',
            textAlign: 'center',
            marginBottom: '1.25rem',
            maxWidth: '820px',
          }}
        >
          <span className="gold-gradient-text">REAL ESTATE WITHOUT COMPROMISE.</span>
        </h1>

        {/* Refined Narrative */}
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(0.9rem, 1.15vw, 1.05rem)',
            color: 'var(--text-secondary)',
            maxWidth: '560px',
            lineHeight: 1.7,
            fontWeight: 300,
            marginBottom: '2rem',
          }}
        >
          Where sovereign capital commands private crystal archipelagoes, sky-high penthouses, and irreplaceable trophy estates.
        </p>

        {/* Elegant Action */}
        <div>
          <button
            onClick={onExploreClick}
            aria-label="Explore curated Dubai residences"
            className="btn-gold"
            style={{ minWidth: '200px', padding: '0.85rem 1.8rem' }}
          >
            <span>EXPLORE RESIDENCES</span>
            <ArrowDown size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
