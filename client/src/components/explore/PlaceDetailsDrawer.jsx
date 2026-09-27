import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock, MapPin, Navigation2, Info, Map } from 'lucide-react';
import api from '@/lib/api';

const PlaceDetailsDrawer = ({ placeSlug, onClose }) => {
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (placeSlug) {
      setLoading(true);
      api.get(`/places/${placeSlug}`)
        .then(res => setPlace(res.data.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [placeSlug]);

  const handleDirections = () => {
    if (place?.location?.coordinates) {
      const [lng, lat] = place.location.coordinates;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    }
  };

  return (
    <AnimatePresence>
      {placeSlug && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
          />

          {/* ─── DETACHED FLOATING DRAWER (Margins applied here) ─── */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 250 }}
            className="fixed top-0 right-0 w-full h-full md:w-[460px] md:h-[calc(100vh-32px)] md:top-4 md:right-4 bg-[#f8fafc] z-[9999] shadow-[0_0_40px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden rounded-none md:rounded-2xl border border-transparent md:border-white/60"
          >
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#F58216]"></div>
                <p className="text-[14px] font-bold text-gray-400 tracking-wide">Loading wonderful details...</p>
              </div>
            ) : place ? (
              <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth pb-6">

                {/* ─── CUTE HEADER IMAGE CARD ─── */}
                <div className="p-6 sm:p-8 relative">
                  <button
                    onClick={onClose}
                    className="absolute top-10 right-12 z-10 w-10 h-10 bg-white/90 backdrop-blur-md hover:bg-white rounded-full text-gray-800 flex items-center justify-center transition-transform hover:scale-110 shadow-lg border border-gray-100"
                  >
                    <X size={20} strokeWidth={3} />
                  </button>

                  <div className="relative w-full h-[300px] sm:h-[320px] rounded-2xl overflow-hidden shadow-xl shadow-gray-200/50 bg-white">
                    <img
                      src={place.images?.[0] || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400'}
                      alt={place.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />

                    {/* Floating Rating Pill */}
                    <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg border border-white/20">
                      <Star size={18} className="text-amber-400 fill-amber-400" />
                      <span className="font-black text-gray-900 text-[15px]">{place.averageRating?.toFixed(1) || '4.5'}</span>
                    </div>
                  </div>
                </div>

                {/* ─── INFO SECTION (Proper inner padding applied) ─── */}
                <div className="px-6 sm:px-8 pb-10">

                  {/* The Cute Unified Bordered Wrapper */}
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_10px_40px_rgb(0,0,0,0.05)] border border-gray-100 relative overflow-hidden">

                    {/* Decorative Background Blob */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

                    <div className="relative z-10 mb-6">
                      <h2
                        className="text-[36px] font-black leading-[1.1] bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-800 to-gray-500"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        {place.name}
                      </h2>
                      <div className="w-16 h-1.5 bg-gradient-to-r from-[#F58216] to-orange-300 rounded-full mt-4 shadow-sm" />
                    </div>

                    {/* Tags / Badges */}
                    <div className="flex flex-wrap items-center gap-3.5 mb-8 relative z-10">
                      {place.timings && (
                        <div className="flex items-center gap-2.5 bg-gradient-to-br from-white to-blue-50/50 text-blue-600 pr-5 pl-2 py-2 rounded-2xl text-[14px] font-bold border border-blue-100/60 shadow-[0_8px_20px_rgb(59,130,246,0.06)] hover:-translate-y-1 transition-all cursor-default group">
                          <div className="bg-blue-100/60 p-2 rounded-xl text-blue-500 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all">
                            <Clock size={16} strokeWidth={2.5} />
                          </div>
                          <span className="tracking-wide">{place.timings.open} - {place.timings.close}</span>
                        </div>
                      )}
                      {place.type && (
                        <div className="flex items-center gap-2.5 bg-gradient-to-br from-white to-emerald-50/50 text-emerald-700 pr-5 pl-2 py-2 rounded-2xl text-[14px] font-bold border border-emerald-100/60 shadow-[0_8px_20px_rgb(16,185,129,0.06)] hover:-translate-y-1 transition-all cursor-default group">
                          <div className="bg-emerald-100/60 p-2 rounded-xl text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                            <Map size={16} strokeWidth={2.5} />
                          </div>
                          <span className="capitalize tracking-wide">{place.type.replace('_', ' ')}</span>
                        </div>
                      )}
                    </div>

                    {/* The Story */}
                    {place.description && (
                      <div className="mt-10 relative z-10">
                        <div className="w-12 h-1.5 bg-orange-100/80 rounded-full mb-6" />
                        <h3 className="text-[18px] font-black text-gray-900 flex items-center gap-2.5 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                          <Info size={20} className="text-[#F58216]" /> The Story
                        </h3>
                        <p className="text-gray-600 leading-[1.85] text-[15px] font-medium tracking-wide">
                          {place.description}
                        </p>
                      </div>
                    )}

                    {/* Cute Cuisines */}
                    {place.cuisines?.length > 0 && (
                      <div className="mt-12 relative z-10">
                        <div className="w-12 h-1.5 bg-orange-100/80 rounded-full mb-6" />
                        <h3 className="text-[13px] font-black text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2.5">
                          <Star size={16} className="text-amber-400" /> Famous For
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {place.cuisines.map((c, i) => (
                            <span
                              key={i}
                              className="px-5 py-2.5 bg-orange-50/40 border border-orange-100 hover:border-[#F58216] rounded-xl text-[14px] font-extrabold text-[#F58216] shadow-sm transition-all cursor-default hover:-translate-y-0.5 hover:shadow-orange-500/15"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-bold bg-white">
                <MapPin size={48} className="mb-4 text-gray-200" />
                <p>Place details not found.</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PlaceDetailsDrawer;