import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { MapPin, Star, Navigation } from 'lucide-react';
import { MARKER_COLORS, PLACE_TYPES, FAMOUS_PLACE_TYPES } from '@/lib/constants';

/**
 * Helper to create a custom divIcon for Leaflet
 */
export const createCustomIcon = (place, isActive = false) => {
  const isFood = place.famousFoods && place.famousFoods.length > 0;
  const typeKey = place.type || (isFood ? 'food_shop' : 'monument');
  
  const markerColor = MARKER_COLORS[typeKey] || '#FF6B2B';
  const typeInfo = isFood ? PLACE_TYPES[typeKey] : FAMOUS_PLACE_TYPES[typeKey];
  const fallbackEmoji = typeInfo?.emoji || '📍';
  
  const imageSrc = place.coverImage || place.images?.[0];

  const html = renderToString(
    <div className={`custom-photo-marker ${isActive ? 'active' : ''}`}>
      <div 
        className="marker-container"
        style={{ borderColor: markerColor }}
      >
        {imageSrc ? (
          <img src={imageSrc} alt={place.name} className="marker-image" />
        ) : (
          <span className="marker-emoji">{fallbackEmoji}</span>
        )}
      </div>
      <div 
        className="marker-pointer" 
        style={{ borderTopColor: markerColor }}
      />
    </div>
  );

  return L.divIcon({
    html,
    className: 'leaflet-custom-div-icon', // Just to remove default background
    iconSize: [48, 54],
    iconAnchor: [24, 54],
    popupAnchor: [0, -56],
  });
};

/**
 * Component to render the popup content
 */
export const PopupContent = ({ place, onNavigate }) => {
  const imageSrc = place.coverImage || place.images?.[0];
  const isFood = place.famousFoods && place.famousFoods.length > 0;

  return (
    <div className="flex flex-col w-full bg-white text-gray-800">
      {imageSrc && (
        <div className="h-32 w-full relative">
          <img src={imageSrc} alt={place.name} className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            {place.rating || 4.5}
          </div>
        </div>
      )}
      
      <div className="p-3">
        <h3 className="font-bold text-base mb-1 truncate leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          {place.name}
        </h3>
        
        <p className="text-xs text-gray-500 mb-2 truncate">
          {place.address}
        </p>

        {isFood && place.famousFoods?.length > 0 && (
          <div className="text-xs text-primary font-medium mb-3 truncate">
            Must try: {place.famousFoods.map(f => f.name).join(', ')}
          </div>
        )}

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(place);
          }}
          className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors text-sm font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <Navigation size={14} />
          Directions
        </button>
      </div>
    </div>
  );
};
