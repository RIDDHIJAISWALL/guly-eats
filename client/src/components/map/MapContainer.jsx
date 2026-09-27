import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { createCustomIcon } from './PhotoMarker';

// Component to handle map zooming to active place
const MapFocus = ({ activePlace, center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (activePlace && activePlace.location?.coordinates) {
      const [lng, lat] = activePlace.location.coordinates;
      map.flyTo([lat, lng], 16, { animate: true, duration: 1 });
    } else if (center) {
      map.flyTo(center, 13, { animate: true, duration: 1 });
    }
  }, [activePlace, center, map]);

  return null;
};

const CustomMapContainer = ({ 
  places = [], 
  cityCenter = [20.5937, 78.9629], // Default to India center
  activePlace = null,
  onPlaceSelect,
  className = "" 
}) => {
  const markerRefs = useRef({});

  // When active place changes from external click (list view), open its popup
  useEffect(() => {
    if (activePlace && activePlace._id) {
      const marker = markerRefs.current[activePlace._id];
      if (marker && !marker.isPopupOpen()) {
        marker.openPopup();
      }
    }
  }, [activePlace]);

  return (
    <div className={`w-full h-full relative z-0 ${className}`}>
      <MapContainer 
        center={cityCenter} 
        zoom={13} 
        scrollWheelZoom={true}
        className="w-full h-full outline-none"
        zoomControl={false} // Will add custom one if needed
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {places.map(place => {
          if (!place.location?.coordinates) return null;
          const [lng, lat] = place.location.coordinates;
          const isActive = activePlace?._id === place._id;
          
          return (
            <Marker
              key={place._id}
              position={[lat, lng]}
              icon={createCustomIcon(place, isActive)}
              ref={(ref) => {
                if (ref) markerRefs.current[place._id] = ref;
              }}
              eventHandlers={{
                click: () => {
                  if (onPlaceSelect) onPlaceSelect(place);
                },
              }}
            >
              <Popup autoPan={true} closeButton={false} className="custom-premium-popup">
                <div style={{
                  width: '320px',
                  overflow: 'hidden',
                  borderRadius: '20px',
                  backgroundColor: '#fff',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '100%',
                  border: `1px solid ${isActive ? '#FF6B2B' : 'rgba(0,0,0,0.05)'}`
                }}>
                  {place.coverImage || place.images?.[0] ? (
                    <div style={{ position: 'relative', height: '160px', width: '100%', backgroundColor: '#f0f0f0' }}>
                      <img 
                        src={place.coverImage || place.images?.[0]} 
                        alt={place.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        height: '60%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)'
                      }} />
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(4px)',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#D97706',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        {place.averageRating?.toFixed(1) || '4.5'}
                      </div>
                      <h4 style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '16px',
                        right: '16px',
                        margin: 0,
                        fontFamily: 'var(--font-heading)',
                        fontSize: '18px',
                        fontWeight: 800,
                        color: '#fff',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {place.name}
                      </h4>
                    </div>
                  ) : (
                    <div style={{ padding: '16px 16px 0 16px' }}>
                      <h4 style={{
                        margin: 0,
                        fontFamily: 'var(--font-heading)',
                        fontSize: '18px',
                        fontWeight: 800,
                        color: 'var(--color-text)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {place.name}
                      </h4>
                    </div>
                  )}
                  <div style={{ padding: '16px', boxSizing: 'border-box' }}>
                    <p style={{
                      margin: '0 0 8px 0',
                      fontSize: '12px',
                      color: 'var(--color-text-secondary)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.4
                    }}>
                      {place.description || place.address}
                    </p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onPlaceSelect) onPlaceSelect(place);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: isActive ? '#FF6B2B' : '#fff',
                        backgroundColor: isActive ? '#fff' : '#111',
                        border: isActive ? '1px solid #FF6B2B' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = '#333';
                        else e.currentTarget.style.backgroundColor = '#FF6B2B10';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = '#111';
                        else e.currentTarget.style.backgroundColor = '#fff';
                      }}
                    >
                      {isActive ? 'Currently Selected' : 'View on List'}
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapFocus activePlace={activePlace} center={cityCenter} />
      </MapContainer>
    </div>
  );
};

export default CustomMapContainer;
