"use client";

import React, { useState } from "react";
import { Users, X, Send, UserCheck, ShieldAlert } from "lucide-react";
import { useCollaboration } from "@/lib/collaboration-store";
import { cn } from "@/lib/utils";

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  boardName: string;
}

export function CollaborationModal({ isOpen, onClose, boardId, boardName }: CollaborationModalProps) {
  const { sharedList, inviteUser } = useCollaboration();
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitedStatus, setInvitedStatus] = useState(false);

  const boardEmails = sharedList[boardId] || ["creator@nookcanvas.com"];

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) return;

    inviteUser(boardId, inviteEmail);
    setInviteEmail("");
    setInvitedStatus(true);
    setTimeout(() => {
      setInvitedStatus(false);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-[#5F9E77] dark:text-[#90C8A4]" />
            <h2 className="text-sm font-extrabold text-[var(--foreground)] tracking-tight">
              Share & Collaboration
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Board title scope */}
        <div className="text-xs bg-[var(--secondary)]/40 border border-[var(--border)] p-3 rounded-xl mb-4 font-bold text-[var(--foreground)]">
          📍 Collaborating on: <span className="text-[var(--primary)] font-extrabold">{boardName}</span>
        </div>

        {/* Shared collaborators index */}
        <div className="space-y-3 mb-6">
          <h3 className="text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase tracking-wider">
            Who has access
          </h3>
          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
            {boardEmails.map((email) => {
              const isOwner = email === "creator@nookcanvas.com";
              return (
                <div
                  key={email}
                  className="flex items-center justify-between px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs font-semibold"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Avatar Badge */}
                    <div className="w-6.5 h-6.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0 text-[10px] font-extrabold">
                      {email.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="truncate text-[var(--foreground)]">{email}</span>
                  </div>
                  <span className={cn(
                    "text-[8px] font-extrabold px-2 py-0.5 rounded border uppercase shrink-0",
                    isOwner ? "bg-[#E2ECE9] border-[#B2D1C8] text-[#2D5A4E]" : "bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-[var(--muted-foreground)]"
                  )}>
                    {isOwner ? "Owner" : "Editor"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Send invite email form */}
        <form onSubmit={handleInvite} className="space-y-3 border-t border-[var(--border)] pt-4">
          <h3 className="text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase tracking-wider">
            Invite new collaborator
          </h3>
          
          <div className="flex gap-2">
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="collaborator@domain.com"
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] font-semibold"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:opacity-90 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Invite</span>
            </button>
          </div>

          {invitedStatus && (
            <div className="flex items-center gap-1.5 text-[10px] text-[#2D5A4E] font-bold mt-1 bg-[#E2ECE9]/50 px-2.5 py-1 rounded-lg w-fit border border-[#B2D1C8]/60">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Invitation shared! User joining workspace...</span>
            </div>
          )}
        </form>

        <div className="mt-6 pt-3 border-t border-[var(--border)] text-[9px] text-[var(--muted-foreground)] flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Members added gain access to comment and move cards in this specific room.</span>
        </div>
      </div>
    </div>
  );
}
