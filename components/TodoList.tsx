

import React from 'react';
import { type Todo } from '../types';
import TodoItem from './TodoItem';
import EmptyState from './EmptyState';
import { CheckCircleIcon } from './Icons';

type TodoListProps = {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newValues: { text?: string; dueDate?: string | null; }) => void;
};

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete, onEdit }) => {
  if (todos.length === 0) {
    return (
      <EmptyState 
        icon={<CheckCircleIcon className="h-16 w-16" />}
        title="All Clear!"
        message="Looks like you're all caught up. Add a new task below to get started."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
};

export default TodoList;