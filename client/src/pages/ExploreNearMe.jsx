import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Navigation, Crosshair, Search, Star, Clock, ChevronRight, Utensils, Compass, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import SEOHead from '@/components/common/SEOHead';
import useThemeStore from '@/stores/themeStore';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const ExploreNearMe = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState(null);
  const [radius, setRadius] = useState(5000);
  const searchRef = useRef(null);

  // Popular cities for quick selection
  const popularLocations = [
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Varanasi', lat: 25.3176, lng: 83.0064 },
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  ];

  // Get current location
  const getCurrentLocation = () => {
    setIsLocating(true);
    setError(null);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setLocationName('Your Current Location');
          setIsLocating(false);
        },
        (err) => {
          setError('Location access denied. Try selecting a city below.');
          setIsLocating(false);
        }
      );
    } else {
      setError('Geolocation not supported');
      setIsLocating(false);
    }
  };

  // Auto-detect on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const selectCity = (city) => {
    setLocation({ lat: city.lat, lng: city.lng });
    setLocationName(city.name);
    setSearchQuery('');
  };

  const { data: places, isLoading } = useQuery({
    queryKey: ['nearby-places', location?.lat, location?.lng, radius],
    queryFn: async () => {
      if (!location) return [];
      const { data } = await api.get(`/places/nearby?lat=${location.lat}&lng=${location.lng}&maxDistance=${radius}`);
      return data.data;
    },
    enabled: !!location,
  });

  const filteredPlaces = places?.filter(p =>
    !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.cuisines?.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <SEOHead title="Explore Near Me - Guly Eats" description="Discover the best food places near your current location." />
      
      <div className="min-h-screen pt-20 pb-16" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          
          {/* ─── Hero Header ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 pt-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), #FF8F50)', boxShadow: '0 8px 24px rgba(255,107,43,0.3)' }}
            >
              <Compass size={32} className="text-white" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-black mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
              Explore <span style={{ color: 'var(--color-primary)' }}>Near You</span>
            </h1>
            <p className="text-lg max-w-lg mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Find the best food spots, famous places, and hidden gems around your location.
            </p>
          </motion.div>

          {/* ─── Location Selector Card ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-6 mb-8"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.06)',
            }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-5">
              {/* Current Location Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={getCurrentLocation}
                disabled={isLocating}
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all w-full sm:w-auto justify-center"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary), #FF8F50)',
                  color: '#fff',
                  boxShadow: '0 4px 15px rgba(255,107,43,0.3)',
                }}
              >
                {isLocating ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Crosshair size={18} />
                )}
                {isLocating ? 'Locating...' : 'Use Current Location'}
              </motion.button>

              <span className="text-sm font-bold" style={{ color: 'var(--color-text-muted)' }}>or</span>

              {/* Search Input */}
              <div className="relative flex-1 w-full">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search places, cuisines..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border outline-none transition-all font-medium text-sm"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    color: 'var(--color-text)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'; }}
                />
              </div>
            </div>

            {/* Quick City Selection */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider self-center mr-2" style={{ color: 'var(--color-text-muted)' }}>
                Quick:
              </span>
              {popularLocations.map((city) => (
                <motion.button
                  key={city.name}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectCity(city)}
                  className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                  style={{
                    backgroundColor: locationName === city.name
                      ? 'var(--color-primary)'
                      : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                    color: locationName === city.name
                      ? '#fff'
                      : 'var(--color-text-secondary)',
                    border: locationName === city.name
                      ? 'none'
                      : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                  }}
                >
                  {city.name}
                </motion.button>
              ))}
            </div>

            {/* Active Location Display */}
            {locationName && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center gap-2 text-sm font-medium"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <MapPin size={14} style={{ color: 'var(--color-primary)' }} />
                Showing results for: <span className="font-bold" style={{ color: 'var(--color-text)' }}>{locationName}</span>
                {filteredPlaces && <span className="ml-auto font-bold" style={{ color: 'var(--color-primary)' }}>{filteredPlaces.length} places found</span>}
              </motion.div>
            )}

            {error && (
              <p className="mt-3 text-sm font-medium text-amber-500 flex items-center gap-2">
                <Navigation size={14} /> {error}
              </p>
            )}
          </motion.div>

          {/* ─── Results Grid ─── */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <div className="h-48" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
                  <div className="p-5 space-y-3">
                    <div className="h-5 rounded-lg w-3/4" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
                    <div className="h-4 rounded-lg w-1/2" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPlaces?.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPlaces.map((place) => (
                <motion.div
                  key={place._id}
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  onClick={() => navigate(`/cities/${place.city?.slug}/places/${place.slug}`)}
                  className="rounded-2xl overflow-hidden cursor-pointer group"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                    boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={place.images?.[0] || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600'}
                      alt={place.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Rating Badge */}
                    {place.averageRating > 0 && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
                        style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', color: '#fff' }}
                      >
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        {place.averageRating.toFixed(1)}
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold"
                        style={{ backgroundColor: 'var(--color-primary)', color: '#fff' }}
                      >
                        {place.type === 'food_shop' ? 'Food Shop' : place.type === 'famous_place' ? 'Famous Place' : 'Restaurant'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-1 group-hover:text-[var(--color-primary)] transition-colors"
                      style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
                    >
                      {place.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm mb-3" style={{ color: 'var(--color-text-muted)' }}>
                      <MapPin size={13} />
                      <span className="truncate">{place.address || place.city?.name}</span>
                    </div>

                    {place.cuisines?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {place.cuisines.slice(0, 3).map((cuisine, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md text-xs font-medium"
                            style={{
                              backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            {cuisine}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3"
                      style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}
                    >
                      {place.priceRange && (
                        <span className="text-xs font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                          Budget: {place.priceRange}
                        </span>
                      )}
                      <span className="text-xs font-bold flex items-center gap-1 ml-auto group-hover:translate-x-1 transition-transform"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        View Details <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : location ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
              >
                <MapPin size={36} style={{ color: 'var(--color-text-muted)' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>No Places Found</h3>
              <p className="max-w-md mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
                We couldn't find any places within {radius/1000}km of your location. Try selecting a different city above.
              </p>
            </motion.div>
          ) : null}

        </div>
      </div>
    </>
  );
};

export default ExploreNearMe;
