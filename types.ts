export type Priority = 'Alta' | 'Média' | 'Baixa';
export type Status = 'Pendente' | 'Concluído';

export interface Activity {
  id: string;
  date: string; // YYYY-MM-DD
  priority: Priority;
  description: string;
  status: Status;
  completionDate?: string; // YYYY-MM-DD
  createdAt: number;
}

export interface FilterState {
  date: string; // Empty string means "All dates"
  priorities: Priority[];
  status: Status | 'Todos';
}

export type SortField = 'date' | 'priority' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export const PRIORITY_WEIGHTS: Record<Priority, number> = {
  'Alta': 3,
  'Média': 2,
  'Baixa': 1
};