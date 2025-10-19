import callBackend from "../api/callBackend.ts";

export default async function generatingListQuestions(message: string) {
  const body = { text: message };
  const response = await callBackend(
    "api/questions/recognized_questions",
    "POST",
    body,
    "json",
  );
  return await response.json();
}
