import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Star, MapPin, Clock, Navigation2, Check, Share2, Heart, MessageSquare, X, ChevronDown, Utensils, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import SEOHead from '@/components/common/SEOHead';
import { MARKER_COLORS } from '@/lib/constants';

const PlaceDetail = () => {
  const { citySlug, placeSlug } = useParams();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for navbar glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Place Details
  const { data: place, isLoading, error } = useQuery({
    queryKey: ['place', placeSlug],
    queryFn: async () => {
      const { data } = await api.get(`/places/${placeSlug}`);
      return data.data;
    },
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-3xl font-black text-gray-800 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Place Not Found</h2>
        <p className="text-gray-500 mb-8">The place you are looking for does not exist or has been removed.</p>
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
          <div className="h-32 bg-white rounded-3xl w-full mb-8 shadow-sm" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 h-96 bg-white rounded-3xl shadow-sm" />
            <div className="h-96 bg-white rounded-3xl shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  const isFood = place?.type === 'food_shop' || place?.type === 'restaurant' || place?.famousFoods?.length > 0;
  const accentColor = MARKER_COLORS[place?.type] || '#FF6B2B';
  const images = place?.images || [];
  
  const handleDirections = () => {
    if (place?.location?.coordinates) {
      const [lng, lat] = place.location.coordinates;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans selection:bg-primary/20 selection:text-primary">
      <SEOHead 
        title={`${place.name} in ${place.city?.name} - Guly Eats`}
        description={place.description}
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
                {place.name}
              </motion.h1>
            )}
          </AnimatePresence>

          <div className="flex gap-3">
            <button className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${scrolled ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 'bg-black/20 hover:bg-black/40 backdrop-blur-md text-white'}`}>
              <Share2 size={20} />
            </button>
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isLiked ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 hover:bg-red-600' : scrolled ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' : 'bg-black/20 hover:bg-black/40 backdrop-blur-md text-white'}`}
            >
              <Heart size={20} className={isLiked ? "fill-white" : ""} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden bg-black">
        {images.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.img 
              key={activeImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.8, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              src={images[activeImage]} 
              alt={place.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <span className="text-gray-500 font-medium">No Images</span>
          </div>
        )}

        {/* Hero Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 flex flex-col gap-3 z-20">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-white scale-110 shadow-2xl z-10' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'}`}
              >
                <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
              </button>
            ))}
          </div>
        )}

        {/* Hero Content (Bottom Aligned) */}
        <div className="absolute bottom-0 left-0 w-full pb-32 pt-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-lg backdrop-blur-md" style={{ backgroundColor: accentColor }}>
                  {place.type.replace('_', ' ')}
                </span>
                {place.isVegetarian && (
                  <span className="px-4 py-1.5 rounded-full bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-bold backdrop-blur-md shadow-lg">Pure Veg</span>
                )}
                {place.isHalal && (
                  <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md shadow-lg">Halal</span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
                {place.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-lg font-medium">
                <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                  <Star size={20} className="fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white">{place.averageRating?.toFixed(1) || '4.5'}</span>
                  <span className="text-white/60">({place.numReviews || 120} reviews)</span>
                </div>
                <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 capitalize">
                  <span className="text-white/60">Budget:</span> <span className="font-bold text-white">{place.budget || 'Medium'}</span>
                </div>
                {place.timings && (
                  <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10">
                    <Clock size={18} className="text-white/60" />
                    <span>{place.timings.open} - {place.timings.close}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-20 -mt-20">
        
        {/* Quick Info Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-200/50 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border border-gray-100"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100 shrink-0">
              <MapPin size={24} style={{ color: accentColor }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Location</h3>
              <p className="text-gray-900 font-medium text-lg leading-snug">{place.address}</p>
            </div>
          </div>
          
          <div className="w-full md:w-px h-px md:h-16 bg-gray-100 shrink-0" />
          
          <button 
            onClick={handleDirections}
            className="w-full md:w-auto px-10 py-5 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-xl group"
            style={{ backgroundColor: accentColor, boxShadow: `0 10px 25px -5px ${accentColor}60` }}
          >
            <Navigation2 size={24} className="group-hover:animate-bounce" />
            Get Directions
          </button>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-24">
          
          {/* Left Column: Description & Famous Foods */}
          <div className="lg:col-span-2 space-y-12">
            
            <section className="prose prose-lg max-w-none">
              <div className="flex items-center gap-3 mb-6">
                <Info size={28} style={{ color: accentColor }} />
                <h2 className="text-3xl font-black text-gray-900 m-0" style={{ fontFamily: 'var(--font-heading)' }}>The Story</h2>
              </div>
              <p className="text-gray-600 leading-loose text-lg whitespace-pre-wrap font-medium">
                {place.description}
              </p>
            </section>

            {isFood && place.famousFoods?.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Utensils size={28} style={{ color: accentColor }} />
                  <h2 className="text-3xl font-black text-gray-900 m-0" style={{ fontFamily: 'var(--font-heading)' }}>Must Try Dishes</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {place.famousFoods.map((food, index) => (
                    <Link 
                      key={food._id}
                      to={`/food/${food.slug}`}
                    >
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative h-64 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
                      >
                        <img 
                          src={food.image || place.images[0]} 
                          alt={food.name} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="absolute bottom-0 left-0 w-full p-6">
                          <h4 className="font-black text-2xl text-white mb-2 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{food.name}</h4>
                          <p className="text-sm text-white/80 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">{food.description}</p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews Section */}
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <MessageSquare size={28} style={{ color: accentColor }} />
                  <h2 className="text-3xl font-black text-gray-900 m-0" style={{ fontFamily: 'var(--font-heading)' }}>Reviews</h2>
                </div>
                <button 
                  onClick={() => setShowReviewModal(true)}
                  className="px-6 py-3 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-colors shadow-md"
                >
                  Write Review
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-10 text-center border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Star className="text-gray-300" size={32} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500 font-medium">Be the first to share your experience here! Your review helps others discover great places.</p>
                <button 
                  onClick={() => setShowReviewModal(true)}
                  className="mt-6 text-primary font-bold hover:underline"
                >
                  Add the first review
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            {/* Cuisines Widget */}
            {place.cuisines?.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-widest text-center">Cuisines</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {place.cuisines.map((cuisine, i) => (
                    <span 
                      key={i} 
                      className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors cursor-default"
                    >
                      {cuisine}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities Widget */}
            {place.facilities?.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-widest text-center">Facilities</h3>
                <ul className="space-y-4">
                  {place.facilities.map((facility, i) => (
                    <li key={i} className="flex items-center gap-4 text-gray-700 font-medium p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 text-green-500">
                        <Check size={18} strokeWidth={3} />
                      </div>
                      <span className="capitalize text-base">{facility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowReviewModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl relative z-10"
            >
              <button 
                onClick={() => setShowReviewModal(false)}
                className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-600"
              >
                <X size={20} strokeWidth={3} />
              </button>
              
              <h2 className="text-3xl font-black mb-8 text-gray-900" style={{ fontFamily: 'var(--font-heading)' }}>Rate & Review</h2>
              
              <div className="mb-8">
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="text-gray-200 hover:text-amber-400 hover:scale-110 transition-all">
                      <Star size={40} className="fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Your Review</label>
                <textarea 
                  rows="4" 
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 text-lg outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                  placeholder={`Share your experience at ${place.name}...`}
                />
              </div>

              <button 
                onClick={() => setShowReviewModal(false)}
                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-lg hover:bg-secondary hover:-translate-y-1 transition-all shadow-lg shadow-primary/30"
              >
                Post Review
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlaceDetail;
