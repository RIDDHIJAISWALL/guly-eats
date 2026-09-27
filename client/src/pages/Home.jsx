import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, MapPin, Utensils, Star, Compass, Route, Clock, TrendingUp, Quote } from 'lucide-react';
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
  {
    name: 'Priya S.', city: 'Delhi', foodEmoji: '🍔', rating: 5,
    text: 'Guly Eats unlocked flavors I never knew were in my own city. The map led me straight to the most incredible dabeli stall hidden in the lanes of Chandni Chowk!',
    tag: 'Street Food Lover',
  },
  {
    name: 'Rahul M.', city: 'Varanasi', foodEmoji: '🍢', rating: 5,
    text: "This isn't just an app; it's a spice treasure hunt! Varanasi's alleys are full of hidden chaat gems, and I found them all with this guide. Absolutely life-changing.",
    tag: 'Food Blogger',
  },
  {
    name: 'Ananya K.', city: 'Mumbai', foodEmoji: '🥞', rating: 5,
    text: 'The Mumbai street food trail was planned perfectly. Every pav bhaji stop was amazing and the turn-by-turn directions through narrow gullies were flawless!',
    tag: 'Weekend Explorer',
  },
  {
    name: 'Meera A.', city: 'Kolkata', foodEmoji: '🍮', rating: 5,
    text: 'I thought I knew my city, but I was so wrong! From the best Phuchka corners to the most secret Kathi roll spots — this app is an expert guide through Kolkata.',
    tag: 'Local Foodie',
  },
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {trendingFoods.map((food, i) => (
        <motion.div
          key={food.name}
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: i * 0.1, type: "spring", bounce: 0.4 }}
          className="group cursor-pointer relative h-[360px] rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-gray-100 overflow-hidden">
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${food.image})` }}
            />
          </div>

          {/* Base Gradient Overlay for strong readability before hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-0 transition-opacity duration-500" />

          {/* City Badge - Animated on Top Right */}
          <div className="absolute top-5 right-5 z-20">
            <div
              className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md bg-white/20 text-white shadow-lg border border-white/30 transform transition-transform duration-500 group-hover:scale-105 group-hover:bg-white/30"
              style={{ backgroundColor: `${food.color}99` }} // subtle hint of the color on the badge too!
            >
              <MapPin size={12} className="inline mr-1" />
              {food.city}
            </div>
          </div>

          {/* Content Panel */}
          <div className="absolute inset-x-3 bottom-4 z-10 rounded-3xl">
            {/* The sliding panel with elegant light glassmorphism */}
            <div
              className="transform transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] translate-y-[6rem] group-hover:translate-y-0 backdrop-blur-xl p-5 pt-5 border border-white/70 shadow-[0_8px_32px_rgba(255,223,153,0.25)] rounded-3xl flex flex-col items-center"
              style={{
                // More translucent golden/milky frosted glass
                background: `linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(253,248,241,0.15) 50%, rgba(243,232,216,0.15) 100%)`
              }}
            >
              <h3
                className="font-black text-2xl sm:text-[26px] text-[#6B4423] mb-1 drop-shadow-[0_1px_1px_rgba(255,255,255,1)] text-center leading-tight"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {food.name}
              </h3>

              {/* Description smoothly fades and slides up */}
              <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] delay-100 h-[6rem] flex flex-col items-center justify-center w-full">
                <p className="text-[13px] sm:text-[14px] font-bold text-[#3A1E0D] leading-relaxed line-clamp-2 text-center px-2">
                  {food.description}
                </p>

                {/* Decorative icons line */}
                <div className="flex items-center justify-center gap-3 mt-3 w-full">
                  <div className="h-px bg-gradient-to-r from-transparent via-[#8B6B52]/30 to-transparent flex-1" />
                  <span className="text-sm opacity-80 grayscale-[30%]">🌶️ 🍅</span>
                  <div className="h-px bg-gradient-to-r from-transparent via-[#8B6B52]/30 to-transparent flex-1" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ── Avatar photos for testimonials
const AVATAR_PHOTOS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&h=80&q=80',
];

const CARD_ACCENT_COLORS = [
  { light: '#FFF7ED', border: 'rgba(245,130,22,0.18)', dot: '#F58216' },
  { light: '#FDF4FF', border: 'rgba(168,85,247,0.18)', dot: '#A855F7' },
  { light: '#ECFDF5', border: 'rgba(16,185,129,0.18)', dot: '#10B981' },
  { light: '#FFF1F2', border: 'rgba(244,63,94,0.18)', dot: '#F43F5E' },
  { light: '#EFF6FF', border: 'rgba(59,130,246,0.18)', dot: '#3B82F6' },
  { light: '#FFFBEB', border: 'rgba(234,179,8,0.18)', dot: '#EAB308' },
];

const GlassCarousel = () => {
  const isDark = false;

  return (
    <section
      id="reviews-section"
      className="relative w-full min-h-screen py-28 lg:py-36 flex flex-col justify-center overflow-hidden"
    >
      {/* ── Decorative blobs ── */}
      <div
        className="absolute top-[-10%] left-[-8%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'rgba(245,130,22,0.10)', opacity: 0.9 }}
      />
      <div
        className="absolute bottom-[-10%] right-[-8%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'rgba(168,85,247,0.08)', opacity: 0.9 }}
      />

      {/* Decorative large quote watermark */}
      <div
        className="absolute left-1/2 top-12 -translate-x-1/2 text-[200px] font-black leading-none select-none pointer-events-none"
        style={{ color: 'rgba(120,80,40,0.05)', fontFamily: 'Georgia, serif' }}
      >
        ❝
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-12 max-w-[1600px]">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center flex flex-col items-center justify-center w-full"
        >
          <h2
            className="text-4xl sm:text-5xl lg:text-[64px] font-black tracking-tight mb-5 leading-[1.08]"
            style={{ fontFamily: 'var(--font-heading)', color: isDark ? '#fff' : '#1a0f00' }}
          >
            Real Stories from{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #FF9A3C 0%, #FF6B2B 50%, #F58216 100%)' }}
            >
              Real Foodies
            </span>
          </h2>

          <p
            className="text-base sm:text-lg font-medium max-w-lg text-center leading-relaxed"
            style={{ color: isDark ? 'rgba(255,255,255,0.42)' : 'rgba(92,64,51,0.6)' }}
          >
            Six voices from across India's most delicious streets and hidden alleys.
          </p>
        </motion.div>

        {/* ── Foolproof Spacer to Prevent Margin Collapse ── */}
        <div className="h-[60px] lg:h-[100px] w-full flex-shrink-0"></div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 w-full mx-auto mt-4">
          {testimonials.slice(0, 4).map((t, i) => {
            // Colors inspired by the reference image
            const BUBBLE_COLORS = ['#81C7BE', '#F7C06D', '#F28157', '#7CA5B8'];
            const bg_color = BUBBLE_COLORS[i % BUBBLE_COLORS.length];
            const isVerifiedStory = i % 2 !== 0;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{
                  delay: i * 0.08,
                  duration: 0.5,
                  type: 'spring',
                  stiffness: 90,
                }}
                className="relative flex flex-col items-center transition-transform duration-300 hover:-translate-y-2 h-full w-full"
              >
                {/* ── Speech Bubble ── */}
                <div
                  className="relative w-full rounded-[40px] p-8 sm:p-10 shadow-xl flex flex-col text-white"
                  style={{
                    backgroundColor: bg_color,
                    borderBottomLeftRadius: 0,
                    minHeight: '320px',
                  }}
                >
                  {/* The curved tail */}
                  <svg
                    className="absolute -bottom-[39px] left-0 w-[48px] h-[40px] pointer-events-none"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <path d="M0,0 L100,0 C50,0 0,50 0,100 Z" fill={bg_color} />
                  </svg>

                  {/* Review Text */}
                  <div className="flex-1 flex flex-col justify-center relative z-10 text-center">
                    <p className="text-[16px] leading-[1.8] italic font-medium text-wrap break-words">
                      "{t.text}"
                    </p>
                  </div>

                  {/* Verification / Rating */}
                  <div className="mt-6 flex items-center justify-center opacity-90 z-10">
                    {isVerifiedStory ? (
                      <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
                        <span className="text-[10px] font-black">✓</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                          Verified
                        </span>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            fill={s <= t.rating ? '#FFF' : 'transparent'}
                            color="#FFF"
                            className={s > t.rating ? 'opacity-40' : ''}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Avatar & Info Below ── */}
                <div className="flex flex-col items-center mt-14 mb-4">
                  <div className="relative">
                    <img
                      src={AVATAR_PHOTOS[i % AVATAR_PHOTOS.length]}
                      alt={t.name}
                      className="w-[72px] h-[72px] rounded-full object-cover shadow-md"
                      style={{ 
                        filter: 'grayscale(100%)',
                        border: '3px solid white',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.08)' 
                      }}
                    />
                  </div>
                  <h4
                    className="font-black text-[13px] uppercase tracking-widest mt-4 text-center"
                    style={{ color: isDark ? '#fff' : '#1f2937' }}
                  >
                    {t.name}
                  </h4>
                  <div
                    className="flex flex-col items-center gap-1 mt-1 text-[10px] font-bold uppercase tracking-widest text-center"
                    style={{ color: '#6b7280' }}
                  >
                    <span>{t.tag || 'Foodie'}</span>
                    <span>{t.city}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const isDark = false;

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

      {/* ── City Cards Grid ───────────────────── */}
      <section className="section relative overflow-hidden py-16 lg:py-24" style={{ backgroundColor: 'var(--color-background)' }}>
        {/* Background Image (Beautiful Faded Indian Architecture/Texture) */}
        <div
          className="absolute inset-0 bg-cover bg-fixed opacity-[0.45]"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071")', // Day Taj Mahal
            backgroundPosition: 'center 0%', // Anchors the top of the image to the top of the viewport
          }}
        ></div>

        {/* Top Smudge (Fade) */}
        <div className="absolute top-0 left-0 w-full h-48 z-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, var(--color-background) 0%, transparent 100%)' }}></div>
        {/* Bottom Smudge (Fade) */}
        <div className="absolute bottom-0 left-0 w-full h-48 z-0 pointer-events-none" style={{ background: 'linear-gradient(to top, var(--color-background) 0%, transparent 100%)' }}></div>

        <div className="container mx-auto px-4 md:px-8 max-w-[1200px] relative z-10">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonLoader key={i} className="aspect-[4/3] rounded-2xl" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
            >
              {cities.slice(0, 8).map((city) => {
                const slug = city.slug;

                return (
                  <motion.div key={city._id || slug} variants={cardVariants} style={{ height: '100%' }}>
                    <Link
                      to={`/cities/${slug}`}
                      className="group block"
                      style={{
                        backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #F0F0F5',
                        overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                        transition: 'all 0.3s ease', textDecoration: 'none', height: '100%',
                        boxShadow: '0 4px 12px rgba(26,26,46,0.03)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 24px rgba(26,26,46,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(26,26,46,0.03)';
                      }}
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
                          {city.tagline || 'Explore City'}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center"
            style={{ marginTop: '80px', marginBottom: '64px' }}
          >
            <motion.div whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/cities"
                className="group flex items-center justify-center gap-3 font-bold text-lg"
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

                Explore All Destinations
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
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

      {/* ── Massive Continuous Background Wrapper ── */}
      <div 
        className="w-full relative"
        style={{
          backgroundColor: isDark ? 'transparent' : 'var(--color-background)',
          backgroundImage: isDark
            ? 'linear-gradient(to bottom, rgba(10,9,6,0.9), rgba(10,9,6,0.85), rgba(10,9,6,0.95)), url("https://images.unsplash.com/photo-1564507592208-5287569ce447?q=80&w=2000&auto=format&fit=crop")'
            : 'url("data:image/svg+xml,%3Csvg width=\\"60\\" height=\\"60\\" viewBox=\\"0 0 60 60\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cpath d=\\"M54.627 0l.83.83v58.34h-58.34l-.83-.83V0h58.34zM29.5 49.5c11.046 0 20-8.954 20-20s-8.954-20-20-20-20 8.954-20 20 8.954 20 20 20zm0-35c8.284 0 15 6.716 15 15s-6.716 15-15 15-15-6.716-15-15 6.716-15 15-15z\\" fill=\\"%239C92AC\\" fill-opacity=\\"0.015\\" fill-rule=\\"evenodd\\"/%3E%3C/svg%3E")'
        }}
      >
        {/* ── Hanging Stats Section (Spaced Out) ─────────────────────── */}
        <section className="relative w-full min-h-[30vh] flex flex-col justify-center pt-10 pb-20 overflow-hidden bg-transparent">
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
                  className="relative group text-center p-10 rounded-3xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_15px_35px_rgba(0,0,0,0.06)] hover:bg-white/50 transition-colors duration-300 z-10"
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

      <div className="w-full h-24 md:h-32 bg-transparent" />
      {/* ── End of Massive Continuous Background Wrapper ── */}
      </div>
    </>
  );
};

export default Home;
