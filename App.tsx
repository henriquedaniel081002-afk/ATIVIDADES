import React, { useState, useMemo } from 'react';
import { Plus, LayoutDashboard } from 'lucide-react';
import { Activity, FilterState, SortState, PRIORITY_WEIGHTS } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import ActivityModal from './components/ActivityModal';
import ActivityList from './components/ActivityList';
import FilterBar from './components/FilterBar';

const App: React.FC = () => {
  // --- State ---
  const [activities, setActivities] = useLocalStorage<Activity[]>('daily-tasker-activities', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    date: '',
    priorities: [],
    status: 'Todos',
  });

  const [sort, setSort] = useState<SortState>({
    field: 'date',
    direction: 'asc',
  });

  // --- Actions ---

  const handleSaveActivity = (data: Omit<Activity, 'id' | 'createdAt'>) => {
    if (editingActivity) {
      // Update existing
      setActivities(prev => prev.map(act => 
        act.id === editingActivity.id 
          ? { ...act, ...data } 
          : act
      ));
    } else {
      // Create new
      const newActivity: Activity = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        ...data
      };
      setActivities(prev => [...prev, newActivity]);
    }
    setEditingActivity(null);
  };

  const handleToggleStatus = (id: string) => {
    setActivities(prev => prev.map(act => {
      if (act.id === id) {
        const isCompleted = act.status === 'Concluído';
        return {
          ...act,
          status: isCompleted ? 'Pendente' : 'Concluído',
          completionDate: isCompleted ? undefined : new Date().toISOString().split('T')[0]
        };
      }
      return act;
    }));
  };

  const handleDeleteActivity = (id: string) => {
    // Confirmation is now handled in ActivityList to support animation
    setActivities(prev => prev.filter(act => act.id !== id));
  };

  const openCreateModal = () => {
    setEditingActivity(null);
    setIsModalOpen(true);
  };

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  // --- Derived State (Filter & Sort) ---

  const processedActivities = useMemo(() => {
    let result = [...activities];

    // 1. Filtering
    if (filters.date) {
      result = result.filter(a => a.date === filters.date);
    }
    
    if (filters.priorities.length > 0) {
      result = result.filter(a => filters.priorities.includes(a.priority));
    }
    // (Optional status filter currently hardcoded to 'Todos' in initial state, but logic is here)
    if (filters.status !== 'Todos') {
      result = result.filter(a => a.status === filters.status);
    }

    // 2. Sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sort.field) {
        case 'date':
          comparison = a.date.localeCompare(b.date);
          break;
        case 'priority':
          comparison = PRIORITY_WEIGHTS[a.priority] - PRIORITY_WEIGHTS[b.priority];
          break;
        case 'status':
          // 'Pendente' comes before 'Concluído' usually, or alphabetical
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [activities, filters, sort]);

  // --- Stats ---
  const pendingCount = activities.filter(a => a.status === 'Pendente').length;
  const doneCount = activities.filter(a => a.status === 'Concluído').length;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-blue-500/30">
      
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <LayoutDashboard size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">DailyTasker</h1>
            </div>
            <div className="flex gap-4 text-sm font-medium">
               <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-gray-400">Pendentes:</span>
                  <span className="text-white">{pendingCount}</span>
               </div>
               <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-gray-400">Concluídas:</span>
                  <span className="text-white">{doneCount}</span>
               </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
             <h2 className="text-2xl font-bold text-white">Minhas Atividades</h2>
             <p className="text-gray-400 mt-1">Gerencie suas tarefas e acompanhe seu progresso.</p>
          </div>
          
          <button 
            onClick={openCreateModal}
            className="group flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-900/20 active:scale-95"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium">Nova Atividade</span>
          </button>
        </div>

        {/* Filters */}
        <FilterBar 
          filters={filters} 
          setFilters={setFilters} 
          sort={sort}
          setSort={setSort}
          activities={activities}
        />

        {/* List */}
        <ActivityList 
          activities={processedActivities}
          onToggleStatus={handleToggleStatus}
          onEdit={openEditModal}
          onDelete={handleDeleteActivity}
          sort={sort}
          onSort={(f) => setSort(prev => ({ field: f, direction: prev.field === f && prev.direction === 'asc' ? 'desc' : 'asc' }))}
        />

      </main>

      <ActivityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveActivity}
        editingActivity={editingActivity}
      />
    </div>
  );
};

export default App;