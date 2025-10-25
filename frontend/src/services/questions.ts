import callBackend from "../api/callBackend.ts";

export default async function generatingQuestion(
  message: string,
): Promise<string> {
  const body = { text: message };
  const response = await callBackend(
    "api/questions/recognized_questions",
    "POST",
    body,
    "json",
  );
  const data = await response.json();
  return data.question;
}

export async function answer_question(question: string): Promise<string> {
  const body = { text: question };
  const response = await callBackend(
    "api/questions/answer_questions",
    "POST",
    body,
    "json",
  );
  const data = await response.json();
  return data.answer;
}
