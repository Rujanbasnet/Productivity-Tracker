
import React from 'react';

type EmptyStateProps = {
  icon: React.ReactNode;
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full py-16">
      <div className="mb-4 text-green-500">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-300">{title}</h3>
      <p className="text-gray-500 mt-2 max-w-xs">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
