
import React from 'react';
import { MicrophoneIcon, StopIcon, ProcessingIcon } from './IconComponents';

interface ControlsProps {
  isListening: boolean;
  isProcessing: boolean;
  onStart: () => void;
  onStop: () => void;
}

const Controls: React.FC<ControlsProps> = ({ isListening, isProcessing, onStart, onStop }) => {
  let statusText = 'Click "Start Listening" to begin';
  if (isProcessing) statusText = 'AI is thinking...';
  else if (isListening) statusText = 'Listening... Speak now';

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center w-24 h-24">
        {!isListening ? (
          <button
            onClick={onStart}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-105 active:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed"
            aria-label="Start listening"
            disabled={isListening}
          >
            <MicrophoneIcon />
          </button>
        ) : (
          <button
            onClick={onStop}
            className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-105 active:scale-95 disabled:bg-gray-500 disabled:cursor-not-allowed"
            aria-label="Stop listening"
            disabled={!isListening}
          >
            <StopIcon />
          </button>
        )}
      </div>
      <p className="text-center text-gray-400 h-6 flex items-center">
        {isProcessing && <ProcessingIcon />}
        {statusText}
      </p>
    </div>
  );
};

export default Controls;
