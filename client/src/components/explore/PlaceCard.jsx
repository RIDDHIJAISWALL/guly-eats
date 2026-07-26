import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Navigation2 } from 'lucide-react';
import { MARKER_COLORS } from '@/lib/constants';

const PlaceCard = ({ place, isActive, onSelect, onNavigate }) => {
  const isFood = place.famousFoods && place.famousFoods.length > 0;
  const typeKey = place.type || (isFood ? 'food_shop' : 'monument');
  const accentColor = MARKER_COLORS[typeKey] || '#FF6B2B';
  const coverImg = place.coverImage || place.images?.[0];

  return (
    <div
      onClick={() => onSelect(place)}
      onMouseEnter={() => !isActive && onSelect(place)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        gap: '0',
        backgroundColor: 'var(--color-surface)',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: isActive ? `2px solid ${accentColor}` : '1px solid var(--color-border-light)',
        boxShadow: isActive ? `0 4px 20px ${accentColor}25` : 'var(--shadow-sm)',
      }}
    >
      {/* Active Indicator */}
      {isActive && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          backgroundColor: accentColor,
          zIndex: 2,
          borderRadius: '16px 0 0 16px',
        }} />
      )}

      {/* Image */}
      {coverImg && (
        <div style={{
          width: '130px',
          height: '140px',
          flexShrink: 0,
          overflow: 'hidden',
          backgroundColor: '#f3f4f6',
          position: 'relative',
        }}>
          <img
            src={coverImg}
            alt={place.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
            }}
            onMouseEnter={(e) => { e.target.style.transform = 'scale(1.1)'; }}
            onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
          />
          {/* Rating Badge */}
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)',
            padding: '3px 8px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            color: '#1a1a2e',
          }}>
            <Star size={11} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
            {place.averageRating?.toFixed(1) || '4.5'}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }}>
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '15px',
          fontWeight: 700,
          color: 'var(--color-text)',
          margin: '0 0 4px 0',
          lineHeight: 1.2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {place.name}
        </h3>

        <p style={{
          fontSize: '11px',
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          margin: '0 0 8px 0',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          <MapPin size={11} />
          {place.address}
        </p>

        {/* Famous Foods Tags */}
        {isFood && place.famousFoods?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
            {place.famousFoods.slice(0, 3).map(food => (
              <span
                key={food._id}
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: `${accentColor}12`,
                  color: accentColor,
                }}
              >
                {food.name}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {place.description && (
          <p style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            margin: '0',
            lineHeight: 1.4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {place.description}
          </p>
        )}

        {/* Bottom Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: 'auto',
          paddingTop: '10px',
          borderTop: '1px solid var(--color-border-light)',
        }}>
          {place.timings && (
            <span style={{
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <Clock size={11} /> {place.timings.open}
            </span>
          )}

          <Link
            to={`/cities/${place.city?.slug}/places/${place.slug}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              marginLeft: 'auto',
              fontSize: '11px',
              fontWeight: 600,
              padding: '5px 12px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              textDecoration: 'none',
              color: 'var(--color-text-secondary)',
              backgroundColor: 'var(--color-surface)',
              transition: 'all 0.2s',
            }}
          >
            Details
          </Link>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(place);
            }}
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '5px 12px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: accentColor,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'transform 0.2s',
            }}
          >
            <Navigation2 size={11} /> Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
