"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageProvider";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function getWelcomeMessage(lang: "en" | "id"): Message {
  return {
    id: "welcome",
    role: "assistant",
    content:
      lang === "id"
        ? "Hai! Aku asisten portfolio Akhyar. Tanya apa saja tentang project, skill, atau pengalamannya."
        : "Hey! I'm Akhyar's portfolio assistant. Ask me anything about his projects, skills, or experience.",
  };
}

export default function Chatbot() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    getWelcomeMessage(lang),
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([getWelcomeMessage(lang)]);
  }, [lang]);

  useEffect(() => {
    const handleScroll = () => {
      setShowChat(window.scrollY > window.innerHeight * 0.5);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async () => {
    const content = input.trim();
    if (!content || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({
            role,
            content,
          })),
          userMessage: content,
          lang,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Chatbot request failed");

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.content || "Sorry, I couldn't process that.",
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!showChat) return null;

  return (
    <div className="relative flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.22 }}
            className="absolute bottom-full right-0 mb-3
                       flex h-[60vh] sm:h-[28rem]
                       w-[calc(100vw-2rem)] sm:w-[28rem]
                       flex-col overflow-hidden rounded-2xl
                       border border-[#61DCA3]/70
                       bg-[#0B0F15]/95 shadow-2xl shadow-black/50 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-black/10 bg-[#61DCA3] px-4 py-3 text-black ">
              <div>
                <h3 className="text-sm font-bold">Akhyar's Assistant</h3>
                <p className="text-xs font-medium text-black/70">
                  Projects, skills, and experience
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
                className="rounded-lg p-1.5 transition hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-black/30"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "rounded-br-sm bg-[#61DCA3] text-black"
                        : "rounded-bl-sm bg-white/10 text-gray-100"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-white/10 px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#61DCA3]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#61DCA3] [animation-delay:120ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#61DCA3] [animation-delay:240ms]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 border-t border-white/10 bg-black/20 p-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask about Akhyar..."
                disabled={loading}
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-[#61DCA3] disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#61DCA3] text-black transition hover:bg-[#50c894] focus:outline-none focus:ring-2 focus:ring-[#61DCA3]/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
        className={`flex h-12 w-12 items-center justify-center rounded-2xl
                    shadow-lg transition-all duration-200 cursor-pointer
                    ${isOpen
                      ? "bg-white/8 text-white border border-white/10 hover:bg-white/12"
                      : "bg-[#61DCA3] text-[#0B0F15] shadow-[0_4px_20px_rgba(97,220,163,0.4)] hover:shadow-[0_4px_28px_rgba(97,220,163,0.6)] hover:bg-[#4ecf96]"
                    }`}
      >
        {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
      </motion.button>
    </div>
  );
}
