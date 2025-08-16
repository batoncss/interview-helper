'use client';
import { useEffect, useRef, useState } from 'react';
import { sendChat } from '@/app/lib/sendChat';

export type QAItem = {
  id: string;
  createdAt: number;
  question: string;
  answer: string;
  status: 'done';
};

function restartRecognition(recognition: any) {
  try { recognition.stop(); } catch {}
  setTimeout(() => {
    try { recognition.start(); } catch {}
  }, 400);
}

async function getPossibleQuestions(text: string): Promise<string[]> {
  const res = await fetch('/api/getQuestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!res.ok) throw new Error('Ошибка API получения вопросов');
  return await res.json();
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [finalText, setFinalText] = useState<string[]>([]);
  const [interimText, setInterimText] = useState('');
  const [qa, setQa] = useState<QAItem[]>([]);
  const [chatMode, setChatMode] = useState(false);
  const [bufferText, setBufferText] = useState<string[]>([]);

  const recognitionRef = useRef<any>(null);
  const lastResultTime = useRef(Date.now());
  const chatModeRef = useRef(chatMode);

  useEffect(() => {
    chatModeRef.current = chatMode;
  }, [chatMode]);

  async function processBuffer(sentences: string[]) {
    const textBlock = sentences.join(' ');
    try {
      const questions = await getPossibleQuestions(textBlock);
      if (!questions || questions.length === 0) return;

      for (const question of questions) {
        try {
          const answer = await sendChat(question);
          if (answer && answer.trim().toLowerCase() !== 'нет вопроса') {
            setQa(prev => [
              {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                createdAt: Date.now(),
                question,
                answer: answer.trim(),
                status: 'done'
              },
              ...prev
            ]);
          }
        } catch (err) {
          console.error('Ошибка при отправке вопроса:', err);
        }
      }
    } catch (err) {
      console.error('Ошибка при получении вопросов:', err);
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const SpeechGrammarList =
      (window as any).SpeechGrammarList || (window as any).webkitSpeechGrammarList;

    if (!SpeechRecognition) {
      console.warn('Web Speech API не поддерживается.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = true;
    recognition.interimResults = true;

    if (SpeechGrammarList) {
      const keywords = [
        'python', 'класс', 'объект', 'наследование', 'инкапсуляция', 'полиморфизм',
        'интерфейс', 'абстракция', 'алгоритм', 'структура данных', 'массив', 'хэш', 'очередь', 'стек',
        'база данных', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL',
        'API', 'REST', 'GraphQL', 'HTTP', 'HTTPS', 'WebSocket',
        'Docker', 'контейнер', 'оркестрация', 'Kubernetes',
        'Node', 'JavaScript', 'TypeScript', 'React', 'Next',
        'сервер', 'клиент', 'бэкенд', 'фронтенд',
        'тестирование', 'юнит тест', 'интеграционное тестирование',
        'Git', 'репозиторий', 'ветка', 'коммит', 'merge', 'pull request'
      ];

      const sgl = new SpeechGrammarList();
      const jsgfWords = keywords
        .map(w => (/\s/.test(w) ? `"${w}"` : w))
        .join(' | ');
      const grammar = `#JSGF V1.0; grammar keywords; public <keyword> = ${jsgfWords} ;`;

      try {
        sgl.addFromString(grammar, 1);
        (recognition as any).grammars = sgl;
      } catch (e) {
        console.warn('Не удалось применить SpeechGrammarList:', e);
      }
    }

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e: any) => console.error('Speech error:', e);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const now = Date.now();
      const pauseMs = now - lastResultTime.current;
      lastResultTime.current = now;

      let interim = '';
      let finalChunk = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalChunk += res[0].transcript;
        else interim += res[0].transcript;
      }

      setInterimText(interim);

      if (finalChunk.trim()) {
        const sentence = finalChunk.trim();
        setFinalText(prev => [
          ...prev,
          chatModeRef.current ? sentence : `${sentence} (не отправлено)`
        ]);

        if (chatModeRef.current) {
          setBufferText(prev => {
            const updated = [...prev];
            if (updated.length === 0 || updated[updated.length - 1] !== sentence) {
              updated.push(sentence);
            }
            if (updated.length >= 3) {
              processBuffer(updated);
              return [];
            }
            return updated;
          });
        }
      }

      if (pauseMs > 3500 || interim.length > 150) {
        restartRecognition(recognition);
        setInterimText('');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try { recognition.stop(); } catch {}
      recognitionRef.current = null;
    };
  }, []);

  const startListening = () => {
    const rec = recognitionRef.current;
    if (rec && !isListening) {
      try { rec.start(); } catch {}
    }
  };

  const stopListening = () => {
    const rec = recognitionRef.current;
    if (rec) {
      try { rec.stop(); } catch {}
      setInterimText('');
      setBufferText([]);
    }
  };

  return {
    isListening,
    interimText,
    finalText,
    qa,
    chatMode,
    setChatMode,
    startListening,
    stopListening
  };
}
