export async function sendChat(user_question: string): Promise<string | null> {
  try {
    const res = await fetch("/api/gpt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: user_question }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const { answer } = await res.json();
    return (answer?.trim?.() || null);
  } catch (err) {
    console.error("sendChat error:", err);
    return null;
  }
}
