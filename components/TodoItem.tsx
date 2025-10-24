import React, { useState, useRef, useEffect } from 'react';
import { type Todo } from '../types';
import { TrashIcon, PencilIcon, CalendarIcon, CloseIcon } from './Icons';
import { formatDueDate, getDueDateStatus } from '../utils/dateUtils';
import InlineCalendar from './InlineCalendar';

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newValues: { text?: string; dueDate?: string | null; }) => void;
};

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDate, setEditDate] = useState<string | null>(todo.dueDate);
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    } else {
      setCalendarOpen(false); // Close calendar when editing ends
    }
  }, [isEditing]);
  
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmedText = editText.trim();
    if (trimmedText) {
       onEdit(todo.id, { text: trimmedText, dueDate: editDate });
    } else { // if user clears text, revert
        setEditText(todo.text);
        setEditDate(todo.dueDate);
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setEditDate(todo.dueDate);
      setIsEditing(false);
    }
  };

  const handleDateSelect = (date: string | null) => {
    setEditDate(date);
    setCalendarOpen(false);
  }

  const handleCheckboxChange = () => {
    onToggle(todo.id);
  };
  
  const dueDateStatus = getDueDateStatus(todo.dueDate);
  const dateColorClass = {
      overdue: 'text-red-400',
      today: 'text-yellow-400',
      future: 'text-gray-400',
      none: 'hidden'
  }[dueDateStatus];

  return (
    <li className="flex flex-col bg-gray-700/50 p-3 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-700 group relative">
      <div className="flex items-center w-full">
         <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleCheckboxChange}
          className="flex-shrink-0 h-6 w-6 rounded-full border-gray-500 text-emerald-600 bg-gray-800 focus:ring-emerald-500 cursor-pointer transition-transform duration-200 transform hover:scale-110"
        />
        {isEditing ? (
            <div className="ml-4 flex-grow flex items-center gap-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent text-gray-100 outline-none"
                />
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setCalendarOpen(prev => !prev)}
                        className={`border rounded-md py-1 px-2 text-sm flex items-center focus:outline-none focus:ring-1 focus:ring-emerald-500 ${isCalendarOpen ? 'bg-gray-600 border-gray-500' : 'bg-gray-800 border-gray-600 text-gray-300'}`}
                    >
                        <CalendarIcon className="h-4 w-4 mr-1.5" />
                        {editDate ? formatDueDate(editDate) : 'Set Date'}
                    </button>
                    {editDate && !isCalendarOpen && (
                        <button 
                            type="button" 
                            onClick={() => setEditDate(null)}
                            className="absolute -top-1 -right-1 bg-gray-600 rounded-full text-white hover:bg-red-500 transition-colors p-px"
                            aria-label="Clear due date"
                        >
                            <CloseIcon className="h-3 w-3" />
                        </button>
                    )}
                </div>
            </div>
        ) : (
          <div className="ml-4 flex-grow flex flex-col" onClick={handleCheckboxChange}>
            <span
                className={`cursor-pointer ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-200'
                } transition-colors duration-300`}
            >
                {todo.text}
            </span>
            {todo.dueDate && !todo.completed && (
                <div className={`flex items-center text-xs mt-1 ${dateColorClass}`}>
                    <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                    {formatDueDate(todo.dueDate)}
                </div>
            )}
          </div>
        )}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {!isEditing && (
                <button onClick={handleEdit} className="text-gray-400 hover:text-emerald-400 p-1 rounded" aria-label="Edit task">
                <PencilIcon className="h-5 w-5" />
                </button>
            )}
            <button onClick={() => onDelete(todo.id)} className="text-gray-400 hover:text-red-500 p-1 rounded" aria-label="Delete task">
            <TrashIcon className="h-5 w-5" />
            </button>
        </div>
      </div>
      {isEditing && isCalendarOpen && (
        <div className="absolute bottom-full right-0 mb-2 z-20">
          <InlineCalendar 
            selectedDate={editDate}
            onSelectDate={handleDateSelect}
            onClose={() => setCalendarOpen(false)}
          />
        </div>
      )}
    </li>
  );
};

export default TodoItem;