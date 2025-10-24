import React, { useState, useEffect, useRef } from 'react';
import { type Habit } from '../types';
import { TrashIcon, CalendarIcon, FireIcon, PencilIcon, CheckCircleIcon } from './Icons';
import { calculateStreak } from '../utils/dateUtils';

const WeeklyProgress: React.FC<{
  progress: { [date: string]: number };
  goal: number;
  onToggle: (date: string) => void;
}> = ({ progress, goal, onToggle }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate Monday of the current week
  const dayOfWeek = today.getDay(); // Sunday: 0, Monday: 1, ..., Saturday: 6
  // Adjust to find the Monday of the current week.
  // If today is Sunday (0), we go back 6 days. Otherwise, we go back (dayOfWeek - 1) days.
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysToSubtract);

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });

  return (
    <div className="flex justify-between">
      {weekDays.map(date => {
        const dateString = date.toISOString().split('T')[0];
        // Use 'narrow' for a compact, single-letter representation of the weekday (e.g., 'M', 'T').
        const dayLabel = date.toLocaleDateString('en-US', { weekday: 'narrow' });
        const isCompleted = (progress[dateString] || 0) >= goal;
        const tooltip = `${date.toLocaleDateString()}: ${progress[dateString] || 0}/${goal}`;

        return (
          <div key={dateString} className="flex flex-col items-center gap-2" title={tooltip}>
            <span className="text-xs text-gray-400">{dayLabel}</span>
            <button
              onClick={() => onToggle(dateString)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                isCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Toggle habit completion for ${date.toLocaleDateString()}`}
            >
              {isCompleted && <CheckCircleIcon className="w-5 h-5 text-white" />}
            </button>
          </div>
        );
      })}
    </div>
  );
};

const getStreakVisuals = (streakCount: number) => {
    if (streakCount === 0) return null;
    let iconClassName = 'text-orange-400';
    let tooltipText = `You're on a ${streakCount}-day streak!`;
    if (streakCount >= 3) iconClassName = 'text-orange-500';
    if (streakCount >= 7) iconClassName = 'text-red-500';
    if (streakCount >= 14) iconClassName = 'text-red-500 drop-shadow-[0_1px_4px_rgba(239,68,68,0.8)]';
    return { iconClassName, tooltipText };
};

type HabitItemProps = {
  habit: Habit;
  onToggleCompletion: (id: number, date: string) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newValues: { text?: string; goal?: number; }) => void;
  onShowCalendar: (id: number) => void;
};

const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggleCompletion, onDelete, onEdit, onShowCalendar }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(habit.text);
  const [editGoal, setEditGoal] = useState(habit.goal.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);
  
  const handleSave = () => {
    const trimmedText = editText.trim();
    const goalNumber = parseInt(editGoal, 10);
    if (trimmedText && !isNaN(goalNumber) && goalNumber > 0) {
       onEdit(habit.id, { text: trimmedText, goal: goalNumber });
    } else {
        setEditText(habit.text);
        setEditGoal(habit.goal.toString());
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    else if (e.key === 'Escape') {
      setEditText(habit.text);
      setEditGoal(habit.goal.toString());
      setIsEditing(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysProgress = habit.progress[todayStr] || 0;
  const isGoalMetToday = todaysProgress >= habit.goal;
  const streak = calculateStreak(habit.progress, habit.goal);
  const streakVisuals = getStreakVisuals(streak);
  const totalCompletions = Object.values(habit.progress).reduce((sum: number, count: number) => sum + (count >= habit.goal ? 1 : 0), 0);

  if (isEditing) {
    return (
        <li className="flex flex-col bg-gray-700/50 p-3 sm:p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-3">
                 <input
                    ref={inputRef}
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-100 outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                    type="number"
                    value={editGoal}
                    onChange={(e) => setEditGoal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    min="1"
                    className="bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-gray-100 w-24 text-center outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button onClick={handleSave} className="bg-emerald-600 p-2 rounded-md text-white hover:bg-emerald-500 transition-colors">
                    <CheckCircleIcon className="h-6 w-6" />
                </button>
            </div>
        </li>
    )
  }

  return (
    <li className="flex flex-col bg-gray-700/50 p-3 sm:p-4 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-700 group">
      <div className="flex items-start justify-between">
        <span className="text-lg text-gray-200 font-medium break-words pr-2">
          {habit.text}
        </span>
        <div className="flex-shrink-0 flex items-center -mt-1 -mr-1">
            <div className="flex items-center gap-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                {streak > 0 && streakVisuals && (
                    <div className="flex items-center gap-1" title={streakVisuals.tooltipText}>
                        <FireIcon className={`h-5 w-5 transition-all duration-300 ease-in-out ${streakVisuals.iconClassName}`} />
                        <span className="font-bold">{streak}</span>
                    </div>
                )}
                <div className="flex items-center gap-1.5" title={`Total days completed: ${totalCompletions}`}>
                    <CalendarIcon className="h-5 w-5 text-emerald-400" />
                    <span className="font-bold">{totalCompletions}</span>
                </div>
            </div>
            <button onClick={() => onShowCalendar(habit.id)} className="text-gray-400 hover:text-emerald-400 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`View calendar for ${habit.text}`}>
                <CalendarIcon className="h-5 w-5" />
            </button>
            <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-emerald-400 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Edit habit ${habit.text}`}>
                <PencilIcon className="h-5 w-5" />
            </button>
            <button onClick={() => onDelete(habit.id)} className="text-gray-400 hover:text-red-500 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Delete habit ${habit.text}`}>
              <TrashIcon className="h-5 w-5" />
            </button>
        </div>
      </div>

      <button
        onClick={() => onToggleCompletion(habit.id, todayStr)}
        className={`flex items-center w-full p-3 my-4 rounded-lg transition-all duration-200 text-left ${
          isGoalMetToday ? 'bg-green-500/20 hover:bg-green-500/30' : 'bg-gray-800 hover:bg-gray-800/60'
        }`}
      >
        {isGoalMetToday ? (
          <CheckCircleIcon className="h-7 w-7 text-green-400 flex-shrink-0" />
        ) : (
          <div className="h-7 w-7 rounded-full border-2 border-gray-500 flex-shrink-0"></div>
        )}
        <span className={`ml-4 font-medium ${isGoalMetToday ? 'text-green-300' : 'text-gray-300'}`}>
          {isGoalMetToday ? 'Goal met for today!' : `Tap to complete today's goal`}
        </span>
        <span className="ml-auto font-mono text-gray-400">{isGoalMetToday ? habit.goal : todaysProgress}/{habit.goal}</span>
      </button>

      <div className="border-t border-gray-600/50 pt-3 mt-1">
        <WeeklyProgress
          progress={habit.progress}
          goal={habit.goal}
          onToggle={(date) => onToggleCompletion(habit.id, date)}
        />
      </div>
    </li>
  );
};

export default HabitItem;