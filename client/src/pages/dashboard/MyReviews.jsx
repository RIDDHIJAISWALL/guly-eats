import { useQuery } from '@tanstack/react-query';
import { Star, MessageSquare, Trash2, Calendar, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import SkeletonLoader from '@/components/common/SkeletonLoader';

const MyReviews = () => {
  const { data: reviews, isLoading, refetch } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: async () => {
      const { data } = await api.get('/reviews/me');
      return data.data;
    }
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/reviews/${id}`);
        refetch();
      } catch (error) {
        console.error("Failed to delete review", error);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div>
        <h1 style={{
          fontSize: '28px', fontWeight: 900, color: '#1A1A2E',
          fontFamily: 'var(--font-heading)', margin: 0, letterSpacing: '-0.5px',
        }}>My Reviews</h1>
        <p style={{ fontSize: '15px', color: '#8B8B9E', margin: '6px 0 0', fontWeight: 500 }}>
          Your experiences shared with the community.
        </p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map(i => <SkeletonLoader key={i} className="h-40 rounded-3xl" />)}
        </div>
      ) : reviews?.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map(review => (
            <div
              key={review._id}
              className="group"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #F0F0F5',
                padding: '24px',
                position: 'relative',
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
              {/* Delete button */}
              <button
                onClick={() => handleDelete(review._id)}
                title="Delete Review"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  padding: '8px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#C0C0CC',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: 0,
                }}
                className="group-hover:!opacity-100"
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

              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {/* Place info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '200px' }}>
                  {review.place?.images?.[0] ? (
                    <img
                      src={review.place.images[0]}
                      alt={review.place.name}
                      style={{
                        width: '56px', height: '56px', borderRadius: '14px',
                        objectFit: 'cover', border: '2px solid #F0F0F5',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '56px', height: '56px', borderRadius: '14px',
                      backgroundColor: '#F5F5FA', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', color: '#C0C0CC',
                    }}>
                      <MessageSquare size={22} />
                    </div>
                  )}
                  <div>
                    <h3 style={{
                      fontSize: '15px', fontWeight: 700, color: '#1A1A2E',
                      margin: 0, fontFamily: 'var(--font-heading)',
                    }}>
                      <Link
                        to={`/cities/${review.place?.city?.slug}/places/${review.place?.slug}`}
                        style={{ color: 'inherit', textDecoration: 'none' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#FF6B2B'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#1A1A2E'; }}
                      >
                        {review.place?.name}
                      </Link>
                    </h3>
                    <p style={{ fontSize: '12px', color: '#8B8B9E', margin: '2px 0 0' }}>
                      {review.place?.city?.name}
                    </p>
                  </div>
                </div>

                {/* Review content */}
                <div style={{
                  flex: 1, minWidth: '200px',
                  paddingLeft: '20px',
                  borderLeft: '1px solid #F0F0F5',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={15}
                        style={{
                          fill: star <= review.rating ? '#FBBF24' : '#E8E8F0',
                          color: star <= review.rating ? '#FBBF24' : '#E8E8F0',
                        }}
                      />
                    ))}
                    <span style={{
                      fontSize: '12px', color: '#B0B0BB', marginLeft: '10px',
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      <Calendar size={12} />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{
                    fontSize: '14px', color: '#5A5A6E', lineHeight: 1.7,
                    margin: 0, whiteSpace: 'pre-wrap',
                  }}>
                    {review.comment}
                  </p>
                </div>
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
            backgroundColor: '#F5F5FA', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px', color: '#B0B0BB',
          }}>
            <MessageSquare size={28} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1A1A2E', margin: '0 0 8px', fontFamily: 'var(--font-heading)' }}>
            No reviews yet
          </h3>
          <p style={{ fontSize: '14px', color: '#8B8B9E', margin: '0 0 24px' }}>
            You haven't reviewed any places. Go explore and share your experience!
          </p>
          <Link
            to="/cities"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px',
              fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-heading)',
              color: '#FFFFFF', background: 'linear-gradient(135deg, #FF6B2B, #FF8F5E)',
              textDecoration: 'none', boxShadow: '0 4px 14px rgba(255,107,43,0.3)',
            }}
          >
            <Compass size={18} /> Explore Places
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
