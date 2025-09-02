import React, { useState, useEffect, useCallback } from 'react';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { detectQuestion, generateAnswer, translateText } from './services/geminiService';
import type { Message } from './types';
import { MessageType } from './types';
import Controls from './components/Controls';
import TranscriptionPanel from './components/TranscriptionPanel';
import TranslationPanel from './components/TranslationPanel';
import CompatibilityNotice from './components/CompatibilityNotice';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [spanishText, setSpanishText] = useState<string>('');
  const [lastProcessedText, setLastProcessedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    finalTranscript,
    interimTranscript,
    isListening,
    startListening,
    stopListening,
    isSupported,
  } = useSpeechRecognition();

  const handleStart = () => {
    setMessages([]);
    setSpanishText('');
    setLastProcessedText('');
    setError(null);
    startListening();
  };

  const processTranscript = useCallback(async (transcript: string) => {
    if (transcript.length <= lastProcessedText.length) return;

    setIsProcessing(true);
    setError(null);

    const newText = transcript.substring(lastProcessedText.length).trim();
    if (!newText) {
      setIsProcessing(false);
      return;
    }

    try {
      const newQuestionMessage: Message = {
        id: Date.now().toString(),
        type: MessageType.TRANSCRIPTION,
        text: newText,
      };
      setMessages(prev => [...prev, newQuestionMessage]);

      const [isQuestion, translation] = await Promise.all([
        detectQuestion(newText),
        translateText(newText)
      ]);

      setSpanishText(prev => prev ? `${prev}\n${translation}` : translation);
      
      if (isQuestion) {
        const answer = await generateAnswer(newText);
        const newAnswerMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: MessageType.ANSWER,
          text: answer,
        };
        setMessages(prev => [...prev, newAnswerMessage]);
      }
      
      setLastProcessedText(transcript);
    } catch (err) {
      console.error("Error processing transcript:", err);
      setError("An error occurred while communicating with the AI. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [lastProcessedText]);

  useEffect(() => {
    if (finalTranscript) {
      processTranscript(finalTranscript);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTranscript, processTranscript]);


  if (!isSupported) {
    return <CompatibilityNotice />;
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans flex flex-col">
      <header className="p-4 border-b border-gray-700 shadow-lg bg-gray-800/50 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Real-time AI Translator & Q&A
        </h1>
      </header>
      
      <main className="flex-grow flex flex-col lg:flex-row p-4 gap-4">
        <div className="lg:w-1/2 flex flex-col bg-gray-800/50 rounded-lg border border-gray-700 shadow-2xl">
          <TranscriptionPanel messages={messages} interimTranscript={interimTranscript} isListening={isListening} />
        </div>
        <div className="lg:w-1/2 flex flex-col bg-gray-800/50 rounded-lg border border-gray-700 shadow-2xl">
          <TranslationPanel text={spanishText} />
        </div>
      </main>

      <footer className="p-4 border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        {error && <p className="text-center text-red-400 mb-2">{error}</p>}
        <Controls
          isListening={isListening}
          isProcessing={isProcessing}
          onStart={handleStart}
          onStop={stopListening}
        />
      </footer>
    </div>
  );
};

export default App;