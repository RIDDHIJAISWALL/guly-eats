import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import api from '@/lib/api';
import SEOHead from '@/components/common/SEOHead';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import { CITY_COLORS } from '@/lib/constants';

const CITY_EMOJIS = {
  varanasi: '🛕', lucknow: '🍢', prayagraj: '🍲', delhi: '🍛',
  noida: '🍔', indore: '🥘', jaipur: '🏰', srinagar: '🏔️',
  nainital: '⛰️', kolkata: '🧁', chennai: '☕', mumbai: '🌊', amritsar: '🥛',
  hyderabad: '🍗',
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const Cities = () => {
  const { data: citiesData, isLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data } = await api.get('/cities');
      return data.data;
    },
  });

  const cities = citiesData || [];

  return (
    <>
      <SEOHead
        title="Explore Cities - Guly Eats"
        description="Discover the best street food, restaurants, and famous places across Indian cities."
      />
      <div className="pt-12 min-h-screen relative" style={{ backgroundColor: '#F8F9FC', paddingBottom: '250px' }}>
        <div className="container relative z-10 mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center justify-center text-center mb-16"
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', borderRadius: '100px',
              backgroundColor: '#FFF4F0', color: '#FF6B2B',
              fontWeight: 800, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase',
              marginBottom: '20px'
            }}>
              <MapPin size={14} strokeWidth={2.5} /> ALL CITIES
            </span>
            <h1 style={{
              fontSize: '42px', fontWeight: 900, color: '#1A1A2E',
              fontFamily: 'var(--font-heading)', margin: '0 0 16px 0', letterSpacing: '-1px'
            }}>
              Choose Your Destination
            </h1>
            <p style={{
              fontSize: '16px', color: '#8B8B9E', maxWidth: '600px', margin: '0 auto', fontWeight: 500
            }}>
              Select a city below to explore its famous street food, hidden gems, and iconic monuments.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" style={{ marginBottom: '50px' }}>
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonLoader key={i} className="h-72 rounded-3xl" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              style={{ marginBottom: '20px' }}
            >
              {cities.map((city) => {
                const slug = city.slug;

                return (
                  <motion.div key={city._id} variants={cardVariants} style={{ height: '100%' }}>
                    <Link
                      to={`/cities/${slug}`}
                      className="group block"
                      style={{
                        backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #F0F0F5',
                        overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                        transition: 'all 0.3s ease', textDecoration: 'none', height: '100%',
                        boxShadow: '0 4px 12px rgba(26,26,46,0.03)'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(26,26,46,0.08)'; e.currentTarget.style.borderColor = '#E8E8F0'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(26,26,46,0.03)'; e.currentTarget.style.borderColor = '#F0F0F5'; }}
                    >
                      <div className="h-40 w-full relative bg-gray-100 overflow-hidden shrink-0">
                        {city.coverImage ? (
                          <img
                            src={city.coverImage}
                            alt={city.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50" />
                        )}
                      </div>
                      <div style={{ padding: '20px 16px', textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1A1A2E', fontFamily: 'var(--font-heading)', margin: '0 0 6px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{city.name}</h3>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#8B8B9E', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {city.tagline || 'No tagline provided'}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cities;
