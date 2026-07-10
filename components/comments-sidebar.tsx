"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot, Clock } from "lucide-react";
import { useCollaboration } from "@/lib/collaboration-store";
import { cn } from "@/lib/utils";

interface CommentsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  boardId: string;
  taskTitle: string;
}

export function CommentsSidebar({ isOpen, onClose, taskId, boardId, taskTitle }: CommentsSidebarProps) {
  const { comments, addComment, typingUser, triggerTypingIndicator } = useCollaboration();
  const [commentInput, setCommentInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const taskComments = comments[taskId] || [];

  // Scroll to bottom on new comments
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [taskComments, typingUser]);

  // Simulate collaborator typing indicator occasionally when opening sidebar
  useEffect(() => {
    if (isOpen && taskComments.length === 0) {
      setTimeout(() => {
        triggerTypingIndicator(taskId, 2500);
      }, 1000);
    }
  }, [isOpen, taskId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    addComment(boardId, taskId, commentInput);
    setCommentInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 md:w-96 bg-[var(--card)] border-l border-[var(--border)] shadow-2xl z-50 flex flex-col justify-between animate-slide-left select-none">
      
      {/* Header */}
      <div className="h-14 border-b border-[var(--border)] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4.5 h-4.5 text-[#4285F4]" />
          <h2 className="text-xs font-extrabold uppercase text-[var(--foreground)] tracking-wide">
            Task Discussion
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Task title card reference */}
      <div className="px-4 py-3 bg-[var(--secondary)]/30 border-b border-[var(--border)] text-xs font-bold text-[var(--foreground)] shrink-0 line-clamp-2">
        📌 {taskTitle}
      </div>

      {/* Chat scroll area */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
        {taskComments.length === 0 && !typingUser ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10 space-y-2">
            <MessageSquare className="w-10 h-10 text-[var(--primary)]" />
            <p className="text-[10px] font-bold">No comments yet. Start the thread below!</p>
          </div>
        ) : (
          taskComments.map((c) => (
            <div key={c.id} className="flex gap-2.5 items-start">
              {/* Avatar circle */}
              <div className={cn("w-7.5 h-7.5 rounded-xl flex items-center justify-center text-[10px] font-bold shrink-0 border border-[var(--border)] shadow-xs", c.authorColor)}>
                {c.authorName.split(" ").map((n) => n[0]).join("")}
              </div>

              {/* Message body */}
              <div className="flex-1 min-w-0 bg-[var(--background)] border border-[var(--border)] rounded-2xl p-3 shadow-xs">
                <div className="flex items-center justify-between mb-1 text-[9px] font-bold text-[var(--muted-foreground)]">
                  <span>{c.authorName}</span>
                  <span className="flex items-center gap-1 font-medium opacity-85">
                    <Clock className="w-2.5 h-2.5" />
                    {c.timestamp}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[var(--foreground)] leading-relaxed break-words whitespace-pre-wrap">
                  {c.content}
                </p>
              </div>
            </div>
          ))
        )}

        {/* Real-time typing indicators */}
        {typingUser && (
          <div className="flex gap-2.5 items-center pl-1 text-[10px] text-[var(--muted-foreground)] font-bold animate-pulse">
            <div className="flex items-center gap-1 bg-[var(--secondary)] border border-[var(--border)] px-2.5 py-1.5 rounded-full shadow-xs">
              <span className="w-1.5 h-1.5 bg-[#4285F4] rounded-full animate-bounce shrink-0" />
              <span>{typingUser} is typing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Message input footer */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--border)] bg-[var(--secondary)]/20 shrink-0">
        <div className="flex gap-2 bg-[var(--card)] border border-[var(--border)] rounded-xl p-1.5 shadow-xs">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Type a collaborative reply..."
            className="flex-1 bg-transparent px-2.5 text-xs focus:outline-none text-[var(--foreground)] placeholder-[var(--muted-foreground)] font-semibold"
          />
          <button
            type="submit"
            className="w-8 h-8 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center hover:opacity-90 shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
