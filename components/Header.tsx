import React from 'react';
import { ListIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="mb-6 sm:mb-8 text-center">
        <div className="inline-flex items-center">
            <ListIcon className="h-8 w-8 text-emerald-400 mr-3" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 tracking-tight">
                Productivity Tracker
            </h1>
        </div>
        <p className="text-gray-400 mt-1">Track tasks and build habits.</p>
    </header>
  );
};

export default Header;