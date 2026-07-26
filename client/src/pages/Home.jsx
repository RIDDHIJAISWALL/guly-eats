import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, MapPin, Utensils, Map, Star, ChevronLeft, ChevronRight, Compass, Route, Heart, Clock, TrendingUp } from 'lucide-react';
import SEOHead from '@/components/common/SEOHead';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import { APP_NAME, APP_TAGLINE, CITY_COLORS } from '@/lib/constants';
import api from '@/lib/api';

// City emoji map for decorative overlays
const CITY_EMOJIS = {
  varanasi: '🛕', lucknow: '🍢', prayagraj: '🍲', delhi: '🍛',
  noida: '🍔', indore: '🥘', jaipur: '🏰', srinagar: '🏔️',
  nainital: '⛰️', kolkata: '🧁', chennai: '☕', mumbai: '🌊', amritsar: '🥛',
  hyderabad: '🍗',
};

// Trending food items (static for now — will be API-driven later)
const trendingFoods = [
  { name: 'Tamatar Chaat', city: 'Varanasi', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&q=80', color: '#FF6B2B', description: 'Tangy tomato-based chaat unique to Banaras' },
  { name: 'Tunday Kebab', city: 'Lucknow', image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&q=80', color: '#D4A017', description: 'World-famous melt-in-mouth galouti kebabs' },
  { name: 'Chole Bhature', city: 'Delhi', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&q=80', color: '#C41E3A', description: 'Crispy bhature with spicy chickpea curry' },
  { name: 'Vada Pav', city: 'Mumbai', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80', color: '#0284C7', description: "Mumbai's iconic spicy potato burger" },
  { name: 'Poha Jalebi', city: 'Indore', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&q=80', color: '#7C3AED', description: 'The legendary Indori breakfast combo' },
  { name: 'Pyaaz Kachori', city: 'Jaipur', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80', color: '#E11D73', description: 'Crispy onion-filled pastry from the Pink City' },
  { name: 'Rosogolla', city: 'Kolkata', image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=500&q=80', color: '#C2410C', description: 'Soft syrupy cottage cheese dumplings' },
  { name: 'Biryani', city: 'Hyderabad', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&q=80', color: '#059669', description: 'Slow-cooked dum biryani of the Nawabs' },
];

// Testimonials
const testimonials = [
  { name: 'Priya S.', city: 'Delhi', avatar: '👩‍💻', text: 'Found hidden gems in Old Delhi I never knew existed! The map directions were super helpful.', rating: 5, color: 'from-orange-100 to-amber-50' },
  { name: 'Rahul M.', city: 'Varanasi', avatar: '👨‍🍳', text: 'As a food blogger, this app is a goldmine. Every gully chaat spot mapped perfectly!', rating: 5, color: 'from-blue-100 to-cyan-50' },
  { name: 'Ananya K.', city: 'Mumbai', avatar: '👩‍🎨', text: 'Planned an entire weekend food trail through Mumbai street food. Absolutely loved it!', rating: 5, color: 'from-pink-100 to-rose-50' },
  { name: 'Meera D.', city: 'Kolkata', avatar: '👩‍🏫', text: 'From Rosogolla to Kathi Rolls, this app knows Kolkata food better than locals!', rating: 5, color: 'from-emerald-100 to-teal-50' },
];

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

// ── Animated counter ──
const AnimatedCounter = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const numericValue = parseInt(value) || 0;

  useEffect(() => {
    if (!isInView) return;
    const duration = 1200;
    const steps = 40;
    const increment = numericValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// ── Trending Foods Grid ──
const TrendingGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {trendingFoods.map((food, i) => (
        <motion.div
          key={food.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="group cursor-pointer relative h-[320px] rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-white border border-gray-100"
        >
          {/* City Badge - Animated on Top Right */}
          <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transform -translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-100">
            <div
              className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md bg-white/95 shadow-[0_10px_20px_rgba(0,0,0,0.1)] border border-white"
              style={{ color: food.color }}
            >
              <MapPin size={12} className="inline mr-1" />
              {food.city}
            </div>
          </div>

          {/* Background Image Container */}
          <div className="absolute inset-0 h-[240px] w-full overflow-hidden rounded-t-[32px] bg-gray-100">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${food.image})` }}
            />
          </div>

          {/* Animated Info Panel */}
          <div className="absolute bottom-0 left-0 right-0 h-[80px] group-hover:h-[130px] bg-white transition-all duration-500 rounded-[32px] p-5 pt-6 flex flex-col justify-start z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] overflow-hidden">

            {/* Animated Top Bar Gradient based on food color */}
            <div
              className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-all duration-500"
              style={{ backgroundColor: food.color }}
            />

            <div className="flex justify-between items-start mb-2">
              <h3
                className="font-bold text-xl text-black truncate pr-2 group-hover:text-[color:var(--hover-color)] transition-colors duration-500"
                style={{ fontFamily: 'var(--font-heading)', '--hover-color': food.color }}
              >
                {food.name}
              </h3>
            </div>

            {/* Description (revealed on hover) */}
            <p className="text-sm font-medium text-gray-500 line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
              {food.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const GlassCarousel = () => {
  return (
    <section className="relative w-full min-h-[50vh] flex flex-col justify-center py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #F0EFEB 0%, #E3D5CA 100%)',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\"60\\" height=\\"60\\" viewBox=\\"0 0 60 60\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cpath d=\\"M54.627 0l.83.83v58.34h-58.34l-.83-.83V0h58.34zM29.5 49.5c11.046 0 20-8.954 20-20s-8.954-20-20-20-20 8.954-20 20 8.954 20 20 20zm0-35c8.284 0 15 6.716 15 15s-6.716 15-15 15-15-6.716-15-15 6.716-15 15-15z\\" fill=\\"%239C92AC\\" fill-opacity=\\"0.05\\" fill-rule=\\"evenodd\\"/%3E%3C/svg%3E")'
      }}>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-[1300px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Header & Description */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-sm border border-white/60 mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#8C6036] animate-ping"></span>
                <span className="text-xs font-bold tracking-widest text-[#5C4033] uppercase">
                  Community Reviews
                </span>
              </div>

              <h2 className="text-6xl lg:text-7xl font-black mb-8 tracking-tighter leading-[1.1] lg:leading-[1.05]" style={{ fontFamily: 'var(--font-heading)' }}>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2D4537] to-[#8C6036] drop-shadow-sm">
                  Real Stories,
                </span>
                <br className="hidden lg:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8C6036] to-[#5C4033] drop-shadow-sm">
                  Real Foodies
                </span>
              </h2>

              <p className="text-xl text-[#5C4033]/80 font-semibold max-w-lg leading-relaxed mx-auto lg:mx-0 mb-12">
                Don't just take our word for it. Hear from those who've tasted the difference and explored local street food with us.
              </p>

              {/* Trust Indicators (Glassmorphism Pill) */}
              <div className="inline-flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 p-3 pr-6 bg-white/30 backdrop-blur-md rounded-full shadow-[0_8px_32px_rgba(140,96,54,0.1)] border border-white/50 relative overflow-hidden group transition-all duration-300 hover:bg-white/40">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                <div className="flex -space-x-3">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64',
                    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64'
                  ].map((src, idx) => (
                    <img key={idx} src={src} alt="User" className="w-10 h-10 rounded-full object-cover border-2 border-[#F0EFEB] shadow-sm relative z-10" />
                  ))}
                </div>
                <div className="flex flex-col items-center sm:items-start justify-center relative z-10">
                  <div className="flex gap-0.5 text-[#F59E0B]">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" stroke="transparent" />)}
                  </div>
                  <span className="text-[11px] font-bold text-[#5C4033] mt-0.5 tracking-wide">
                    4.9/5 <span className="opacity-70">from 10k+ reviews</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Layered Paper Cards */}
          <div className="lg:col-span-7 mt-16 lg:mt-0 relative">
            <div className="absolute inset-0 bg-[#B35A24]/5 rounded-[40px] blur-3xl -z-10 transform rotate-3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 w-full">
              {testimonials.slice(0, 4).map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.15, duration: 0.5, type: "spring", stiffness: 100 }}
                  whileHover={{ y: -8, x: -4 }}
                  className={`w-full flex flex-col transition-all duration-300 ${i % 2 !== 0 ? 'sm:mt-24' : ''}`}
                >
                  {/* Layered Paper Effect */}
                  <div className="bg-[#FCF7F0] rounded-[32px] p-8 lg:p-10 shadow-[8px_10px_0px_rgba(140,96,54,0.15)] border-2 border-[#E3D5CA] flex flex-col h-full relative overflow-hidden group transition-all duration-300 hover:shadow-[12px_16px_0px_rgba(140,96,54,0.2)]">

                    {/* Top Section: Avatar, Name & Quotes */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-[#E3D5CA] flex items-center justify-center text-3xl shadow-inner border-[2px] border-[#D5BFAF] flex-shrink-0">
                          {t.avatar}
                        </div>
                        <div className="flex flex-col">
                          <h4 className="font-extrabold text-[#5C4033] text-xl" style={{ fontFamily: 'var(--font-heading)' }}>{t.name}</h4>
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C6036] mt-1">{t.city}</span>
                        </div>
                      </div>
                      {/* Quote Icon */}
                      <div className="text-[#8C6036]/10 group-hover:text-[#8C6036]/20 transition-colors duration-500 transform group-hover:scale-110 group-hover:-rotate-6">
                        <svg width="45" height="36" viewBox="0 0 45 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.5 0C6.044 0 0 6.044 0 13.5V36H18V13.5H9C9 8.529 13.029 4.5 18 4.5V0H13.5ZM40.5 0C33.044 0 27 6.044 27 13.5V36H45V13.5H36C36 8.529 40.029 4.5 45 4.5V0H40.5Z" />
                        </svg>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1.5 mb-5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={18} fill={j < t.rating ? '#F59E0B' : 'transparent'} stroke={j < t.rating ? '#F59E0B' : '#D5BFAF'} strokeWidth={2.5} />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-base lg:text-lg leading-relaxed text-[#5C4033]/90 font-medium relative z-10 italic">
                      "{t.text}"
                    </p>

                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// ── Main Home Component ──
const Home = () => {
  // Fetch cities from the API
  const { data: citiesData, isLoading: citiesLoading } = useQuery({
    queryKey: ['cities', 'featured'],
    queryFn: async () => {
      const { data } = await api.get('/cities/featured');
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });

  const cities = citiesData || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: APP_NAME,
    description: APP_TAGLINE,
    url: window.location.origin,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${window.location.origin}/cities/{search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <SEOHead
        title={null}
        description="Discover the best street food, restaurants, and famous places across Indian cities. Plan day trips, get directions, and explore local favourites."
        canonical="/"
        jsonLd={jsonLd}
      />

      {/* ── Premium Modern Hero Section ──────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20" style={{ backgroundColor: 'var(--color-background)' }}>

        {/* Dynamic Background Elements */}

        {/* Glowing Orbs */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full blur-[100px] -z-10"
          style={{ background: 'linear-gradient(to bottom right, var(--color-primary), var(--color-accent))', opacity: 0.15 }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] -z-10"
          style={{ background: 'linear-gradient(to top right, #3B82F6, #8B5CF6)', opacity: 0.1 }}
        />

        <div className="container relative z-10 px-4 md:px-8 max-w-[1200px] mx-auto h-full flex flex-col lg:flex-row items-center gap-12 lg:gap-8 pb-16">

          {/* Left Text Content */}
          <div className="flex-1 w-full text-center lg:text-left mt-12 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full shadow-sm mb-6 lg:mb-8" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary)' }}></span>
                <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--color-text)' }}>
                  India's #1 Food Guide
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 1.11, 0.81, 0.99] }}
              className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
            >
              Discover the <br className="hidden lg:block" />
              <span style={{
                color: 'transparent',
                backgroundImage: 'linear-gradient(to right, var(--color-primary), #E11D73)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text'
              }}>
                real taste
              </span>
              <br className="hidden lg:block" /> of every city
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Explore iconic street food, hidden gems, famous places, and plan unforgettable food trips across India's most delicious cities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5"
            >
              <motion.div whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}>
                <Link to="/cities" className="group flex items-center justify-center gap-3 font-bold text-lg"
                  style={{
                    padding: '18px 36px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--color-primary), #FF8F50)',
                    color: '#FFFFFF',
                    boxShadow: '0 12px 35px rgba(255, 107, 43, 0.4)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                  }}
                >
                  <MapPin size={22} />
                  Explore Cities
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}>
                <Link to="/explore-near-me" className="flex items-center justify-center gap-3 font-bold text-lg"
                  style={{
                    padding: '18px 36px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text)',
                    border: '2px solid var(--color-border)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                  }}
                >
                  <Compass size={22} style={{ color: 'var(--color-primary)' }} />
                  Near Me
                </Link>
              </motion.div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}
              className="mt-10 flex items-center justify-center lg:justify-start gap-4"
            >
              <div className="flex -space-x-3">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64',
                  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64'
                ].map((src, i) => (
                  <img key={i} src={src} alt="User" className="w-10 h-10 rounded-full object-cover" style={{ border: '2px solid var(--color-background)' }} />
                ))}
              </div>
              <div className="text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                Loved by <span style={{ color: 'var(--color-text)' }}>10,000+</span> foodies
              </div>
            </motion.div>
          </div>

          {/* Right Image Collage */}
          <div className="flex-1 w-full relative h-[450px] md:h-[500px] lg:h-[600px] hidden md:block">

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute top-[5%] right-[10%] w-[60%] h-[55%] rounded-3xl overflow-hidden shadow-2xl z-10"
              style={{ border: '6px solid var(--color-surface)' }}
            >
              <img src="https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800" alt="Indian Thali" className="w-full h-full object-cover block" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 4 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute bottom-[10%] left-[5%] w-[45%] h-[40%] rounded-3xl overflow-hidden shadow-2xl z-20"
              style={{ border: '6px solid var(--color-surface)' }}
            >
              <img src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=600" alt="Biryani" className="w-full h-full object-cover block" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: -6 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute bottom-[15%] right-[5%] w-[40%] h-[35%] rounded-3xl overflow-hidden shadow-2xl z-30"
              style={{ border: '6px solid var(--color-surface)' }}
            >
              <img src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600" alt="Curry" className="w-full h-full object-cover block" />
            </motion.div>

            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
              className="absolute top-[50%] left-[10%] z-40 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
                <Star size={20} fill="currentColor" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase" style={{ color: 'var(--color-text-secondary)' }}>Top Rated</p>
                <p className="font-black text-base" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>500+ Places</p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── City Cards Grid (Premium Redesign with Smudges) ───────────────────── */}
      <section className="section relative overflow-hidden py-16 lg:py-24" style={{ backgroundColor: 'var(--color-bg, #FAF6F0)' }}>
        {/* Background Image (Beautiful Faded Indian Architecture/Texture) */}
        <div
          className="absolute inset-0 bg-cover bg-fixed opacity-[0.45]"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071")', // Taj Mahal / subtle texture
            backgroundPosition: 'center 0%', // Anchors the top of the image to the top of the viewport
          }}
        ></div>

        {/* Top Smudge (Fade) */}
        <div className="absolute top-0 left-0 w-full h-48 z-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, var(--color-bg, #FAF6F0) 0%, transparent 100%)' }}></div>
        {/* Bottom Smudge (Fade) */}
        <div className="absolute bottom-0 left-0 w-full h-48 z-0 pointer-events-none" style={{ background: 'linear-gradient(to top, var(--color-bg, #FAF6F0) 0%, transparent 100%)' }}></div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
              style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
            >
              <MapPin size={12} className="inline mr-1" /> EXPLORE CITIES
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Choose Your City
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Explore food, culture, and famous places across India
            </p>
          </motion.div>

          {citiesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <SkeletonLoader key={i} className="aspect-[3/4] rounded-2xl" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-5"
            >
              {cities.map((city) => {
                const slug = city.slug;
                const color = CITY_COLORS[slug] || '#FF6B2B';
                const emoji = CITY_EMOJIS[slug] || '🍛';

                return (
                  <motion.div key={city._id || slug} variants={cardVariants}>
                    <Link
                      to={`/cities/${slug}`}
                      className="group block relative rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[4/5]"
                      style={{
                        background: `linear-gradient(135deg, ${color}22, ${color}44)`,
                        border: `1px solid ${color}33`,
                      }}
                    >
                      {/* Cover Image */}
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

                      {/* Gradient overlay at bottom for text readability */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(to top, ${color} 0%, ${color}99 35%, transparent 100%)`,
                        }}
                      />

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                        <h3
                          className="text-lg font-bold mb-0.5 text-white group-hover:translate-x-1 transition-transform duration-200 drop-shadow-md"
                          style={{ fontFamily: 'var(--font-heading)' }}
                        >
                          {city.name}
                        </h3>
                        <p className="text-xs mb-2 text-white/80">
                          {city.state}
                        </p>
                        <p className="text-xs line-clamp-1 mb-2 text-white/70">
                          {city.famousFor?.join(', ')}
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm"
                          >
                            <Utensils size={10} className="inline mr-1" />
                            Explore →
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
      </section>

      {/* ── Trending Foods Carousel ────────────── */}
      <section className="section" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
              style={{ backgroundColor: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }}
            >
              <TrendingUp size={12} className="inline mr-1" /> TRENDING NOW
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Must-Try Foods
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              The most loved dishes from across the country
            </p>
          </motion.div>

          <TrendingGrid />
        </div>
      </section>

      {/* ── Hanging Stats Section (Spaced Out) ─────────────────────── */}
      <section className="relative w-full min-h-[30vh] flex flex-col justify-center py-20 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #F0EFEB 0%, #E3D5CA 100%)',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\\"60\\" height=\\"60\\" viewBox=\\"0 0 60 60\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cpath d=\\"M54.627 0l.83.83v58.34h-58.34l-.83-.83V0h58.34zM29.5 49.5c11.046 0 20-8.954 20-20s-8.954-20-20-20-20 8.954-20 20 8.954 20 20 20zm0-35c8.284 0 15 6.716 15 15s-6.716 15-15 15-15-6.716-15-15 6.716-15 15-15z\\" fill=\\"%239C92AC\\" fill-opacity=\\"0.05\\" fill-rule=\\"evenodd\\"/%3E%3C/svg%3E")'
        }}>
        {/* Seamless Fade from White */}
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-white to-transparent pointer-events-none z-0"></div>
        <div className="container relative z-10 max-w-[1200px] mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {[
              { icon: MapPin, value: '13', label: 'Cities Covered', color: '#B35A24', bg: 'bg-[#FDF8F5]' },
              { icon: Utensils, value: '500', label: 'Verified Spots', color: '#6B4C9A', bg: 'bg-[#F9F5FD]' },
              { icon: Star, value: '100', label: 'Hidden Gems', color: '#2D6A4F', bg: 'bg-[#F2FBF7]' },
              { icon: Route, value: '50', label: 'Curated Trails', color: '#1E6091', bg: 'bg-[#F4F9FD]' },
            ].map((stat, i) => (
              <div key={stat.label} className="relative pt-10 mt-6 sm:mt-0">
                {/* Hanging Wires */}
                <div className="absolute top-0 left-[20%] w-[2px] h-12 bg-gradient-to-b from-gray-400 to-gray-500 shadow-sm z-0 hidden sm:block"></div>
                <div className="absolute top-0 right-[20%] w-[2px] h-12 bg-gradient-to-b from-gray-400 to-gray-500 shadow-sm z-0 hidden sm:block"></div>

                <motion.div
                  initial={{ opacity: 0, y: -20, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, type: "spring", stiffness: 100, damping: 12 }}
                  className="relative group text-center p-8 rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_15px_35px_rgba(0,0,0,0.06)] hover:bg-white/50 transition-colors duration-300 z-10"
                >
                  {/* Metal Clips */}
                  <div className="absolute -top-3 left-[20%] -translate-x-1/2 w-4 h-6 bg-gradient-to-b from-gray-300 to-gray-400 rounded-sm shadow-md border border-gray-200 hidden sm:block"></div>
                  <div className="absolute -top-3 right-[20%] translate-x-1/2 w-4 h-6 bg-gradient-to-b from-gray-300 to-gray-400 rounded-sm shadow-md border border-gray-200 hidden sm:block"></div>

                  <div className="flex items-center justify-center gap-4 mb-3 relative">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-inner border border-white ${stat.bg}`} style={{ color: stat.color }}>
                      <stat.icon size={24} />
                    </div>
                    <div
                      className="text-5xl md:text-6xl font-black tracking-tight flex items-baseline gap-1"
                      style={{ fontFamily: 'var(--font-heading)', color: '#2C3E50' }}
                    >
                      <AnimatedCounter value={stat.value} suffix="" />
                      {stat.label.includes('Cities') ? '' : '+'}
                    </div>
                  </div>
                  <div className="text-sm font-bold uppercase tracking-widest mt-4" style={{ color: '#5C4033' }}>
                    {stat.label}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials (Glass Carousel) ────────────── */}
      <GlassCarousel />

      {/* ── Ready to Taste CTA Section (Premium Bright) ───────────────────────── */}
      <section className="py-24 lg:py-32 relative overflow-hidden bg-[#FAF6F0]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-[48px] overflow-hidden px-6 py-20 md:py-32 md:px-16 flex flex-col items-center text-center shadow-2xl"
          >
            {/* Background Image (Vibrant Indian Street Food) */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] ease-out hover:scale-110"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070")',
              }}
            ></div>

            {/* Gradient Overlay for Text Readability - Much Lighter now! */}
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A1610]/80 via-transparent to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center max-w-4xl">
              <span className="px-6 py-2.5 rounded-full text-xs font-black tracking-[0.2em] uppercase mb-8 border border-white/40 bg-black/20 backdrop-blur-md shadow-xl" style={{ color: '#ffffff' }}>
                Start Your Journey
              </span>

              <h2
                className="text-5xl md:text-7xl font-black mb-8 tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)] leading-[1.1]"
                style={{ fontFamily: 'var(--font-heading)', color: '#ffffff' }}
              >
                Ready to taste the real India?
              </h2>

              <p className="text-xl md:text-3xl font-medium mb-12 max-w-3xl leading-relaxed drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]" style={{ color: 'rgba(255, 255, 255, 0.95)' }}>
                Sign up to unlock your personal wishlist, AI food recommendations, day trips, and custom culinary routes.
              </p>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/signup"
                  className="group relative inline-flex items-center justify-center gap-4 px-12 py-6 rounded-[100px] text-2xl font-black bg-[#F59E0B] overflow-hidden shadow-[0_15px_40px_rgba(245,158,11,0.5)] transition-all hover:shadow-[0_20px_50px_rgba(245,158,11,0.7)]"
                  style={{ color: '#5C4033' }}
                >
                  <span className="relative z-10">Create Free Account</span>
                  <div className="relative z-10 w-12 h-12 rounded-full bg-white/40 flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <ArrowRight size={24} color="#5C4033" />
                  </div>
                  {/* Hover effect background */}
                  <div className="absolute inset-0 bg-[#FCD34D] transform scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100"></div>
                </Link>
              </motion.div>

              {/* Trust Section */}
              <div className="mt-16 flex flex-col sm:flex-row items-center gap-6 opacity-90 hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-md px-8 py-4 rounded-full border border-white/20">
                <span className="text-base font-bold tracking-wide" style={{ color: '#ffffff' }}>Join 10,000+ foodies already exploring</span>
                <div className="flex -space-x-4">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64',
                    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64'
                  ].map((src, idx) => (
                    <img key={idx} src={src} alt="User" className="w-12 h-12 rounded-full object-cover border-2 border-[#2A1610] shadow-md" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
