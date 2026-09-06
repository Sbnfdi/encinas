export type SceneType = 
  | 'HERO' 
  | 'PROPERTY' 
  | 'COMMUNITY' 
  | 'DEVELOPER' 
  | 'SERVICES' 
  | 'INVESTMENT' 
  | 'BRAND' 
  | 'CTA';

export interface TimelineScene {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  sceneType: SceneType;
  order: number;
  image: string;
  video?: string;
  propertyId?: string;
  communityId?: string;
  developerId?: string;
  ctaLabel: string;
  ctaUrl: string;
  animationMode: 'cinematic-zoom' | 'horizontal-glide' | 'depth-reveal' | 'ambient-drift';
  durationWeight: number; // proportional weight in scroll duration
  isActive: boolean;
  accentColor?: string;
  metaBadge?: string;
  stats?: { label: string; value: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Property {
  id: string;
  title: string;
  tagline: string;
  developer: string;
  community: string;
  type: 'Waterfront Villa' | 'Sky Penthouse' | 'Branded Residence' | 'Private Island Mansion';
  priceAED: number;
  priceUSD: string;
  startingPriceText: string;
  bedrooms: string;
  builtUpAreaSqFt: string;
  completionDate: string;
  status: 'Off-Plan Exclusive' | 'Recently Launched' | 'Handover Ready' | 'VIP Allocation';
  featuredImage: string;
  gallery: string[];
  description: string;
  architectureNarrative: string;
  amenities: string[];
  keyFeatures: string[];
  paymentPlan: {
    downPayment: string;
    duringConstruction: string;
    onHandover: string;
    postHandover?: string;
  };
  isFeaturedInTimeline?: boolean;
}

export interface Community {
  id: string;
  name: string;
  tagline: string;
  description: string;
  lifestyleHighlights: string[];
  averagePricePerSqFt: string;
  capitalAppreciationYoY: string;
  featuredImage: string;
  propertiesCount: number;
  signatureDevelopers: string[];
}

export interface Developer {
  id: string;
  name: string;
  tier: string;
  founded: string;
  reputation: string;
  description: string;
  heroProject: string;
  totalDeliveredUnits: string;
  image: string;
  specialty: string;
}

export interface ConsultationInquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  investmentBudget: string;
  preferredAssetType: string;
  preferredCommunity: string;
  timeframe: string;
  notes?: string;
  status: 'New' | 'Contacted' | 'VIP Portfolio Sent' | 'Scheduled' | 'Closed';
  createdAt: string;
}

export interface FilterState {
  search: string;
  developer: string;
  community: string;
  type: string;
  bedrooms: string;
  status: string;
  minPrice: number;
  maxPrice: number;
}

export const SCENE_TYPES = [
  'HERO',
  'PROPERTY',
  'COMMUNITY',
  'DEVELOPER',
  'SERVICES',
  'INVESTMENT',
  'BRAND',
  'CTA'
] as const;

