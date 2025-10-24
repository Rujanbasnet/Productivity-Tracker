// Internal helper to parse YYYY-MM-DD string as a local date at midnight.
// This avoids timezone issues that can occur with `new Date('YYYY-MM-DD')`.
const parseISODateAsLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  // In JavaScript, the month argument is 0-indexed (0 for January, 1 for February, etc.).
  return new Date(year, month - 1, day);
};

export const formatDueDate = (dueDate: string | null): string => {
  if (!dueDate) return '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const date = parseISODateAsLocalDate(dueDate);

  if (date.getTime() === today.getTime()) {
    return 'Today';
  }
  if (date.getTime() === tomorrow.getTime()) {
    return 'Tomorrow';
  }
  if (date.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};


export const getDueDateStatus = (dueDate: string | null): 'overdue' | 'today' | 'future' | 'none' => {
  if (!dueDate) return 'none';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = parseISODateAsLocalDate(dueDate);

  if (date.getTime() < today.getTime()) {
    return 'overdue';
  }
  if (date.getTime() === today.getTime()) {
    return 'today';
  }
  return 'future';
};

export const calculateStreak = (progress: { [date: string]: number }, goal: number): number => {
  if (!progress || Object.keys(progress).length === 0 || goal <= 0) return 0;

  const completedDates = new Set(
    Object.keys(progress).filter(date => (progress[date] || 0) >= goal)
  );

  if (completedDates.size === 0) return 0;
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // A streak is only current if it includes today or ended yesterday.
  // If not completed today, start checking from yesterday.
  if (!completedDates.has(currentDate.toISOString().split('T')[0])) {
      currentDate.setDate(currentDate.getDate() - 1);
  }

  // Loop backwards from either today or yesterday and count consecutive days.
  while (completedDates.has(currentDate.toISOString().split('T')[0])) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
};