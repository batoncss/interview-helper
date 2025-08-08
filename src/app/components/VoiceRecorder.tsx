'use client';

import { useEffect, useRef, useState } from 'react';

export default function SimpleVoiceStream() {
  const [finalText, setFinalText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<any | null>(null);
  const lastResultTime = useRef<number>(Date.now());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      console.warn('Web Speech API не поддерживается в этом браузере.');
      return;
    }

    const recognition = new SR();
    recognition.lang = 'ru-RU';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onerror = (e) => {
      console.error('Speech error:', e);
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const now = Date.now();
      const pauseMs = now - lastResultTime.current;
      console.log(`⏱ Пауза между результатами: ${pauseMs} мс`);
      lastResultTime.current = now;

      let interim = '';
      let finalChunk = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const text = res[0].transcript;
        if (res.isFinal) {
          finalChunk += text;
        } else {
          interim += text;
        }
      }

      if (finalChunk) setFinalText(prev => (prev + finalChunk));
      setInterimText(interim);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.onresult = null;
        recognition.onstart = null;
        recognition.onend = null;
        recognition.onerror = null;
        recognition.stop();
      } catch {}
      recognitionRef.current = null;
    };
  }, []);

  const start = () => {
    setFinalText('');
    setInterimText('');
    try {
      recognitionRef.current?.start();
    } catch (e) {
      console.warn(e);
    }
  };

  const stop = () => {
    try {
      recognitionRef.current?.stop();
    } catch {}
  };

  const transcript = (finalText + (interimText ? ` ${interimText}` : '')).trim();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🎙 Голос → Текст</h2>

        <div className="flex gap-4 mb-6">
          <button
            onClick={start}
            disabled={isListening}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            ▶ Старт
          </button>
          <button
            onClick={stop}
            disabled={!isListening}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            ⏹ Стоп
          </button>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg min-h-[150px] whitespace-pre-wrap text-gray-700 text-lg">
          {transcript || <span className="text-gray-400 italic">Говорите…</span>}
        </div>
      </div>
    </div>
  );
}
