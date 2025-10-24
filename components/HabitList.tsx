import React from 'react';
import { type Habit } from '../types';
import HabitItem from './HabitItem';
import EmptyState from './EmptyState';
import { HabitsIcon } from './Icons';

type HabitListProps = {
  habits: Habit[];
  onToggleCompletion: (id: number, date: string) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newValues: { text?: string; goal?: number; }) => void;
  onShowCalendar: (id: number) => void;
};

const HabitList: React.FC<HabitListProps> = ({ habits, onToggleCompletion, onDelete, onEdit, onShowCalendar }) => {
  if (habits.length === 0) {
    return (
        <EmptyState 
            icon={<HabitsIcon className="h-16 w-16" />}
            title="Track Your Goals"
            message="Add a new habit below to start building a better you, one day at a time."
        />
    );
  }

  return (
    <ul className="space-y-3">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onToggleCompletion={onToggleCompletion}
          onDelete={onDelete}
          onEdit={onEdit}
          onShowCalendar={onShowCalendar}
        />
      ))}
    </ul>
  );
};

export default HabitList;