import React, { useState, useEffect, useRef, useMemo } from 'react';
import type {
  TimelineScene,
  Property,
  Community,
  Developer,
  ConsultationInquiry
} from './types';
import {
  INITIAL_TIMELINE_SCENES,
  INITIAL_PROPERTIES,
  INITIAL_COMMUNITIES,
  INITIAL_DEVELOPERS,
  INITIAL_INQUIRIES
} from './data/initialData';
import { ThreeCanvas } from './components/cinematic/ThreeCanvas';
import { AudioAmbience } from './components/cinematic/AudioAmbience';
import { TimelineIndicator } from './components/cinematic/TimelineIndicator';
import { HeroTimelineScene } from './components/cinematic/HeroTimelineScene';
import { PropertyReelScene } from './components/cinematic/PropertyReelScene';
import { CommunityTimelineScene } from './components/cinematic/CommunityTimelineScene';
import { DeveloperTimelineScene } from './components/cinematic/DeveloperTimelineScene';
import { InvestmentBrandScene } from './components/cinematic/InvestmentBrandScene';
import { ConsultationScene } from './components/cinematic/ConsultationScene';
import { PropertyExplorer } from './components/discovery/PropertyExplorer';
import { PropertyDetailModal } from './components/discovery/PropertyDetailModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { ArrowDown, Compass, Settings, Sparkles } from 'lucide-react';

export function App() {
  // PERSISTED CMS STATE
  const [timelineScenes, setTimelineScenes] = useState<TimelineScene[]>(() => {
    const saved = localStorage.getItem('encinas_timeline_scenes');
    return saved ? JSON.parse(saved) : INITIAL_TIMELINE_SCENES;
  });

  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('encinas_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [communities] = useState<Community[]>(INITIAL_COMMUNITIES);
  const [developers] = useState<Developer[]>(INITIAL_DEVELOPERS);

  const [inquiries, setInquiries] = useState<ConsultationInquiry[]>(() => {
    const saved = localStorage.getItem('encinas_inquiries');
    return saved ? JSON.parse(saved) : INITIAL_INQUIRIES;
  });

  // ACTIVE MODALS & ADMIN
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // SCROLL TIMELINE DRIVER
  const [globalProgress, setGlobalProgress] = useState<number>(0);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);

  // Specific progress for the pinned Property Reel section
  const propertyReelTrackRef = useRef<HTMLDivElement>(null);
  const [propertyReelProgress, setPropertyReelProgress] = useState<number>(0);

  // Active scenes (filtered for isActive)
  const activeScenes = useMemo(() => {
    return timelineScenes.filter((s) => s.isActive);
  }, [timelineScenes]);

  // Global scroll listener & Intersection Observer for timeline scenes
  useEffect(() => {
    const sceneIds = [
      'scene-hero',
      'scene-properties',
      'scene-communities',
      'scene-developers',
      'scene-investment',
      'scene-philosophy',
      'scene-consultation',
      'property-discovery',
    ];

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalDocHeight > 0) {
            const progress = Math.min(1, Math.max(0, window.scrollY / totalDocHeight));
            setGlobalProgress(progress);
          }

          // Track Property Reel internal horizontal progress
          const reelTrack = propertyReelTrackRef.current;
          if (reelTrack) {
            const rect = reelTrack.getBoundingClientRect();
            const trackScrollable = rect.height - window.innerHeight;
            if (trackScrollable > 0) {
              const scrolledInTrack = -rect.top;
              const p = Math.min(1, Math.max(0, scrolledInTrack / trackScrollable));
              setPropertyReelProgress(p);
            }
          }

          // Identify active scene based on viewport position
          const scrollPos = window.scrollY + window.innerHeight * 0.35;
          for (let i = sceneIds.length - 1; i >= 0; i--) {
            const el = document.getElementById(sceneIds[i]);
            if (el && el.offsetTop <= scrollPos) {
              setCurrentSceneIndex(Math.min(activeScenes.length - 1, i));
              break;
            }
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeScenes.length]);

  // Persist state updates
  const handleUpdateScenes = (updated: TimelineScene[]) => {
    setTimelineScenes(updated);
    localStorage.setItem('encinas_timeline_scenes', JSON.stringify(updated));
  };

  const handleUpdateProperties = (updated: Property[]) => {
    setProperties(updated);
    localStorage.setItem('encinas_properties', JSON.stringify(updated));
  };

  const handleUpdateInquiries = (updated: ConsultationInquiry[]) => {
    setInquiries(updated);
    localStorage.setItem('encinas_inquiries', JSON.stringify(updated));
  };

  const handleAddInquiry = async (inquiryData: Omit<ConsultationInquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInq: ConsultationInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'New',
    };
    const updated = [newInq, ...inquiries];
    handleUpdateInquiries(updated);
    return true;
  };

  // Jump directly to a scene on click
  const jumpToScene = (sceneIndex: number) => {
    const sceneIds = [
      'scene-hero',
      'scene-properties',
      'scene-communities',
      'scene-developers',
      'scene-investment',
      'scene-philosophy',
      'scene-consultation',
      'property-discovery',
    ];

    const targetId = sceneIds[sceneIndex] || sceneIds[0];
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToConsultation = () => {
    const el = document.getElementById('scene-consultation');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDiscovery = () => {
    const el = document.getElementById('property-discovery');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const currentScene = activeScenes[currentSceneIndex] || activeScenes[0];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#070707' }}>
      {/* 3D Real-time Architectural Camera Canvas */}
      <ThreeCanvas scrollProgress={globalProgress} reducedMotion={reducedMotion} />

      {/* Cinematic Vignette Overlay */}
      <div className="vignette-layer" />

      {/* Top Floating Glass Navigation Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          padding: '1.1rem 3vw',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(7,7,7,0.85) 0%, transparent 100%)',
        }}
      >
        {/* Brand Identity */}
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a
            href="#scene-hero"
            onClick={(e) => {
              e.preventDefault();
              jumpToScene(0);
            }}
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>⚜️</span>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '0.2em',
                color: '#FFF',
              }}
            >
              ENCINAS
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'var(--gold-primary)',
                borderLeft: '1px solid rgba(255,255,255,0.2)',
                paddingLeft: '0.75rem',
                fontWeight: 600,
              }}
            >
              DUBAI
            </span>
          </a>
        </div>

        {/* Center Minimal Active Scene Tracker */}
        <div
          className="hidden md:flex items-center gap-3 glass-pill"
          style={{
            pointerEvents: 'auto',
            padding: '0.4rem 1.1rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            letterSpacing: '0.16em',
            color: 'var(--gold-light)',
          }}
        >
          <span style={{ opacity: 0.5, fontFamily: 'var(--font-serif)' }}>
            SCENE {((currentSceneIndex + 1).toString().padStart(2, '0'))}
          </span>
          <span style={{ opacity: 0.3 }}>•</span>
          <span style={{ fontWeight: 600 }}>{currentScene.title}</span>
        </div>

        {/* Right Actions: Sound Atmosphere + Admin Toggle + CTA */}
        <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Audio Ambience Synthesizer */}
          <AudioAmbience />

          {/* Admin CMS Switcher */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="glass-pill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            title="Open Operational Admin CMS & Story Builder"
          >
            <Settings size={13} color="var(--gold-primary)" />
            <span className="hidden sm:inline">CMS BUILDER</span>
          </button>

          {/* Direct Consultation CTA */}
          <button
            onClick={scrollToConsultation}
            className="btn-gold"
            style={{ padding: '0.45rem 1.25rem', fontSize: '0.72rem' }}
          >
            <span>CONSULTATION</span>
          </button>
        </div>
      </header>

      {/* Timeline Indicator Rail (Left Fixed Rail) */}
      <TimelineIndicator
        scenes={activeScenes}
        currentSceneIndex={currentSceneIndex}
        globalProgress={globalProgress}
        onSelectScene={jumpToScene}
      />

      {/* ================================================================ */}
      {/* 01 — HERO SCENE: THE HORIZON (DUBAI SKYLINE EMERGENCE)           */}
      {/* ================================================================ */}
      <section id="scene-hero" style={{ position: 'relative', zIndex: 10 }}>
        {activeScenes[0] && (
          <HeroTimelineScene
            scene={activeScenes[0]}
            progress={Math.min(1, globalProgress * 6)}
            onExploreClick={() => jumpToScene(1)}
          />
        )}
      </section>

      {/* ================================================================ */}
      {/* 02 — PINNED HORIZONTAL PROPERTY REEL                             */}
      {/* Vertical scroll drives horizontal property showcase              */}
      {/* ================================================================ */}
      <section
        id="scene-properties"
        ref={propertyReelTrackRef}
        style={{
          position: 'relative',
          height: '240vh', // Pinned scroll track for horizontal reel travel
          zIndex: 15,
        }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <PropertyReelScene
            properties={properties}
            progress={propertyReelProgress}
            onSelectProperty={(p) => setSelectedProperty(p)}
            onInquire={() => scrollToConsultation()}
          />
        </div>
      </section>

      {/* ================================================================ */}
      {/* 03 — COMMUNITY TIMELINE: DUBAI ARCHIPELAGO JOURNEY               */}
      {/* ================================================================ */}
      <section
        id="scene-communities"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 15,
          padding: '6rem 0',
        }}
      >
        <CommunityTimelineScene
          communities={communities}
          progress={globalProgress}
          onSelectCommunity={() => scrollToDiscovery()}
        />
      </section>

      {/* ================================================================ */}
      {/* 04 — DEVELOPER TIMELINE: TIER-1 MASTER BUILDERS                  */}
      {/* ================================================================ */}
      <section
        id="scene-developers"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 15,
          padding: '6rem 0',
        }}
      >
        <DeveloperTimelineScene
          developers={developers}
          progress={globalProgress}
          onSelectDeveloper={() => scrollToDiscovery()}
        />
      </section>

      {/* ================================================================ */}
      {/* 05 — INVESTMENT FRAMEWORK (0% TAX & GOLDEN VISA)                 */}
      {/* ================================================================ */}
      <section
        id="scene-investment"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 15,
          padding: '6rem 0',
        }}
      >
        {activeScenes[5] && (
          <InvestmentBrandScene
            scene={activeScenes[5]}
            progress={globalProgress}
            onOpenConsultation={() => scrollToConsultation()}
          />
        )}
      </section>

      {/* ================================================================ */}
      {/* 06 — ENCINAS PHILOSOPHY & DISCIPLINE                             */}
      {/* ================================================================ */}
      <section
        id="scene-philosophy"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 15,
          padding: '6rem 0',
        }}
      >
        {activeScenes[6] && (
          <InvestmentBrandScene
            scene={activeScenes[6]}
            progress={globalProgress}
            onOpenConsultation={() => scrollToConsultation()}
          />
        )}
      </section>

      {/* ================================================================ */}
      {/* 07 — PRIVATE ACQUISITION CONSULTATION BRIEFING                   */}
      {/* ================================================================ */}
      <section
        id="scene-consultation"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 15,
        }}
      >
        {activeScenes[7] && (
          <ConsultationScene
            scene={activeScenes[7]}
            onSubmitInquiry={handleAddInquiry}
          />
        )}
      </section>

      {/* Transition Prompt to Practical Discovery */}
      <div
        style={{
          position: 'relative',
          zIndex: 25,
          textAlign: 'center',
          padding: '4rem 1rem 3rem 1rem',
          background: 'linear-gradient(to bottom, transparent, #0A0A0A)',
        }}
      >
        <button
          onClick={scrollToDiscovery}
          className="btn-secondary"
          style={{ padding: '0.9rem 2.2rem' }}
        >
          <Compass size={16} />
          <span>TRANSITION TO PROPERTY DISCOVERY EXPLORER</span>
          <ArrowDown size={14} />
        </button>
      </div>

      {/* ================================================================ */}
      {/* 08 — POST-TIMELINE PRACTICAL PROPERTY EXPLORER                   */}
      {/* ================================================================ */}
      <PropertyExplorer
        properties={properties}
        communities={communities}
        developers={developers}
        onSelectProperty={(prop) => setSelectedProperty(prop)}
        onInquireProperty={(prop) => {
          setSelectedProperty(null);
          scrollToConsultation();
        }}
      />

      {/* Luxury Footer */}
      <footer
        style={{
          position: 'relative',
          zIndex: 20,
          backgroundColor: '#050505',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '4rem 4vw 3rem 4vw',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.3rem' }}>⚜️</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.15em', color: '#FFF' }}>
                ENCINAS
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '320px' }}>
              Private sovereign real estate advisory for ultra-high-net-worth acquisitions across Dubai's most commanding blue-chip archipelagoes and high-rise towers.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-primary)', marginBottom: '1rem', fontWeight: 600 }}>
              Global Private Desks
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li>Dubai: Gate Precinct 4, DIFC</li>
              <li>London: 42 Berkeley Square, Mayfair</li>
              <li>Zurich: Bahnhofstrasse 18</li>
              <li>Singapore: Marina Bay Financial Centre</li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-primary)', marginBottom: '1rem', fontWeight: 600 }}>
              Advisory Mandates
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li>Private Island Parcels</li>
              <li>Off-Plan Boardroom Allocations</li>
              <li>Sky Penthouses & Full Floors</li>
              <li>UAE 10-Year Golden Visa Facilitation</li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold-primary)', marginBottom: '1rem', fontWeight: 600 }}>
              Discretion & Protocol
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
              All client interactions are protected under bilateral non-disclosure agreements. Zero broker fees on direct developer off-plan allocations.
            </p>
            <div style={{ marginTop: '1.25rem' }}>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: reducedMotion ? 'var(--gold-light)' : 'var(--text-dim)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '2px',
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                }}
              >
                MOTION: {reducedMotion ? 'REDUCED' : 'CINEMATIC'}
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.75rem',
            color: 'var(--text-dim)',
          }}
        >
          <div>
            © 2026 ENCINAS Real Estate LLC. All rights reserved. Registered with Dubai Real Estate Regulatory Authority (RERA).
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Protocol</span>
            <span>Terms of Mandate</span>
            <span style={{ color: 'var(--gold-primary)', cursor: 'pointer' }} onClick={() => setIsAdminOpen(true)}>
              CMS Admin
            </span>
          </div>
        </div>
      </footer>

      {/* ================================================================ */}
      {/* FULL PROPERTY TIMELINE MODAL                                     */}
      {/* ================================================================ */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onInquire={(p) => {
          setSelectedProperty(null);
          scrollToConsultation();
        }}
      />

      {/* ================================================================ */}
      {/* OPERATIONAL ADMIN CMS PORTAL                                    */}
      {/* ================================================================ */}
      {isAdminOpen && (
        <AdminPortal
          timelineScenes={timelineScenes}
          properties={properties}
          communities={communities}
          developers={developers}
          inquiries={inquiries}
          onUpdateScenes={handleUpdateScenes}
          onUpdateProperties={handleUpdateProperties}
          onUpdateInquiries={handleUpdateInquiries}
          onCloseAdmin={() => setIsAdminOpen(false)}
          onPreviewScene={(sceneIdx) => {
            setIsAdminOpen(false);
            setTimeout(() => jumpToScene(sceneIdx), 150);
          }}
        />
      )}
    </div>
  );
}
export default App;
