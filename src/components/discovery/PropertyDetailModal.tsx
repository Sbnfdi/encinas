import React, { useState } from 'react';
import type { Property } from '../../types';
import { Award, Bed, Calendar, Check, ChevronRight, DollarSign, Eye, Layers, MapPin, ShieldCheck, Sparkles, X } from 'lucide-react';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onInquire: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onInquire,
}) => {
  if (!property) return null;

  const [activeTab, setActiveTab] = useState<'narrative' | 'architecture' | 'amenities' | 'payment' | 'gallery'>('narrative');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(5, 5, 5, 0.95)',
        backdropFilter: 'blur(20px)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Fixed Floating Navigation Bar */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(8, 8, 8, 0.88)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(197, 168, 128, 0.25)',
          padding: '1rem 4vw',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold-primary)' }}>
              {property.developer} • {property.community}
            </span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFF', fontWeight: 600 }}>
              {property.title}
            </span>
          </div>
        </div>

        {/* Stepper Tabs */}
        <div className="hidden lg:flex items-center gap-2" style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: 'narrative', label: '01 OVERVIEW' },
            { id: 'architecture', label: '02 ARCHITECTURE' },
            { id: 'amenities', label: '03 AMENITIES' },
            { id: 'payment', label: '04 PAYMENT PLAN' },
            { id: 'gallery', label: '05 GALLERY' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? 'rgba(197, 168, 128, 0.15)' : 'transparent',
                border: activeTab === tab.id ? '1px solid var(--border-gold)' : '1px solid transparent',
                borderRadius: '2px',
                padding: '0.45rem 0.9rem',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                color: activeTab === tab.id ? 'var(--gold-light)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => onInquire(property)}
            className="btn-gold"
            style={{ padding: '0.6rem 1.4rem', fontSize: '0.75rem' }}
          >
            <span>RESERVE ALLOCATION</span>
            <ChevronRight size={14} />
          </button>

          <button
            onClick={onClose}
            className="glass-pill"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFF',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Narrative Body */}
      <div style={{ maxWidth: '1300px', width: '92%', margin: '2rem auto 5rem auto' }}>
        {/* 01 HERO STAGE */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '62vh',
            minHeight: '420px',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '3.5rem',
            boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
            border: '1px solid rgba(197, 168, 128, 0.3)',
          }}
        >
          <img
            src={property.featuredImage}
            alt={property.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(7,7,7,0.95) 0%, rgba(7,7,7,0.3) 50%, transparent 100%)',
            }}
          />

          {/* Hero Caption */}
          <div
            style={{
              position: 'absolute',
              bottom: '2.5rem',
              left: '2.5rem',
              right: '2.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-primary)', fontSize: '0.74rem', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <MapPin size={13} />
                <span>{property.community} • {property.type}</span>
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.2rem, 4.8vw, 3.8rem)',
                  lineHeight: 1.1,
                  fontWeight: 700,
                  color: '#FFF',
                }}
              >
                {property.title}
              </h1>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--gold-light)', marginTop: '0.4rem' }}>
                {property.tagline}
              </p>
            </div>

            <div
              className="glass-panel"
              style={{
                padding: '1.25rem 2rem',
                borderRadius: '4px',
                border: '1px solid var(--border-gold)',
                textAlign: 'right',
              }}
            >
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                Direct Allocation Price
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--gold-pale)', fontWeight: 700 }}>
                {property.startingPriceText}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#4ADE80', marginTop: '0.2rem' }}>
                Status: {property.status}
              </div>
            </div>
          </div>
        </div>

        {/* 02 SPECS MATRIX */}
        <div
          className="glass-panel"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            padding: '1.5rem 2rem',
            borderRadius: '4px',
            marginBottom: '3.5rem',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              Configurations
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFF', fontWeight: 600, marginTop: '0.25rem' }}>
              {property.bedrooms}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              Built-Up Area
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFF', fontWeight: 600, marginTop: '0.25rem' }}>
              {property.builtUpAreaSqFt}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              Anticipated Handover
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--gold-light)', fontWeight: 600, marginTop: '0.25rem' }}>
              {property.completionDate}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
              Master Developer
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#FFF', fontWeight: 600, marginTop: '0.25rem' }}>
              {property.developer}
            </div>
          </div>
        </div>

        {/* 03 NARRATIVE & ARCHITECTURE TWO-COLUMN BREAKDOWN */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
          }}
        >
          {/* Overview */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-primary)', fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
              <Sparkles size={13} />
              <span>THE ACQUISITION OVERVIEW</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#FFF', marginBottom: '1rem' }}>
              A World-Class Residential Statement
            </h3>
            <p style={{ fontSize: '0.94rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {property.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {property.keyFeatures.map((kf, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                  <span style={{ color: 'var(--gold-primary)' }}>✓</span>
                  <span>{kf}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture */}
          <div
            className="glass-panel-gold"
            style={{
              padding: '2.2rem',
              borderRadius: '4px',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-primary)', fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.8rem' }}>
              <Layers size={13} />
              <span>THE ARCHITECTURAL PROSPECTUS</span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#FFF', marginBottom: '1rem' }}>
              Materiality & Vanguard Design
            </h3>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.75, color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
              {property.architectureNarrative}
            </p>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
              <span style={{ fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', display: 'block', marginBottom: '0.6rem' }}>
                Curated Amenities
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {property.amenities.map((am, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.74rem',
                      padding: '0.35rem 0.75rem',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '2px',
                      color: 'var(--gold-light)',
                    }}
                  >
                    {am}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 04 PAYMENT PLAN BREAKDOWN */}
        <div
          className="glass-panel"
          style={{
            padding: '2.5rem',
            borderRadius: '4px',
            marginBottom: '3.5rem',
            border: '1px solid rgba(197, 168, 128, 0.25)',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-primary)', fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
            <DollarSign size={13} />
            <span>PAYMENT SCHEDULE MILESTONES</span>
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#FFF', marginBottom: '1.5rem' }}>
            Flexible Investor Staging
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid var(--gold-primary)' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-dim)' }}>
                Stage 01
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: '#FFF', margin: '0.3rem 0' }}>
                {property.paymentPlan.downPayment}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Immediate Reservation</div>
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid var(--gold-primary)' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-dim)' }}>
                Stage 02
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: '#FFF', margin: '0.3rem 0' }}>
                {property.paymentPlan.duringConstruction}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Escrow Protected Milestones</div>
            </div>

            <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderLeft: '2px solid var(--gold-primary)' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-dim)' }}>
                Stage 03
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--gold-light)', margin: '0.3rem 0' }}>
                {property.paymentPlan.onHandover}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Key Handover & Title Deed</div>
            </div>
          </div>
        </div>

        {/* 05 GALLERY MOSAIC */}
        <div style={{ marginBottom: '3.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#FFF', marginBottom: '1.5rem' }}>
            Visual Architecture Reel
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {property.gallery.map((imgUrl, i) => (
              <div
                key={i}
                style={{
                  borderRadius: '2px',
                  overflow: 'hidden',
                  aspectRatio: '16/10',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <img
                  src={imgUrl}
                  alt={`${property.title} view ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 06 FINAL CTA IN MODAL */}
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            background: 'radial-gradient(ellipse at center, rgba(197, 168, 128, 0.12) 0%, rgba(7,7,7,0.85) 80%)',
            border: '1px solid var(--border-gold)',
            borderRadius: '4px',
          }}
        >
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#FFF', marginBottom: '0.8rem' }}>
            Secure Allocation in {property.title}
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto 2rem auto' }}>
            Our team maintains direct developer boardroom allocations, priority unit selection, and 0% buyer commission.
          </p>
          <button
            onClick={() => onInquire(property)}
            className="btn-gold"
            style={{ minWidth: '260px' }}
          >
            <span>RESERVE PRIVATE ALLOCATION</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
