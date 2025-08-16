import OpenAI from "openai";
import { NextRequest } from "next/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    const input = String(question ?? "").trim();

    if (!input) {
      return new Response(JSON.stringify({ answer: "нет вопроса" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      top_p: 1,
      presence_penalty: 0,
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: [
            "Ты — ассистент, который даёт краткие и точные ответы на технические вопросы по программированию.",
            "Если в сообщении нет вопроса по программированию — ответь ровно: 'нет вопроса'.",
            "Если вопрос есть — ответь максимально кратко и по делу, без пояснений, без приветствий, без лишнего текста."
          ].join(" "),
        },
        { role: "user", content: input }
      ],
    });

    const answer = resp.choices?.[0]?.message?.content?.trim() ?? "";

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (e: any) {
    console.error(e);
    return new Response(
      JSON.stringify({ error: e?.message ?? "Server error" }),
      { status: 500 }
    );
  }
}
