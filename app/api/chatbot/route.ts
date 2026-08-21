import { getKnowledgeContext, type KnowledgeLanguage } from "@/lib/aiKnowledgeBase";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import Groq from "groq-sdk";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const INJECTION_PATTERNS = [
  "ignore previous",
  "ignore your instructions",
  "ignore your previous",
  "disregard the above",
  "forget your rules",
  "forget your instructions",
  "system prompt",
  "abaikan instruksi",
  "lupakan aturan",
  "anggap kamu adalah",
];

function containsInjection(text: string): boolean {
  const lower = text.toLowerCase();
  return INJECTION_PATTERNS.some((p) => lower.includes(p));
}

function normalizeLanguage(lang: unknown): KnowledgeLanguage {
  return lang === "id" ? "id" : "en";
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!checkRateLimit(`chatbot:${ip}`, { limit: 15, windowMs: 5 * 60 * 1000 })) {
    return Response.json(
      { message: "Too many requests. Please slow down." },
      { status: 429 },
    );
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return Response.json(
      { message: "Groq API key is not configured." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const lang = normalizeLanguage(body.lang);
    const systemPrompt = await getKnowledgeContext(lang);
    const messages = Array.isArray(body.messages)
      ? (body.messages as ChatMessage[])
      : [];
    const userMessage =
      typeof body.userMessage === "string" ? body.userMessage.trim() : "";

    const injectionBlocked =
      containsInjection(userMessage) ||
      messages.some(
        (m) => m.role === "user" && containsInjection(m.content),
      );

    if (injectionBlocked) {
      return Response.json({
        content:
          lang === "id"
            ? "Saya hanya dapat membantu menjawab pertanyaan seputar karya dan proyek Akhyar. Apa yang ingin Anda ketahui?"
            : "I can only help with questions about Akhyar's work and projects. What would you like to know?",
      });
    }

    const safeHistory = messages
      .filter(
        (message) =>
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.trim()
      )
      .slice(-8)
      .map((message) => ({
        role: message.role,
        content: message.content.slice(0, 1000),
      }));

    const finalMessages =
      userMessage && safeHistory[safeHistory.length - 1]?.content !== userMessage
        ? [
            ...safeHistory,
            { role: "user" as const, content: userMessage.slice(0, 1000) },
          ]
        : safeHistory;

    if (
      !finalMessages.length ||
      finalMessages[finalMessages.length - 1].role !== "user"
    ) {
      return Response.json({ message: "Missing user message." }, { status: 400 });
    }

    const groq = new Groq({ apiKey });
    const response = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }, ...finalMessages],
      model: process.env.GROQ_MODEL ?? "openai/gpt-oss-20b",
      max_tokens: 320,
      temperature: 0.7,
    });

    return Response.json({
      content:
        response.choices[0]?.message?.content ??
        "Sorry, I couldn't process that.",
    });
  } catch (error) {
    console.error("Groq API error:", error);
    return Response.json(
      { message: "Sorry, I encountered an error. Please try again." },
      { status: 500 }
    );
  }
}
