import { Search, MapPin, Utensils } from 'lucide-react';

const icons = {
  search: Search,
  location: MapPin,
  food: Utensils,
};

const EmptyState = ({
  icon = 'search',
  title = 'Nothing found',
  description = 'Try adjusting your search or filters.',
  action,
  actionLabel,
}) => {
  const Icon = icons[icon] || Search;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: 'var(--color-primary-light)' }}
      >
        <Icon size={32} style={{ color: 'var(--color-primary)' }} strokeWidth={1.5} />
      </div>
      <h3
        className="text-lg font-semibold mb-2"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
      >
        {title}
      </h3>
      <p className="text-sm max-w-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
        {description}
      </p>
      {action && (
        <button onClick={action} className="btn btn-primary text-sm">
          {actionLabel || 'Try Again'}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
