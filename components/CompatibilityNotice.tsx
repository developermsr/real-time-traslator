
import React from 'react';

const CompatibilityNotice: React.FC = () => {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center bg-gray-800 p-8 rounded-lg shadow-2xl border border-red-500/50">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Browser Not Supported</h1>
        <p className="text-gray-300">
          This application relies on the Web Speech API for real-time voice recognition, which is not supported by your current browser.
        </p>
        <p className="mt-4 text-gray-400">
          For the best experience, please use a recent version of Google Chrome or another supported browser.
        </p>
      </div>
    </div>
  );
};

export default CompatibilityNotice;
