"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Pin,
  Copy,
  Edit2,
  X,
  ChevronRight,
  Sparkles,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  RefreshCw,
  FolderOpen,
  ArrowLeft,
  Check,
  MoreVertical,
  Undo,
  Mic
} from "lucide-react";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useAssemblyAIStreaming } from "@/lib/hooks/useAssemblyAIStreaming";
import { cn } from "@/lib/utils";

interface CozyNote {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  color: "sage" | "coral" | "lavender" | "honey" | "blue";
  isPinned: boolean;
  isDeleted: boolean;
  icon: string;
}

const noteColors: Record<
  "sage" | "coral" | "lavender" | "honey" | "blue",
  { bg: string; text: string; dot: string; hoverBg: string; border: string }
> = {
  sage: { bg: "bg-[#E2ECE9] dark:bg-[#1D322B]", text: "text-[#2D5A4E] dark:text-[#91C8BA]", dot: "bg-[#4A7C70]", hoverBg: "hover:bg-[#D2DDD9] dark:hover:bg-[#253D35]", border: "border-[#B2D1C8] dark:border-[#2C4D43]" },
  coral: { bg: "bg-[#FCECE7] dark:bg-[#341F1A]", text: "text-[#B34B2E] dark:text-[#F19F88]", dot: "bg-[#E07A5F]", hoverBg: "hover:bg-[#F7DBD0] dark:hover:bg-[#432922]", border: "border-[#F5C7BA] dark:border-[#52312A]" },
  lavender: { bg: "bg-[#F0EBF8] dark:bg-[#251D33]", text: "text-[#62479B] dark:text-[#BFABEC]", dot: "bg-[#8E75C4]", hoverBg: "hover:bg-[#E3DAF2] dark:hover:bg-[#322744]", border: "border-[#DCD0F0] dark:border-[#42345C]" },
  honey: { bg: "bg-[#FBF3DB] dark:bg-[#332814]", text: "text-[#8E640B] dark:text-[#E9C37A]", dot: "bg-[#D8A035]", hoverBg: "hover:bg-[#F3E3B9] dark:hover:bg-[#40331D]", border: "border-[#F2DEB1] dark:border-[#544329]" },
  blue: { bg: "bg-[#E8F0FE] dark:bg-[#17243B]", text: "text-[#1C54B2] dark:text-[#92B8F8]", dot: "bg-[#4285F4]", hoverBg: "hover:bg-[#D5E4FC] dark:hover:bg-[#202E4C]", border: "border-[#B7D2FC] dark:border-[#293E62]" }
};

const defaultNotes: CozyNote[] = [
  {
    id: "n1",
    title: "📝 Notion-Miro Hybrid Architecture Spec",
    content: `<h1>Product Specifications</h1><p>We are creating a workspace that leverages the structural organization of <strong>Notion</strong> with the visual canvas flexibilities of <strong>Miro</strong>. Here are the core pillars:</p><ul><li><strong>Sidebar Navigation</strong>: Collapsible, grouped workspace, color indicators.</li><li><strong>Kanban Boards</strong>: Multiple boards, custom columns, tasks containing priorities, tags, and calendar sync.</li><li><strong>Notion Notes Page</strong>: Rich text blocks, floating bubble menus, slash command converters, and AI refinement.</li><li><strong>Whiteboard Drafts</strong>: Visual canvasses for brainstorming.</li></ul><blockquote>This Spec defines our MVP milestone requirements.</blockquote>`,
    updatedAt: "10:15 AM",
    color: "coral",
    isPinned: true,
    isDeleted: false,
    icon: "🚀"
  },
  {
    id: "n2",
    title: "🍵 Coffee Recipes & Caramel Specifications",
    content: `<h2>Seasonal Coffee Specifications</h2><p>Seasonal beverages require warm, inviting profiles. List of ingredients:</p><ol><li>Double Espresso Shot (Medium roast)</li><li>Steamed Whole Milk (Microfoam)</li><li>House Caramel Syrup (warm syrup bottles)</li></ol><pre><code>// Brew config
const BrewTemp = 93.5; // Celsius
const BrewPressure = 9; // bar
</code></pre>`,
    updatedAt: "Yesterday",
    color: "sage",
    isPinned: false,
    isDeleted: false,
    icon: "☕"
  }
];

export default function NotesWorkspace() {
  const [notes, setNotes] = useState<CozyNote[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nook-notes");
      if (saved) return JSON.parse(saved);
    }
    return defaultNotes;
  });

  // Sync notes to localStorage
  useEffect(() => {
    localStorage.setItem("nook-notes", JSON.stringify(notes));
  }, [notes]);
  const [activeNoteId, setActiveNoteId] = useState("n1");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Slash commands popup states
  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState(false);
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });

  // AI Refine loading states
  const [isAiRefining, setIsAiRefining] = useState(false);
  const [aiRefineMenuOpen, setAiRefineMenuOpen] = useState(false);

  // Active note helper
  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === activeNoteId && !n.isDeleted) || notes.find((n) => !n.isDeleted) || null;
  }, [notes, activeNoteId]);

  // Set activeNoteId fallback if activeNote changes
  useEffect(() => {
    if (activeNote && activeNote.id !== activeNoteId) {
      setActiveNoteId(activeNote.id);
    }
  }, [activeNote]);

  // AssemblyAI Voice Streaming Hook
  const { isRecording, partialTranscript, error: voiceError, startRecording, stopRecording } = useAssemblyAIStreaming({
    onFinalTranscript: (text) => {
      if (editor) {
        editor.commands.insertContent(text);
      }
    }
  });

  // Initialize Tiptap
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Placeholder.configure({
        placeholder: "Press '/' for commands...",
      }),
    ],
    content: activeNote ? activeNote.content : "",
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[480px] leading-relaxed max-w-full font-sans text-xs md:text-sm text-[var(--foreground)]",
      },
    },
    onUpdate: ({ editor }) => {
      // Auto-save trigger
      setIsSaving(true);
      const html = editor.getHTML();
      
      setNotes((prevNotes) =>
        prevNotes.map((n) =>
          n.id === activeNoteId ? { ...n, content: html, updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : n
        )
      );

      setTimeout(() => {
        setIsSaving(false);
      }, 750);

      // Check slash commands trigger
      const { selection } = editor.state;
      const { $from } = selection;
      const currentBlockText = $from.parent.textContent || "";
      const cursorOffset = $from.parentOffset;
      const textBeforeCursor = currentBlockText.slice(0, cursorOffset);

      if (textBeforeCursor.endsWith("/")) {
        setIsSlashMenuOpen(true);
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0).cloneRange();
          const rect = range.getBoundingClientRect();
          const container = document.getElementById("tiptap-editor-container");
          if (container) {
            const containerRect = container.getBoundingClientRect();
            setSlashMenuPos({
              top: rect.bottom - containerRect.top + container.scrollTop + 8,
              left: Math.max(8, rect.left - containerRect.left)
            });
          }
        }
      } else {
        setIsSlashMenuOpen(false);
      }
    },
  });

  // Switch notes in editor
  useEffect(() => {
    if (editor && activeNote) {
      if (editor.getHTML() !== activeNote.content) {
        editor.commands.setContent(activeNote.content);
      }
    }
  }, [activeNoteId, editor]);

  // Sync title changes
  const handleTitleChange = (newTitle: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((n) =>
        n.id === activeNoteId ? { ...n, title: newTitle, updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : n
      )
    );
  };

  // Create Note
  const handleCreateNote = () => {
    const newNote: CozyNote = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "<p></p>",
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: "sage",
      isPinned: false,
      isDeleted: false,
      icon: "📄"
    };

    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  // Duplicate Note
  const handleDuplicateNote = (note: CozyNote) => {
    const copyNote: CozyNote = {
      ...note,
      id: Date.now().toString(),
      title: `${note.title} (Copy)`,
      isPinned: false,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotes([copyNote, ...notes]);
  };

  // Delete Note (move to trash)
  const handleDeleteNote = (noteId: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((n) => (n.id === noteId ? { ...n, isDeleted: true } : n))
    );
  };

  // Toggle Pinned
  const handleTogglePin = (noteId: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((n) => (n.id === noteId ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  // Change Note color
  const handleChangeColor = (noteId: string, col: "sage" | "coral" | "lavender" | "honey" | "blue") => {
    setNotes((prevNotes) =>
      prevNotes.map((n) => (n.id === noteId ? { ...n, color: col } : n))
    );
  };

  // Trash restoration/deletion
  const handleRestoreNote = (noteId: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((n) => (n.id === noteId ? { ...n, isDeleted: false } : n))
    );
  };

  const handlePermanentDelete = (noteId: string) => {
    if (!confirm("Delete note permanently? This action cannot be undone.")) return;
    setNotes((prevNotes) => prevNotes.filter((n) => n.id !== noteId));
  };

  // Slash commands block changer
  const handleApplySlashBlock = (command: string) => {
    if (!editor) return;
    const { selection } = editor.state;
    const { $from } = selection;

    // Delete the "/" typed
    editor.commands.deleteRange({ from: $from.pos - 1, to: $from.pos });

    // Apply formatting block
    if (command === "h1") {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    } else if (command === "h2") {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    } else if (command === "h3") {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    } else if (command === "bullet") {
      editor.chain().focus().toggleBulletList().run();
    } else if (command === "number") {
      editor.chain().focus().toggleOrderedList().run();
    } else if (command === "quote") {
      editor.chain().focus().toggleBlockquote().run();
    } else if (command === "code") {
      editor.chain().focus().toggleCodeBlock().run();
    }

    setIsSlashMenuOpen(false);
  };

  // AI Selection Refiner Simulation
  const handleAiRefineSelection = (option: string) => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");
    if (!selectedText.trim()) return;

    setIsAiRefining(true);
    setAiRefineMenuOpen(false);

    // Simulate AI thinking and rewriting
    setTimeout(() => {
      let refined = selectedText;
      if (option === "grammar") {
        refined = selectedText.charAt(0).toUpperCase() + selectedText.slice(1) + ".";
      } else if (option === "rephrase") {
        refined = `In other words, ${selectedText.toLowerCase().replace(/[.!?]/g, "")}, which enhances our overall workflow.`;
      } else if (option === "shorter") {
        refined = `${selectedText.split(" ").slice(0, Math.ceil(selectedText.split(" ").length / 2)).join(" ")}...`;
      } else if (option === "longer") {
        refined = `${selectedText} Additionally, this is critical because it ensures robust, clean, and collaborative productivity standards for all team members.`;
      } else if (option === "simplify") {
        refined = `Simply put, ${selectedText.toLowerCase()}`;
      } else if (option === "tone") {
        refined = `✨ Warm welcome! ${selectedText} We hope this cozy space sparks joy and inspires collaborative writing! ☕`;
      }

      editor.chain().focus().insertContentAt({ from, to }, refined).run();
      setIsAiRefining(false);
    }, 1800);
  };

  // Filter notes based on query
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase());
      return !n.isDeleted && matchesSearch;
    });
  }, [notes, searchQuery]);

  const pinnedNotes = useMemo(() => filteredNotes.filter((n) => n.isPinned), [filteredNotes]);
  const unpinnedNotes = useMemo(() => filteredNotes.filter((n) => !n.isPinned), [filteredNotes]);
  const deletedNotes = useMemo(() => notes.filter((n) => n.isDeleted), [notes]);

  const wordCount = useMemo(() => {
    if (!editor) return 0;
    const text = editor.getText();
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }, [editor?.getText()]);

  return (
    <div className="flex h-screen overflow-hidden font-sans text-[var(--foreground)] bg-[var(--background)] select-none">
      
      {/* CSS overrides for Tiptap Notion rendering */}
      <style>{`
        .ProseMirror:focus {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--muted-foreground);
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1 {
          font-size: 1.5rem;
          font-weight: 800;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: var(--foreground);
        }
        .ProseMirror h2 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-top: 1.25rem;
          margin-bottom: 0.4rem;
          color: var(--foreground);
        }
        .ProseMirror h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.3rem;
          color: var(--foreground);
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.25rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror blockquote {
          border-left: 3px solid var(--primary);
          padding-left: 1rem;
          font-style: italic;
          color: var(--muted-foreground);
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .ProseMirror pre {
          background-color: var(--secondary);
          border: 1px solid var(--border);
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-family: monospace;
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
          overflow-x: auto;
          font-size: 0.85em;
        }
      `}</style>

      {/* Left side notes listing panel */}
      <aside className="w-64 bg-[var(--card)] flex flex-col justify-between hidden sm:flex shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.015)]">
        <div className="flex-1 flex flex-col min-h-0">
          
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-4 shrink-0">
            <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase">Note Directory</span>
            <button
              onClick={handleCreateNote}
              className="p-1 rounded-md border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              title="New Note"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar */}
          <div className="p-3 shrink-0">
            <div className="flex items-center gap-2 bg-[var(--background)] border border-[var(--border)] rounded-xl px-2.5 py-1.5 shadow-xs">
              <Search className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes content..."
                className="bg-transparent text-xs w-full focus:outline-none placeholder-[var(--muted-foreground)] text-[var(--foreground)] font-semibold"
              />
            </div>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-4">
            
            {/* Pinned section */}
            {pinnedNotes.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase px-2 tracking-wider">
                  Pinned
                </span>
                {pinnedNotes.map((note) => renderNoteCard(note))}
              </div>
            )}

            {/* General list */}
            <div className="space-y-1">
              {pinnedNotes.length > 0 && unpinnedNotes.length > 0 && (
                <span className="text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase px-2 tracking-wider">
                  Notes
                </span>
              )}
              {unpinnedNotes.map((note) => renderNoteCard(note))}
              
              {filteredNotes.length === 0 && (
                <div className="text-center py-8 opacity-45">
                  <p className="text-[10px] font-bold">No notes found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Trash panel drawer trigger */}
        <div className="p-2.5 shrink-0">
          <button
            onClick={() => setIsTrashOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[#D36A73] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5" />
              <span>Trash Bin</span>
            </div>
            {deletedNotes.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#F9EAEB] border border-[#F5C7BA] text-[#D36A73] text-[9px] font-bold">
                {deletedNotes.length}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Right side Rich text editor panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--background)] overflow-hidden">
        {activeNote ? (
          <div className="flex-1 flex flex-col min-h-0 relative">
            
            {/* Editor Topbar Toolbar Info */}
            <header className="h-14 bg-transparent px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Link href="/" className="p-2 rounded-xl hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer sm:hidden">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                
                {/* Note metadata indicators */}
                <div className="flex items-center gap-2">
                  <span className={cn("w-2.5 h-2.5 rounded-full", noteColors[activeNote.color].dot)} />
                  <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase">
                    Updated {activeNote.updatedAt}
                  </span>
                </div>
              </div>

              {/* Saved & word count badge indicators */}
              <div className="flex items-center gap-3">
                {/* Voice speech to text controller */}
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-[10px] font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs select-none",
                    isRecording
                      ? "bg-[#F9EAEB] border-[#F5C7BA] text-[#D36A73] animate-pulse shadow-[0_0_8px_rgba(211,106,115,0.3)]"
                      : "bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
                  )}
                  title={isRecording ? "Stop Recording" : "Speak to Note"}
                >
                  <Mic className={cn("w-3.5 h-3.5", isRecording ? "text-[#D36A73] animate-pulse" : "text-[var(--primary)]")} />
                  <span>{isRecording ? "Listening..." : "Speak to Note"}</span>
                </button>

                <div className="text-[10px] font-extrabold text-[var(--muted-foreground)] bg-[var(--secondary)] border border-[var(--border)] px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 select-none shadow-xs">
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin text-[var(--primary)]" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3 h-3 text-[#5F9E77]" />
                      <span>Saved</span>
                    </>
                  )}
                </div>

                <div className="text-[10px] font-extrabold text-[var(--muted-foreground)] bg-[var(--card)] border border-[var(--border)] px-2.5 py-1.5 rounded-lg select-none shadow-xs">
                  {wordCount} Words
                </div>
              </div>
            </header>

            {/* Note Title Input at the top of writing workspace */}
            <div className="px-6 md:px-12 pt-6 pb-2 bg-[var(--background)] shrink-0">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full text-lg md:text-2xl font-extrabold text-[var(--foreground)] placeholder-[var(--muted-foreground)] bg-transparent border-none outline-none tracking-tight py-2 font-sans"
                placeholder="Untitled note..."
              />
            </div>

            {/* Tiptap content box */}
            <div
              id="tiptap-editor-container"
              className="flex-1 px-6 md:px-12 pb-16 overflow-y-auto relative bg-[var(--background)]"
            >
              <EditorContent editor={editor} className="outline-none" />

              {/* Real-time partial transcript preview floating overlay */}
              {isRecording && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[var(--card)] border border-[var(--border)] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3.5 max-w-md w-[calc(100%-2rem)] z-30 select-none border-dashed border-[#D36A73]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D36A73] animate-ping shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase block mb-0.5">
                      Voice Streaming Preview
                    </span>
                    <p className="text-xs font-semibold text-[var(--foreground)] leading-normal truncate italic">
                      {partialTranscript || "Start speaking, matching text will stream in..."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="text-[10px] font-extrabold text-[#D36A73] hover:underline shrink-0"
                  >
                    Stop
                  </button>
                </div>
              )}

              {/* Tiptap Floating Bubble Menu */}
              {editor && (
                <BubbleMenu
                  editor={editor}
                  className="bg-[var(--card)] border border-[var(--border)] shadow-xl p-1.5 rounded-xl flex items-center gap-1 z-40 select-none"
                >
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={cn(
                      "p-1.5 rounded hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer",
                      editor.isActive("bold") && "bg-[var(--secondary)] text-[var(--foreground)]"
                    )}
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={cn(
                      "p-1.5 rounded hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer",
                      editor.isActive("italic") && "bg-[var(--secondary)] text-[var(--foreground)]"
                    )}
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={cn(
                      "p-1.5 rounded hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer",
                      editor.isActive("strike") && "bg-[var(--secondary)] text-[var(--foreground)]"
                    )}
                  >
                    <Strikethrough className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={cn(
                      "p-1.5 rounded hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer",
                      editor.isActive("code") && "bg-[var(--secondary)] text-[var(--foreground)]"
                    )}
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>

                  <div className="w-px h-5 bg-[var(--border)] mx-1" />

                  {/* AI Refine button */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAiRefineMenuOpen(!aiRefineMenuOpen);
                      }}
                      className="px-2.5 py-1 rounded bg-[var(--primary)] text-[var(--primary-foreground)] text-[10px] font-extrabold flex items-center gap-1.5 hover:opacity-90 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      <span>AI Refine</span>
                    </button>

                    {aiRefineMenuOpen && (
                      <div className="absolute left-0 bottom-full mb-2 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-xl w-44 p-1 z-50 py-1.5">
                        <span className="block text-[8px] font-extrabold text-[var(--muted-foreground)] uppercase px-2.5 py-1 tracking-wider border-b border-[var(--border)] mb-1">
                          Refine selection
                        </span>
                        {[
                          { id: "grammar", label: "Improve grammar" },
                          { id: "rephrase", label: "Rephrase text" },
                          { id: "shorter", label: "Make shorter" },
                          { id: "longer", label: "Make longer" },
                          { id: "simplify", label: "Simplify language" },
                          { id: "tone", label: "Cozy tone" }
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => handleAiRefineSelection(opt.id)}
                            className="w-full text-left px-2.5 py-1.5 text-[10px] font-semibold text-[var(--foreground)] hover:bg-[var(--secondary)] rounded-lg transition-colors cursor-pointer"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </BubbleMenu>
              )}

              {/* Slash Command Block Popup Menu */}
              {isSlashMenuOpen && (
                <div
                  style={{ top: slashMenuPos.top, left: slashMenuPos.left }}
                  className="absolute bg-[var(--card)] border border-[var(--border)] shadow-xl p-1.5 rounded-xl w-52 z-50 max-h-72 overflow-y-auto select-none"
                >
                  <span className="block text-[8px] font-extrabold text-[var(--muted-foreground)] uppercase px-2 py-1.5 tracking-wider border-b border-[var(--border)] mb-1.5">
                    Block Commands
                  </span>
                  {[
                    { id: "h1", label: "Heading 1", icon: Heading1, desc: "Large page header" },
                    { id: "h2", label: "Heading 2", icon: Heading2, desc: "Medium section header" },
                    { id: "h3", label: "Heading 3", icon: Heading3, desc: "Small sub-section" },
                    { id: "bullet", label: "Bullet list", icon: List, desc: "Simple bullet items" },
                    { id: "number", label: "Numbered list", icon: ListOrdered, desc: "Sequential ordering" },
                    { id: "quote", label: "Blockquote", icon: Quote, desc: "Emphasize key block" },
                    { id: "code", label: "Code Block", icon: Code, desc: "Raw code console panel" }
                  ].map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => handleApplySlashBlock(cmd.id)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-lg hover:bg-[var(--secondary)] transition-colors cursor-pointer"
                    >
                      <div className="w-6.5 h-6.5 rounded-lg border border-[var(--border)] flex items-center justify-center bg-[var(--background)] shrink-0">
                        <cmd.icon className="w-3.5 h-3.5 text-[var(--primary)]" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-[var(--foreground)]">{cmd.label}</div>
                        <div className="text-[8px] text-[var(--muted-foreground)] truncate">{cmd.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Global AI Refinement Loading Overlay */}
            {isAiRefining && (
              <div className="absolute inset-0 bg-white/40 dark:bg-black/35 backdrop-blur-xs flex items-center justify-center z-50">
                <div className="bg-[var(--card)] border border-[var(--border)] px-5 py-4.5 rounded-2xl flex items-center gap-3 shadow-xl max-w-xs select-none">
                  <Sparkles className="w-5 h-5 text-amber-500 animate-bounce" />
                  <div className="text-xs">
                    <span className="font-extrabold text-[var(--foreground)] block">AI Refinement Active</span>
                    <span className="text-[10px] text-[var(--muted-foreground)] block">Drafting cozy writing updates...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <FolderOpen className="w-12 h-12 text-[var(--primary)] opacity-40 mb-3" />
            <h2 className="text-sm font-extrabold text-[var(--foreground)] mb-1">No Active Notes</h2>
            <p className="text-xs text-[var(--muted-foreground)] max-w-xs mb-4">
              Create a new note page from the directory sidebar to start your Notion writing spec.
            </p>
            <button
              onClick={handleCreateNote}
              className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Note</span>
            </button>
          </div>
        )}
      </div>

      {/* Trash Bin Modal Overlay */}
      {isTrashOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-scale-up select-none">
            <div className="flex items-center justify-between pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4.5 h-4.5 text-[#D36A73]" />
                <h2 className="text-sm font-extrabold text-[var(--foreground)] tracking-tight">Trash Bin</h2>
              </div>
              <button
                onClick={() => setIsTrashOpen(false)}
                className="p-1 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto mb-5 pr-1">
              {deletedNotes.length === 0 ? (
                <div className="text-center py-10 opacity-40">
                  <p className="text-xs font-bold">Trash is empty</p>
                </div>
              ) : (
                deletedNotes.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[var(--secondary)]/40 hover:bg-[var(--secondary)]/70 transition-all"
                  >
                    <div className="min-w-0 flex-1 mr-4">
                      <div className="text-xs font-bold text-[var(--foreground)] truncate flex items-center gap-1.5">
                        <span className={cn("w-2 h-2 rounded-full shrink-0", noteColors[n.color].dot)} />
                        <span>{n.title}</span>
                      </div>
                      <span className="text-[9px] text-[var(--muted-foreground)] block mt-0.5 font-semibold">
                        Deleted {n.updatedAt}
                      </span>
                    </div>

                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleRestoreNote(n.id)}
                        className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[#E2ECE9] text-[var(--muted-foreground)] hover:text-[#2D5A4E] transition-colors cursor-pointer"
                        title="Restore Note"
                      >
                        <Undo className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handlePermanentDelete(n.id)}
                        className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[#F9EAEB] text-[var(--muted-foreground)] hover:text-[#D36A73] transition-colors cursor-pointer"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-[var(--border)]">
              <button
                onClick={() => setIsTrashOpen(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted-foreground)] hover:bg-[var(--secondary)] transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Note directory list card builder helper
  function renderNoteCard(note: CozyNote) {
    const isSelected = note.id === activeNoteId;
    const style = noteColors[note.color];
    return (
      <div
        key={note.id}
        onClick={() => setActiveNoteId(note.id)}
        className={cn(
          "w-full flex items-center justify-between gap-1.5 px-3 py-2.5 rounded-2xl cursor-pointer transition-all group relative",
          isSelected
            ? cn(style.bg, style.text, "shadow-xs")
            : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/40 hover:text-[var(--foreground)]"
        )}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xs shrink-0 select-none leading-none">
            {note.icon}
          </span>
          
          <div className="min-w-0 flex-1 leading-normal">
            <div className="text-xs font-bold truncate pr-1">
              {note.title}
            </div>
            <div className="text-[9px] text-[var(--muted-foreground)] font-semibold mt-0.5">
              {note.updatedAt}
            </div>
          </div>
        </div>

        {/* Note Card controls list */}
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          
          {/* Favorite pin trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTogglePin(note.id);
            }}
            className={cn(
              "p-1 rounded hover:bg-[var(--background)] cursor-pointer text-[var(--muted-foreground)]",
              note.isPinned && "text-amber-500 hover:text-amber-600"
            )}
            title={note.isPinned ? "Unpin Note" : "Pin Note"}
          >
            <Pin className={cn("w-3 h-3", note.isPinned && "fill-amber-500")} />
          </button>

          {/* Copy duplication trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDuplicateNote(note);
            }}
            className="p-1 rounded hover:bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
            title="Duplicate Note"
          >
            <Copy className="w-3 h-3" />
          </button>

          {/* Color picker circle indicators */}
          <div className="relative group/color inline-block">
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded hover:bg-[var(--background)] text-[var(--muted-foreground)] cursor-pointer"
            >
              <span className={cn("w-2 h-2 rounded-full block border border-[var(--border)]", style.dot)} />
            </button>
            <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover/color:flex gap-1 bg-[var(--card)] border border-[var(--border)] p-1 rounded-lg shadow-lg z-50">
              {(["sage", "coral", "lavender", "honey", "blue"] as const).map((c) => (
                <button
                  key={c}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChangeColor(note.id, c);
                  }}
                  className={cn("w-3 h-3 rounded-full border border-black/10 cursor-pointer block hover:scale-110", noteColors[c].dot)}
                />
              ))}
            </div>
          </div>

          {/* Delete trash trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteNote(note.id);
            }}
            className="p-1 rounded hover:bg-[#F9EAEB] text-[var(--muted-foreground)] hover:text-[#D36A73] cursor-pointer"
            title="Move to Trash"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }
}
