import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { type Todo, type Habit, Filter, type View } from './types';
import Header from './components/Header';
import AddTodoForm from './components/AddTodoForm';
import AddHabitForm from './components/AddHabitForm';
import TodoList from './components/TodoList';
import HabitList from './components/HabitList';
import FilterTabs from './components/FilterTabs';
import ViewSwitcher from './components/ViewSwitcher';
import HabitCalendarModal from './components/HabitCalendarModal';
import ConfirmationModal from './components/ConfirmationModal';
import { CheckCircleIcon } from './components/Icons';

const App: React.FC = () => {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [view, setView] = useState<View>('tasks');
  const [viewingCalendarForHabitId, setViewingCalendarForHabitId] = useState<number | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);

  // One-time effect to migrate old data structures on initial load.
  useEffect(() => {
    setHabits(prevHabits => {
      const requiresMigration = prevHabits.some(h => 'completionDates' in h && !('progress' in h));
      if (!requiresMigration) return prevHabits;

      console.log("Migrating habit data structure...");
      return prevHabits.map(habit => {
        if ('progress' in habit) return habit;
        
        const oldHabit = habit as any;
        const newProgress: { [date: string]: number } = {};
        if (Array.isArray(oldHabit.completionDates)) {
          oldHabit.completionDates.forEach((date: string) => {
            newProgress[date] = 1;
          });
        }
        
        const { completionDates, ...restOfHabit } = oldHabit;
        
        return {
          ...restOfHabit,
          goal: 1,
          progress: newProgress,
        };
      });
    });
    
    setTodos(prevTodos => {
      const requiresMigration = prevTodos.some(t => !('dueDate' in t));
      if (!requiresMigration) return prevTodos;
      
      console.log("Migrating todo data structure for dueDate...");
      return prevTodos.map(todo => 
          // Fix: Cast `todo` to `any` before spreading. In the `else` branch of this check,
          // TypeScript narrows `todo` to type `never` because the condition `!('dueDate' in todo)`
          // contradicts the static `Todo` type, which causes an error when spreading `todo`.
          ('dueDate' in todo) ? todo : { ...(todo as any), dueDate: null }
      );
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // --- Todo Handlers ---
  const addTodo = useCallback((text: string, dueDate: string | null) => {
    const newTodo: Todo = { id: Date.now(), text, completed: false, dueDate };
    setTodos(prev => [...prev, newTodo]);
  }, [setTodos]);

  const toggleTodo = useCallback((id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, [setTodos]);

  const deleteTodo = useCallback((id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  }, [setTodos]);

  const editTodo = useCallback((id: number, newValues: { text?: string; dueDate?: string | null; }) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...newValues } : t));
  }, [setTodos]);
  
  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed));
  }, [setTodos]);

  // --- Habit Handlers ---
  const addHabit = useCallback((text: string, goal: number) => {
    const newHabit: Habit = { id: Date.now(), text, goal, progress: {} };
    setHabits(prev => [...prev, newHabit]);
  }, [setHabits]);
  
  const toggleHabitCompletion = useCallback((id: number, date: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === id) {
          const currentProgress = h.progress[date] || 0;
          const goalMet = currentProgress >= h.goal;
          const newProgress = goalMet ? 0 : h.goal; // Toggle between 0 and goal
          return {
            ...h,
            progress: {
              ...h.progress,
              [date]: newProgress
            }
          };
        }
        return h;
      })
    );
  }, [setHabits]);
  
  const requestDeleteHabit = useCallback((id: number) => {
    const habit = habits.find(h => h.id === id);
    if (habit) {
        setHabitToDelete(habit);
    }
  }, [habits]);

  const confirmDeleteHabit = useCallback(() => {
    if (habitToDelete) {
        setHabits(prev => prev.filter(h => h.id !== habitToDelete.id));
        setHabitToDelete(null);
    }
  }, [habitToDelete, setHabits]);

  const cancelDeleteHabit = useCallback(() => {
      setHabitToDelete(null);
  }, []);

  const editHabit = useCallback((id: number, newValues: { text?: string; goal?: number; }) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...newValues } : h));
  }, [setHabits]);

  const handleShowCalendar = useCallback((id: number) => {
    setViewingCalendarForHabitId(id);
  }, []);

  const handleCloseCalendar = useCallback(() => {
    setViewingCalendarForHabitId(null);
  }, []);

  // --- Memoized calculations ---
  const filteredTodos = useMemo(() => {
    const sortedTodos = [...todos].sort((a, b) => {
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
    });

    switch (filter) {
      case Filter.Active:
        return sortedTodos.filter(todo => !todo.completed);
      case Filter.Completed:
        return sortedTodos.filter(todo => todo.completed);
      default:
        return sortedTodos;
    }
  }, [todos, filter]);
  
  const activeCount = useMemo(() => todos.filter(todo => !todo.completed).length, [todos]);
  const completedCount = useMemo(() => todos.length - activeCount, [todos, activeCount]);
  const habitForCalendar = useMemo(() => 
    viewingCalendarForHabitId ? habits.find(h => h.id === viewingCalendarForHabitId) : null,
    [viewingCalendarForHabitId, habits]
  );

  const renderTaskView = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <FilterTabs currentFilter={filter} setFilter={setFilter} />
        {completedCount > 0 && (
           <button 
              onClick={clearCompleted}
              className="flex items-center text-sm text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
            >
              <CheckCircleIcon className="h-4 w-4 mr-1.5" />
              Clear Completed
           </button>
        )}
      </div>
      
      <div className="flex-grow overflow-y-auto pr-2 -mr-2" style={{maxHeight: 'calc(100vh - 320px)'}}>
        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />
      </div>
      
      <div className="text-center text-gray-500 text-sm mt-4">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </div>
    </>
  );
  
  const renderHabitView = () => (
     <div className="flex-grow overflow-y-auto pr-2 -mr-2" style={{maxHeight: 'calc(100vh - 250px)'}}>
        <HabitList
            habits={habits}
            onToggleCompletion={toggleHabitCompletion}
            onDelete={requestDeleteHabit}
            onEdit={editHabit}
            onShowCalendar={handleShowCalendar}
        />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 font-sans flex flex-col">
      <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col flex-grow">
        <Header />
        <ViewSwitcher currentView={view} setView={setView} />
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-4 sm:p-6 flex-grow flex flex-col">
          {view === 'tasks' ? renderTaskView() : renderHabitView()}
        </div>
      </div>
      
      <div className="sticky bottom-0 bg-gray-900/50 backdrop-blur-lg border-t border-gray-700/50">
          <div className="w-full max-w-2xl mx-auto p-4 sm:px-6 lg:px-8">
              {view === 'tasks' ? <AddTodoForm onAdd={addTodo} /> : <AddHabitForm onAdd={addHabit} />}
          </div>
      </div>
      {habitForCalendar && (
        <HabitCalendarModal habit={habitForCalendar} onClose={handleCloseCalendar} />
      )}
      {habitToDelete && (
        <ConfirmationModal
            message={`Are you sure you want to delete the habit "${habitToDelete.text}"? This action cannot be undone.`}
            onConfirm={confirmDeleteHabit}
            onCancel={cancelDeleteHabit}
            confirmText="Delete"
            confirmButtonClass="bg-red-600 hover:bg-red-500"
        />
      )}
    </div>
  );
};

export default App;
