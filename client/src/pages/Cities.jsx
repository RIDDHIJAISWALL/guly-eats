import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Utensils } from 'lucide-react';
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
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
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
      <div className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-primary/10 text-primary"
            >
              <MapPin size={12} className="inline mr-1" /> ALL CITIES
            </span>
            <h1 className="text-3xl md:text-5xl font-black mb-4 font-heading">
              Choose Your Destination
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Select a city below to explore its famous street food, hidden gems, and iconic monuments on an interactive map.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
              {Array.from({ length: 15 }).map((_, i) => (
                <SkeletonLoader key={i} className="aspect-[3/4] rounded-2xl" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5"
            >
              {cities.map((city) => {
                const slug = city.slug;
                const color = CITY_COLORS[slug] || '#FF6B2B';
                const emoji = CITY_EMOJIS[slug] || '🍛';

                return (
                  <motion.div key={city._id} variants={cardVariants}>
                    <Link
                      to={`/cities/${slug}`}
                      className="group block relative rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[4/5]"
                      style={{
                        background: `linear-gradient(135deg, ${color}22, ${color}44)`,
                        border: `1px solid ${color}33`,
                      }}
                    >
                      {city.coverImage && (
                        <img
                          src={city.coverImage}
                          alt={city.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                      )}
                      {/* City Emoji - float top right */}
                      <div className="absolute top-3 right-3 z-10 bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg border border-white/30 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-xl">{emoji}</span>
                      </div>
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(to top, ${color} 0%, ${color}99 35%, transparent 100%)`,
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                        <h3 className="text-lg font-bold mb-0.5 text-white group-hover:translate-x-1 transition-transform duration-200 drop-shadow-md font-heading">
                          {city.name}
                        </h3>
                        <p className="text-xs mb-2 text-white/80">{city.state}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                            <Utensils size={10} className="inline mr-1" />
                            Explore Map →
                          </span>
                        </div>
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
