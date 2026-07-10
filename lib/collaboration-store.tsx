"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
  isActive: boolean;
  activeBoardId: string | null;
}

export interface TaskComment {
  id: string;
  taskId: string;
  boardId: string;
  authorName: string;
  authorEmail: string;
  authorColor: string;
  content: string;
  timestamp: string;
}

interface CollaborationContextType {
  collaborators: Collaborator[];
  sharedList: Record<string, string[]>; // boardId -> list of emails
  comments: Record<string, TaskComment[]>; // taskId -> list of comments
  typingUser: string | null; // Name of collaborator currently typing
  inviteUser: (boardId: string, email: string) => void;
  addComment: (boardId: string, taskId: string, content: string) => void;
  getCommentCount: (taskId: string) => number;
  triggerTypingIndicator: (taskId: string, durationMs?: number) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

const initialCollaborators: Collaborator[] = [
  { id: "c1", name: "Oliver Plum", email: "oliver@nookcanvas.com", avatarColor: "bg-[#E07A5F] text-[#FFFFFF]", isActive: true, activeBoardId: "b1" },
  { id: "c2", name: "Hazel Nut", email: "hazel@nookcanvas.com", avatarColor: "bg-[#4A7C70] text-[#FFFFFF]", isActive: true, activeBoardId: "b1" },
  { id: "c3", name: "Sienna Wood", email: "sienna@nookcanvas.com", avatarColor: "bg-[#8E75C4] text-[#FFFFFF]", isActive: false, activeBoardId: null }
];

const initialSharing: Record<string, string[]> = {
  b1: ["creator@nookcanvas.com", "oliver@nookcanvas.com", "hazel@nookcanvas.com"],
  b2: ["creator@nookcanvas.com"]
};

const initialComments: Record<string, TaskComment[]> = {
  t1: [
    {
      id: "cm1",
      taskId: "t1",
      boardId: "b1",
      authorName: "Oliver Plum",
      authorEmail: "oliver@nookcanvas.com",
      authorColor: "bg-[#E07A5F] text-[#FFFFFF]",
      content: "This matches the guidelines perfectly. Should we add dark mode equivalent values?",
      timestamp: "10:35 AM"
    },
    {
      id: "cm2",
      taskId: "t1",
      boardId: "b1",
      authorName: "Hazel Nut",
      authorEmail: "hazel@nookcanvas.com",
      authorColor: "bg-[#4A7C70] text-[#FFFFFF]",
      content: "Yes! Already updated the colors in app/globals.css.",
      timestamp: "10:38 AM"
    }
  ]
};

export function CollaborationProvider({ children }: { children: React.ReactNode }) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(initialCollaborators);
  const [sharedList, setSharedList] = useState<Record<string, string[]>>(initialSharing);
  const [comments, setComments] = useState<Record<string, TaskComment[]>>(initialComments);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  // Invite user logic
  const inviteUser = (boardId: string, email: string) => {
    if (!email.trim() || !email.includes("@")) return;

    setSharedList((prev) => {
      const currentList = prev[boardId] || ["creator@nookcanvas.com"];
      if (currentList.includes(email)) return prev;
      return {
        ...prev,
        [boardId]: [...currentList, email]
      };
    });

    // Simulate collaborator joining the active space after invite
    const name = email.split("@")[0].replace(/[._-]/g, " ");
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    setTimeout(() => {
      const newCollab: Collaborator = {
        id: `sim-${Date.now()}`,
        name: formattedName,
        email: email,
        avatarColor: "bg-[#D8A035] text-[#FFFFFF]",
        isActive: true,
        activeBoardId: boardId
      };
      setCollaborators((prevCols) => [...prevCols, newCollab]);
    }, 1500);
  };

  // Add task comments
  const addComment = (boardId: string, taskId: string, content: string) => {
    if (!content.trim()) return;

    const newComment: TaskComment = {
      id: `cmsg-${Date.now()}`,
      taskId,
      boardId,
      authorName: "Atharv Creator",
      authorEmail: "kaleatharv@gmail.com",
      authorColor: "bg-[var(--primary)] text-[var(--primary-foreground)]",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setComments((prev) => {
      const currentTaskComments = prev[taskId] || [];
      return {
        ...prev,
        [taskId]: [...currentTaskComments, newComment]
      };
    });

    // Cozy Simulator real-time responses to make it feel alive!
    simulateCollaboratorReply(boardId, taskId);
  };

  const simulateCollaboratorReply = (boardId: string, taskId: string) => {
    // Select a random collaborator who is active on this board
    const activePartners = collaborators.filter(c => c.isActive && c.id !== "c1" && c.id !== "c2");
    const replier = activePartners.length > 0
      ? activePartners[Math.floor(Math.random() * activePartners.length)]
      : collaborators[Math.floor(Math.random() * 2)]; // Fallback to Oliver or Hazel

    // 1. Trigger typing indicator
    setTimeout(() => {
      setTypingUser(replier.name);
    }, 1200);

    // 2. Add reply comment and clear typing indicator
    setTimeout(() => {
      setTypingUser(null);
      const responses = [
        "That looks solid! Let me test that drag-and-drop locally.",
        "Perfect, let's review this in tomorrow's standup. ☕",
        "Looks great, I'll follow up on this check soon.",
        "Nice outline! Can we make sure the borders align on mobile screens?",
        "Awesome work, let's tag the marketing team on this spec."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const partnerComment: TaskComment = {
        id: `simmsg-${Date.now()}`,
        taskId,
        boardId,
        authorName: replier.name,
        authorEmail: replier.email,
        authorColor: replier.avatarColor,
        content: partnerCommentPrefix(taskId) + randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setComments((prev) => {
        const currentTaskComments = prev[taskId] || [];
        return {
          ...prev,
          [taskId]: [...currentTaskComments, partnerComment]
        };
      });
    }, 3800);
  };

  const partnerCommentPrefix = (taskId: string) => {
    return taskId === "t1" ? "💡 " : "📝 ";
  };

  const triggerTypingIndicator = (taskId: string, durationMs = 2000) => {
    const activePartners = collaborators.filter(c => c.isActive);
    if (activePartners.length === 0) return;
    const partner = activePartners[Math.floor(Math.random() * activePartners.length)];

    setTypingUser(partner.name);
    setTimeout(() => {
      setTypingUser(null);
    }, durationMs);
  };

  const getCommentCount = (taskId: string) => {
    return (comments[taskId] || []).length;
  };

  // Simulate collaborators joining/leaving randomly to enhance high-fidelity test experience
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators((prev) =>
        prev.map((c) => {
          // Toggle Sienna active state
          if (c.id === "c3") {
            const nextActive = !c.isActive;
            return {
              ...c,
              isActive: nextActive,
              activeBoardId: nextActive ? "b1" : null
            };
          }
          return c;
        })
      );
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  return (
    <CollaborationContext.Provider
      value={{
        collaborators,
        sharedList,
        comments,
        typingUser,
        inviteUser,
        addComment,
        getCommentCount,
        triggerTypingIndicator
      }}
    >
      {children}
    </CollaborationContext.Provider>
  );
}

export function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error("useCollaboration must be used within a CollaborationProvider");
  }
  return context;
}
