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

export type Currency = 'AED' | 'USD' | 'EUR' | 'GBP';

export const CURRENCY_RATES: Record<Currency, number> = {
  AED: 1,
  USD: 3.6725,
  EUR: 4.02,
  GBP: 4.70,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  AED: 'AED',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export function formatPriceInCurrency(priceAED: number, currency: Currency): string {
  const rate = CURRENCY_RATES[currency] || 1;
  const converted = priceAED / rate;
  const symbol = CURRENCY_SYMBOLS[currency];

  if (converted >= 1_000_000) {
    const millions = (converted / 1_000_000).toFixed(1);
    return currency === 'AED' ? `AED ${millions}M` : `${symbol}${millions}M`;
  }
  if (converted >= 1_000) {
    const thousands = (converted / 1_000).toFixed(0);
    return currency === 'AED' ? `AED ${thousands}K` : `${symbol}${thousands}K`;
  }
  return currency === 'AED' ? `AED ${Math.round(converted).toLocaleString()}` : `${symbol}${Math.round(converted).toLocaleString()}`;
}

