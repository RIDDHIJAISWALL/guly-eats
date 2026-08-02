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
      <div className="pt-12 pb-20 min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg, #FAF6F0)' }}>
        {/* Subtle background */}
        <div
          className="absolute inset-0 bg-cover bg-fixed opacity-[0.25]"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071")',
            backgroundPosition: 'center 0%', 
          }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-40 z-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, var(--color-bg, #FAF6F0) 0%, transparent 100%)' }}></div>
        <div className="absolute bottom-0 left-0 w-full h-40 z-0 pointer-events-none" style={{ background: 'linear-gradient(to top, var(--color-bg, #FAF6F0) 0%, transparent 100%)' }}></div>
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mb-5 bg-white/60 backdrop-blur-md border border-orange-100 text-[#F58216] shadow-sm">
              <MapPin size={14} /> ALL CITIES
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-5 font-heading" style={{ color: 'var(--color-text)' }}>
              Choose Your Destination
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto text-center leading-relaxed">
              Select a city below to explore its famous street food, hidden gems, and iconic monuments on an interactive map.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonLoader key={i} className="aspect-[4/3] rounded-[2rem]" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7"
            >
              {cities.map((city) => {
                const slug = city.slug;
                const color = CITY_COLORS[slug] || '#FF6B2B';
                const emoji = CITY_EMOJIS[slug] || '🍛';

                return (
                  <motion.div key={city._id} variants={cardVariants}>
                    <Link
                      to={`/cities/${slug}`}
                      className="group block relative rounded-[2rem] overflow-hidden aspect-[4/3] shadow-lg hover:shadow-2xl transition-shadow duration-500"
                      style={{ border: `2px solid ${color}22` }}
                    >
                      {/* Image - always fills the card */}
                      {city.coverImage ? (
                        <img
                          src={city.coverImage}
                          alt={city.name}
                          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                      ) : (
                        <div 
                          className="absolute inset-0" 
                          style={{ background: `linear-gradient(135deg, ${color}44, ${color}88)` }}
                        />
                      )}

                      {/* Always-visible dark gradient at bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Hover overlay for extra effect */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Emoji badge top-right */}
                      <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-2xl shadow-md border border-white/50 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl">{emoji}</span>
                      </div>

                      {/* City Name - ALWAYS visible at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                        <h3 className="text-2xl md:text-3xl font-black text-white drop-shadow-lg tracking-wide font-heading">
                          {city.name}
                        </h3>
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
