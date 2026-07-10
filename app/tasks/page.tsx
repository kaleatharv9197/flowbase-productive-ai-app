"use client";

import React, { useState, useEffect } from "react";
import {
  SquareKanban,
  Plus,
  Edit2,
  Trash2,
  X,
  Calendar,
  FileText,
  AlertCircle,
  MoreVertical,
  ArrowLeft,
  ChevronRight,
  FolderPlus
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCollaboration } from "@/lib/collaboration-store";
import { CollaborationModal } from "@/components/collaboration-modal";
import { CommentsSidebar } from "@/components/comments-sidebar";
import { Users, MessageSquare } from "lucide-react";

interface KanbanTask {
  id: string;
  title: string;
  desc: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  labels: string[];
  syncCalendar: boolean;
  syncNotes: boolean;
}

interface KanbanColumn {
  id: string;
  name: string;
  tasks: KanbanTask[];
}

interface KanbanBoard {
  id: string;
  name: string;
  color: "sage" | "coral" | "lavender" | "honey" | "blue";
  columns: KanbanColumn[];
}

const boardColors: Record<
  "sage" | "coral" | "lavender" | "honey" | "blue",
  { bg: string; text: string; dot: string; hoverBg: string; border: string }
> = {
  sage: { bg: "bg-[#E2ECE9]", text: "text-[#2D5A4E]", dot: "bg-[#4A7C70]", hoverBg: "hover:bg-[#D2DDD9]", border: "border-[#B2D1C8]" },
  coral: { bg: "bg-[#FCECE7]", text: "text-[#B34B2E]", dot: "bg-[#E07A5F]", hoverBg: "hover:bg-[#F7DBD0]", border: "border-[#F5C7BA]" },
  lavender: { bg: "bg-[#F0EBF8]", text: "text-[#62479B]", dot: "bg-[#8E75C4]", hoverBg: "hover:bg-[#E3DAF2]", border: "border-[#DCD0F0]" },
  honey: { bg: "bg-[#FBF3DB]", text: "text-[#8E640B]", dot: "bg-[#D8A035]", hoverBg: "hover:bg-[#F3E3B9]", border: "border-[#F2DEB1]" },
  blue: { bg: "bg-[#E8F0FE]", text: "text-[#1C54B2]", dot: "bg-[#4285F4]", hoverBg: "hover:bg-[#D5E4FC]", border: "border-[#B7D2FC]" }
};

const priorityStyles: Record<"Low" | "Medium" | "High", { bg: string; text: string; border: string }> = {
  Low: { bg: "bg-gray-100 dark:bg-zinc-800", text: "text-gray-600 dark:text-zinc-400", border: "border-gray-200 dark:border-zinc-700" },
  Medium: { bg: "bg-[#FBF3DB] dark:bg-[#3D311B]", text: "text-[#8E640B] dark:text-[#E9C37A]", border: "border-[#F2DEB1] dark:border-[#5E4A2A]" },
  High: { bg: "bg-[#FCECE7] dark:bg-[#3D251E]", text: "text-[#B34B2E] dark:text-[#F4A793]", border: "border-[#F5C7BA] dark:border-[#5E3B30]" }
};

const labelStyles: Record<string, { bg: string; text: string; border: string }> = {
  Design: { bg: "bg-[#FCECE7] dark:bg-[#3D251E]", text: "text-[#E07A5F] dark:text-[#F4A793]", border: "border-[#F5C7BA] dark:border-[#5E3B30]" },
  Tech: { bg: "bg-[#E8F0FE] dark:bg-[#1B2945]", text: "text-[#4285F4] dark:text-[#7CABFA]", border: "border-[#B7D2FC] dark:border-[#2C3F66]" },
  Personal: { bg: "bg-[#EAF5E9] dark:bg-[#1C2F24]", text: "text-[#5F9E77] dark:text-[#90C8A4]", border: "border-[#C3E6C0] dark:border-[#2F4F3D]" },
  Marketing: { bg: "bg-[#FBF3DB] dark:bg-[#3D311B]", text: "text-[#D8A035] dark:text-[#E9C37A]", border: "border-[#F2DEB1] dark:border-[#5E4A2A]" },
  Content: { bg: "bg-[#F0EBF8] dark:bg-[#2C213D]", text: "text-[#8E75C4] dark:text-[#B49FE6]", border: "border-[#DCD0F0] dark:border-[#4B3B69]" }
};

const defaultBoards: KanbanBoard[] = [
  {
    id: "b1",
    name: "🚀 Product Launch Specs",
    color: "coral",
    columns: [
      {
        id: "c1",
        name: "Todo",
        tasks: [
          { id: "t1", title: "Design cozy theme palette specifications", desc: "Balance Notion's structure with Miro's sketch capabilities.", dueDate: "2026-07-10", priority: "High", labels: ["Design", "Content"], syncCalendar: true, syncNotes: true },
          { id: "t2", title: "Write weekly developer summary docs", desc: "Integrate all details of completed routes.", dueDate: "2026-07-12", priority: "Low", labels: ["Content"], syncCalendar: false, syncNotes: true }
        ]
      },
      {
        id: "c2",
        name: "In Progress",
        tasks: [
          { id: "t3", title: "Build collapsible sidebar component skeleton", desc: "Setup Lucide React icons and group them nicely.", dueDate: "2026-07-09", priority: "Medium", labels: ["Design"], syncCalendar: true, syncNotes: false }
        ]
      },
      {
        id: "c3",
        name: "Done",
        tasks: [
          { id: "t4", title: "Resolve dev server PID port conflicts", desc: "Kill dangled Next.js process 5828.", dueDate: "2026-07-08", priority: "High", labels: ["Tech"], syncCalendar: false, syncNotes: false }
        ]
      }
    ]
  },
  {
    id: "b2",
    name: "🍵 Personal Coffee Shop Specs",
    color: "sage",
    columns: [
      {
        id: "c4",
        name: "Todo",
        tasks: [
          { id: "t5", title: "Order warm caramel syrup bottles", desc: "Needed for testing seasonal recipes.", dueDate: "2026-07-15", priority: "Low", labels: ["Personal"], syncCalendar: true, syncNotes: false }
        ]
      },
      { id: "c5", name: "In Progress", tasks: [] },
      { id: "c6", name: "Done", tasks: [] }
    ]
  }
];

export default function KanbanWorkspace() {
  const [boards, setBoards] = useState<KanbanBoard[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nook-kanban-boards");
      if (saved) return JSON.parse(saved);
    }
    return defaultBoards;
  });

  // Sync boards to localStorage
  useEffect(() => {
    localStorage.setItem("nook-kanban-boards", JSON.stringify(boards));
  }, [boards]);

  const [activeBoardId, setActiveBoardId] = useState("b1");

  // Collaboration States
  const { collaborators, getCommentCount } = useCollaboration();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [activeCommentTaskId, setActiveCommentTaskId] = useState("");
  const [activeCommentTaskTitle, setActiveCommentTaskTitle] = useState("");

  // Board Creation Modal
  const [isBoardDialogOpen, setIsBoardDialogOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardColor, setNewBoardColor] = useState<"sage" | "coral" | "lavender" | "honey" | "blue">("sage");

  // Task Dialog States
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState("");
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);

  // Form Fields
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [taskLabels, setTaskLabels] = useState<string[]>([]);
  const [taskSyncCalendar, setTaskSyncCalendar] = useState(false);
  const [taskSyncNotes, setTaskSyncNotes] = useState(false);

  // Column Modification
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [editingColName, setEditingColName] = useState("");
  const [newColName, setNewColName] = useState("");
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  // Drag states
  const [draggedOverColId, setDraggedOverColId] = useState<string | null>(null);

  // Active Board helper
  const activeBoard = boards.find((b) => b.id === activeBoardId) || boards[0];

  // Set default due date as today YYYY-MM-DD
  const getTodayString = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Create new board
  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    const newBoard: KanbanBoard = {
      id: Date.now().toString(),
      name: newBoardName,
      color: newBoardColor,
      columns: [
        { id: `tc1-${Date.now()}`, name: "Todo", tasks: [] },
        { id: `tc2-${Date.now()}`, name: "In Progress", tasks: [] },
        { id: `tc3-${Date.now()}`, name: "Done", tasks: [] }
      ]
    };

    setBoards([...boards, newBoard]);
    setActiveBoardId(newBoard.id);
    setIsBoardDialogOpen(false);
    setNewBoardName("");
  };

  // Column functions
  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    if (activeBoard.columns.length >= 5) {
      alert("Maximum of 5 columns allowed per board!");
      return;
    }

    const updated = boards.map((b) => {
      if (b.id !== activeBoardId) return b;
      return {
        ...b,
        columns: [...b.columns, { id: Date.now().toString(), name: newColName, tasks: [] }]
      };
    });

    setBoards(updated);
    setNewColName("");
    setIsAddingColumn(false);
  };

  const handleStartRenameColumn = (colId: string, name: string) => {
    setEditingColId(colId);
    setEditingColName(name);
  };

  const handleSaveColumnName = (colId: string) => {
    if (!editingColName.trim()) return;
    setBoards(
      boards.map((b) => {
        if (b.id !== activeBoardId) return b;
        return {
          ...b,
          columns: b.columns.map((c) => (c.id === colId ? { ...c, name: editingColName } : c))
        };
      })
    );
    setEditingColId(null);
  };

  const handleDeleteColumn = (colId: string) => {
    if (!confirm("Are you sure you want to delete this column and all its tasks?")) return;
    setBoards(
      boards.map((b) => {
        if (b.id !== activeBoardId) return b;
        return {
          ...b,
          columns: b.columns.filter((c) => c.id !== colId)
        };
      })
    );
  };

  // Task creation/editing functions
  const openAddTaskDialog = (colId: string) => {
    setSelectedColumnId(colId);
    setEditingTask(null);
    setTaskTitle("");
    setTaskDesc("");
    setTaskDueDate(getTodayString());
    setTaskPriority("Low");
    setTaskLabels([]);
    setTaskSyncCalendar(false);
    setTaskSyncNotes(false);
    setIsTaskDialogOpen(true);
  };

  const openEditTaskDialog = (colId: string, task: KanbanTask) => {
    setSelectedColumnId(colId);
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDesc(task.desc);
    setTaskDueDate(task.dueDate);
    setTaskPriority(task.priority);
    setTaskLabels(task.labels);
    setTaskSyncCalendar(task.syncCalendar);
    setTaskSyncNotes(task.syncNotes);
    setIsTaskDialogOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    if (editingTask) {
      // Edit mode
      setBoards(
        boards.map((b) => {
          if (b.id !== activeBoardId) return b;
          return {
            ...b,
            columns: b.columns.map((col) => {
              if (col.id !== selectedColumnId) return col;
              return {
                ...col,
                tasks: col.tasks.map((t) =>
                  t.id === editingTask.id
                    ? {
                        ...t,
                        title: taskTitle,
                        desc: taskDesc,
                        dueDate: taskDueDate,
                        priority: taskPriority,
                        labels: taskLabels,
                        syncCalendar: taskSyncCalendar,
                        syncNotes: taskSyncNotes
                      }
                    : t
                )
              };
            })
          };
        })
      );
    } else {
      // Create mode
      const newTask: KanbanTask = {
        id: Date.now().toString(),
        title: taskTitle,
        desc: taskDesc,
        dueDate: taskDueDate,
        priority: taskPriority,
        labels: taskLabels,
        syncCalendar: taskSyncCalendar,
        syncNotes: taskSyncNotes
      };

      setBoards(
        boards.map((b) => {
          if (b.id !== activeBoardId) return b;
          return {
            ...b,
            columns: b.columns.map((col) => {
              if (col.id !== selectedColumnId) return col;
              return {
                ...col,
                tasks: [...col.tasks, newTask]
              };
            })
          };
        })
      );
    }

    setIsTaskDialogOpen(false);
  };

  const handleDeleteTask = (colId: string, taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setBoards(
      boards.map((b) => {
        if (b.id !== activeBoardId) return b;
        return {
          ...b,
          columns: b.columns.map((col) => {
            if (col.id !== colId) return col;
            return {
              ...col,
              tasks: col.tasks.filter((t) => t.id !== taskId)
            };
          })
        };
      })
    );
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, colId: string, taskId: string) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ colId, taskId }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, toColId: string) => {
    e.preventDefault();
    setDraggedOverColId(null);
    const dataStr = e.dataTransfer.getData("text/plain");
    if (!dataStr) return;

    try {
      const { colId: fromColId, taskId } = JSON.parse(dataStr);
      if (fromColId === toColId) return;

      setBoards((prevBoards) =>
        prevBoards.map((b) => {
          if (b.id !== activeBoardId) return b;

          let draggedTask: KanbanTask | null = null;
          const updatedColumns = b.columns.map((col) => {
            if (col.id === fromColId) {
              draggedTask = col.tasks.find((t) => t.id === taskId) || null;
              return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
            }
            return col;
          });

          if (!draggedTask) return b;

          const finalColumns = updatedColumns.map((col) => {
            if (col.id === toColId) {
              return { ...col, tasks: [...col.tasks, draggedTask!] };
            }
            return col;
          });

          return { ...b, columns: finalColumns };
        })
      );
    } catch (err) {
      console.error("Drop failed:", err);
    }
  };

  // Toggle label array checkbox
  const handleLabelToggle = (labelName: string) => {
    if (taskLabels.includes(labelName)) {
      setTaskLabels(taskLabels.filter((l) => l !== labelName));
    } else {
      setTaskLabels([...taskLabels, labelName]);
    }
  };

  const activeColor = boardColors[activeBoard.color] || boardColors.sage;

  return (
    <div className="flex h-screen overflow-hidden font-sans text-[var(--foreground)] bg-[var(--background)] select-none">
      
      {/* Left panel for board lists */}
      <aside className="w-64 bg-[var(--card)] flex flex-col justify-between hidden sm:flex shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.015)]">
        <div>
          <div className="h-14 flex items-center justify-between px-4 border-b border-[var(--border)]">
            <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase">Workspace Boards</span>
            <button
              onClick={() => {
                setNewBoardName("");
                setNewBoardColor("sage");
                setIsBoardDialogOpen(true);
              }}
              className="p-1 rounded-md border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>

          <nav className="p-2.5 space-y-1">
            {boards.map((b) => {
              const bColor = boardColors[b.color] || boardColors.sage;
              const isActive = b.id === activeBoardId;
              return (
                <button
                  key={b.id}
                  onClick={() => setActiveBoardId(b.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer",
                    isActive
                      ? "bg-[var(--secondary)] text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/50 hover:text-[var(--foreground)]"
                  )}
                >
                  <span className={cn("w-2 h-2 rounded-full shrink-0", bColor.dot)} />
                  <span className="truncate flex-1">{b.name}</span>
                  <ChevronRight className={cn("w-3.5 h-3.5 opacity-60", isActive ? "opacity-100" : "")} />
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-[var(--border)] text-[10px] text-[var(--muted-foreground)] leading-normal">
          💡 Clicking a board loads it. You can edit column headers inline.
        </div>
      </aside>

      {/* Main Board Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[var(--background)]">
        
        {/* Board Header Toolbar */}
        <header className="h-14 bg-transparent px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer sm:hidden">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full", activeColor.dot)} />
              <h1 className="text-sm font-extrabold tracking-tight text-[var(--foreground)]">
                {activeBoard.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Active collaborators avatar circles */}
            <div className="flex items-center -space-x-1.5 overflow-hidden">
              {collaborators
                .filter((c) => c.isActive && c.activeBoardId === activeBoard.id)
                .map((c) => (
                  <div
                    key={c.id}
                    title={`${c.name} (${c.email})`}
                    className={cn(
                      "w-6.5 h-6.5 rounded-lg border border-[var(--border)] flex items-center justify-center text-[9px] font-extrabold shadow-xs select-none",
                      c.avatarColor
                    )}
                  >
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                ))}
            </div>

            {/* Collaboration Settings / Invite Button */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Share Board Settings"
            >
              <Users className="w-3.5 h-3.5 text-[#5F9E77] dark:text-[#90C8A4]" />
              <span className="hidden sm:inline">Collaboration</span>
            </button>

            <div className="h-6 w-px bg-[var(--border)] hidden sm:block" />

            <div className="flex items-center gap-2">
              {activeBoard.columns.length < 5 ? (
                isAddingColumn ? (
                  <form onSubmit={handleAddColumn} className="flex items-center gap-1">
                    <input
                      type="text"
                      required
                      value={newColName}
                      onChange={(e) => setNewColName(e.target.value)}
                      placeholder="Column name..."
                      className="px-2 py-1 text-xs rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                    <button type="submit" className="px-2.5 py-1 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold rounded-lg hover:opacity-90 transition-all cursor-pointer">
                      Add
                    </button>
                    <button type="button" onClick={() => setIsAddingColumn(false)} className="p-1 rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsAddingColumn(true)}
                    className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-[var(--primary)]" />
                    <span>Add Column</span>
                  </button>
                )
              ) : (
                <span className="text-[10px] font-bold text-[var(--muted-foreground)] px-2.5 py-1 rounded bg-[var(--secondary)] border border-[var(--border)]">
                  Columns Limit Met (5/5)
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Board Columns Scroll Layout Container */}
        <div className="flex-1 p-5 overflow-x-auto min-w-0 flex items-stretch gap-4">
          {activeBoard.columns.length === 0 ? (
            <div className="h-full flex-1 flex flex-col items-center justify-center text-center">
              <p className="text-xs text-[var(--muted-foreground)] max-w-xs">
                This board has no columns. Click "Add Column" above to start staging tasks.
              </p>
            </div>
          ) : (
            activeBoard.columns.map((col) => {
              const isDragOver = draggedOverColId === col.id;
              return (
                <div
                  key={col.id}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => { e.preventDefault(); setDraggedOverColId(col.id); }}
                  onDragLeave={() => { if (draggedOverColId === col.id) setDraggedOverColId(null); }}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={cn(
                    "w-72 bg-[#F6F4F0]/65 dark:bg-[#1E1E22]/50 rounded-[28px] p-5 flex flex-col justify-between max-h-full shrink-0 transition-all duration-200",
                    isDragOver && "bg-[var(--secondary)]/80 scale-102 shadow-xs"
                  )}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border)] mb-4 select-none">
                    {editingColId === col.id ? (
                      <input
                        type="text"
                        value={editingColName}
                        onChange={(e) => setEditingColName(e.target.value)}
                        onBlur={() => handleSaveColumnName(col.id)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveColumnName(col.id)}
                        className="px-2 py-0.5 text-xs rounded-xl bg-[var(--secondary)] text-[var(--foreground)] focus:outline-none font-bold w-[120px] border-none"
                        autoFocus
                      />
                    ) : (
                      <h2
                        onClick={() => handleStartRenameColumn(col.id, col.name)}
                        className="text-xs font-extrabold text-[var(--foreground)] uppercase tracking-wider cursor-text flex items-center gap-1.5 group/header"
                      >
                        <span>{col.name}</span>
                        <Edit2 className="w-3 h-3 opacity-0 group-hover/header:opacity-60 transition-opacity" />
                      </h2>
                    )}

                    <div className="flex items-center gap-1 text-[var(--muted-foreground)]">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--secondary)] border border-[var(--border)]">
                        {col.tasks.length}
                      </span>
                      <button
                        onClick={() => openAddTaskDialog(col.id)}
                        className="p-1 rounded hover:bg-[var(--secondary)] hover:text-[var(--foreground)] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteColumn(col.id)}
                        className="p-1 rounded hover:bg-[#F9EAEB] hover:text-[#D36A73] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Task list inside column */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-0.5 min-h-[150px]">
                    {col.tasks.length === 0 ? (
                      <div className="h-full flex items-center justify-center p-6 border border-dashed border-[var(--border)]/75 rounded-xl opacity-40">
                        <p className="text-[10px] text-center font-bold">No tasks here</p>
                      </div>
                    ) : (
                      col.tasks.map((task) => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, col.id, task.id)}
                          className="p-4 rounded-2xl bg-[var(--card)] shadow-[0_4px_16px_rgba(0,0,0,0.015)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.035)] group cursor-grab active:cursor-grabbing transition-all select-none relative"
                        >
                          {/* Priority badge & Edit actions */}
                          <div className="flex items-center justify-between mb-2">
                            <span className={cn(
                              "text-[8px] font-extrabold px-2 py-0.5 rounded border uppercase",
                              priorityStyles[task.priority].bg,
                              priorityStyles[task.priority].text,
                              priorityStyles[task.priority].border
                            )}>
                              {task.priority} Priority
                            </span>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEditTaskDialog(col.id, task)}
                                className="p-1 rounded hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(col.id, task.id)}
                                className="p-1 rounded hover:bg-[#F9EAEB] hover:text-[#D36A73] text-[var(--muted-foreground)] cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Task details */}
                          <h3 className="text-xs font-bold text-[var(--foreground)] leading-snug break-words">
                            {task.title}
                          </h3>
                          {task.desc && (
                            <p className="text-[10px] text-[var(--muted-foreground)] mt-1.5 leading-normal line-clamp-2">
                              {task.desc}
                            </p>
                          )}

                          {/* Color coded tags */}
                          {task.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {task.labels.map((l) => {
                                const style = labelStyles[l] || labelStyles.Design;
                                return (
                                  <span key={l} className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded border", style.bg, style.text, style.border)}>
                                    {l}
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          {/* Divider line */}
                          <div className="h-px bg-[var(--border)]/45 my-3" />

                          {/* Date and sync indicators */}
                          <div className="flex items-center justify-between text-[9px] text-[var(--muted-foreground)]">
                            <span className="font-bold">{task.dueDate}</span>
                            
                            <div className="flex items-center gap-2">
                              {/* Task Comment Count Badge */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveCommentTaskId(task.id);
                                  setActiveCommentTaskTitle(task.title);
                                  setIsCommentsOpen(true);
                                }}
                                className="flex items-center gap-1 text-[var(--muted-foreground)] hover:text-[#4285F4] hover:bg-[var(--secondary)] px-1.5 py-0.5 rounded cursor-pointer transition-colors"
                              >
                                <MessageSquare className="w-3 h-3 text-[#4285F4]/70" />
                                <span className="text-[9px] font-bold">{getCommentCount(task.id)}</span>
                              </button>

                              {task.syncCalendar && (
                                <span title="Synced with Calendar">
                                  <Calendar className="w-3 h-3 text-[#D36A73]" />
                                </span>
                              )}
                              {task.syncNotes && (
                                <span title="Linked with Notes">
                                  <FileText className="w-3 h-3 text-[#4285F4]" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* dialog modal for creating new board */}
      {isBoardDialogOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-sm p-6 shadow-xl relative animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
              <h2 className="text-sm font-extrabold text-[var(--foreground)] tracking-tight">Create Kanban Board</h2>
              <button onClick={() => setIsBoardDialogOpen(false)} className="p-1 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBoard} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                  Board Name
                </label>
                <input
                  type="text"
                  required
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="e.g. Design Sprint Week"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-2">
                  Board Color Scheme
                </label>
                <div className="flex gap-2.5">
                  {(["sage", "coral", "lavender", "honey", "blue"] as const).map((col) => {
                    const style = boardColors[col];
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setNewBoardColor(col)}
                        className={cn(
                          "w-7 h-7 rounded-lg border flex items-center justify-center cursor-pointer transition-transform shrink-0 relative",
                          style.bg,
                          style.border,
                          newBoardColor === col ? "scale-110 ring-2 ring-[var(--primary)] ring-offset-2" : "hover:scale-105"
                        )}
                      >
                        <span className={cn("w-2 h-2 rounded-full", style.dot)} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsBoardDialogOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted-foreground)] hover:bg-[var(--secondary)] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:opacity-90 transition-all cursor-pointer"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Creation & Editing Dialog */}
      {isTaskDialogOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
              <h2 className="text-sm font-extrabold text-[var(--foreground)] tracking-tight">
                {editingTask ? "Edit Kanban Card" : "Add Task Card"}
              </h2>
              <button onClick={() => setIsTaskDialogOpen(false)} className="p-1 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                  Card Title
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="What is this task?"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all font-semibold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                  Description
                </label>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Add more details about this task card..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all font-semibold resize-none h-16"
                />
              </div>

              {/* Due Date & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] cursor-pointer font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as "Low" | "Medium" | "High")}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] cursor-pointer font-semibold"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {/* Multi Labels Checklist */}
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                  Labels & Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(labelStyles).map((lbl) => {
                    const hasLabel = taskLabels.includes(lbl);
                    const style = labelStyles[lbl];
                    return (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => handleLabelToggle(lbl)}
                        className={cn(
                          "px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer",
                          hasLabel ? style.bg + " " + style.border + " " + style.text : "border-[var(--border)] text-[var(--muted-foreground)]"
                        )}
                      >
                        {lbl}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Workspace Sync switches */}
              <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                <span className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1">
                  Workspace Sync
                </span>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold block text-[var(--foreground)]">Sync with Calendar</span>
                    <span className="text-[10px] text-[var(--muted-foreground)] block">Sync card dates onto calendar schedule views.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={taskSyncCalendar}
                    onChange={(e) => setTaskSyncCalendar(e.target.checked)}
                    className="w-8 h-4 rounded-full border-[var(--border)] bg-[var(--background)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold block text-[var(--foreground)]">Link with Notes</span>
                    <span className="text-[10px] text-[var(--muted-foreground)] block">Reference this card inside Notion outline document specs.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={taskSyncNotes}
                    onChange={(e) => setTaskSyncNotes(e.target.checked)}
                    className="w-8 h-4 rounded-full border-[var(--border)] bg-[var(--background)] text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                  />
                </div>
              </div>

              {/* Dialog Footer Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsTaskDialogOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted-foreground)] hover:bg-[var(--secondary)] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:opacity-90 transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{editingTask ? "Save Card" : "Add Card"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Collaboration Settings Modal */}
      <CollaborationModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        boardId={activeBoard.id}
        boardName={activeBoard.name}
      />

      {/* Task Comments Sidebar */}
      <CommentsSidebar
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        taskId={activeCommentTaskId}
        boardId={activeBoard.id}
        taskTitle={activeCommentTaskTitle}
      />
    </div>
  );
}
