import React, { useState, useMemo } from 'react';
import type { Property, FilterState, Community, Developer } from '../../types';
import { Bed, ChevronRight, Eye, Layers, MapPin, RotateCcw, Search, SlidersHorizontal, Sparkles } from 'lucide-react';

interface PropertyExplorerProps {
  properties: Property[];
  communities: Community[];
  developers: Developer[];
  onSelectProperty: (property: Property) => void;
  onInquireProperty: (property: Property) => void;
}

export const PropertyExplorer: React.FC<PropertyExplorerProps> = ({
  properties,
  communities,
  developers,
  onSelectProperty,
  onInquireProperty,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    developer: 'ALL',
    community: 'ALL',
    type: 'ALL',
    bedrooms: 'ALL',
    status: 'ALL',
    minPrice: 0,
    maxPrice: 100000000,
  });

  const [showFilterBar, setShowFilterBar] = useState(false);

  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDev = item.developer.toLowerCase().includes(q);
        const matchComm = item.community.toLowerCase().includes(q);
        if (!matchTitle && !matchDev && !matchComm) return false;
      }
      if (filters.developer !== 'ALL' && item.developer !== filters.developer) return false;
      if (filters.community !== 'ALL' && item.community !== filters.community) return false;
      if (filters.type !== 'ALL' && item.type !== filters.type) return false;
      if (filters.status !== 'ALL' && item.status !== filters.status) return false;
      if (item.priceAED < filters.minPrice || item.priceAED > filters.maxPrice) return false;
      return true;
    });
  }, [properties, filters]);

  const resetFilters = () => {
    setFilters({
      search: '',
      developer: 'ALL',
      community: 'ALL',
      type: 'ALL',
      bedrooms: 'ALL',
      status: 'ALL',
      minPrice: 0,
      maxPrice: 100000000,
    });
  };

  return (
    <section
      id="property-discovery"
      style={{
        position: 'relative',
        zIndex: 20,
        backgroundColor: '#0A0A0A',
        borderTop: '1px solid rgba(197, 168, 128, 0.18)',
        padding: '6rem 4vw',
      }}
    >
      <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            marginBottom: '3rem',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontSize: '0.72rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--gold-primary)',
            }}
          >
            <Sparkles size={13} />
            <span>PRACTICAL SEARCH TRANSITION • ULTRA-LUXURY INVENTORY</span>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 3.8vw, 3.4rem)',
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  color: '#FFF',
                }}
              >
                PROPERTY DISCOVERY REPERTORY
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem', maxWidth: '640px' }}>
                Filter across verified off-plan allocations, private island palaces, and high-floor penthouses with direct developer terms.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={() => setShowFilterBar(!showFilterBar)}
                className="btn-secondary"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem' }}
              >
                <SlidersHorizontal size={14} />
                <span>{showFilterBar ? 'HIDE FILTERS' : 'ADVANCED FILTERS'}</span>
              </button>

              <button
                onClick={resetFilters}
                className="btn-secondary"
                style={{ padding: '0.65rem 1rem', fontSize: '0.75rem' }}
                title="Reset all filters"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div
          className="glass-panel"
          style={{
            padding: '1.5rem',
            borderRadius: '4px',
            marginBottom: '2.5rem',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Main Search Row */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: showFilterBar ? '1.5rem' : '0' }}>
            <div style={{ position: 'relative', flex: 2, minWidth: '260px' }}>
              <input
                type="text"
                placeholder="Search developments, developers, or island enclaves..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem 0.8rem 2.6rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '2px',
                  color: '#FFF',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
              <Search size={15} color="var(--gold-primary)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <div style={{ flex: 1, minWidth: '180px' }}>
              <select
                value={filters.community}
                onChange={(e) => setFilters({ ...filters, community: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  background: '#141414',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '2px',
                  color: '#FFF',
                  fontSize: '0.84rem',
                  outline: 'none',
                }}
              >
                <option value="ALL">All Communities</option>
                {communities.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1, minWidth: '180px' }}>
              <select
                value={filters.developer}
                onChange={(e) => setFilters({ ...filters, developer: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  background: '#141414',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '2px',
                  color: '#FFF',
                  fontSize: '0.84rem',
                  outline: 'none',
                }}
              >
                <option value="ALL">All Developers</option>
                {developers.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilterBar && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: '1.25rem',
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                  Property Classification
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    background: '#141414',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '2px',
                    color: '#FFF',
                    fontSize: '0.84rem',
                    outline: 'none',
                  }}
                >
                  <option value="ALL">All Types</option>
                  <option value="Waterfront Villa">Waterfront Villa</option>
                  <option value="Sky Penthouse">Sky Penthouse</option>
                  <option value="Branded Residence">Branded Residence</option>
                  <option value="Private Island Mansion">Private Island Mansion</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                  Allocation Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    background: '#141414',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '2px',
                    color: '#FFF',
                    fontSize: '0.84rem',
                    outline: 'none',
                  }}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Off-Plan Exclusive">Off-Plan Exclusive</option>
                  <option value="Recently Launched">Recently Launched</option>
                  <option value="Handover Ready">Handover Ready</option>
                  <option value="VIP Allocation">VIP Allocation</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.4rem' }}>
                  Maximum Budget (AED)
                </label>
                <select
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    background: '#141414',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '2px',
                    color: '#FFF',
                    fontSize: '0.84rem',
                    outline: 'none',
                  }}
                >
                  <option value="100000000">Any Price Cap</option>
                  <option value="5000000">Up to AED 5M (~$1.36M)</option>
                  <option value="10000000">Up to AED 10M (~$2.72M)</option>
                  <option value="25000000">Up to AED 25M (~$6.8M)</option>
                  <option value="50000000">Up to AED 50M (~$13.6M)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>
            Showing <strong style={{ color: 'var(--gold-light)' }}>{filteredProperties.length}</strong> ultra-luxury assets
          </span>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
            Direct Developer Verification
          </span>
        </div>

        {/* Properties Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '2rem',
          }}
        >
          {filteredProperties.map((prop) => (
            <div
              key={prop.id}
              className="glass-panel"
              style={{
                borderRadius: '4px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.35s ease',
              }}
            >
              {/* Card Image */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/10',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                onClick={() => onSelectProperty(prop)}
              >
                <img
                  src={prop.featuredImage}
                  alt={prop.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
                />
                {/* Status Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.8rem',
                    background: 'rgba(7,7,7,0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '9999px',
                    fontSize: '0.68rem',
                    color: 'var(--gold-light)',
                    letterSpacing: '0.12em',
                  }}
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#4ADE80' }} />
                  <span>{prop.status}</span>
                </div>

                {/* Property Type Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    padding: '0.3rem 0.75rem',
                    background: 'rgba(0,0,0,0.75)',
                    borderRadius: '2px',
                    fontSize: '0.68rem',
                    color: '#FFF',
                    letterSpacing: '0.08em',
                  }}
                >
                  {prop.type}
                </div>
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                }}
              >
                {/* Meta */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold-primary)', fontWeight: 600 }}>
                    {prop.developer}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={11} color="var(--gold-primary)" />
                    {prop.community}
                  </span>
                </div>

                {/* Title */}
                <h3
                  onClick={() => onSelectProperty(prop)}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.35rem',
                    color: '#FFF',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                  }}
                >
                  {prop.title}
                </h3>

                {/* Tagline */}
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>
                  {prop.tagline}
                </p>

                {/* Specs Pill Matrix */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    padding: '0.85rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '2px',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.76rem', color: 'var(--text-primary)' }}>
                    <Bed size={13} color="var(--gold-primary)" />
                    <span>{prop.bedrooms}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.76rem', color: 'var(--text-primary)' }}>
                    <Layers size={13} color="var(--gold-primary)" />
                    <span>{prop.builtUpAreaSqFt}</span>
                  </div>
                </div>

                {/* Price & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                  <div>
                    <div style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-dim)' }}>
                      Starting Price
                    </div>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--gold-pale)', fontWeight: 600 }}>
                      {prop.startingPriceText}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button
                      onClick={() => onSelectProperty(prop)}
                      className="btn-secondary"
                      style={{ padding: '0.55rem 0.95rem', fontSize: '0.72rem' }}
                      title="View full architectural timeline"
                    >
                      <Eye size={13} />
                      <span>DETAILS</span>
                    </button>

                    <button
                      onClick={() => onInquireProperty(prop)}
                      className="btn-gold"
                      style={{ padding: '0.55rem 0.95rem', fontSize: '0.72rem' }}
                      title="Reserve allocation"
                    >
                      <span>INQUIRE</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
