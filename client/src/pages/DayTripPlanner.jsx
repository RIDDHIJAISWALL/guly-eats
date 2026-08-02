import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Map as MapIcon, GripVertical, Navigation2, Search, Trash2, ArrowUp, ArrowDown, MapPin, Compass } from 'lucide-react';
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
      
      {/* We use h-[calc(100vh-80px)] to account for the fixed navbar and prevent overlap */}
      <div className="h-[calc(100vh-80px)] flex flex-col md:flex-row overflow-hidden bg-[#FAF6F0]">
        
        {/* ─── Sidebar Planner ─── */}
        <div className="w-full md:w-[450px] bg-white border-r border-orange-100 shadow-2xl shadow-orange-900/5 z-20 flex flex-col h-[50vh] md:h-full relative">
          
          <div className="p-8 border-b border-orange-100/50 bg-white z-10 shrink-0">
            <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F58216] to-[#FFAA33] flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                <Compass size={20} />
              </div>
              <h1 className="text-2xl font-black font-heading text-gray-900">
                Route Planner
              </h1>
            </motion.div>
            <p className="text-sm font-medium text-gray-500 mb-6">Build your ultimate food itinerary. Add spots and we'll map the route for you! 🚗</p>
            
            {/* Search Input */}
            <div className="relative group">
              <input
                type="text"
                placeholder="Search for a famous place or food..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-gray-100 focus:border-[#F58216] outline-none text-sm font-bold transition-all bg-gray-50 focus:bg-white shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={18} className="absolute left-4 top-4 text-gray-400 group-focus-within:text-[#F58216] transition-colors" />
            </div>
            
            {/* Search Results Dropdown */}
            {searchQuery.length >= 3 && (
              <div className="absolute left-8 right-8 top-[180px] mt-2 bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden max-h-64 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-6 text-center text-sm font-bold text-gray-400 flex items-center justify-center gap-2">
                     <span className="animate-spin text-[#F58216]"><Navigation2 size={16} /></span> Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((place, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                      key={place._id} 
                      className="p-4 border-b border-gray-50 hover:bg-orange-50/50 cursor-pointer flex justify-between items-center transition-colors"
                      onClick={() => addStop(place)}
                    >
                      <div>
                        <p className="font-bold text-sm text-gray-900 line-clamp-1">{place.name}</p>
                        <p className="text-xs font-semibold text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={10} />{place.city?.name}</p>
                      </div>
                      <button className="text-xs font-black text-white px-3 py-1.5 bg-[#F58216] hover:bg-orange-600 rounded-lg shadow-sm">Add</button>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm font-bold text-gray-400">No places found.</div>
                )}
              </div>
            )}
          </div>

          {/* Route Info */}
          {route && (
            <div className="px-8 py-4 bg-orange-50 border-b border-orange-100 flex justify-between items-center shrink-0">
              <div>
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-wider mb-1">Total Distance</p>
                <p className="font-black text-orange-900 text-lg">{(route.distance / 1000).toFixed(1)} <span className="text-sm">km</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-orange-400 uppercase tracking-wider mb-1">Est. Travel Time</p>
                <p className="font-black text-orange-900 text-lg">{Math.round(route.duration / 60)} <span className="text-sm">mins</span></p>
              </div>
            </div>
          )}

          {/* Stops List */}
          <div className="flex-1 p-8 overflow-y-auto bg-gray-50/30">
            {stops.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-20 h-20 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mx-auto mb-4 relative">
                  <MapPin size={32} className="text-gray-300" />
                  <div className="absolute top-0 right-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 text-xs font-bold shadow-sm">1</div>
                </div>
                <p className="text-gray-900 text-lg font-black mb-1">Your itinerary is empty.</p>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">Search and add places above to start planning your perfect food trail!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {stops.map((stop, index) => (
                    <motion.div 
                      key={stop._id}
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 relative group hover:border-orange-200 transition-colors"
                    >
                      <div className="flex flex-col gap-1">
                        <button onClick={() => moveStop(index, 'up')} disabled={index === 0} className="text-gray-300 hover:text-[#F58216] disabled:opacity-30 p-1 transition-colors">
                          <ArrowUp size={16} />
                        </button>
                        <button onClick={() => moveStop(index, 'down')} disabled={index === stops.length - 1} className="text-gray-300 hover:text-[#F58216] disabled:opacity-30 p-1 transition-colors">
                          <ArrowDown size={16} />
                        </button>
                      </div>
                      
                      <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-black shrink-0 shadow-md">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-[15px] truncate">{stop.name}</p>
                      </div>
                      
                      <button 
                        onClick={() => removeStop(stop._id)}
                        className="p-2.5 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-xl"
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

        {/* ─── Map Area ─── */}
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
                  html: `<div style="background-color: #111827; color: white; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-weight: 900; font-size: 14px; border: 3px solid white; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.3);">${index + 1}</div>`,
                  className: 'custom-marker',
                  iconSize: [32, 32],
                  iconAnchor: [16, 16]
                })}
              >
                <Popup className="custom-popup rounded-2xl">
                  <p className="font-bold text-sm m-0 p-0 text-center">{stop.name}</p>
                </Popup>
              </Marker>
            ))}

            {route && route.geometry && (
              <Polyline 
                positions={route.geometry.coordinates.map(c => [c[1], c[0]])}
                color="#F58216"
                weight={6}
                opacity={0.8}
                lineCap="round"
                lineJoin="round"
                dashArray="1, 12"
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
