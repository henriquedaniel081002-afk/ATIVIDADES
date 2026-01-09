import React, { useState } from 'react';
import { Activity, SortState, SortField, Priority } from '../types';
import { Edit2, CheckCircle, Circle, Calendar, ArrowUp, ArrowDown, Trash2, X, Check } from 'lucide-react';

interface ActivityListProps {
  activities: Activity[];
  onToggleStatus: (id: string) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  sort: SortState;
  onSort: (field: SortField) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({ activities, onToggleStatus, onEdit, onDelete, sort, onSort }) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'Alta': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Média': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Baixa': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400';
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sort.field !== field) return <div className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-30"><ArrowUp size={14} /></div>;
    return sort.direction === 'asc' 
      ? <ArrowUp size={14} className="ml-1 text-blue-400" /> 
      : <ArrowDown size={14} className="ml-1 text-blue-400" />;
  };

  const handleDeleteInitialClick = (id: string) => {
    setConfirmingId(id);
  };

  const handleConfirmDelete = (id: string) => {
    setConfirmingId(null);
    setDeletingId(id);
    // Wait for animation (400ms) before calling parent delete
    setTimeout(() => {
      onDelete(id);
      setDeletingId(null);
    }, 400);
  };

  const handleCancelDelete = () => {
    setConfirmingId(null);
  };

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-800 rounded-xl border border-gray-700 border-dashed">
        <div className="bg-gray-900 p-4 rounded-full mb-4">
          <Calendar size={32} className="text-gray-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-300">Nenhuma atividade encontrada</h3>
        <p className="text-gray-500 text-sm mt-1">Ajuste os filtros ou crie uma nova atividade.</p>
      </div>
    );
  }

  // Common transition class for delete animation
  const getRowClass = (id: string) => `
    transition-all duration-300 ease-out transform
    ${deletingId === id 
      ? 'opacity-0 translate-x-12 scale-95 pointer-events-none bg-red-900/20 border-red-500/50' 
      : 'opacity-100 translate-x-0'}
  `;

  return (
    <div className="w-full">
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className={`p-4 rounded-xl border shadow-sm ${getRowClass(activity.id)} ${
              activity.status === 'Concluído' 
                ? 'bg-gray-800/50 border-gray-700' // Base styles if not deleting
                : 'bg-gray-800 border-gray-600 hover:border-blue-500/50'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                 <button 
                  onClick={() => onToggleStatus(activity.id)}
                  className={`transition-colors ${activity.status === 'Concluído' ? 'text-green-500' : 'text-gray-500 hover:text-blue-400'}`}
                >
                  {activity.status === 'Concluído' ? <CheckCircle size={22} className="fill-green-500/10" /> : <Circle size={22} />}
                </button>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${getPriorityColor(activity.priority)}`}>
                  {activity.priority}
                </span>
              </div>
              <div className="flex gap-2 items-center h-8">
                <button 
                  onClick={() => onEdit(activity)}
                  className="text-gray-500 hover:text-white p-1 rounded hover:bg-gray-700 transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                
                {confirmingId === activity.id ? (
                  <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-0.5 border border-gray-700">
                      <button 
                        onClick={() => handleConfirmDelete(activity.id)} 
                        className="text-red-400 hover:text-white hover:bg-red-500/80 p-1 rounded transition-colors"
                        title="Confirmar exclusão"
                      >
                          <Check size={14} />
                      </button>
                      <button 
                        onClick={handleCancelDelete} 
                        className="text-gray-400 hover:text-white hover:bg-gray-700 p-1 rounded transition-colors"
                        title="Cancelar"
                      >
                          <X size={14} />
                      </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleDeleteInitialClick(activity.id)}
                    className="text-red-500/70 hover:text-red-400 p-1 rounded hover:bg-red-900/20 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
            
            <h3 className={`font-medium text-base mb-2 ${activity.status === 'Concluído' ? 'text-gray-500 line-through' : 'text-white'}`}>
              {activity.description}
            </h3>

            <div className="flex justify-between items-end text-xs text-gray-500 border-t border-gray-700 pt-3 mt-1">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> Data: {formatDate(activity.date)}
                </span>
                {activity.completionDate && (
                   <span className="text-green-500/70 flex items-center gap-1">
                    <CheckCircle size={10} /> Concluído: {formatDate(activity.completionDate)}
                   </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-700 shadow-lg">
        <table className="w-full bg-gray-800 text-left border-collapse">
          <thead className="bg-gray-900 text-gray-400 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="p-4 w-12 text-center">Check</th>
              <th 
                className="p-4 cursor-pointer hover:text-white group transition-colors"
                onClick={() => onSort('date')}
              >
                <div className="flex items-center">Data {getSortIcon('date')}</div>
              </th>
              <th 
                className="p-4 cursor-pointer hover:text-white group transition-colors"
                onClick={() => onSort('priority')}
              >
                <div className="flex items-center">Prioridade {getSortIcon('priority')}</div>
              </th>
              <th className="p-4 w-1/3">Descrição</th>
              <th 
                className="p-4 cursor-pointer hover:text-white group transition-colors"
                onClick={() => onSort('status')}
              >
                <div className="flex items-center">Status {getSortIcon('status')}</div>
              </th>
              <th className="p-4">Concluído em</th>
              <th className="p-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {activities.map((activity) => (
              <tr 
                key={activity.id} 
                className={`${getRowClass(activity.id)} ${
                  activity.status === 'Concluído' 
                    ? 'bg-gray-800/50 hover:bg-gray-800' 
                    : 'hover:bg-gray-750'
                }`}
              >
                <td className="p-4 text-center">
                  <button 
                    onClick={() => onToggleStatus(activity.id)}
                    className={`transition-all duration-200 transform active:scale-90 ${
                      activity.status === 'Concluído' ? 'text-green-500' : 'text-gray-500 hover:text-blue-400'
                    }`}
                  >
                    {activity.status === 'Concluído' ? <CheckCircle size={20} className="fill-green-500/10" /> : <Circle size={20} />}
                  </button>
                </td>
                <td className="p-4 text-sm text-gray-300 whitespace-nowrap">
                  {formatDate(activity.date)}
                </td>
                <td className="p-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded border inline-flex items-center ${getPriorityColor(activity.priority)}`}>
                    {activity.priority}
                  </span>
                </td>
                <td className="p-4 text-sm text-white">
                  <span className={activity.status === 'Concluído' ? 'line-through text-gray-500' : ''}>
                    {activity.description}
                  </span>
                </td>
                <td className="p-4">
                   <span className={`text-xs px-2 py-1 rounded-full ${
                     activity.status === 'Concluído' 
                      ? 'bg-green-900/30 text-green-400' 
                      : 'bg-blue-900/30 text-blue-400'
                   }`}>
                     {activity.status}
                   </span>
                </td>
                <td className="p-4 text-sm text-gray-400 whitespace-nowrap">
                  {activity.completionDate ? formatDate(activity.completionDate) : '-'}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 h-8">
                    <button 
                      onClick={() => onEdit(activity)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    
                    {confirmingId === activity.id ? (
                      <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-0.5 border border-gray-700">
                          <button 
                            onClick={() => handleConfirmDelete(activity.id)} 
                            className="text-red-400 hover:text-white hover:bg-red-500/80 p-1.5 rounded transition-colors"
                            title="Confirmar exclusão"
                          >
                              <Check size={14} />
                          </button>
                          <button 
                            onClick={handleCancelDelete} 
                            className="text-gray-400 hover:text-white hover:bg-gray-700 p-1.5 rounded transition-colors"
                            title="Cancelar"
                          >
                              <X size={14} />
                          </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleDeleteInitialClick(activity.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityList;