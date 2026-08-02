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
  hidden: { opacity: 0, y: 30, scale: 0.95 },
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
    { name: 'Delhi', lat: 28.6139, lng: 77.2090, emoji: '🍛' },
    { name: 'Varanasi', lat: 25.3176, lng: 83.0064, emoji: '🛕' },
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462, emoji: '🍢' },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777, emoji: '🌊' },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873, emoji: '🏰' },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639, emoji: '🧁' },
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
      
      <div className="min-h-screen pt-12 pb-16 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg, #FAF6F0)' }}>
        
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-300/20 blur-[100px] rounded-full mix-blend-multiply pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-yellow-300/20 blur-[100px] rounded-full mix-blend-multiply pointer-events-none -translate-x-1/2"></div>

        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
          
          {/* ─── Hero Header ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2, bounce: 0.6 }}
              className="w-20 h-20 mx-auto mb-6 rounded-[2rem] flex items-center justify-center shadow-xl shadow-orange-500/20 relative"
              style={{ background: 'linear-gradient(135deg, #F58216, #FFAA33)' }}
            >
              <Navigation size={32} className="text-white fill-white/20" />
              {/* Cute floating badges */}
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-3 -right-3 bg-white p-2 rounded-full shadow-lg text-lg">🍔</motion.div>
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }} className="absolute -bottom-2 -left-3 bg-white p-2 rounded-full shadow-lg text-lg">🍕</motion.div>
            </motion.div>
            <h1 className="text-4xl sm:text-6xl font-black mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F58216] to-[#FFAA33]">Near You</span>
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Find the most delicious hidden gems, street food, and iconic eateries around your current location!
            </p>
          </motion.div>

          {/* ─── Location Selector Card ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-[2.5rem] p-10 sm:p-12 mb-12 relative overflow-hidden backdrop-blur-xl"
            style={{
              backgroundColor: isDark ? 'rgba(30,30,40,0.7)' : 'rgba(255,255,255,0.7)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.4)'}`,
              boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.3)' : '0 20px 40px rgba(245,130,22,0.08)',
            }}
          >
            <div className="flex flex-col md:flex-row gap-5 mb-6">
              {/* Current Location Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={getCurrentLocation}
                disabled={isLocating}
                className="flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-[15px] transition-all w-full md:w-auto justify-center shadow-lg shadow-orange-500/20 shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #F58216, #FFAA33)',
                  color: '#fff',
                }}
              >
                {isLocating ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Crosshair size={20} />
                )}
                {isLocating ? 'Locating You...' : 'Use Current Location'}
              </motion.button>

              {/* Search Input */}
              <div className="relative flex-1 w-full group">
                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F58216] transition-colors" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for pizza, momos, or specific places..."
                  className="w-full pl-14 pr-5 py-4 rounded-2xl border-2 outline-none transition-all font-medium text-[15px] shadow-sm"
                  style={{
                    backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#ffffff',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6',
                    color: 'var(--color-text)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#F58216'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6'; }}
                />
              </div>
            </div>

            {/* Quick City Selection */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <span className="text-sm font-bold uppercase tracking-wider px-2" style={{ color: 'var(--color-text-muted)' }}>
                Quick Jump:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {popularLocations.map((city) => (
                  <motion.button
                    key={city.name}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => selectCity(city)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                    style={{
                      backgroundColor: locationName === city.name
                        ? '#F58216'
                        : isDark ? 'rgba(255,255,255,0.06)' : '#ffffff',
                      color: locationName === city.name
                        ? '#fff'
                        : 'var(--color-text-secondary)',
                      border: locationName === city.name
                        ? '1px solid #F58216'
                        : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`,
                    }}
                  >
                    <span>{city.emoji}</span> {city.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Active Location Display */}
            {locationName && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 pt-5 flex items-center gap-2 text-sm font-semibold"
                style={{ color: 'var(--color-text-secondary)', borderTop: `1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}` }}
              >
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                  <MapPin size={16} />
                </div>
                Exploring near: <span className="font-black text-[15px]" style={{ color: 'var(--color-text)' }}>{locationName}</span>
                {filteredPlaces && <span className="ml-auto font-black px-3 py-1 bg-orange-100 text-orange-600 rounded-lg">{filteredPlaces.length} places found</span>}
              </motion.div>
            )}

            {error && (
              <p className="mt-4 text-sm font-semibold text-red-500 flex items-center gap-2 bg-red-50 p-3 rounded-xl border border-red-100">
                <Navigation size={16} /> {error}
              </p>
            )}
          </motion.div>

          {/* ─── Results Grid ─── */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="rounded-[2rem] overflow-hidden animate-pulse shadow-sm" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <div className="h-56" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
                  <div className="p-6 space-y-4">
                    <div className="h-6 rounded-lg w-3/4" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPlaces.map((place) => (
                <motion.div
                  key={place._id}
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  onClick={() => navigate(`/cities/${place.city?.slug}/places/${place.slug}`)}
                  className="rounded-[2rem] overflow-hidden cursor-pointer group flex flex-col h-full bg-white relative z-10"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
                    boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={place.images?.[0] || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600'}
                      alt={place.name}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    
                    {/* Rating Badge */}
                    {place.averageRating > 0 && (
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-black shadow-lg"
                        style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#F58216' }}
                      >
                        <Star size={14} className="fill-current" />
                        {place.averageRating.toFixed(1)}
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg"
                        style={{ backgroundColor: '#F58216', color: '#fff' }}
                      >
                        {place.type === 'food_shop' ? 'Food Shop' : place.type === 'famous_place' ? 'Famous Place' : 'Restaurant'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-xl font-black mb-2 group-hover:text-[#F58216] transition-colors line-clamp-1"
                      style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}
                    >
                      {place.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm mb-4 font-medium" style={{ color: 'var(--color-text-muted)' }}>
                      <MapPin size={14} className="text-[#F58216] shrink-0" />
                      <span className="truncate">{place.address || place.city?.name}</span>
                    </div>

                    {place.cuisines?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                        {place.cuisines.slice(0, 3).map((cuisine, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-bold"
                            style={{
                              backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#FFF5EC',
                              color: isDark ? 'var(--color-text-secondary)' : '#F58216',
                            }}
                          >
                            {cuisine}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 mt-auto"
                      style={{ borderTop: `1px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}
                    >
                      {place.priceRange && (
                        <span className="text-sm font-black" style={{ color: 'var(--color-text-secondary)' }}>
                          {place.priceRange}
                        </span>
                      )}
                      <span className="text-sm font-black flex items-center gap-1 ml-auto group-hover:translate-x-1 transition-transform"
                        style={{ color: '#F58216' }}
                      >
                        Explore <ChevronRight size={16} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : location ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 px-6 max-w-lg mx-auto bg-white rounded-[3rem] shadow-xl border border-orange-100"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-orange-50 rounded-full flex items-center justify-center relative">
                <span className="text-4xl absolute animate-bounce">😢</span>
              </div>
              <h3 className="text-2xl font-black mb-3" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-heading)' }}>Nothing nearby yet!</h3>
              <p className="text-lg leading-relaxed text-gray-500">
                We couldn't find any places within {radius/1000}km of your location. But don't worry, we are adding new spots every day! 
                <br /><br />
                Try selecting a different city from the quick jump menu above.
              </p>
            </motion.div>
          ) : null}

        </div>
      </div>
    </>
  );
};

export default ExploreNearMe;
