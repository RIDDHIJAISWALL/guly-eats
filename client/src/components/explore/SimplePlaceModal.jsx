import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { X, Star, Clock, MapPin, Heart } from 'lucide-react';
import { MARKER_COLORS } from '@/lib/constants';
import useAuthStore from '@/stores/authStore';

const SimplePlaceModal = ({ place, onClose }) => {
  const { user, toggleWishlist, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  if (!place) return null;

  const isFood = place.famousFoods && place.famousFoods.length > 0;
  const typeKey = place.type || (isFood ? 'food_shop' : 'monument');
  const accentColor = MARKER_COLORS[typeKey] || '#FF6B2B';
  const coverImg = place.images?.[0] || place.coverImage;

  const isWishlisted = user?.wishlist?.[place.isFamousPlace ? 'famousPlaces' : 'places']?.some(p => (p._id || p) === place._id);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return alert("Please login to save places!");
    await toggleWishlist(place._id, place.isFamousPlace ? 'famousPlaces' : 'places');
    queryClient.invalidateQueries({ queryKey: ['wishlist'] });
  };

  return (
    <AnimatePresence>
      {place && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998]"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          />

          <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none md:pl-[420px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                pointerEvents: 'auto',
                width: '90%',
                maxWidth: '420px',
                backgroundColor: 'var(--color-surface, #fff)',
                borderRadius: '24px',
                boxShadow: '0 24px 50px rgba(0,0,0,0.3)',
                overflow: 'hidden',
              }}
            >
            {/* Header Image Area */}
            <div style={{ position: 'relative', width: '100%', height: '220px', backgroundColor: '#f0f0f0' }}>
              {coverImg ? (
                <img 
                  src={coverImg} 
                  alt={place.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${accentColor}20` }}>
                  <MapPin size={48} color={accentColor} opacity={0.5} />
                </div>
              )}
              
              {/* Gradient Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)'
              }} />

              {/* Close Button */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  color: '#fff',
                  transition: 'all 0.2s',
                  zIndex: 2
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <X size={18} strokeWidth={2.5} />
              </button>

              {/* Wishlist Heart */}
              <button
                onClick={handleWishlist}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '60px',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  color: isWishlisted ? '#ef4444' : '#fff',
                  transition: 'all 0.2s',
                  zIndex: 2
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <Heart size={18} fill={isWishlisted ? '#ef4444' : 'transparent'} strokeWidth={2.5} />
              </button>

              {/* Title & Rating overlaying the image */}
              <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', zIndex: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    color: '#D97706',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}>
                    <Star size={13} style={{ fill: '#F59E0B' }} />
                    {place.averageRating?.toFixed(1) || '4.5'}
                  </div>
                  {place.type && (
                    <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      {place.type.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '26px',
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1.1,
                  margin: 0,
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                }}>
                  {place.name}
                </h2>
              </div>
            </div>

            {/* Content Area */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Address */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} style={{ color: 'var(--color-text-muted)', marginTop: '2px', flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  {place.address}
                </p>
              </div>

              {/* Description (Scrollable if long) */}
              {place.description && (
                <div style={{ 
                  backgroundColor: 'rgba(0,0,0,0.02)', 
                  padding: '16px', 
                  borderRadius: '16px',
                  border: '1px solid rgba(0,0,0,0.04)'
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '14px', 
                    color: 'var(--color-text)', 
                    lineHeight: 1.6,
                    fontWeight: 500
                  }}>
                    {place.description}
                  </p>
                </div>
              )}

              {/* Timings */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                backgroundColor: `${accentColor}10`,
                borderRadius: '16px',
                border: `1px solid ${accentColor}20`
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Clock size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Operating Hours
                  </p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '16px', fontWeight: 800, color: 'var(--color-text)' }}>
                    {place.timings ? `${place.timings.open} - ${place.timings.close}` : 'Contact to confirm'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SimplePlaceModal;
