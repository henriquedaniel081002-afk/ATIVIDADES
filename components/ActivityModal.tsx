import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Activity, Priority, Status } from '../types';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  editingActivity?: Activity | null;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, onSave, editingActivity }) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState<Priority>('Média');
  const [status, setStatus] = useState<Status>('Pendente');

  useEffect(() => {
    if (isOpen) {
      if (editingActivity) {
        setDescription(editingActivity.description);
        setDate(editingActivity.date);
        setPriority(editingActivity.priority);
        setStatus(editingActivity.status);
      } else {
        // Defaults for new activity
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        setPriority('Média');
        setStatus('Pendente');
      }
    }
  }, [isOpen, editingActivity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      description,
      date,
      priority,
      status,
      // If manually setting status to done in edit mode, ensure we have a completion date logic handled by parent,
      // but here we just pass the form state.
      completionDate: status === 'Concluído' ? (editingActivity?.completionDate || new Date().toISOString().split('T')[0]) : undefined
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            {editingActivity ? 'Editar Atividade' : 'Nova Atividade'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-md"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
            <input 
              type="text" 
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600"
              placeholder="Ex: Reunião de projeto..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Data</label>
              <input 
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Prioridade</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Alta">Alta</option>
                <option value="Média">Média</option>
                <option value="Baixa">Baixa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
            <div className="flex space-x-4 mt-1">
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  className="form-radio text-blue-500 focus:ring-blue-500 bg-gray-900 border-gray-600" 
                  name="status" 
                  value="Pendente" 
                  checked={status === 'Pendente'}
                  onChange={() => setStatus('Pendente')}
                />
                <span className="ml-2 text-white">Pendente</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  className="form-radio text-green-500 focus:ring-green-500 bg-gray-900 border-gray-600" 
                  name="status" 
                  value="Concluído" 
                  checked={status === 'Concluído'}
                  onChange={() => setStatus('Concluído')}
                />
                <span className="ml-2 text-white">Concluído</span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center space-x-2 font-medium transition-colors shadow-lg shadow-blue-900/20"
            >
              <Save size={18} />
              <span>Salvar</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ActivityModal;