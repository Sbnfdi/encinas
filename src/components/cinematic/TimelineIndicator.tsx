import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, Layers, X } from 'lucide-react';
import type { TimelineScene } from '../../types';

interface TimelineIndicatorProps {
  scenes: TimelineScene[];
  currentSceneIndex: number;
  globalProgress: number; // 0.0 to 1.0
  onSelectScene: (index: number) => void;
  visible?: boolean;
}

export const TimelineIndicator: FC<TimelineIndicatorProps> = ({
  scenes,
  currentSceneIndex,
  globalProgress,
  onSelectScene,
  visible = true,
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Close mobile drawer if indicator becomes invisible
  useEffect(() => {
    if (!visible) {
      setIsMobileDrawerOpen(false);
    }
  }, [visible]);

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

  const handlePrev = () => {
    if (currentSceneIndex > 0) {
      onSelectScene(currentSceneIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentSceneIndex < scenes.length - 1) {
      onSelectScene(currentSceneIndex + 1);
    }
  };

  const currentScene = scenes[currentSceneIndex] || scenes[0];

  return (
    <>
      {/* ================================================================ */}
      {/* DESKTOP SLEEK VERTICAL RAIL (visible on md: screens and above)    */}
      {/* ================================================================ */}
      <nav
        aria-label="Timeline desktop navigation"
        className="hidden md:flex flex-col"
        style={{
          position: 'fixed',
          left: 'clamp(1rem, 2.5vw, 2.5rem)',
          top: '50%',
          transform: visible ? 'translateY(-50%) translateX(0)' : 'translateY(-50%) translateX(-40px)',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          visibility: visible ? 'visible' : 'hidden',
          zIndex: 50,
          gap: '0.85rem',
          transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.4s',
        }}
      >
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
                gap: '0.9rem',
                padding: '0.35rem 0',
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
      </nav>

      {/* ================================================================ */}
      {/* MOBILE INTERACTIVE TIMELINE SCRUBBER (visible on mobile only)    */}
      {/* ================================================================ */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          left: '50%',
          transform: visible ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(40px)',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          visibility: visible ? 'visible' : 'hidden',
          zIndex: 60,
          transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.4s',
          maxWidth: 'calc(100vw - 2rem)',
          width: 'max-content',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: 'rgba(14, 13, 12, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-gold)',
            borderRadius: '9999px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.75)',
            padding: '0.25rem 0.35rem',
            gap: '0.2rem',
          }}
        >
          {/* Previous Scene Button */}
          <button
            onClick={handlePrev}
            disabled={currentSceneIndex === 0}
            style={{
              background: 'transparent',
              border: 'none',
              color: currentSceneIndex === 0 ? 'rgba(255,255,255,0.2)' : 'var(--gold-primary)',
              cursor: currentSceneIndex === 0 ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.35rem',
              borderRadius: '9999px',
              transition: 'background 0.2s ease',
            }}
            title="Previous Scene"
            aria-label="Previous scene"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Center Info & Drawer Trigger */}
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(197, 168, 128, 0.25)',
              borderRadius: '9999px',
              padding: '0.35rem 0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
            title="Open Timeline Navigation"
          >
            <Layers size={12} color="var(--gold-primary)" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-light)', fontWeight: 700 }}>
                {((currentSceneIndex + 1).toString().padStart(2, '0'))}
              </span>
              <span style={{ opacity: 0.35, fontSize: '0.65rem' }}>/</span>
              <span style={{ opacity: 0.5, fontSize: '0.68rem' }}>
                {scenes.length.toString().padStart(2, '0')}
              </span>
              <span style={{ opacity: 0.35 }}>•</span>
              <span style={{ letterSpacing: '0.12em', fontWeight: 600, color: 'var(--gold-pale)', fontSize: '0.7rem' }}>
                {currentScene ? getSceneShortLabel(currentScene) : 'DUBAI'}
              </span>
            </div>

            {/* Mini Progress Bar */}
            <div
              style={{
                width: '18px',
                height: '2px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '1px',
                overflow: 'hidden',
                marginLeft: '2px',
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

            <ChevronUp size={12} color="var(--gold-light)" style={{ opacity: 0.7 }} />
          </button>

          {/* Next Scene Button */}
          <button
            onClick={handleNext}
            disabled={currentSceneIndex === scenes.length - 1}
            style={{
              background: 'transparent',
              border: 'none',
              color: currentSceneIndex === scenes.length - 1 ? 'rgba(255,255,255,0.2)' : 'var(--gold-primary)',
              cursor: currentSceneIndex === scenes.length - 1 ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.35rem',
              borderRadius: '9999px',
              transition: 'background 0.2s ease',
            }}
            title="Next Scene"
            aria-label="Next scene"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* MOBILE TIMELINE QUICK-JUMP DRAWER / MODAL                        */}
      {/* ================================================================ */}
      {isMobileDrawerOpen && (
        <div
          className="md:hidden"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.25s ease-out',
          }}
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <div
            style={{
              background: 'rgba(12, 11, 10, 0.98)',
              borderTop: '1px solid var(--border-gold)',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              padding: '1.25rem 1.25rem 2rem 1.25rem',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.9rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem' }}>⚜️</span>
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.85rem',
                    letterSpacing: '0.16em',
                    fontWeight: 700,
                    color: 'var(--gold-light)',
                  }}
                >
                  ARCHITECTURAL TIMELINE
                </span>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
                aria-label="Close timeline drawer"
              >
                <X size={14} />
              </button>
            </div>

            {/* Scene Selection List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {scenes.map((scene, idx) => {
                const isActive = idx === currentSceneIndex;
                const orderNum = (idx + 1).toString().padStart(2, '0');

                return (
                  <button
                    key={scene.id}
                    onClick={() => {
                      onSelectScene(idx);
                      setIsMobileDrawerOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: isActive
                        ? 'rgba(197, 168, 128, 0.12)'
                        : 'rgba(255, 255, 255, 0.02)',
                      border: isActive
                        ? '1px solid var(--gold-primary)'
                        : '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      width: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: isActive ? 'var(--gold-primary)' : 'var(--text-dim)',
                          minWidth: '24px',
                        }}
                      >
                        {orderNum}
                      </span>
                      <div>
                        <div
                          style={{
                            fontSize: '0.82rem',
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                          }}
                        >
                          {scene.title}
                        </div>
                        <div
                          style={{
                            fontSize: '0.62rem',
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase',
                            color: 'var(--gold-light)',
                            opacity: 0.8,
                            marginTop: '2px',
                          }}
                        >
                          {getSceneShortLabel(scene)}
                        </div>
                      </div>
                    </div>

                    {isActive && (
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
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
          </div>
        </div>
      )}
    </>
  );
};

