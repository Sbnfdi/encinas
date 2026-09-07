import { useState, useEffect, useRef, useMemo } from 'react';
import type {
  TimelineScene,
  Property,
  Community,
  Developer,
  ConsultationInquiry,
  Currency
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
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { ArrowDown, Compass, Settings, ChevronLeft, ChevronRight, Lock } from 'lucide-react';

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

  // ACTIVE MODALS & AUTH
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return (
      sessionStorage.getItem('encinas_admin_auth') === 'true' ||
      localStorage.getItem('encinas_admin_auth') === 'true'
    );
  });
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [currency, setCurrency] = useState<Currency>('AED');

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

    const handleScroll = () => {
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
    };

    // IntersectionObserver for determining active scene
    const sceneElements = sceneIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sceneIds.indexOf(entry.target.id);
            if (idx !== -1) {
              setCurrentSceneIndex(Math.min(activeScenes.length - 1, idx));
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.35,
      }
    );

    sceneElements.forEach((el) => observer.observe(el));
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
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

  const handleOpenAdmin = () => {
    if (isAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleLogoutAdmin = () => {
    sessionStorage.removeItem('encinas_admin_auth');
    localStorage.removeItem('encinas_admin_auth');
    setIsAuthenticated(false);
    setIsAdminOpen(false);
  };

  // Dynamic Scene lookup for customized timelines
  const heroScene = activeScenes.find((s) => s.sceneType === 'HERO') || activeScenes[0];
  const investmentScene = activeScenes.find((s) => s.sceneType === 'INVESTMENT') || activeScenes[5];
  const philosophyScene = activeScenes.find((s) => s.sceneType === 'BRAND') || activeScenes[6];
  const consultationScene = activeScenes.find((s) => s.sceneType === 'CTA') || activeScenes[7];

  const currentScene = activeScenes[currentSceneIndex] || activeScenes[0];

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#070707' }}>
      {/* Viewport Top 2px Shimmering Journey Progress Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: `${Math.min(100, Math.max(0, globalProgress * 100))}%`,
          height: '2.5px',
          background: 'linear-gradient(90deg, #8E7051 0%, #DFC29B 50%, #FFF 100%)',
          zIndex: 150,
          transition: 'width 0.1s linear',
          boxShadow: '0 0 10px rgba(197, 168, 128, 0.7)',
        }}
      />

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
          padding: 'clamp(0.6rem, 1.8vw, 0.95rem) clamp(0.75rem, 2.5vw, 2.5rem)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(7,7,7,0.92) 0%, rgba(7,7,7,0.7) 70%, transparent 100%)',
        }}
      >
        {/* Main Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {/* Brand Identity */}
          <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
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
                gap: '0.45rem',
              }}
            >
              <span style={{ fontSize: 'clamp(1rem, 3.5vw, 1.25rem)' }}>⚜️</span>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.05rem, 3.5vw, 1.25rem)',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  color: '#FFF',
                }}
              >
                ENCINAS
              </span>
              <span
                style={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'var(--gold-primary)',
                  borderLeft: '1px solid rgba(255,255,255,0.2)',
                  paddingLeft: '0.55rem',
                  fontWeight: 600,
                }}
              >
                DUBAI
              </span>
            </a>
          </div>

          {/* Center Minimal Active Scene Tracker (Desktop) */}
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

          {/* Right Actions: Currency Selector + Sound + CMS Access + CTA */}
          <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 'clamp(0.4rem, 1.2vw, 0.75rem)' }}>
            {/* Multi-Currency Toggle */}
            <div
              className="glass-pill hidden sm:inline-flex"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '2px',
                borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(12, 12, 12, 0.7)',
              }}
              title="Select display currency"
            >
              {(['AED', 'USD', 'EUR', 'GBP'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  style={{
                    background: currency === c ? 'rgba(197, 168, 128, 0.25)' : 'transparent',
                    border: 'none',
                    color: currency === c ? 'var(--gold-light)' : 'var(--text-dim)',
                    borderRadius: '9999px',
                    padding: '0.22rem 0.55rem',
                    fontSize: '0.66rem',
                    letterSpacing: '0.08em',
                    fontWeight: currency === c ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Audio Ambience Synthesizer */}
            <AudioAmbience />

            {/* Admin CMS Access (Protected by Login Gateway) */}
            <button
              onClick={handleOpenAdmin}
              className="glass-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem clamp(0.5rem, 1.2vw, 0.85rem)',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                color: isAuthenticated ? 'var(--gold-light)' : 'var(--text-secondary)',
                cursor: 'pointer',
                border: isAuthenticated ? '1px solid var(--border-gold)' : '1px solid rgba(255,255,255,0.1)',
              }}
              title={isAuthenticated ? 'Open CMS Builder (Authenticated)' : 'Sign In to Operational CMS'}
            >
              {isAuthenticated ? <Settings size={13} color="var(--gold-primary)" /> : <Lock size={12} color="var(--gold-primary)" />}
              <span className="hidden sm:inline">CMS BUILDER</span>
            </button>

            {/* Direct Consultation CTA */}
            <button
              onClick={scrollToConsultation}
              className="btn-gold"
              style={{ padding: '0.45rem clamp(0.65rem, 1.8vw, 1.25rem)', fontSize: 'clamp(0.65rem, 1.6vw, 0.72rem)' }}
            >
              <span className="hidden sm:inline">CONSULTATION</span>
              <span className="sm:hidden">CONSULT</span>
            </button>
          </div>
        </div>

        {/* Dedicated Scene Tracker (Mobile: touch-interactive with stepping) */}
        <div className="flex md:hidden justify-center items-center w-full pointer-events-auto">
          <div
            onClick={() => jumpToScene(currentSceneIndex)}
            className="glass-pill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              padding: '0.26rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.68rem',
              letterSpacing: '0.12em',
              color: 'var(--gold-light)',
              border: '1px solid rgba(197, 168, 128, 0.3)',
              background: 'rgba(14, 13, 12, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              maxWidth: '96vw',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
              cursor: 'pointer',
            }}
            title="Current Scene - Tap to focus"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (currentSceneIndex > 0) jumpToScene(currentSceneIndex - 1);
              }}
              disabled={currentSceneIndex === 0}
              style={{
                background: 'transparent',
                border: 'none',
                color: currentSceneIndex === 0 ? 'rgba(255,255,255,0.2)' : 'var(--gold-primary)',
                cursor: currentSceneIndex === 0 ? 'default' : 'pointer',
                padding: '0 2px',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Previous scene"
            >
              <ChevronLeft size={13} />
            </button>

            <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.72rem' }}>
              SCENE {((currentSceneIndex + 1).toString().padStart(2, '0'))}
            </span>
            <span style={{ opacity: 0.35 }}>•</span>
            <span
              style={{
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '52vw',
                color: 'var(--text-primary)',
              }}
            >
              {currentScene.title}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (currentSceneIndex < activeScenes.length - 1) jumpToScene(currentSceneIndex + 1);
              }}
              disabled={currentSceneIndex === activeScenes.length - 1}
              style={{
                background: 'transparent',
                border: 'none',
                color: currentSceneIndex === activeScenes.length - 1 ? 'rgba(255,255,255,0.2)' : 'var(--gold-primary)',
                cursor: currentSceneIndex === activeScenes.length - 1 ? 'default' : 'pointer',
                padding: '0 2px',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Next scene"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* Persistent Elegant Timeline Indicator Rail (Desktop left fixed rail) */}
      <TimelineIndicator
        scenes={activeScenes}
        currentSceneIndex={currentSceneIndex}
        globalProgress={globalProgress}
        onSelectScene={jumpToScene}
        visible={true}
      />

      {/* ================================================================ */}
      {/* 01 — HERO SCENE: THE HORIZON (DUBAI SKYLINE EMERGENCE)           */}
      {/* ================================================================ */}
      <section id="scene-hero" style={{ position: 'relative', zIndex: 10 }}>
        {heroScene && (
          <HeroTimelineScene
            scene={heroScene}
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
          height: '240vh',
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
        {investmentScene && (
          <InvestmentBrandScene
            scene={investmentScene}
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
        {philosophyScene && (
          <InvestmentBrandScene
            scene={philosophyScene}
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
        {consultationScene && (
          <ConsultationScene
            scene={consultationScene}
            onSubmitInquiry={handleAddInquiry}
          />
        )}
      </section>

      {/* Refined Seamless Transition Divider */}
      <div
        style={{
          position: 'relative',
          zIndex: 25,
          textAlign: 'center',
          padding: '5rem 1rem 3rem 1rem',
          background: 'linear-gradient(to bottom, transparent, #070707)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
        }}
      >
        <div style={{ width: '48px', height: '1px', background: 'var(--gold-primary)', opacity: 0.6 }} />
        <button
          onClick={scrollToDiscovery}
          className="btn-secondary"
          style={{ padding: '0.8rem 2rem', fontSize: '0.75rem' }}
        >
          <Compass size={15} color="var(--gold-primary)" />
          <span>EXPLORE COMPLETE PORTFOLIO REPERTORY</span>
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
        currency={currency}
        onSelectProperty={(prop) => setSelectedProperty(prop)}
        onInquireProperty={(_prop) => {
          setSelectedProperty(null);
          scrollToConsultation();
        }}
      />

      {/* Luxury Sovereign Footer */}
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
            <span
              style={{ color: 'var(--gold-primary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
              onClick={handleOpenAdmin}
            >
              <Lock size={11} />
              <span>CMS Portal</span>
            </span>
          </div>
        </div>
      </footer>

      {/* ================================================================ */}
      {/* FULL PROPERTY TIMELINE MODAL                                     */}
      {/* ================================================================ */}
      <PropertyDetailModal
        property={selectedProperty}
        currency={currency}
        onClose={() => setSelectedProperty(null)}
        onInquire={(_p) => {
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
          onLogout={handleLogoutAdmin}
          onPreviewScene={(sceneIdx) => {
            setIsAdminOpen(false);
            setTimeout(() => jumpToScene(sceneIdx), 150);
          }}
        />
      )}

      {/* ================================================================ */}
      {/* SECURE CMS LOGIN GATEWAY MODAL                                   */}
      {/* ================================================================ */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccessLogin={() => {
          setIsAuthenticated(true);
          setIsAdminLoginOpen(false);
          setIsAdminOpen(true);
        }}
      />
    </div>
  );
}

export default App;
