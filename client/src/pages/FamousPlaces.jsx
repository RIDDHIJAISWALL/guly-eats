import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, ArrowLeft, Filter, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import SEOHead from '@/components/common/SEOHead';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import { CITY_COLORS, CITY_EMOJIS } from '@/lib/constants';

const FAMOUS_PLACE_TYPES = [
  { id: 'all', label: 'All Places' },
  { id: 'monument', label: 'Monuments' },
  { id: 'temple', label: 'Temples' },
  { id: 'market', label: 'Markets' },
  { id: 'heritage', label: 'Heritage' },
  { id: 'viewpoint', label: 'Viewpoints' },
  { id: 'park', label: 'Parks' },
];

const FamousPlaces = () => {
  const { citySlug } = useParams();
  const [activeType, setActiveType] = useState('all');

  const { data: places, isLoading, error } = useQuery({
    queryKey: ['famous-places', citySlug],
    queryFn: async () => {
      const { data } = await api.get(`/famous-places?city=${citySlug}`);
      return data.data;
    },
    retry: 1,
  });

  const city = places?.[0]?.city;
  const color = city ? CITY_COLORS[city.slug] : '#FF6B2B';
  const emoji = city ? CITY_EMOJIS[city.slug] : '🗺️';
  const cityName = city?.name || citySlug.charAt(0).toUpperCase() + citySlug.slice(1);

  const filteredPlaces = useMemo(() => {
    if (!places) return [];
    if (activeType === 'all') return places;
    return places.filter(place => place.type === activeType);
  }, [places, activeType]);

  return (
    <>
      <SEOHead 
        title={`Famous Places in ${cityName} - Guly Eats`} 
        description={`Explore the best monuments, markets, and tourist attractions in ${cityName}.`}
      />

      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div 
          className="relative pt-24 pb-16 px-4 md:px-8 shadow-sm"
          style={{ background: `linear-gradient(135deg, ${color}11, ${color}33)` }}
        >
          <div className="container mx-auto max-w-6xl relative z-10">
            <Link 
              to={`/cities/${citySlug}`}
              className="inline-flex items-center gap-2 text-gray-700 hover:text-primary transition-colors font-bold mb-6 bg-white/50 px-4 py-2 rounded-full backdrop-blur-md"
            >
              <ArrowLeft size={18} /> Back to {cityName}
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black font-heading text-gray-900 mb-2 flex items-center gap-3">
                  {emoji} Famous Places
                </h1>
                <p className="text-gray-600 text-lg">Must-visit spots before or after your meal in {cityName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl mt-8 px-4 md:px-8">
          {/* Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 hide-scrollbar sticky top-16 z-30 bg-gray-50/90 backdrop-blur-md py-4">
            <div className="flex items-center gap-2 text-gray-500 font-bold mr-2">
              <Filter size={18} /> Filter:
            </div>
            {FAMOUS_PLACE_TYPES.map(type => (
              <button
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`whitespace-nowrap px-5 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${
                  activeType === type.id
                    ? 'bg-primary text-white shadow-primary/30'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <SkeletonLoader key={i} className="h-72 rounded-3xl" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
              <p className="text-gray-500 mb-4">Failed to load famous places.</p>
              <button onClick={() => window.location.reload()} className="btn btn-primary rounded-xl px-6 py-2">
                Try Again
              </button>
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 flex flex-col items-center">
              <Camera size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-bold font-heading text-gray-800 mb-2">No Places Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We don't have any famous places matching this category in {cityName} yet.
              </p>
              {activeType !== 'all' && (
                <button 
                  onClick={() => setActiveType('all')}
                  className="mt-6 text-primary font-bold hover:underline"
                >
                  View all places
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place, i) => (
                <motion.div
                  key={place._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col h-full"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                    <img 
                      src={place.thumbnail || 'https://images.unsplash.com/photo-1526761122248-c31c93f8b2b9'} 
                      alt={place.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm capitalize">
                      {place.type}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold font-heading text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {place.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                      {place.description}
                    </p>
                    
                    <div className="flex items-center text-xs font-bold text-gray-500 mt-auto pt-4 border-t border-gray-100">
                      <MapPin size={14} className="mr-1 text-primary" />
                      <span className="truncate">{place.address || cityName}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FamousPlaces;
