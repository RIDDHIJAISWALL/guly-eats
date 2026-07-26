import { Filter, Search, Map } from 'lucide-react';
import { PLACE_TYPES, FAMOUS_PLACE_TYPES, BUDGET_LABELS, DIETARY_FILTERS } from '@/lib/constants';

const FilterPanel = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedBudget,
  setSelectedBudget
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search for places or famous foods..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm"
        />
      </div>

      <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
        {/* Categories */}
        <div className="flex gap-2">
          <button 
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${!selectedCategory ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setSelectedCategory(null)}
          >
            All Places
          </button>
          
          <div className="w-px h-6 bg-gray-200 self-center mx-1" />
          
          {Object.entries({ ...PLACE_TYPES, ...FAMOUS_PLACE_TYPES }).map(([key, type]) => (
            <button 
              key={key}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${selectedCategory === key ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setSelectedCategory(key)}
            >
              <span>{type.emoji}</span>
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
