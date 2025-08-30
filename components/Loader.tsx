
import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Generating content...' }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-gray-800/50 rounded-lg">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      <p className="text-lg text-gray-300 font-semibold">{message}</p>
      <p className="text-sm text-gray-400">This may take a few moments. Please wait.</p>
    </div>
  );
};

export default Loader;
