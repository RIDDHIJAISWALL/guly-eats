import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Star, MapPin, ChefHat, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import SEOHead from '@/components/common/SEOHead';
import SkeletonLoader from '@/components/common/SkeletonLoader';

const FoodDetail = () => {
  const { foodSlug } = useParams();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for navbar glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 1. Fetch Food details
  const { data: food, isLoading, error } = useQuery({
    queryKey: ['food', foodSlug],
    queryFn: async () => {
      const { data } = await api.get(`/foods/${foodSlug}`);
      return data.data;
    },
  });

  // 2. Fetch Places serving this food
  const { data: places = [], isLoading: placesLoading } = useQuery({
    queryKey: ['places', 'food', food?._id],
    queryFn: async () => {
      if (!food?._id) return [];
      const { data } = await api.get(`/places?famousFoods=${food._id}`);
      return data.data;
    },
    enabled: !!food?._id,
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-3xl font-black text-gray-800 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Food Not Found</h2>
        <p className="text-gray-500 mb-8">The dish you are looking for does not exist or has been removed.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
          Go Back
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="h-[70vh] bg-gray-200 w-full" />
        <div className="max-w-7xl mx-auto px-4 py-12 -mt-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 h-96 bg-white rounded-3xl shadow-sm" />
            <div className="h-96 bg-white rounded-3xl shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans selection:bg-primary/20 selection:text-primary">
      <SEOHead 
        title={`${food.name} - Famous Street Food`}
        description={food.description}
      />

      {/* Floating Header */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm py-3' : 'bg-transparent py-6'}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${scrolled ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 'bg-black/20 hover:bg-black/40 backdrop-blur-md text-white'}`}
          >
            <ArrowLeft size={24} />
          </button>
          
          <AnimatePresence>
            {scrolled && (
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="font-bold text-lg md:text-xl text-gray-900 absolute left-1/2 -translate-x-1/2 hidden md:block"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {food.name}
              </motion.h1>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-black">
        <motion.img 
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{ duration: 0.7 }}
          src={food.image || 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=2000'} 
          alt={food.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Hero Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

        {/* Hero Content (Bottom Aligned) */}
        <div className="absolute bottom-0 left-0 w-full pb-32 pt-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {food.isVegetarian ? (
                  <span className="px-4 py-1.5 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-bold backdrop-blur-md shadow-lg">Pure Veg</span>
                ) : (
                  <span className="px-4 py-1.5 rounded-full bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-bold backdrop-blur-md shadow-lg">Non-Veg</span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
                {food.name}
              </h1>
              
              {food.originCity && (
                <div className="flex items-center gap-2 bg-black/30 px-5 py-2.5 rounded-full backdrop-blur-sm border border-white/10 w-fit">
                  <MapPin size={18} className="text-primary" />
                  <span className="text-white/80 font-medium">Famous in <span className="font-bold text-white">{food.originCity.name}</span></span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20 -mt-20">
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-24">
          
          {/* Left Column: Description & Best Places */}
          <div className="lg:col-span-2 space-y-12">
            
            <section className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <Info size={28} className="text-primary" />
                <h2 className="text-3xl font-black text-gray-900 m-0" style={{ fontFamily: 'var(--font-heading)' }}>The Story</h2>
              </div>
              <p className="text-gray-600 leading-loose text-lg whitespace-pre-wrap font-medium">
                {food.description}
              </p>
            </section>

            {/* Best Places to Eat */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <ChefHat size={32} className="text-primary" />
                <h2 className="text-3xl font-black text-gray-900 m-0" style={{ fontFamily: 'var(--font-heading)' }}>Best Places for {food.name}</h2>
              </div>
              
              {placesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <SkeletonLoader key={i} className="h-32 rounded-3xl w-full" />)}
                </div>
              ) : places.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center border border-dashed border-gray-200 shadow-sm">
                  <ChefHat className="text-gray-300 mx-auto mb-4" size={48} />
                  <h3 className="font-bold text-xl text-gray-900 mb-2">No places found</h3>
                  <p className="text-gray-500 font-medium">We haven't listed any top places for this dish yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {places.map((place, idx) => (
                    <Link 
                      key={place._id}
                      to={`/cities/${place.city?.slug || 'unknown'}/places/${place.slug}`}
                    >
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex flex-col sm:flex-row gap-6 bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                      >
                        <div className="relative w-full sm:w-48 h-48 sm:h-auto rounded-2xl overflow-hidden shrink-0">
                          <img 
                            src={place.images[0] || 'https://via.placeholder.com/400'} 
                            alt={place.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                          <div className="absolute top-3 left-3 w-8 h-8 bg-black/50 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center font-black text-sm shadow-lg">
                            {idx + 1}
                          </div>
                        </div>
                        <div className="flex-1 py-2 pr-2 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10">
                              {place.type.replace('_', ' ')}
                            </span>
                          </div>
                          <h3 className="font-black text-2xl text-gray-900 group-hover:text-primary transition-colors mb-2">{place.name}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-4 font-medium">
                            <MapPin size={16} className="text-gray-400" /> {place.address}
                          </p>
                          <div className="flex items-center gap-4 text-sm font-bold">
                            <span className="flex items-center text-amber-500 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                              <Star size={16} className="fill-amber-500 mr-1.5" /> {place.averageRating?.toFixed(1) || '4.5'}
                            </span>
                            <span className="text-gray-400 font-medium">({place.numReviews || 120} reviews)</span>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center justify-center pr-4">
                          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <ArrowLeft size={20} className="rotate-135" />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10" />
              
              <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-widest" style={{ fontFamily: 'var(--font-heading)' }}>Fast Facts</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${food.isVegetarian ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                    <ChefHat size={24} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Dietary</span>
                    <span className="font-bold text-gray-900">{food.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}</span>
                  </div>
                </div>
                
                {food.originCity && (
                  <div className="flex items-center gap-4 border-b border-gray-50 pb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-500">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <span className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Origin</span>
                      <span className="font-bold text-gray-900">{food.originCity.name}</span>
                    </div>
                  </div>
                )}
                
                {food.spicinessLevel && (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-50 text-amber-500">
                      <Star size={24} />
                    </div>
                    <div>
                      <span className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Spice Level</span>
                      <span className="font-bold text-gray-900">{food.spicinessLevel}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
