
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string | null; // Stores dates in 'YYYY-MM-DD' format
}

export interface Habit {
  id: number;
  text: string;
  goal: number; // Daily completion goal
  progress: { [date: string]: number }; // e.g., { '2024-07-29': 5 }
}

export enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export type View = 'tasks' | 'habits';