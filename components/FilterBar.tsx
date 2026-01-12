import React, { useMemo } from 'react';
import { FilterState, Priority, SortState, SortField, Activity } from '../types';
import { Filter, ArrowUp, ArrowDown, Calendar } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  sort: SortState;
  setSort: React.Dispatch<React.SetStateAction<SortState>>;
  activities: Activity[];
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, sort, setSort, activities }) => {
  // Extract unique dates from activities, sort descending, and format for display
  const availableDates = useMemo(() => {
    const dates = activities.map(a => a.date).filter(Boolean);
    const uniqueDates = Array.from(new Set(dates));
    // Sort descending (newest first)
    return uniqueDates.sort().reverse();
  }, [activities]);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const togglePriority = (p: Priority) => {
    setFilters(prev => {
      if (prev.priorities.includes(p)) {
        return { ...prev, priorities: prev.priorities.filter(item => item !== p) };
      } else {
        return { ...prev, priorities: [...prev.priorities, p] };
      }
    });
  };

  const handleSort = (field: SortField) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc'
      ? <ArrowUp size={14} className="ml-1" />
      : <ArrowDown size={14} className="ml-1" />;
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm space-y-4 lg:space-y-0 lg:flex lg:items-end lg:justify-between lg:gap-4 mb-6">

      {/* Date Smart Filter */}
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 flex items-center gap-1">
          <Calendar size={12} />
          Filtrar por Data
        </label>
        <div className="relative">
          <select
            value={filters.date}
            onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
            disabled={availableDates.length === 0}
            className={`w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none appearance-none cursor-pointer transition-colors ${
              availableDates.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-500'
            }`}
          >
            <option value="">{availableDates.length === 0 ? 'Nenhuma data disponível' : 'Todas as datas'}</option>
            {availableDates.map(date => (
              <option key={date} value={date}>
                {formatDate(date)}
              </option>
            ))}
          </select>
          {/* Custom Arrow Icon Overlay */}
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
            <ArrowDown size={14} />
          </div>
        </div>
      </div>

      {/* Priority Filter */}
      <div className="flex-1">
        <label className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2 flex items-center gap-1">
          <Filter size={12} />
          Prioridade
        </label>
        <div className="flex gap-2">
          {(['Alta', 'Média', 'Baixa'] as Priority[]).map(p => (
            <button
              key={p}
              onClick={() => togglePriority(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filters.priorities.includes(p)
                  ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                  : 'bg-gray-900 border-gray-700 text-gray-500 hover:border-gray-500'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter (NOVO) */}
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
          Status
        </label>
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as FilterState['status'] }))}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none appearance-none cursor-pointer transition-colors hover:border-gray-500"
          >
            <option value="Todos">Tudo</option>
            <option value="Pendente">Somente pendentes</option>
            <option value="Concluído">Somente concluídas</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
            <ArrowDown size={14} />
          </div>
        </div>
      </div>

      {/* Mobile Sort Options */}
      <div className="lg:hidden flex-1">
        <label className="block text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">
          Ordenar Por
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => handleSort('date')}
            className={`flex items-center px-3 py-2 rounded-lg text-sm border ${
              sort.field === 'date'
                ? 'border-blue-500 text-blue-400 bg-blue-900/10'
                : 'border-gray-600 text-gray-400'
            }`}
          >
            Data {getSortIcon('date')}
          </button>
          <button
            onClick={() => handleSort('priority')}
            className={`flex items-center px-3 py-2 rounded-lg text-sm border ${
              sort.field === 'priority'
                ? 'border-blue-500 text-blue-400 bg-blue-900/10'
                : 'border-gray-600 text-gray-400'
            }`}
          >
            Prioridade {getSortIcon('priority')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
