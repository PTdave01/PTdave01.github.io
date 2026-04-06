const Anthropic = require("@anthropic-ai/sdk");

const SYSTEM_PROMPT = `You are PT Dave's assistant — a friendly, knowledgeable AI for a licensed physiotherapist named PT Dave. Your job is to help patients on his website.

You can:
- Answer general physiotherapy questions clearly and confidently
- Describe PT Dave's services: sports rehabilitation, back pain relief, post-surgery recovery, injury prevention, movement assessment, and general physiotherapy
- Help patients understand their symptoms and what type of treatment might help
- Guide patients toward booking a session with PT Dave
- Triage symptoms — give helpful general guidance while always making clear that PT Dave provides the real diagnosis
- Escalate to PT Dave when the situation is serious or the patient needs direct human contact

Tone: Warm, confident, no-nonsense. Short responses — 2-4 sentences max unless explaining something complex. Never diagnose. Always recommend a real session for anything serious.`;

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

  const { messages } = JSON.parse(event.body);
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages
  });

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ reply: response.content[0].text })
  };
};
