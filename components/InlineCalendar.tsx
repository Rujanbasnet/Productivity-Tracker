import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from './Icons';

type InlineCalendarProps = {
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  onClose: () => void;
};

const InlineCalendar: React.FC<InlineCalendarProps> = ({ selectedDate, onSelectDate, onClose }) => {
  // Helper to parse YYYY-MM-DD string as a local date at midnight, avoiding timezone issues.
  const parseDateString = (dateString: string | null): Date => {
    if (!dateString) return new Date();
    const parts = dateString.split('-').map(Number);
    // new Date(year, month-1, day)
    return new Date(parts[0], parts[1] - 1, parts[2]);
  };
  
  const [displayDate, setDisplayDate] = useState(parseDateString(selectedDate));

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
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [displayDate]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayString = today.toISOString().split('T')[0];

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3 w-[260px] animate-fade-in-up">
      <div className="flex items-center justify-between mb-2">
        <button onClick={goToPreviousMonth} className="p-1 rounded-full hover:bg-gray-700 transition-colors">
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <span className="font-semibold text-gray-200 text-sm">
          {displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700 transition-colors">
            <CloseIcon className="w-4 h-4"/>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => <div key={i}>{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          if (!date) return <div key={`blank-${index}`} />;
          
          const dateString = date.toISOString().split('T')[0];
          const isSelected = dateString === selectedDate;
          const isToday = dateString === todayString;

          let dayClass = 'h-7 w-7 flex items-center justify-center rounded-full text-xs cursor-pointer transition-colors ';
          if (isSelected) {
            dayClass += 'bg-emerald-600 text-white font-bold ';
          } else {
            dayClass += 'hover:bg-gray-700 ';
          }
          if (isToday && !isSelected) {
            dayClass += 'text-emerald-400 ring-1 ring-emerald-500 ';
          }
          return (
            <button key={dateString} className={dayClass} onClick={() => onSelectDate(dateString)}>
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InlineCalendar;