
import React from 'react';
import { Filter } from '../types';

type FilterTabsProps = {
  currentFilter: Filter;
  setFilter: (filter: Filter) => void;
};

const FilterTabs: React.FC<FilterTabsProps> = ({ currentFilter, setFilter }) => {
  const filters = [Filter.All, Filter.Active, Filter.Completed];

  const getButtonClass = (filter: Filter) => {
    const baseClass = "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500";
    if (filter === currentFilter) {
      return `${baseClass} bg-emerald-600 text-white`;
    }
    return `${baseClass} text-gray-300 hover:bg-gray-700`;
  };

  return (
    <div className="flex space-x-2 bg-gray-900/50 p-1 rounded-lg">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setFilter(filter)}
          className={getButtonClass(filter)}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;