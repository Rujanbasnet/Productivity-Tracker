import React, { useState } from 'react';
import { PlusIcon } from './Icons';

type AddHabitFormProps = {
  onAdd: (text: string, goal: number) => void;
};

const AddHabitForm: React.FC<AddHabitFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [goal, setGoal] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    const goalNumber = parseInt(goal, 10);
    if (trimmedText && !isNaN(goalNumber) && goalNumber > 0) {
      onAdd(trimmedText, goalNumber);
      setText('');
      setGoal('1');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new habit..."
        className="w-full sm:flex-grow bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow duration-200"
      />
      <div className="w-full sm:w-auto flex items-center gap-3">
        <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            min="1"
            className="bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow duration-200 w-24 text-center"
            aria-label="Daily goal"
        />
        <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-emerald-500/50 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none"
            disabled={!text.trim() || !goal || parseInt(goal, 10) <= 0}
            aria-label="Add new habit"
        >
            Add
        </button>
      </div>
    </form>
  );
};

export default AddHabitForm;