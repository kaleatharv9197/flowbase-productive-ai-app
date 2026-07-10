"use client";

import React, { useState } from "react";
import { Sparkles, Send, Bot, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hello! I am your CozyAI workspace companion. ☕ How can I assist you in building or formatting your spaces today?",
      timestamp: "10:30 AM"
    },
    {
      id: "2",
      sender: "user",
      text: "Help me structure a new project timeline for the Nook & Canvas app.",
      timestamp: "10:31 AM"
    },
    {
      id: "3",
      sender: "ai",
      text: "I recommend a Kanban template with 4 columns: Backlog 📌, Designing 🎨, Development 🚀, and Completed ✅. Should I scaffold this board for you?",
      timestamp: "10:31 AM"
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `✨ I've logged that request: "${input}". Since we are in Cozy Workspace mode, I can help you compile notes or generate structured Miro whiteboard cards based on this!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 md:p-6 justify-between">
      {/* Header */}
      <header className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
        <Link href="/" className="p-2 rounded-xl hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer md:hidden">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="w-9 h-9 rounded-xl bg-[#F0EBF8] text-[#8E75C4] dark:bg-[#2C213D] dark:text-[#B49FE6] flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)]">CozyAI Assistant</h1>
          <p className="text-xs text-[var(--muted-foreground)]">Your creative companion for templates, specs, and flows.</p>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center ${
              msg.sender === "ai"
                ? "bg-[#F0EBF8] text-[#8E75C4] dark:bg-[#2C213D] dark:text-[#B49FE6]"
                : "bg-[var(--primary)]/15 text-[var(--primary)] dark:bg-[var(--foreground)]/10 dark:text-[var(--foreground)]"
            }`}>
              {msg.sender === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div className={`p-3.5 rounded-2xl text-sm leading-relaxed border ${
              msg.sender === "user"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] rounded-tr-none"
                : "bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] rounded-tl-none"
            }`}>
              <p className="break-words font-medium">{msg.text}</p>
              <span className={`block text-[10px] mt-1.5 text-right ${
                msg.sender === "user" ? "text-[var(--primary-foreground)]/70" : "text-[var(--muted-foreground)]"
              }`}>
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <form onSubmit={handleSend} className="flex gap-2 p-2 border border-[var(--border)] bg-[var(--card)] rounded-2xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask CozyAI to outline details, generate cards, format tables..."
          className="flex-1 bg-transparent px-3 text-sm focus:outline-none text-[var(--foreground)] placeholder-[var(--muted-foreground)]"
        />
        <button
          type="submit"
          className="w-9 h-9 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center hover:opacity-90 shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
