import { useQuery } from '@tanstack/react-query';
import { Map, Calendar, MapPin, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import SkeletonLoader from '@/components/common/SkeletonLoader';

const MyItineraries = () => {
  const { data: itineraries, isLoading, refetch } = useQuery({
    queryKey: ['my-itineraries'],
    queryFn: async () => {
      const { data } = await api.get('/itineraries');
      return data.data;
    }
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      try {
        await api.delete(`/itineraries/${id}`);
        refetch();
      } catch (error) {
        console.error("Failed to delete itinerary", error);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{
            fontSize: '28px', fontWeight: 900, color: '#1A1A2E',
            fontFamily: 'var(--font-heading)', margin: 0, letterSpacing: '-0.5px',
          }}>My Itineraries</h1>
          <p style={{ fontSize: '15px', color: '#8B8B9E', margin: '6px 0 0', fontWeight: 500 }}>
            Your planned day trips and routes.
          </p>
        </div>
        <Link
          to="/trips/plan"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '10px 20px', borderRadius: '12px', border: 'none',
            fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-heading)',
            color: '#FFFFFF', background: 'linear-gradient(135deg, #FF6B2B, #FF8F5E)',
            textDecoration: 'none', boxShadow: '0 4px 14px rgba(255,107,43,0.3)',
            transition: 'all 0.2s ease',
          }}
        >
          <Plus size={18} /> Plan New Trip
        </Link>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map(i => <SkeletonLoader key={i} className="h-32 rounded-3xl" />)}
        </div>
      ) : itineraries?.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {itineraries.map(itinerary => (
            <div
              key={itinerary._id}
              className="group"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #F0F0F5',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'wrap',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)';
                e.currentTarget.style.borderColor = '#E8E8F0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#F0F0F5';
              }}
            >
              {/* Icon */}
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px',
                backgroundColor: '#EFF6FF', color: '#3B82F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Map size={26} />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: '180px' }}>
                <h3 style={{
                  fontSize: '17px', fontWeight: 800, color: '#1A1A2E',
                  margin: 0, fontFamily: 'var(--font-heading)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {itinerary.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#8B8B9E', fontWeight: 500 }}>
                    <MapPin size={14} /> {itinerary.city?.name}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#8B8B9E', fontWeight: 500 }}>
                    <Calendar size={14} /> {new Date(itinerary.createdAt).toLocaleDateString()}
                  </span>
                  <span style={{
                    fontSize: '12px', fontWeight: 700, color: '#5A5A6E',
                    backgroundColor: '#F0F0F5', padding: '3px 10px', borderRadius: '20px',
                  }}>
                    {itinerary.stops.length} Stops
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link
                  to={`/trips/plan?load=${itinerary._id}`}
                  style={{
                    padding: '10px 20px', borderRadius: '12px',
                    fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-heading)',
                    color: '#1A1A2E', backgroundColor: '#F5F5FA',
                    textDecoration: 'none', transition: 'all 0.2s ease',
                    border: '1px solid #E8E8F0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#EAEAF0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F5F5FA';
                  }}
                >
                  View Route
                </Link>
                <button
                  onClick={() => handleDelete(itinerary._id)}
                  title="Delete"
                  style={{
                    padding: '10px', borderRadius: '12px', border: 'none',
                    backgroundColor: 'transparent', color: '#C0C0CC',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FEF2F2';
                    e.currentTarget.style.color = '#EF4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#C0C0CC';
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '60px 24px',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '2px dashed #E8E8F0',
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px', color: '#3B82F6',
          }}>
            <Map size={28} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1A1A2E', margin: '0 0 8px', fontFamily: 'var(--font-heading)' }}>
            No itineraries found
          </h3>
          <p style={{ fontSize: '14px', color: '#8B8B9E', margin: '0 0 24px' }}>
            You haven't planned any trips yet.
          </p>
          <Link
            to="/trips/plan"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px',
              fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-heading)',
              color: '#FFFFFF', background: 'linear-gradient(135deg, #FF6B2B, #FF8F5E)',
              textDecoration: 'none', boxShadow: '0 4px 14px rgba(255,107,43,0.3)',
            }}
          >
            <Plus size={18} /> Start Planning
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyItineraries;
