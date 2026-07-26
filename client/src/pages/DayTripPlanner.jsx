import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Map as MapIcon, GripVertical, Navigation2, Search, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import api from '@/lib/api';
import SEOHead from '@/components/common/SEOHead';
import { MAP_TILER_URL } from '@/lib/constants';

// OSRM Routing Service
const getRoute = async (coordinates) => {
  if (coordinates.length < 2) return null;
  const coordsString = coordinates.map(c => `${c.lng},${c.lat}`).join(';');
  const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`);
  const data = await res.json();
  return data.routes[0];
};

const FitBounds = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      const bounds = L.latLngBounds(coords.map(c => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coords, map]);
  return null;
};

const DayTripPlanner = () => {
  const [stops, setStops] = useState([]);
  const [route, setRoute] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length < 3) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const { data } = await api.get(`/places?search=${searchQuery}&limit=5`);
        setSearchResults(data.data || []);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Update route whenever stops change
  useEffect(() => {
    const fetchRoute = async () => {
      if (stops.length >= 2) {
        const routeData = await getRoute(stops.map(s => s.location));
        setRoute(routeData);
      } else {
        setRoute(null);
      }
    };
    fetchRoute();
  }, [stops]);

  const addStop = (place) => {
    if (!stops.find(s => s._id === place._id)) {
      setStops([...stops, {
        _id: place._id,
        name: place.name,
        location: { lat: place.location.coordinates[1], lng: place.location.coordinates[0] }
      }]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeStop = (id) => {
    setStops(stops.filter(s => s._id !== id));
  };

  const moveStop = (index, direction) => {
    const newStops = [...stops];
    if (direction === 'up' && index > 0) {
      [newStops[index - 1], newStops[index]] = [newStops[index], newStops[index - 1]];
    } else if (direction === 'down' && index < newStops.length - 1) {
      [newStops[index + 1], newStops[index]] = [newStops[index], newStops[index + 1]];
    }
    setStops(newStops);
  };

  return (
    <>
      <SEOHead 
        title="Day Trip Planner - Guly Eats" 
        description="Plan your perfect food day trip. Add places, optimize your route, and explore."
      />
      
      <div className="h-screen pt-16 md:pt-18 flex flex-col md:flex-row overflow-hidden bg-gray-50">
        
        {/* Sidebar Planner */}
        <div className="w-full md:w-1/3 lg:w-[400px] bg-white border-r border-gray-200 shadow-xl z-20 flex flex-col h-[50vh] md:h-full relative overflow-y-auto">
          <div className="p-6 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-10">
            <h1 className="text-2xl font-bold font-heading text-gray-900 mb-2 flex items-center gap-2">
              <MapIcon className="text-primary" /> Day Trip Planner
            </h1>
            <p className="text-sm text-gray-500 mb-4">Build your ultimate food itinerary. Add stops and we'll route them.</p>
            
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a place..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all bg-gray-50 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>
            
            {/* Search Results Dropdown */}
            {searchQuery.length >= 3 && (
              <div className="absolute left-6 right-6 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(place => (
                    <div 
                      key={place._id} 
                      className="p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                      onClick={() => addStop(place)}
                    >
                      <div>
                        <p className="font-bold text-sm text-gray-800 line-clamp-1">{place.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{place.city?.name}</p>
                      </div>
                      <button className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full">Add</button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">No places found.</div>
                )}
              </div>
            )}
          </div>

          {/* Route Info */}
          {route && (
            <div className="px-6 py-4 bg-primary/5 border-b border-primary/10 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Total Distance</p>
                <p className="font-bold text-gray-800">{(route.distance / 1000).toFixed(1)} km</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-500 uppercase">Est. Travel Time</p>
                <p className="font-bold text-gray-800">{Math.round(route.duration / 60)} mins</p>
              </div>
            </div>
          )}

          {/* Stops List */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50/50">
            {stops.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center mx-auto mb-3">
                  <MapIcon size={24} />
                </div>
                <p className="text-gray-500 text-sm font-medium">Your itinerary is empty.</p>
                <p className="text-gray-400 text-xs mt-1">Search and add places to start planning.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {stops.map((stop, index) => (
                    <motion.div 
                      key={stop._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 relative group"
                    >
                      <div className="flex flex-col gap-1">
                        <button onClick={() => moveStop(index, 'up')} disabled={index === 0} className="text-gray-300 hover:text-gray-600 disabled:opacity-30 p-1">
                          <ArrowUp size={14} />
                        </button>
                        <button onClick={() => moveStop(index, 'down')} disabled={index === stops.length - 1} className="text-gray-300 hover:text-gray-600 disabled:opacity-30 p-1">
                          <ArrowDown size={14} />
                        </button>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-sm truncate">{stop.name}</p>
                      </div>
                      <button 
                        onClick={() => removeStop(stop._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 h-[50vh] md:h-full relative bg-gray-100 z-10">
          <MapContainer 
            center={[28.6139, 77.2090]} // default to Delhi
            zoom={11} 
            className="w-full h-full"
            zoomControl={false}
          >
            <TileLayer
              url={MAP_TILER_URL}
              attribution='&copy; OpenStreetMap contributors'
            />
            
            {stops.map((stop, index) => (
              <Marker 
                key={stop._id} 
                position={[stop.location.lat, stop.location.lng]}
                icon={L.divIcon({
                  html: `<div style="background-color: #111827; color: white; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">${index + 1}</div>`,
                  className: 'custom-marker',
                  iconSize: [28, 28],
                  iconAnchor: [14, 14]
                })}
              >
                <Popup className="custom-popup rounded-2xl">
                  <p className="font-bold text-sm m-0 p-0">{stop.name}</p>
                </Popup>
              </Marker>
            ))}

            {route && route.geometry && (
              <Polyline 
                positions={route.geometry.coordinates.map(c => [c[1], c[0]])}
                color="#FF6B2B"
                weight={5}
                opacity={0.8}
                lineCap="round"
                lineJoin="round"
                dashArray="1, 10"
              />
            )}
            
            {stops.length > 0 && <FitBounds coords={stops.map(s => s.location)} />}
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default DayTripPlanner;
