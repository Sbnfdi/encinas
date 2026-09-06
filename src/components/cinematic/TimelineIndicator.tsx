import type { TimelineScene } from '../../types';
import type { FC } from 'react';

interface TimelineIndicatorProps {
  scenes: TimelineScene[];
  currentSceneIndex: number;
  globalProgress: number; // 0.0 to 1.0
  onSelectScene: (index: number) => void;
}

export const TimelineIndicator: FC<TimelineIndicatorProps> = ({
  scenes,
  currentSceneIndex,
  globalProgress,
  onSelectScene,
}) => {
  const getSceneShortLabel = (scene: TimelineScene) => {
    switch (scene.sceneType) {
      case 'HERO': return 'DUBAI';
      case 'PROPERTY': return 'PROPERTIES';
      case 'COMMUNITY': return 'COMMUNITIES';
      case 'DEVELOPER': return 'DEVELOPERS';
      case 'SERVICES': return 'SERVICES';
      case 'INVESTMENT': return 'INVESTMENT';
      case 'BRAND': return 'ENCINAS';
      case 'CTA': return 'CONSULTATION';
      default: return scene.title.slice(0, 10);
    }
  };

  return (
    <nav
      aria-label="Timeline navigation"
      style={{
        position: 'fixed',
        left: '2.5rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem',
        pointerEvents: 'auto',
      }}
    >
      {/* Desktop sleek vertical rail */}
      <div className="hidden md:flex flex-col gap-3.5" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {scenes.map((scene, idx) => {
          const isActive = idx === currentSceneIndex;
          const isPassed = idx < currentSceneIndex;
          const orderNum = (idx + 1).toString().padStart(2, '0');

          return (
            <button
              key={scene.id}
              onClick={() => onSelectScene(idx)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.3rem 0',
                textAlign: 'left',
                outline: 'none',
              }}
              title={`Jump to Scene ${orderNum}: ${scene.title}`}
            >
              {/* Indicator Node */}
              <div
                style={{
                  position: 'relative',
                  width: isActive ? '28px' : '14px',
                  height: '2px',
                  backgroundColor: isActive
                    ? 'var(--gold-primary)'
                    : isPassed
                    ? 'rgba(197, 168, 128, 0.45)'
                    : 'rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? '0 0 10px rgba(197, 168, 128, 0.7)' : 'none',
                }}
              />

              {/* Label & Number */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.68rem',
                  letterSpacing: '0.18em',
                  fontFamily: 'var(--font-sans)',
                  color: isActive ? 'var(--gold-light)' : 'rgba(255, 255, 255, 0.4)',
                  opacity: isActive ? 1 : 0.45,
                  transform: isActive ? 'translateX(4px)' : 'none',
                  transition: 'all 0.35s ease',
                  fontWeight: isActive ? 600 : 400,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontFamily: 'var(--font-serif)', opacity: isActive ? 1 : 0.6 }}>{orderNum}</span>
                <span>{getSceneShortLabel(scene)}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile minimal pill indicator (01 / 08) */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 60,
        }}
        className="md:hidden"
      >
        <div
          className="glass-panel"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.45rem 0.9rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            color: 'var(--gold-light)',
            border: '1px solid var(--border-gold)',
          }}
        >
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>
            {((currentSceneIndex + 1).toString().padStart(2, '0'))}
          </span>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ opacity: 0.6 }}>
            {scenes.length.toString().padStart(2, '0')}
          </span>
          <div
            style={{
              width: '24px',
              height: '2px',
              background: 'rgba(255,255,255,0.2)',
              marginLeft: '4px',
              borderRadius: '1px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${globalProgress * 100}%`,
                height: '100%',
                backgroundColor: 'var(--gold-primary)',
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
