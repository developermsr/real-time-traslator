
import React from 'react';

interface TranslationPanelProps {
  text: string;
}

const TranslationPanel: React.FC<TranslationPanelProps> = ({ text }) => {
  return (
    <>
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-200 text-center">Spanish Translation</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {text ? (
           <p className="text-gray-200 whitespace-pre-wrap leading-relaxed text-lg">{text}</p>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">Waiting for transcription to begin...</p>
          </div>
        )}
      </div>
    </>
  );
};

export default TranslationPanel;
