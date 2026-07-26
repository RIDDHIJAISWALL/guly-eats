// Budget display
export const BUDGET_LABELS = {
  low: '₹',
  medium: '₹₹',
  high: '₹₹₹',
  premium: '₹₹₹₹',
};

// Place types
export const PLACE_TYPES = {
  food_shop: { label: 'Food Shop', emoji: '🍛' },
  restaurant: { label: 'Restaurant', emoji: '🍽️' },
  street_stall: { label: 'Street Stall', emoji: '🥘' },
  cafe: { label: 'Café', emoji: '☕' },
  sweet_shop: { label: 'Sweet Shop', emoji: '🧁' },
  bakery: { label: 'Bakery', emoji: '🥖' },
};

// Famous place types
export const FAMOUS_PLACE_TYPES = {
  monument: { label: 'Monument', emoji: '🏛' },
  market: { label: 'Market', emoji: '🛍' },
  heritage: { label: 'Heritage', emoji: '🏰' },
  viewpoint: { label: 'Viewpoint', emoji: '🏞' },
  temple: { label: 'Temple', emoji: '🛕' },
  park: { label: 'Park', emoji: '🌳' },
  museum: { label: 'Museum', emoji: '🏛' },
  lake: { label: 'Lake', emoji: '🌊' },
  garden: { label: 'Garden', emoji: '🌺' },
};

// City accent colors (matches CSS variables)
export const CITY_COLORS = {
  varanasi: '#FF6B2B',
  lucknow: '#D4A017',
  prayagraj: '#F59E0B',
  delhi: '#C41E3A',
  noida: '#3B82F6',
  indore: '#7C3AED',
  jaipur: '#E11D73',
  srinagar: '#059669',
  nainital: '#166534',
  kolkata: '#C2410C',
  chennai: '#9F1239',
  mumbai: '#0284C7',
  amritsar: '#EAB308',
};

// City emojis
export const CITY_EMOJIS = {
  varanasi: '🛕',
  lucknow: '🕌',
  prayagraj: '🌊',
  delhi: '🏛️',
  noida: '🏢',
  indore: '🥘',
  jaipur: '🏰',
  srinagar: '🏔️',
  nainital: '⛵',
  kolkata: '🚊',
  chennai: '🥥',
  mumbai: '🎬',
  amritsar: '🛕',
};

// Map URL
export const MAP_TILER_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';


// Marker colors by type
export const MARKER_COLORS = {
  food_shop: '#FF6B2B',
  restaurant: '#FF6B2B',
  street_stall: '#FF6B2B',
  cafe: '#92400E',
  sweet_shop: '#EC4899',
  bakery: '#EC4899',
  monument: '#FFB347',
  market: '#8B5CF6',
  heritage: '#FFB347',
  viewpoint: '#10B981',
  temple: '#F59E0B',
  park: '#10B981',
  museum: '#FFB347',
  lake: '#0284C7',
  parking: '#3B82F6',
  washroom: '#14B8A6',
};

// Cuisine types
export const CUISINES = [
  'Mughlai', 'North Indian', 'South Indian', 'Bengali', 'Rajasthani',
  'Kashmiri', 'Awadhi', 'Street Food', 'Chinese', 'Continental',
  'Bakery', 'Desserts', 'Chaat', 'Biryani', 'Tandoori',
];

// Dietary filters
export const DIETARY_FILTERS = [
  { key: 'isVegetarian', label: 'Vegetarian', emoji: '🥬' },
  { key: 'isHalal', label: 'Halal', emoji: '☪️' },
  { key: 'isFamilyFriendly', label: 'Family Friendly', emoji: '👨‍👩‍👧‍👦' },
];

// App info
export const APP_NAME = 'Guly Eats';
export const APP_TAGLINE = 'Discover the real taste of every city';
export const APP_DESCRIPTION = 'Explore famous food shops, restaurants, street food, monuments, and hidden gems across Indian cities. Plan day trips, get directions, and discover what makes each city taste unique.';
