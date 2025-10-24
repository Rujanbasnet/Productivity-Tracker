import React, { useState, useMemo } from 'react';
import { type Habit } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

type HabitCalendarModalProps = {
  habit: Habit;
  onClose: () => void;
};

const HabitCalendarModal: React.FC<HabitCalendarModalProps> = ({ habit, onClose }) => {
  const [displayDate, setDisplayDate] = useState(new Date());

  const goToPreviousMonth = () => {
    setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setDisplayDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const calendarDays = useMemo(() => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Add blank days for the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [displayDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md p-6 text-gray-200 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-1 truncate" title={habit.text}>{habit.text}</h2>
        <p className="text-sm text-gray-400 mb-4">Completion History</p>
        
        <div className="flex items-center justify-between mb-4">
          <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <span className="text-lg font-semibold w-32 text-center">
            {displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`blank-${index}`} />;
            }

            const dateString = date.toISOString().split('T')[0];
            const isCompleted = (habit.progress[dateString] || 0) >= habit.goal;
            const isToday = date.getTime() === today.getTime();
            
            let dayClass = 'h-10 w-10 flex items-center justify-center rounded-full';
            if (isCompleted) {
              dayClass += ' bg-emerald-500 text-white font-bold';
            } else {
               dayClass += ' bg-gray-700/50';
            }
            if (isToday) {
              dayClass += ' ring-2 ring-emerald-400';
            }

            return (
              <div key={dateString} className={dayClass}>
                {date.getDate()}
              </div>
            );
          })}
        </div>
        <button 
            onClick={onClose}
            className="mt-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg w-full transition-colors"
        >
            Close
        </button>
      </div>
    </div>
  );
};

export default HabitCalendarModal;
