
import React from 'react';
import { type View } from '../types';
import { TasksIcon, HabitsIcon } from './Icons';

type ViewSwitcherProps = {
  currentView: View;
  setView: (view: View) => void;
};

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, setView }) => {
  const views: { id: View; name: string; icon: React.ElementType }[] = [
    { id: 'tasks', name: 'Tasks', icon: TasksIcon },
    { id: 'habits', name: 'Habits', icon: HabitsIcon },
  ];

  const getButtonClass = (viewId: View) => {
    const baseClass = "w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500";
    if (viewId === currentView) {
      return `${baseClass} bg-emerald-600 text-white`;
    }
    return `${baseClass} text-gray-300 hover:bg-gray-700/50`;
  };

  return (
    <div className="flex w-full space-x-2 bg-gray-800/50 p-1 rounded-lg mb-6">
      {views.map(({ id, name, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setView(id)}
          className={getButtonClass(id)}
        >
          <Icon className="w-5 h-5" />
          {name}
        </button>
      ))}
    </div>
  );
};

export default ViewSwitcher;