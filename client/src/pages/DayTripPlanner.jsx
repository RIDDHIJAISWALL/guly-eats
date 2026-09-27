import { useState, useEffect } from 'react';
import { Search, Trash2, ArrowUp, ArrowDown, MapPin, Compass, Loader2, Map as MapIcon, X, Calendar, Clock, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import SEOHead from '@/components/common/SEOHead';
import PlaceCard from '@/components/explore/PlaceCard';
import SimplePlaceModal from '@/components/explore/SimplePlaceModal';

// OSRM Routing Service
const getRoute = async (coordinates) => {
  if (coordinates.length < 2) return null;
  const coordsString = coordinates.map(c => `${c.lng},${c.lat}`).join(';');
  const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`);
  const data = await res.json();
  return data.routes[0];
};

// FitBounds removed

const DayTripPlanner = () => {
  const [stops, setStops] = useState([]);
  const [route, setRoute] = useState(null);
  
  // City selection state
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [cityPlaces, setCityPlaces] = useState([]);
  const [isLoadingCityPlaces, setIsLoadingCityPlaces] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMap, setShowMobileMap] = useState(false);
  const [selectedPlaceForModal, setSelectedPlaceForModal] = useState(null);

  const handleNavigate = (place) => {
    if (!place?.location?.coordinates) return;
    const [lng, lat] = place.location.coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  // Fetch all cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data } = await api.get('/cities');
        setCities(data.data || []);
      } catch (error) {
        console.error("Failed to fetch cities", error);
      }
    };
    fetchCities();
  }, []);

  // Fetch places when a city is selected
  useEffect(() => {
    if (!selectedCity) {
      setCityPlaces([]);
      return;
    }
    
    const fetchPlacesForCity = async () => {
      setIsLoadingCityPlaces(true);
      try {
        const [placesRes, famousRes] = await Promise.all([
          api.get(`/places?city=${selectedCity}`).catch(() => ({ data: { data: [] } })),
          api.get(`/famous-places?city=${selectedCity}`).catch(() => ({ data: { data: [] } }))
        ]);
        const placesData = (placesRes.data?.data || []).map(p => ({ ...p, isFamousPlace: false }));
        const famousData = (famousRes.data?.data || []).map(p => ({ ...p, isFamousPlace: true }));
        setCityPlaces([...placesData, ...famousData]);
      } catch (error) {
        console.error("Failed to fetch city places", error);
      } finally {
        setIsLoadingCityPlaces(false);
      }
    };
    
    fetchPlacesForCity();
  }, [selectedCity]);

  // Filter places based on search query
  const searchResults = cityPlaces.filter(place => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    const matchName = place.name?.toLowerCase().includes(searchLower);
    const matchFood = place.famousFoods?.some(f => f.name?.toLowerCase().includes(searchLower));
    return matchName || matchFood;
  });

  // Search logic removed (now done locally on fetched city places)

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
        city: place.city?.name,
        address: place.address,
        rating: place.averageRating,
        coverImage: place.coverImage || place.images?.[0],
        famousFoods: place.famousFoods,
        description: place.description,
        location: { lat: place.location.coordinates[1], lng: place.location.coordinates[0] }
      }]);
    }
    // Don't clear search/city so they can add multiple from the same view
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
      
      {/* Layout Container */}
      <div style={{
        position: 'fixed',
        top: '80px',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        overflow: 'hidden',
      }}>
        
        {/* ─── SIDEBAR ─── */}
        <div
          style={{
            flexShrink: 0,
            zIndex: 10,
            width: '100%',
            maxWidth: '420px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--color-background)',
            borderRight: '1px solid var(--color-border-light)',
            boxShadow: '4px 0 24px rgba(0,0,0,0.06)',
            transition: 'transform 0.3s ease',
            transform: showMobileMap ? 'translateX(-100%)' : 'translateX(0)',
          }}
          className="sidebar-panel md:translate-x-0"
        >
          
          {/* Sidebar Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid var(--color-border-light)',
            backgroundColor: 'var(--color-surface)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '26px',
                  fontWeight: 800,
                  color: 'var(--color-text)',
                  lineHeight: 1.1,
                  margin: 0,
                }}>
                  Trip Planner
                </h1>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--color-text-muted)',
                  marginTop: '4px',
                }}>
                  {stops.length} stops in your itinerary
                </p>
              </div>
            </div>
          </div>

          {/* City Selection and Search */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid var(--color-border-light)',
                backgroundColor: 'var(--color-surface)',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-text)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="">Select a City first...</option>
              {cities.map(city => (
                <option key={city._id} value={city._id}>{city.name}</option>
              ))}
            </select>
            
            <div style={{ position: 'relative', opacity: selectedCity ? 1 : 0.5, pointerEvents: selectedCity ? 'auto' : 'none' }}>
              <Search size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
              }} />
              <input
                type="text"
                placeholder="Filter places in this city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 36px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border-light)',
                  backgroundColor: 'var(--color-surface)',
                  fontSize: '13px',
                  color: 'var(--color-text)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--color-border-light)'; }}
              />
            </div>
          </div>

          {/* Route Info summary (if route exists) */}
          {route && (
            <div style={{
              padding: '16px 20px',
              backgroundColor: 'var(--color-surface)',
              borderBottom: '1px solid var(--color-border-light)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              position: 'relative',
              zIndex: 5,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ padding: '8px', backgroundColor: 'var(--color-primary-light)', borderRadius: '10px', color: 'var(--color-primary)' }}>
                   <Compass size={18} />
                 </div>
                 <div>
                   <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Total Distance</p>
                   <p style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>{(route.distance / 1000).toFixed(1)} <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>km</span></p>
                 </div>
              </div>
              <div style={{ width: '1px', height: '36px', backgroundColor: 'var(--color-border-light)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <div style={{ padding: '8px', backgroundColor: 'var(--color-primary-light)', borderRadius: '10px', color: 'var(--color-primary)' }}>
                   <Clock size={18} />
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Est. Time</p>
                   <p style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>{Math.round(route.duration / 60)} <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>mins</span></p>
                 </div>
              </div>
            </div>
          )}

          {/* Stops List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            scrollBehavior: 'smooth',
          }}>
            {stops.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px', opacity: 0.7 }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border-light)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <MapPin size={32} />
                </div>
                <p style={{ color: 'var(--color-text)', fontSize: '16px', fontWeight: 800, margin: '0 0 8px 0' }}>Build Your Itinerary</p>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', fontWeight: 500, lineHeight: 1.5, maxWidth: '250px', margin: 0 }}>
                  Search for places above to add them to your trip. We'll automatically calculate the best route for you.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {stops.map((stop, index) => (
                    <motion.div 
                      key={stop._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          borderRadius: '16px',
                          border: '1px solid var(--color-border-light)',
                          boxShadow: 'var(--shadow-sm)',
                          display: 'flex',
                          alignItems: 'stretch',
                          gap: '0',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Number Badge */}
                        <div style={{
                          position: 'absolute',
                          left: '8px',
                          top: '8px',
                          width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 900, zIndex: 10, boxShadow: 'var(--shadow-md)'
                        }}>
                          {index + 1}
                        </div>

                        {/* Image */}
                        {stop.coverImage && (
                          <div style={{
                            width: '100px',
                            flexShrink: 0,
                            backgroundColor: '#f3f4f6',
                            position: 'relative',
                          }}>
                            <img
                              src={stop.coverImage}
                              alt={stop.name}
                              loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        )}
                        
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0, padding: '12px', display: 'flex', flexDirection: 'column' }}>
                          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--color-text)', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 0 4px 0' }}>{stop.name}</p>
                          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 0 8px 0' }}>
                            <MapPin size={11} /> {stop.address || stop.city || 'Location'}
                          </p>
                          
                          {stop.description && (
                            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0, lineHeight: 1.4 }}>
                              {stop.description}
                            </p>
                          )}
                        </div>
                      
                      {/* Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', borderLeft: '1px solid var(--color-border-light)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', opacity: 0.8 }}>
                          <button onClick={() => moveStop(index, 'up')} disabled={index === 0} style={{ background: 'var(--color-background)', border: 'none', padding: '4px', borderRadius: '4px', color: index === 0 ? 'var(--color-border-light)' : 'var(--color-text-muted)', cursor: index === 0 ? 'default' : 'pointer' }}>
                            <ArrowUp size={12} strokeWidth={3} />
                          </button>
                          <button onClick={() => moveStop(index, 'down')} disabled={index === stops.length - 1} style={{ background: 'var(--color-background)', border: 'none', padding: '4px', borderRadius: '4px', color: index === stops.length - 1 ? 'var(--color-border-light)' : 'var(--color-text-muted)', cursor: index === stops.length - 1 ? 'default' : 'pointer' }}>
                            <ArrowDown size={12} strokeWidth={3} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeStop(stop._id)}
                          style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '50%' }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
          
          {/* Action button */}
          <div style={{
            padding: '16px',
            backgroundColor: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border-light)',
            boxShadow: '0 -4px 12px rgba(0,0,0,0.02)',
            zIndex: 10,
          }}>
             <button 
                disabled={stops.length === 0}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: stops.length === 0 ? 'var(--color-border-light)' : 'var(--color-primary)',
                  color: stops.length === 0 ? 'var(--color-text-muted)' : 'white',
                  fontWeight: 800,
                  fontSize: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: stops.length === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: stops.length === 0 ? 'none' : '0 4px 12px rgba(255, 107, 43, 0.3)',
                }}
             >
               <Save size={18} /> Save Itinerary
             </button>
          </div>
        </div>

        {/* ─── RIGHT / PLACE EXPLORER PANEL ─── */}
        <div 
          style={{
            flex: 1,
            backgroundColor: 'var(--color-background)',
            overflowY: 'auto',
          }}
          className={`p-6 md:p-8 ${showMobileMap ? 'block absolute inset-0 z-50' : 'hidden md:block'}`}
        >
          {showMobileMap && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: 'var(--color-text)' }}>Find Places</h2>
              <button 
                onClick={() => setShowMobileMap(false)} 
                className="p-2 bg-white rounded-full shadow-md border border-gray-100 text-gray-900"
              >
                 <X size={20} strokeWidth={3} />
              </button>
            </div>
          )}
          
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {!selectedCity ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center', opacity: 0.6 }}>
                <MapPin size={48} style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }} />
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '8px' }}>Where do you want to go?</h2>
                <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', maxWidth: '400px', lineHeight: 1.5 }}>
                  Select a city from the dropdown on the left to see all famous foods and places you can add to your itinerary.
                </p>
              </div>
            ) : isLoadingCityPlaces ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '20px' }}>
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'All Available Places'}
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '20px',
                }}>
                  {searchResults.map(place => {
                    const isAdded = stops.some(s => s._id === place._id);
                    return (
                      <div key={place._id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%' }}>
                        {/* Fix: Pass empty function to onSelect to prevent hover bug */}
                        <PlaceCard
                          place={place}
                          isActive={isAdded}
                          onSelect={() => {}} 
                          onNavigate={() => handleNavigate(place)}
                          onViewDetails={() => setSelectedPlaceForModal(place)}
                          style={{ flex: 1 }}
                        />
                        {/* Add button below the card */}
                        <button
                          onClick={() => isAdded ? removeStop(place._id) : addStop(place)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '12px',
                            backgroundColor: isAdded ? 'var(--color-surface)' : 'var(--color-primary)',
                            color: isAdded ? 'var(--color-text-muted)' : 'white',
                            border: isAdded ? '1px solid var(--color-border-light)' : 'none',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                          }}
                        >
                          {isAdded ? 'Remove from Itinerary' : '+ Add to Itinerary'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center', opacity: 0.6 }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '8px' }}>No places found</h2>
                <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)' }}>Try adjusting your search query.</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile View Map Button (shown when map is hidden) */}
        {!showMobileMap && (
          <div className="md:hidden fixed bottom-[90px] left-1/2 -translate-x-1/2 z-50">
            <button 
              onClick={() => setShowMobileMap(true)} 
              className="flex items-center gap-2 px-6 py-3.5 bg-gray-900 hover:bg-black text-white font-bold text-[14px] rounded-full shadow-2xl border border-gray-700 transition-transform active:scale-95"
            >
               <Search size={18} /> Find Places
            </button>
          </div>
        )}

      </div>
      
      <SimplePlaceModal 
        place={selectedPlaceForModal} 
        onClose={() => setSelectedPlaceForModal(null)} 
      />
    </>
  );
};

export default DayTripPlanner;
