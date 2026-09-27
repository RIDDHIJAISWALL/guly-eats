import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Navigate, Link, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Map, List, ArrowLeft, Heart, MapPin, Search, X } from 'lucide-react';
import api from '@/lib/api';
import useAuthStore from '@/stores/authStore';
import SEOHead from '@/components/common/SEOHead';
import CustomMapContainer from '@/components/map/MapContainer';
import PlaceCard from '@/components/explore/PlaceCard';
import SkeletonLoader from '@/components/common/SkeletonLoader';
import SimplePlaceModal from '@/components/explore/SimplePlaceModal';
import { PLACE_TYPES, FAMOUS_PLACE_TYPES, CITY_COLORS } from '@/lib/constants';

const CityExplore = () => {
  const { citySlug } = useParams();
  const [activePlace, setActivePlace] = useState(null);
  const [selectedPlaceForModal, setSelectedPlaceForModal] = useState(null);
  const [viewMode, setViewMode] = useState('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { user, toggleWishlist, isAuthenticated } = useAuthStore();
  const listRef = useRef(null);
  const queryClient = useQueryClient();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openPlace) {
      setSelectedPlaceForModal(location.state.openPlace);
      // Clear state so it doesn't reopen on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // 1. Fetch city details
  const { data: city, isLoading: cityLoading, error } = useQuery({
    queryKey: ['city', citySlug],
    queryFn: async () => {
      const { data } = await api.get(`/cities/${citySlug}`);
      return data.data;
    },
  });

  // 2. Fetch all places and famous places in this city
  const { data: allPlaces = [], isLoading: placesLoading } = useQuery({
    queryKey: ['places_and_famous', city?._id],
    queryFn: async () => {
      if (!city?._id) return [];
      const [placesRes, famousRes] = await Promise.all([
        api.get(`/places?city=${city._id}`).catch(() => ({ data: { data: [] } })),
        api.get(`/famous-places?city=${city._id}`).catch(() => ({ data: { data: [] } }))
      ]);
      const placesData = (placesRes.data?.data || []).map(p => ({ ...p, isFamousPlace: false }));
      const famousData = (famousRes.data?.data || []).map(p => ({ ...p, isFamousPlace: true }));
      return [...placesData, ...famousData];
    },
    enabled: !!city?._id,
  });

  // Apply filters
  const filteredPlaces = useMemo(() => {
    return allPlaces.filter(place => {
      const searchLower = searchQuery.toLowerCase();
      const matchName = place.name?.toLowerCase().includes(searchLower);
      const matchFood = place.famousFoods?.some(f => f.name?.toLowerCase().includes(searchLower));
      if (searchQuery && !matchName && !matchFood) return false;
      if (selectedCategory) {
        if (selectedCategory === 'food' && place.isFamousPlace) return false;
        if (selectedCategory === 'places' && !place.isFamousPlace) return false;
      }
      return true;
    });
  }, [allPlaces, searchQuery, selectedCategory]);

  // Auto-scroll list to active place
  useEffect(() => {
    if (activePlace && listRef.current) {
      const element = document.getElementById(`place-card-${activePlace._id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activePlace]);

  const handleNavigate = (place) => {
    const [lng, lat] = place.location.coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const handleCityWishlist = async () => {
    if (!isAuthenticated) return alert("Please login to save cities!");
    if (city?._id) {
      await toggleWishlist(city._id, 'cities');
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    }
  };

  const isCityWishlisted = user?.wishlist?.cities?.some(c => (c._id || c) === city?._id);

  if (error) return <Navigate to="/404" replace />;

  const cityCenter = city?.location?.coordinates
    ? [city.location.coordinates[1], city.location.coordinates[0]]
    : [20.5937, 78.9629];

  const accentColor = CITY_COLORS[citySlug] || '#FF6B2B';

  return (
    <>
      <SEOHead
        title={city ? `Explore ${city.name} - Food & Places` : 'Explore City'}
        description={city?.description || 'Explore the best street food and famous places.'}
      />

      <div style={{
        position: 'fixed',
        top: '80px',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        overflow: 'hidden',
      }}>

        {/* ─── SIDEBAR ─── */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 10,
            width: '100%',
            maxWidth: '420px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--color-background)',
            borderRight: '1px solid var(--color-border-light)',
            boxShadow: '4px 0 24px rgba(0,0,0,0.06)',
            transition: 'transform 0.3s ease',
            transform: viewMode === 'map' ? 'translateX(-100%)' : 'translateX(0)',
          }}
          className="sidebar-panel"
        >
          {/* Sidebar Header */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid var(--color-border-light)',
            backgroundColor: 'var(--color-surface)',
          }}>
            <Link
              to="/cities"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--color-text-muted)',
                textDecoration: 'none',
                marginBottom: '12px',
              }}
            >
              <ArrowLeft size={14} /> Back to Cities
            </Link>

            {cityLoading ? (
              <SkeletonLoader variant="text" className="w-48 h-8" />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h1 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '26px',
                    fontWeight: 800,
                    color: 'var(--color-text)',
                    lineHeight: 1.1,
                    margin: 0,
                  }}>
                    {city?.name}
                  </h1>
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--color-text-muted)',
                    marginTop: '4px',
                  }}>
                    {city?.state} · {filteredPlaces.length} places to explore
                  </p>
                </div>
                <button
                  onClick={handleCityWishlist}
                  style={{
                    padding: '8px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: isCityWishlisted ? '#ef444415' : 'var(--color-primary-light)',
                    color: isCityWishlisted ? '#ef4444' : 'var(--color-text-muted)',
                    transition: 'all 0.2s',
                  }}
                >
                  <Heart size={18} fill={isCityWishlisted ? '#ef4444' : 'transparent'} />
                </button>
              </div>
            )}
          </div>

          {/* Search & Filters */}
          <div style={{
            padding: '12px 20px',
            borderBottom: '1px solid var(--color-border-light)',
          }}>
            {/* Search Bar */}
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <Search size={16} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
              }} />
              <input
                type="text"
                placeholder="Search places or famous foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 36px 10px 36px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border-light)',
                  backgroundColor: 'var(--color-surface)',
                  fontSize: '13px',
                  color: 'var(--color-text)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'var(--font-body)',
                }}
                onFocus={(e) => { e.target.style.borderColor = accentColor; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--color-border-light)'; }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    padding: '2px',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Chips */}
            <div style={{
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none',
            }}>
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  flexShrink: 0,
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: !selectedCategory ? accentColor : 'var(--color-surface)',
                  color: !selectedCategory ? '#fff' : 'var(--color-text-secondary)',
                  boxShadow: !selectedCategory ? `0 2px 8px ${accentColor}40` : 'none',
                  transition: 'all 0.2s',
                  ...(selectedCategory ? { border: '1px solid var(--color-border-light)' } : {}),
                }}
              >
                All
              </button>
              {[
                { id: 'food', label: 'Food & Restaurants', emoji: '🍛' },
                { id: 'places', label: 'Famous Places', emoji: '🏛️' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedCategory(selectedCategory === type.id ? null : type.id)}
                  style={{
                    flexShrink: 0,
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 600,
                    border: selectedCategory === type.id
                      ? `1.5px solid ${accentColor}`
                      : '1px solid var(--color-border-light)',
                    cursor: 'pointer',
                    backgroundColor: selectedCategory === type.id
                      ? `${accentColor}12`
                      : 'var(--color-surface)',
                    color: selectedCategory === type.id
                      ? accentColor
                      : 'var(--color-text-secondary)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>{type.emoji}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Place List */}
          <div
            ref={listRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px 16px 80px',
              scrollBehavior: 'smooth',
            }}
          >
            {placesLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[1, 2, 3].map(i => <SkeletonLoader key={i} className="h-40 rounded-2xl w-full" />)}
              </div>
            ) : filteredPlaces.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '48px 20px',
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: `${accentColor}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <MapPin size={32} style={{ color: accentColor }} />
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  marginBottom: '8px',
                }}>
                  No places found
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--color-text-muted)',
                  marginBottom: '16px',
                  lineHeight: 1.5,
                }}>
                  {allPlaces.length === 0
                    ? `We're still mapping ${city?.name || 'this city'}. Places will appear here soon!`
                    : 'Try adjusting your search or filters.'}
                </p>
                {(searchQuery || selectedCategory) && (
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: accentColor,
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredPlaces.map(place => (
                  <div id={`place-card-${place._id}`} key={place._id}>
                    <PlaceCard
                      place={place}
                      isActive={activePlace?._id === place._id}
                      onSelect={setActivePlace}
                      onNavigate={handleNavigate}
                      onViewDetails={(p) => setSelectedPlaceForModal(p)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ─── MAP ─── */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}>
          {!cityLoading && !placesLoading && (
            <CustomMapContainer
              places={filteredPlaces}
              cityCenter={cityCenter}
              activePlace={activePlace}
              onPlaceSelect={(place) => setActivePlace(place)}
            />
          )}
        </div>

        {/* ─── MOBILE FLOATING ACTION BUTTON ─── */}
        <button
          onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
          className="mobile-fab"
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '50px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#1a1a2e',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            fontFamily: 'var(--font-heading)',
          }}
        >
          {viewMode === 'map' ? (
            <><List size={18} /> Show List</>
          ) : (
            <><Map size={18} /> Show Map</>
          )}
        </button>
      </div>

      <SimplePlaceModal 
        place={selectedPlaceForModal} 
        onClose={() => setSelectedPlaceForModal(null)} 
      />
    </>
  );
};

export default CityExplore;
