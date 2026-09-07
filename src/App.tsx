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
import { TimelineIndicator } from './components/cinematic/TimelineIndicator';
import { Settings, Lock, Compass, ArrowDown, Menu, X } from 'lucide-react';

export function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
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

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#070707' }}>
      {/* Accessible Skip Navigation Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

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

      {/* Vertical Architectural Timeline Indicator Rail */}
      <TimelineIndicator
        scenes={activeScenes}
        currentSceneIndex={currentSceneIndex}
        globalProgress={globalProgress}
        onSelectScene={jumpToScene}
      />

      {/* Top Floating Luxury Navigation Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          padding: '0.75rem clamp(1rem, 2.5vw, 3.5rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'rgba(7, 7, 7, 0.9)',
          borderBottom: '1px solid rgba(197, 168, 128, 0.14)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Brand Identity */}
        <a
          href="#scene-hero"
          onClick={(e) => {
            e.preventDefault();
            jumpToScene(0);
          }}
          aria-label="Encinas Dubai - Return to Horizon"
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>⚜️</span>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.1rem, 3.2vw, 1.35rem)',
              fontWeight: 800,
              letterSpacing: '0.18em',
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
              paddingLeft: '0.55rem',
              fontWeight: 600,
            }}
          >
            DUBAI
          </span>
        </a>

        {/* Center Desktop Editorial Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="lg:flex hidden items-center gap-8"
        >
          {[
            { label: 'Residences', id: 'scene-properties', index: 1 },
            { label: 'Territories', id: 'scene-communities', index: 2 },
            { label: 'Developers', id: 'scene-developers', index: 3 },
            { label: 'Advisory', id: 'scene-investment', index: 4 },
            { label: 'Portfolio', id: 'property-discovery', index: 7 },
          ].map((item) => {
            const isActive = currentSceneIndex === item.index;
            return (
              <button
                key={item.label}
                onClick={() => {
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? 'var(--gold-light)' : 'var(--text-secondary)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  padding: '0.35rem 0',
                  position: 'relative',
                  transition: 'color 0.25s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-light)')}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {item.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: -2,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '16px',
                      height: '1.5px',
                      background: 'var(--gold-primary)',
                      borderRadius: '1px',
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Currency Selector + Sound + CMS Access + CTA + Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.45rem, 1.2vw, 0.85rem)' }}>
          {/* Multi-Currency Toggle */}
          <div
            className="glass-pill sm:inline-flex hidden"
            style={{
              alignItems: 'center',
              padding: '2px',
              borderRadius: '9999px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(12, 12, 12, 0.75)',
            }}
            role="group"
            aria-label="Display currency selection"
          >
            {(['AED', 'USD', 'EUR', 'GBP'] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                aria-label={`Switch currency to ${c}`}
                aria-pressed={currency === c}
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
            aria-label={isAuthenticated ? 'Open CMS Builder (Authenticated)' : 'Sign In to Operational CMS'}
            className="glass-pill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem clamp(0.55rem, 1.2vw, 0.85rem)',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              color: isAuthenticated ? 'var(--gold-light)' : 'var(--text-secondary)',
              cursor: 'pointer',
              border: isAuthenticated ? '1px solid var(--border-gold)' : '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {isAuthenticated ? <Settings size={13} color="var(--gold-primary)" /> : <Lock size={12} color="var(--gold-primary)" />}
            <span className="md:inline hidden">CMS BUILDER</span>
          </button>

          {/* Direct Consultation CTA */}
          <button
            onClick={scrollToConsultation}
            aria-label="Request confidential advisory consultation"
            className="btn-gold"
            style={{ padding: '0.48rem clamp(0.75rem, 1.8vw, 1.35rem)', fontSize: 'clamp(0.68rem, 1.6vw, 0.74rem)', letterSpacing: '0.12em' }}
          >
            <span>PRIVATE ADVISORY</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden glass-pill"
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '2px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--gold-light)',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(12, 12, 12, 0.75)',
            }}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Out Luxury Navigation Drawer */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 140,
            backgroundColor: 'rgba(7, 7, 7, 0.97)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '5.5rem 2rem 2.5rem 2rem',
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--gold-primary)', fontWeight: 600 }}>
              EXPLORE PORTFOLIO
            </div>
            {[
              { label: 'Residences', id: 'scene-properties', index: 1 },
              { label: 'Territories', id: 'scene-communities', index: 2 },
              { label: 'Developers', id: 'scene-developers', index: 3 },
              { label: 'Advisory', id: 'scene-investment', index: 4 },
              { label: 'Portfolio Repertory', id: 'property-discovery', index: 7 },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  const el = document.getElementById(item.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.35rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span>{item.label}</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--gold-primary)' }}>→</span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                Currency
              </span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {(['AED', 'USD', 'EUR', 'GBP'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    style={{
                      background: currency === c ? 'rgba(197, 168, 128, 0.25)' : 'rgba(255,255,255,0.05)',
                      border: currency === c ? '1px solid var(--border-gold)' : '1px solid transparent',
                      color: currency === c ? 'var(--gold-light)' : 'var(--text-secondary)',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '2px',
                      fontSize: '0.75rem',
                      fontWeight: currency === c ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                scrollToConsultation();
              }}
              className="btn-gold"
              style={{ width: '100%', padding: '0.9rem' }}
            >
              <span>REQUEST PRIVATE ADVISORY</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleOpenAdmin();
              }}
              className="btn-secondary"
              style={{ width: '100%', padding: '0.8rem', fontSize: '0.75rem' }}
            >
              <Lock size={13} color="var(--gold-primary)" />
              <span>{isAuthenticated ? 'OPEN CMS BUILDER' : 'OPERATIONAL CMS SIGN IN'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Semantic Landmark for Accessibility */}
      <main id="main-content">
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
            currency={currency}
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
      </main>

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
