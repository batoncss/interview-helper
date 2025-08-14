import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // ключ берём из .env
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Нужен текст для анализа' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Ты получишь фрагменты распознанного текста. В них могут содержаться вопросы, которые задают на собеседованиях Python или JavaScript разработчикам. 
    Твоя задача:
    - Найти все такие вопросы (если они есть),
    - Привести их к логичному, корректному формулированию,
    - Вернуть результат в формате JSON-массива строк, без пояснений и обёрток.`
        },
        { role: 'user', content: text }
      ],
      temperature: 0.3
    });

    // Ответ от GPT
    const raw = completion.choices[0]?.message?.content?.trim() || '[]';

    // Пробуем распарсить JSON
    let questions: string[] = [];
    try {
      questions = JSON.parse(raw);
    } catch {
      console.warn('Не удалось распарсить JSON, ответ GPT:', raw);
      questions = [];
    }

    return NextResponse.json(questions);
  } catch (err: any) {
    console.error('Ошибка API getQuestions:', err);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
