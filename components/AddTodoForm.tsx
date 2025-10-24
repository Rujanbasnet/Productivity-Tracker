import React, { useState } from 'react';
import { CalendarIcon, CloseIcon } from './Icons';
import { formatDueDate } from '../utils/dateUtils';
import InlineCalendar from './InlineCalendar';

type AddTodoFormProps = {
  onAdd: (text: string, dueDate: string | null) => void;
};

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (trimmedText) {
      onAdd(trimmedText, dueDate);
      setText('');
      setDueDate(null);
      setCalendarOpen(false);
    }
  };
  
  const handleDateSelect = (date: string | null) => {
    setDueDate(date);
    setCalendarOpen(false);
  }

  const toggleCalendar = () => setCalendarOpen(prev => !prev);

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="w-full sm:flex-grow bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow duration-200"
        />
        <div className="w-full sm:w-auto flex items-center gap-3">
          {/* Date display and trigger */}
          <div className="relative">
              <button
                  type="button"
                  onClick={toggleCalendar}
                  className={`border rounded-lg py-3 px-4 text-gray-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow duration-200 flex items-center justify-center w-full min-w-[150px] ${isCalendarOpen ? 'bg-gray-700 border-gray-500' : 'bg-gray-800 border-gray-700'}`}
              >
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  <span className="flex-1 text-left">{dueDate ? formatDueDate(dueDate) : 'Due Date'}</span>
              </button>
              {dueDate && !isCalendarOpen && (
                  <button 
                      type="button" 
                      onClick={() => setDueDate(null)}
                      className="absolute -top-1.5 -right-1.5 bg-gray-600 rounded-full text-white hover:bg-red-500 transition-colors p-0.5"
                      aria-label="Clear due date"
                  >
                      <CloseIcon className="h-3.5 w-3.5" />
                  </button>
              )}
          </div>
          <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-emerald-500/50 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
              disabled={!text.trim()}
              aria-label="Add new to-do"
          >
              Add
          </button>
        </div>
      </form>
      {isCalendarOpen && (
        <div className="absolute bottom-full mb-2 right-0">
             <InlineCalendar 
                selectedDate={dueDate}
                onSelectDate={handleDateSelect}
                onClose={() => setCalendarOpen(false)}
            />
        </div>
      )}
    </div>
  );
};

export default AddTodoForm;