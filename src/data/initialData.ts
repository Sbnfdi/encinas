import type { TimelineScene, Property, Community, Developer, ConsultationInquiry } from '../types';

export const INITIAL_TIMELINE_SCENES: TimelineScene[] = [
  {
    id: 'scene-hero',
    slug: 'dubai-skyline',
    title: 'REAL ESTATE WITHOUT COMPROMISE',
    subtitle: 'DUBAI ULTRA-LUXURY COLLECTION',
    description: 'Where sovereign capital meets architectural vanguard. Enter Dubai’s most commanding private residences.',
    sceneType: 'HERO',
    order: 1,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop',
    ctaLabel: 'EXPLORE TIMELINE',
    ctaUrl: '#properties-reel',
    animationMode: 'cinematic-zoom',
    durationWeight: 1.2,
    isActive: true,
    metaBadge: 'PANORAMIC HORIZON',
    stats: [
      { label: 'Prime Yield', value: '7.8% Net' },
      { label: 'Sovereign Tax', value: '0% Tax' },
      { label: 'Transaction Vol', value: '$132B+' }
    ]
  },
  {
    id: 'scene-property-damac-islands',
    slug: 'damac-islands',
    title: 'DAMAC ISLANDS',
    subtitle: 'DUBAI ISLANDS ARCHIPELAGO',
    description: 'Private crystal lagoon living inspired by the world’s most coveted island destinations. Waterfront mansions with private yacht moorings.',
    sceneType: 'PROPERTY',
    propertyId: 'prop-damac-islands',
    order: 2,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop',
    ctaLabel: 'RESERVE ALLOCATION',
    ctaUrl: '#inquiry',
    animationMode: 'horizontal-glide',
    durationWeight: 1.0,
    isActive: true,
    metaBadge: 'WATERFRONT REEL',
    stats: [
      { label: 'Starting Price', value: 'AED 3.2M' },
      { label: 'Payment Plan', value: '70 / 30' },
      { label: 'Handover', value: 'Q4 2028' }
    ]
  },
  {
    id: 'scene-property-volta',
    slug: 'volta-residences',
    title: 'VOLTA ON SZR',
    subtitle: 'DOWNTOWN SKYLINE CORRIDOR',
    description: 'An architectural statement designed for high-velocity living. Sky-high wellbeing sanctuaries with panoramic views of Burj Khalifa and Arabian Gulf.',
    sceneType: 'PROPERTY',
    propertyId: 'prop-volta',
    order: 3,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop',
    ctaLabel: 'VIEW SKY SUITES',
    ctaUrl: '#inquiry',
    animationMode: 'depth-reveal',
    durationWeight: 1.0,
    isActive: true,
    metaBadge: 'SKY SANCTUARIES',
    stats: [
      { label: 'Starting Price', value: 'AED 1.9M' },
      { label: 'Tower Height', value: '60 Levels' },
      { label: 'Handover', value: 'Q1 2027' }
    ]
  },
  {
    id: 'scene-community-palm',
    slug: 'palm-jumeirah-enclave',
    title: 'PALM JUMEIRAH & DUBAI ISLANDS',
    subtitle: 'THE BLUE CHIP SHORES',
    description: 'The world benchmark for coastal real estate. Exclusive billionaire enclaves offering unmatched privacy, private beachfronts, and ultra-high liquidity.',
    sceneType: 'COMMUNITY',
    communityId: 'comm-palm-jumeirah',
    order: 4,
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=2074&auto=format&fit=crop',
    ctaLabel: 'EXPLORE COMMUNITIES',
    ctaUrl: '#communities',
    animationMode: 'ambient-drift',
    durationWeight: 1.1,
    isActive: true,
    metaBadge: 'ICONIC TERRITORIES',
    stats: [
      { label: 'YoY Capital Growth', value: '+24.6%' },
      { label: 'Avg Price/SqFt', value: 'AED 4,800' },
      { label: 'Super-Prime Sales', value: '41% Dubai Total' }
    ]
  },
  {
    id: 'scene-developers',
    slug: 'tier-one-developers',
    title: 'THE MASTER BUILDERS',
    subtitle: 'SOBHA • DAMAC • NAKHEEL • OMNIYAT',
    description: 'We partner directly with institutional developer leadership, securing priority allocations and zero-commission direct-from-boardroom privileges for our clients.',
    sceneType: 'DEVELOPER',
    order: 5,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    ctaLabel: 'DEVELOPER ALLOCATIONS',
    ctaUrl: '#developers',
    animationMode: 'cinematic-zoom',
    durationWeight: 1.0,
    isActive: true,
    metaBadge: 'MASTER ARCHITECTS',
    stats: [
      { label: 'Direct Access', value: 'Boardroom Tier' },
      { label: 'Pre-Market Entry', value: '48h Headstart' },
      { label: 'Buyer Fee', value: '0% Direct' }
    ]
  },
  {
    id: 'scene-investment',
    slug: 'sovereign-wealth-framework',
    title: 'CAPITAL ASYLUM & SOVEREIGN YIELD',
    subtitle: 'UAE STRATEGIC ADVANTAGE',
    description: 'Zero percent property tax, zero capital gains, UAE 10-Year Golden Visa for real estate investors, and a currency pegged solidly to the US Dollar.',
    sceneType: 'INVESTMENT',
    order: 6,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
    ctaLabel: 'INVESTMENT ADVISORY',
    ctaUrl: '#consultation',
    animationMode: 'depth-reveal',
    durationWeight: 1.0,
    isActive: true,
    metaBadge: 'CAPITAL STRATEGY',
    stats: [
      { label: 'Rental Yield Avg', value: '6.5% - 9.1%' },
      { label: 'Currency', value: 'USD Pegged' },
      { label: 'Residency', value: '10-Yr Golden Visa' }
    ]
  },
  {
    id: 'scene-brand',
    slug: 'encinas-philosophy',
    title: 'THE ENCINAS DISCIPLINE',
    subtitle: 'PRIVATE REAL ESTATE FIRM',
    description: 'We do not sell inventory. We audit global wealth mandates, curate irreplaceable architectural positions, and protect your capital longevity.',
    sceneType: 'BRAND',
    order: 7,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    ctaLabel: 'DISCOVER OUR ADVISORY',
    ctaUrl: '#consultation',
    animationMode: 'ambient-drift',
    durationWeight: 1.0,
    isActive: true,
    metaBadge: 'ENCINAS PHILOSOPHY',
    stats: [
      { label: 'Portfolio Managed', value: '$1.4B+' },
      { label: 'Bespoke Advisory', value: 'Strictly VIP' },
      { label: 'Client Retention', value: '96%' }
    ]
  },
  {
    id: 'scene-consultation',
    slug: 'private-consultation',
    title: 'PRIVATE ACQUISITION BRIEFING',
    subtitle: 'BY INVITATION & DIRECT ENQUIRY',
    description: 'Schedule a confidential private viewing, off-plan portfolio audit, or private boardroom briefing with our Managing Partners in DIFC or Monaco.',
    sceneType: 'CTA',
    order: 8,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop',
    ctaLabel: 'REQUEST BRIEFING',
    ctaUrl: '#consultation',
    animationMode: 'cinematic-zoom',
    durationWeight: 1.3,
    isActive: true,
    metaBadge: 'CONFIDENTIAL ADVISORY',
    stats: [
      { label: 'Headquarters', value: 'DIFC Gate Tower' },
      { label: 'Private Desk', value: 'Mayfair & Zurich' },
      { label: 'Confidentiality', value: 'Absolute NDA' }
    ]
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-damac-islands',
    title: 'DAMAC Islands — Coastal Haven',
    tagline: 'Crystal Lagoon Waterfront Palaces',
    developer: 'DAMAC Properties',
    community: 'Dubai Islands',
    type: 'Waterfront Villa',
    priceAED: 6200000,
    priceUSD: '$1,688,000',
    startingPriceText: 'AED 6.2M ($1.69M)',
    bedrooms: '5 - 7 Bedrooms',
    builtUpAreaSqFt: '7,400 - 14,200 sq.ft',
    completionDate: 'Q4 2028',
    status: 'Off-Plan Exclusive',
    featuredImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop'
    ],
    description: 'DAMAC Islands represents a new epoch in ultra-prime Dubai archipelago living. Six island-inspired cluster districts surrounded by swimmable crystal lagoons and white sand beaches.',
    architectureNarrative: 'Curvilinear organic modernism framed with floor-to-ceiling anti-reflective glass, Italian travertine, and private infinity cantilever pools that melt directly into the lagoon.',
    amenities: [
      'Private Yacht Berth',
      'Direct Private Beachfront',
      'Lagoon Wave Park & Spa Sanctuary',
      'Helipad & Executive Valet',
      'Bespoke Butler Service Suite'
    ],
    keyFeatures: [
      'Dual-aspect waterfront orientation',
      'Subterranean 6-car showcase garage',
      'Rooftop stargazing terrace with firepit',
      'Private glass pneumatic elevator'
    ],
    paymentPlan: {
      downPayment: '20% On Booking',
      duringConstruction: '50% Linked to Construction Milestones',
      onHandover: '30% On Key Handover (Q4 2028)',
      postHandover: 'Optional 2-Year Post Handover Facility'
    },
    isFeaturedInTimeline: true
  },
  {
    id: 'prop-volta',
    title: 'Volta on Sheikh Zayed Road',
    tagline: 'Ultra-High Velocity Skyline Sanctuaries',
    developer: 'DAMAC Properties',
    community: 'Downtown & SZR',
    type: 'Sky Penthouse',
    priceAED: 3800000,
    priceUSD: '$1,034,000',
    startingPriceText: 'AED 3.8M ($1.03M)',
    bedrooms: '2 - 4 Bedrooms',
    builtUpAreaSqFt: '2,100 - 5,600 sq.ft',
    completionDate: 'Q1 2027',
    status: 'Recently Launched',
    featuredImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2080&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=2070&auto=format&fit=crop'
    ],
    description: 'Soaring 60 storeys above Dubai’s primary artery, Volta is dedicated to physical and mental longevity, with sensory biohacking pods, sky jogging tracks, and Burj Khalifa vistas.',
    architectureNarrative: 'Aerodynamic vertical sculpture featuring kinetic facade louvres that optimize thermal shade while maximizing 270-degree panorama over DIFC and Downtown.',
    amenities: [
      'Cryotherapy & Bio-Hacking Rooms',
      'Sky Jogging Track at 220 Meters',
      'Multi-Level Infinity Sky Pool',
      'Private Soundproof Podcast Studio',
      'Valet & Concierge Direct Dispatch'
    ],
    keyFeatures: [
      '270° Burj Khalifa & Sea Panorama',
      'Smart circadian lighting systems',
      'Custom Poliform & Miele kitchen suites'
    ],
    paymentPlan: {
      downPayment: '20% On Booking',
      duringConstruction: '60% Staged Payments',
      onHandover: '20% Upon Handover Q1 2027'
    },
    isFeaturedInTimeline: true
  },
  {
    id: 'prop-sobha-seahaven',
    title: 'Sobha SeaHaven — Sky Edition',
    tagline: 'Ultra-Luxury Maritime Living in Dubai Marina',
    developer: 'Sobha Realty',
    community: 'Dubai Marina & Harbour',
    type: 'Sky Penthouse',
    priceAED: 9500000,
    priceUSD: '$2,586,000',
    startingPriceText: 'AED 9.5M ($2.59M)',
    bedrooms: '3 - 5 Bedrooms',
    builtUpAreaSqFt: '3,800 - 8,200 sq.ft',
    completionDate: 'Q4 2026',
    status: 'VIP Allocation',
    featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop'
    ],
    description: 'Overlooking Ain Dubai, Palm Jumeirah, and the superyacht marina, Sobha SeaHaven’s Sky Edition redefines precision craftsmanship with Sobha’s renowned backward integration standard.',
    architectureNarrative: 'Nautical aerodynamic exterior clad in structural metallic skins with oversized wrap-around cantilevered balconies engineered for breezy sea contemplation.',
    amenities: [
      'Observation Deck & Private Cigar Lounge',
      'Private Yacht Charter Service',
      'Infinity Pool with Palm Jumeirah View',
      'Private Cinema & Executive Meeting Suites'
    ],
    keyFeatures: [
      'Full Palm Jumeirah and Arabian Gulf view',
      'Direct access to Dubai Harbour Cruise Terminal',
      'Fitted with Sub-Zero and Gaggenau appliances'
    ],
    paymentPlan: {
      downPayment: '20% On Booking',
      duringConstruction: '60% Construction Milestones',
      onHandover: '20% On Handover'
    },
    isFeaturedInTimeline: true
  },
  {
    id: 'prop-ava-palm',
    title: 'AVA at Palm Jumeirah by OMNIYAT',
    tagline: 'Dorchester Collection Managed Masterpiece',
    developer: 'OMNIYAT',
    community: 'Palm Jumeirah',
    type: 'Private Island Mansion',
    priceAED: 48000000,
    priceUSD: '$13,068,000',
    startingPriceText: 'AED 48M ($13.1M)',
    bedrooms: '4 - 6 Bedrooms',
    builtUpAreaSqFt: '8,500 - 18,000 sq.ft',
    completionDate: 'Q2 2026',
    status: 'Off-Plan Exclusive',
    featuredImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop'
    ],
    description: 'An exclusive collection of only 17 ultra-luxury residences where each home occupies an entire floor or multiple levels, fully serviced by Dorchester Collection hospitality.',
    architectureNarrative: 'Sculptural curved curtain wall designed by world-renowned Foster + Partners, providing each home with an individual 180° private infinity pool suspended in the sky.',
    amenities: [
      'Dorchester Collection 24/7 Dedicated Concierge',
      'Private Infinity Pool on Every Floor',
      'Supercar Lift to Sky Garage',
      'Private Boardroom & Wine Cellar'
    ],
    keyFeatures: [
      'Only 17 ultra-exclusive residences in the tower',
      '4-meter ceiling clearance throughout',
      'Dedicated private elevator opening into private foyer'
    ],
    paymentPlan: {
      downPayment: '25% On Booking',
      duringConstruction: '50% Linked to Structural Completion',
      onHandover: '25% Handover'
    },
    isFeaturedInTimeline: false
  },
  {
    id: 'prop-peninsula-select',
    title: 'Peninsula Five — The Signature Collection',
    tagline: 'Canal-front Masterpiece in Business Bay',
    developer: 'Select Group',
    community: 'Business Bay',
    type: 'Branded Residence',
    priceAED: 2950000,
    priceUSD: '$803,000',
    startingPriceText: 'AED 2.95M ($803K)',
    bedrooms: '1 - 4 Bedrooms',
    builtUpAreaSqFt: '1,200 - 3,900 sq.ft',
    completionDate: 'Q4 2025',
    status: 'Handover Ready',
    featuredImage: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=2069&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=2069&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop'
    ],
    description: 'Directly on the Dubai Water Canal, Peninsula Five represents urban waterfront living within walking distance of Downtown Dubai and the Dubai Mall financial corridor.',
    architectureNarrative: 'Sleek bronze aluminium fins, double-glazed acoustic floor-to-ceiling glass, and warm Scandinavian timber accents overlooking the bustling canal promenade.',
    amenities: [
      'Canal-side Running & Cycling Promenade',
      'Olympic-sized Swimming Pool',
      'Paddle Tennis Courts & Squash Arena',
      'Fine Dining Boardwalk'
    ],
    keyFeatures: [
      'Water canal front with skyline backdrop',
      'High rental yield corridor (8.2% historical)',
      'Substantially completed for immediate investment yield'
    ],
    paymentPlan: {
      downPayment: '30% Immediate Allocation',
      duringConstruction: '20% Prior to Handover',
      onHandover: '50% Final Settlement (Q4 2025)'
    },
    isFeaturedInTimeline: false
  },
  {
    id: 'prop-palm-crown',
    title: 'Palm Crown Beach Villa',
    tagline: 'Private Frond Beachfront Estate',
    developer: 'Nakheel / Dubai Holding',
    community: 'Palm Jumeirah',
    type: 'Waterfront Villa',
    priceAED: 55000000,
    priceUSD: '$14,973,000',
    startingPriceText: 'AED 55M ($14.9M)',
    bedrooms: '6 Bedrooms',
    builtUpAreaSqFt: '11,200 sq.ft',
    completionDate: 'Handover Ready',
    status: 'Off-Plan Exclusive',
    featuredImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop'
    ],
    description: 'An irreplaceable private frond custom estate on the Palm Jumeirah. Enjoy direct private white sand beach frontage with uninterrupted views of the Atlantis Royal and Dubai skyline.',
    architectureNarrative: 'Modern Mediterranean minimalism featuring Calacatta marble slab cladding, motorized sliding glass walls, and water features creating an ambient courtyard sanctuary.',
    amenities: [
      'Private 80ft Shoreline & Mooring',
      'Custom Heated/Cooled Lap Pool',
      'Underground Private Cinema & Spa',
      'Staff Quarters for 6'
    ],
    keyFeatures: [
      'Prime G-Frond orientation',
      'Turnkey luxury designer furnished',
      'Immediate key possession available'
    ],
    paymentPlan: {
      downPayment: '100% Cash or Private Bank Transfer',
      duringConstruction: 'Ready to Move In',
      onHandover: 'Immediate Title Deed Issuance'
    },
    isFeaturedInTimeline: false
  }
];

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm-palm-jumeirah',
    name: 'Palm Jumeirah',
    tagline: 'The World Benchmark in Coastal Grandeur',
    description: 'An iconic engineering marvel offering world-class beach villas, Michelin-starred gastronomy, and ultra-high liquidity blue chip trophy assets.',
    lifestyleHighlights: ['Private Frond Beaches', 'The Royal Atlantis Dining', 'Helipad Access', 'Superyacht Marinas'],
    averagePricePerSqFt: 'AED 4,800 - 8,200',
    capitalAppreciationYoY: '+24.6%',
    featuredImage: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=2074&auto=format&fit=crop',
    propertiesCount: 42,
    signatureDevelopers: ['OMNIYAT', 'Nakheel', 'Select Group']
  },
  {
    id: 'comm-dubai-islands',
    name: 'Dubai Islands',
    tagline: 'The Next Generation of Island Living',
    description: 'An ambitious five-island master development bringing 20+ kilometers of pristine beaches, resort ecosystems, and prime off-plan capital upside.',
    lifestyleHighlights: ['Crystal Lagoons', 'Eco-resort Sanctuaries', 'Championship Golf Club', 'Deep-Water Marina'],
    averagePricePerSqFt: 'AED 2,300 - 3,600',
    capitalAppreciationYoY: '+31.2%',
    featuredImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop',
    propertiesCount: 28,
    signatureDevelopers: ['DAMAC Properties', 'Nakheel']
  },
  {
    id: 'comm-business-bay',
    name: 'Business Bay & Downtown',
    tagline: 'The Commercial Pulse & High-Rise Horizon',
    description: 'Dubai’s Manhattan, centered around the Dubai Canal and the towering Burj Khalifa. Highly demanded by international corporate executives and global investors.',
    lifestyleHighlights: ['Canal Walkways', 'Dubai Mall Access', 'DIFC Financial District', '24/7 Energy'],
    averagePricePerSqFt: 'AED 2,100 - 4,200',
    capitalAppreciationYoY: '+18.4%',
    featuredImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop',
    propertiesCount: 65,
    signatureDevelopers: ['DAMAC Properties', 'Select Group', 'Omniyat']
  },
  {
    id: 'comm-mbr-city',
    name: 'Mohammed Bin Rashid City (MBR)',
    tagline: 'Sprawling Green Luxury & Crystal Waters',
    description: 'Surrounded by lush parklands and the largest man-made crystal lagoon in the world, MBR City offers tranquil, ultra-secure gated villa sanctuaries minutes from Downtown.',
    lifestyleHighlights: ['District One Lagoon', 'Meydan Grandstand', 'Premier International Schools', 'Bespoke Villas'],
    averagePricePerSqFt: 'AED 2,600 - 4,900',
    capitalAppreciationYoY: '+21.0%',
    featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    propertiesCount: 36,
    signatureDevelopers: ['Sobha Realty', 'Meydan']
  }
];

export const INITIAL_DEVELOPERS: Developer[] = [
  {
    id: 'dev-damac',
    name: 'DAMAC Properties',
    tier: 'Tier 1 Ultra-Prime Master Developer',
    founded: '2002',
    reputation: 'Synonymous with bold architectural icons, branded collaborations with Cavalli, de GRISOGONO, and master lagoon communities.',
    description: 'DAMAC has shaped the modern skyline of the Middle East, delivering over 46,000 homes with prestigious master developments across UAE, London, and Miami.',
    heroProject: 'DAMAC Islands & Volta',
    totalDeliveredUnits: '46,000+ Units',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop',
    specialty: 'Branded Luxury & Master Water Communities'
  },
  {
    id: 'dev-sobha',
    name: 'Sobha Realty',
    tier: 'Tier 1 Quality & Engineering Pioneer',
    founded: '1976',
    reputation: 'Renowned for unmatched in-house backward integration, ensuring German-standard build quality and meticulous finishing.',
    description: 'Sobha develops master planned communities with an unyielding dedication to perfection, from bespoke joinery to structural resilience.',
    heroProject: 'Sobha SeaHaven & Sobha Hartland',
    totalDeliveredUnits: '130 Million sq.ft Built',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
    specialty: 'Backward Integrated Construction & Timeless Design'
  },
  {
    id: 'dev-nakheel',
    name: 'Nakheel / Dubai Holding',
    tier: 'Sovereign Master Mastermind',
    founded: '2000',
    reputation: 'Creator of the world-famous Palm Jumeirah, Dubai Islands, and Palm Jebel Ali, shaping Dubai’s coastline permanently.',
    description: 'As the sovereign development arm, Nakheel executes nation-scale visionary infrastructure and landmark coastal destinations.',
    heroProject: 'Palm Jumeirah & Palm Jebel Ali',
    totalDeliveredUnits: 'Over 300km of Coastline Created',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=2074&auto=format&fit=crop',
    specialty: 'Archipelago Engineering & Island Megaprojects'
  },
  {
    id: 'dev-omniyat',
    name: 'OMNIYAT',
    tier: 'Bespoke Architectural Art Curator',
    founded: '2005',
    reputation: 'Collaborates exclusively with legendary architects like Zaha Hadid and Foster + Partners, managed by Dorchester Collection.',
    description: 'OMNIYAT treats each project as a limited-edition work of liveable art, commanding some of the highest price-per-square-foot records in Middle Eastern history.',
    heroProject: 'The Lana, AVA, & One at Palm Jumeirah',
    totalDeliveredUnits: '$6.2B Completed Portfolio',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop',
    specialty: 'Ultra-Prime Architectural Collector Editions'
  },
  {
    id: 'dev-select',
    name: 'Select Group',
    tier: 'Prime Urban Waterfront Specialist',
    founded: '2002',
    reputation: 'Recognized for financial discipline, prime waterfront positioning, and high-yield institutional asset delivery.',
    description: 'Select Group has delivered high-profile waterfront towers throughout Dubai Marina and Business Bay, including collaborations with Six Senses and Jumeirah.',
    heroProject: 'Peninsula & Six Senses Residences',
    totalDeliveredUnits: '20,000+ Units Delivered',
    image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=2069&auto=format&fit=crop',
    specialty: 'Premium Waterfront Towers & Hospitality Residences'
  }
];

export const INITIAL_INQUIRIES: ConsultationInquiry[] = [
  {
    id: 'inq-001',
    fullName: 'Lord Julian Sterling',
    email: 'j.sterling@sterling-wealth.co.uk',
    phone: '+44 7911 123456',
    country: 'United Kingdom',
    investmentBudget: '$5,000,000 - $10,000,000',
    preferredAssetType: 'Waterfront Villa',
    preferredCommunity: 'Palm Jumeirah',
    timeframe: 'Immediate (within 30 days)',
    notes: 'Seeking private beachfront frond villa with berth for 75ft yacht. Interested in Golden Visa facilitation.',
    status: 'VIP Portfolio Sent',
    createdAt: '2026-09-05T11:20:00Z'
  },
  {
    id: 'inq-002',
    fullName: 'Dr. Henrik Lindqvist',
    email: 'h.lindqvist@genevapartners.ch',
    phone: '+41 79 987 6543',
    country: 'Switzerland',
    investmentBudget: '$2,000,000 - $5,000,000',
    preferredAssetType: 'Sky Penthouse',
    preferredCommunity: 'Dubai Marina & Harbour',
    timeframe: '3 to 6 months',
    notes: 'Looking for high rental yield off-plan floor allocation in Sobha SeaHaven or Volta.',
    status: 'Scheduled',
    createdAt: '2026-09-04T15:45:00Z'
  },
  {
    id: 'inq-003',
    fullName: 'Saeed Al-Maktoum',
    email: 's.maktoum@almaktoum-invest.ae',
    phone: '+971 50 123 4567',
    country: 'United Arab Emirates',
    investmentBudget: '$10,000,000+',
    preferredAssetType: 'Private Island Mansion',
    preferredCommunity: 'Dubai Islands',
    timeframe: 'Immediate',
    notes: 'Multiple unit allocation request for DAMAC Islands crystal lagoon estates.',
    status: 'New',
    createdAt: '2026-09-06T08:15:00Z'
  }
];
