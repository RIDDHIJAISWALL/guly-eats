const SkeletonLoader = ({ className = '', variant = 'rect', count = 1 }) => {
  const baseClass = 'skeleton';
  
  const variants = {
    rect: 'w-full h-4 rounded-md',
    circle: 'w-10 h-10 rounded-full',
    card: 'w-full h-48 rounded-xl',
    title: 'w-3/4 h-6 rounded-md',
    text: 'w-full h-3 rounded',
    avatar: 'w-12 h-12 rounded-full',
    image: 'w-full aspect-[4/3] rounded-xl',
    button: 'w-24 h-10 rounded-lg',
  };

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`${baseClass} ${variants[variant] || variants.rect} ${className}`}
          role="status"
          aria-label="Loading..."
        />
      ))}
    </>
  );
};

// Pre-built skeleton layouts
export const PlaceCardSkeleton = () => (
  <div className="card p-0 overflow-hidden">
    <SkeletonLoader variant="image" />
    <div className="p-4 space-y-3">
      <SkeletonLoader variant="title" />
      <SkeletonLoader variant="text" />
      <div className="flex gap-2">
        <SkeletonLoader variant="button" />
        <SkeletonLoader variant="button" />
      </div>
    </div>
  </div>
);

export const CityCardSkeleton = () => (
  <div className="card overflow-hidden" style={{ height: '280px' }}>
    <SkeletonLoader variant="card" className="h-full" />
  </div>
);

export default SkeletonLoader;
