
import React, { useRef, useEffect } from 'react';
import type { Message } from '../types';
import { MessageType } from '../types';
import { UserIcon, SparklesIcon } from './IconComponents';

interface TranscriptionPanelProps {
  messages: Message[];
  interimTranscript: string;
  isListening: boolean;
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({ messages, interimTranscript, isListening }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimTranscript]);

  return (
    <>
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-200 text-center">English Transcription & AI Answers</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === MessageType.TRANSCRIPTION && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400">
                    <UserIcon />
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-3 max-w-xl">
                    <p className="text-gray-200">{message.text}</p>
                  </div>
                </div>
              )}
              {message.type === MessageType.ANSWER && (
                <div className="flex items-start gap-3 justify-start">
                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-400">
                    <SparklesIcon />
                  </div>
                  <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/50 rounded-lg p-3 max-w-xl shadow-md">
                     <p className="text-sm font-bold text-purple-300 mb-1">AI Answer</p>
                    <p className="text-gray-100">{message.text}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isListening && interimTranscript && (
             <div className="flex items-start gap-3 opacity-60">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-400">
                  <UserIcon />
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3 max-w-xl">
                  <p className="text-gray-400 italic">{interimTranscript}</p>
                </div>
              </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </div>
    </>
  );
};

export default TranscriptionPanel;
