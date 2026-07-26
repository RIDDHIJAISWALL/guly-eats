import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { createCustomIcon, PopupContent } from './PhotoMarker';

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
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
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
              <Popup autoPan={true} closeButton={false}>
                <PopupContent 
                  place={place} 
                  onNavigate={(p) => {
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                  }} 
                />
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
