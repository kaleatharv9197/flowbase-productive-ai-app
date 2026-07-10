"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowLeft,
  Trash2,
  X,
  ClipboardList,
  Grid3X3,
  CheckCircle2,
  Clock
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CalendarTask {
  id: string;
  title: string;
  date?: string; // YYYY-MM-DD format
  type: "task" | "reminder";
  category: string;
  color: "sage" | "coral" | "lavender" | "honey" | "blue";
}

// Visual color style mapping for cozy color palette
const colorStyles: Record<
  "sage" | "coral" | "lavender" | "honey" | "blue",
  { bg: string; text: string; border: string; dot: string; hoverBg: string }
> = {
  sage: {
    bg: "bg-[#E2ECE9]",
    hoverBg: "hover:bg-[#D2DDD9]",
    text: "text-[#2D5A4E]",
    border: "border-[#B2D1C8]",
    dot: "bg-[#4A7C70]"
  },
  coral: {
    bg: "bg-[#FCECE7]",
    hoverBg: "hover:bg-[#F7DBD0]",
    text: "text-[#B34B2E]",
    border: "border-[#F5C7BA]",
    dot: "bg-[#E07A5F]"
  },
  lavender: {
    bg: "bg-[#F0EBF8]",
    hoverBg: "hover:bg-[#E3DAF2]",
    text: "text-[#62479B]",
    border: "border-[#DCD0F0]",
    dot: "bg-[#8E75C4]"
  },
  honey: {
    bg: "bg-[#FBF3DB]",
    hoverBg: "hover:bg-[#F3E3B9]",
    text: "text-[#8E640B]",
    border: "border-[#F2DEB1]",
    dot: "bg-[#D8A035]"
  },
  blue: {
    bg: "bg-[#E8F0FE]",
    hoverBg: "hover:bg-[#D5E4FC]",
    text: "text-[#1C54B2]",
    border: "border-[#B7D2FC]",
    dot: "bg-[#4285F4]"
  }
};

const initialScheduledTasks: CalendarTask[] = [
  { id: "s1", title: "Finalize Miro Board integration design", date: "2026-07-08", type: "task", category: "Design", color: "coral" },
  { id: "s2", title: "Implement Next.js 15 routing parameters", date: "2026-07-14", type: "task", category: "Tech", color: "blue" },
  { id: "s3", title: "Daily tea break tea syncing", date: "2026-07-14", type: "reminder", category: "Personal", color: "sage" },
  { id: "s4", title: "AI chat assistant fine-tuning check", date: "2026-07-22", type: "task", category: "Tech", color: "lavender" },
  { id: "s5", title: "Write weekly developer summary docs", date: "2026-07-28", type: "reminder", category: "Content", color: "honey" }
];

const initialDraftTasks: CalendarTask[] = [
  { id: "d1", title: "Sketch draft logo options", type: "task", category: "Design", color: "coral" },
  { id: "d2", title: "Refactor Clerk auth callbacks flow", type: "task", category: "Tech", color: "blue" },
  { id: "d3", title: "Verify database table constraint mappings", type: "task", category: "Tech", color: "lavender" },
  { id: "d4", title: "Buy fresh coffee beans for the workspace", type: "reminder", category: "Personal", color: "sage" }
];

export default function CozyInteractiveCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 9)); // Default to July 9, 2026
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [scheduledTasks, setScheduledTasks] = useState<CalendarTask[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nook-calendar-scheduled");
      if (saved) return JSON.parse(saved);
    }
    return initialScheduledTasks;
  });
  const [draftTasks, setDraftTasks] = useState<CalendarTask[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nook-calendar-drafts");
      if (saved) return JSON.parse(saved);
    }
    return initialDraftTasks;
  });

  // Sync calendar tasks to localStorage
  useEffect(() => {
    localStorage.setItem("nook-calendar-scheduled", JSON.stringify(scheduledTasks));
  }, [scheduledTasks]);

  useEffect(() => {
    localStorage.setItem("nook-calendar-drafts", JSON.stringify(draftTasks));
  }, [draftTasks]);

  // Dialog & Form states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<"task" | "reminder">("task");
  const [formCategory, setFormCategory] = useState("Design");
  const [formColor, setFormColor] = useState<"sage" | "coral" | "lavender" | "honey" | "blue">("sage");
  const [formDate, setFormDate] = useState("");
  const [dialogSource, setDialogSource] = useState<"scheduled" | "draft">("scheduled");

  // Drag states for visual feedback
  const [draggedOverDate, setDraggedOverDate] = useState<string | null>(null);
  const [isDraggingOverDraft, setIsDraggingOverDraft] = useState(false);

  // Date helper: Format a date object as YYYY-MM-DD
  const formatDateString = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Navigations
  const handlePrev = () => {
    const nextDate = new Date(currentDate);
    if (viewMode === "month") {
      nextDate.setMonth(nextDate.getMonth() - 1);
    } else {
      nextDate.setDate(nextDate.getDate() - 7);
    }
    setCurrentDate(nextDate);
  };

  const handleNext = () => {
    const nextDate = new Date(currentDate);
    if (viewMode === "month") {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else {
      nextDate.setDate(nextDate.getDate() + 7);
    }
    setCurrentDate(nextDate);
  };

  const handleToday = () => {
    // Navigate back to the default project date pivot
    setCurrentDate(new Date(2026, 6, 9));
  };

  // Open Dialog for specific date
  const openScheduleDialog = (dateStr: string) => {
    setFormDate(dateStr);
    setFormTitle("");
    setFormType("task");
    setFormCategory("Design");
    setFormColor("sage");
    setDialogSource("scheduled");
    setIsDialogOpen(true);
  };

  // Open Dialog for draft creation
  const openDraftDialog = () => {
    setFormTitle("");
    setFormType("task");
    setFormCategory("Design");
    setFormColor("sage");
    setFormDate("");
    setDialogSource("draft");
    setIsDialogOpen(true);
  };

  // Submit task creation
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newTask: CalendarTask = {
      id: Date.now().toString(),
      title: formTitle,
      type: formType,
      category: formCategory,
      color: formColor
    };

    if (dialogSource === "scheduled" && formDate) {
      newTask.date = formDate;
      setScheduledTasks((prev) => [...prev, newTask]);
    } else {
      setDraftTasks((prev) => [...prev, newTask]);
    }

    setIsDialogOpen(false);
  };

  // Delete a task card
  const deleteTask = (id: string, isDraft: boolean) => {
    if (isDraft) {
      setDraftTasks((prev) => prev.filter((t) => t.id !== id));
    } else {
      setScheduledTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, id: string, source: "scheduled" | "draft") => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ id, source }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    setDraggedOverDate(null);
    const dataStr = e.dataTransfer.getData("text/plain");
    if (!dataStr) return;

    try {
      const { id, source } = JSON.parse(dataStr);
      if (source === "draft") {
        // Move task from draft to scheduled
        const task = draftTasks.find((t) => t.id === id);
        if (task) {
          setDraftTasks((prev) => prev.filter((t) => t.id !== id));
          setScheduledTasks((prev) => [...prev, { ...task, date: dateStr }]);
        }
      } else if (source === "scheduled") {
        // Move scheduled task to another date
        setScheduledTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, date: dateStr } : t))
        );
      }
    } catch (err) {
      console.error("Drop parsing failed:", err);
    }
  };

  const handleDropToDraft = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOverDraft(false);
    const dataStr = e.dataTransfer.getData("text/plain");
    if (!dataStr) return;

    try {
      const { id, source } = JSON.parse(dataStr);
      if (source === "scheduled") {
        // Move scheduled task back to draft list
        const task = scheduledTasks.find((t) => t.id === id);
        if (task) {
          setScheduledTasks((prev) => prev.filter((t) => t.id !== id));
          const { date, ...draftTask } = task; // strip date parameter
          setDraftTasks((prev) => [...prev, draftTask]);
        }
      }
    } catch (err) {
      console.error("Drop back to draft failed:", err);
    }
  };

  // Month View Days Calculation
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    const daysInMonth = endOfMonth.getDate();
    // Monday-Sunday week day offset (Mon=0, Tue=1, ..., Sun=6)
    const startDayOfWeek = (startOfMonth.getDay() + 6) % 7;

    const daysList: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Buffer from previous month
    const prevMonthEnd = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthEnd - i);
      daysList.push({
        dateStr: formatDateString(prevDate),
        dayNum: prevMonthEnd - i,
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const currDate = new Date(year, month, i);
      daysList.push({
        dateStr: formatDateString(currDate),
        dayNum: i,
        isCurrentMonth: true
      });
    }

    // Buffer from next month to fill standard 42 cell grid (6 rows of 7 days)
    const remainingCells = 42 - daysList.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      daysList.push({
        dateStr: formatDateString(nextDate),
        dayNum: i,
        isCurrentMonth: false
      });
    }

    return daysList;
  };

  // Week View Days Calculation
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    // Offset to make Monday the start of the week
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const daysList: { dateStr: string; dayNum: number; dayLabel: string }[] = [];
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for (let i = 0; i < 7; i++) {
      const dateObj = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
      daysList.push({
        dateStr: formatDateString(dateObj),
        dayNum: dateObj.getDate(),
        dayLabel: labels[i]
      });
    }

    return daysList;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 flex flex-col h-[calc(100vh-20px)] overflow-hidden">
      {/* Calendar Controls & Navigation */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--border)] shrink-0 select-none">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-xl hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer md:hidden">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="w-9 h-9 rounded-xl bg-[#F9EAEB] text-[#D36A73] dark:bg-[#3D2224] dark:text-[#E89BA2] flex items-center justify-center">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)]">Cozy Planner</h1>
            <p className="text-xs text-[var(--muted-foreground)]">Schedule tasks, configure reminders, and organize draft backlogs.</p>
          </div>
        </div>

        {/* View Switcher and Month Navigation */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Day Navigation */}
          <div className="flex items-center gap-1 bg-[var(--card)] border border-[var(--border)] rounded-xl p-1 shadow-xs">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-[var(--secondary)] text-[var(--foreground)] cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-sm font-extrabold text-[var(--foreground)] px-2 min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>

          {/* Month/Week Toggle */}
          <div className="flex items-center bg-[var(--card)] border border-[var(--border)] rounded-xl p-1 shadow-xs">
            <button
              onClick={() => setViewMode("month")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5",
                viewMode === "month"
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Month</span>
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5",
                viewMode === "week"
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>Week</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout (Calendar + Drafts Sidebar) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden min-h-0">
        
        {/* Calendar Area */}
        <div className="lg:col-span-3 flex flex-col overflow-x-auto min-w-0 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 shadow-xs select-none">
          <div className="min-w-[650px] flex flex-col flex-1">
            
            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-[var(--muted-foreground)] uppercase">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>

            {/* View Mode Renderer */}
            {viewMode === "month" ? (
              // Month View (Grid of 42 cells)
              <div className="grid grid-cols-7 gap-2 flex-1 min-h-0 overflow-y-auto">
                {getMonthDays().map(({ dateStr, dayNum, isCurrentMonth }) => {
                  const dayTasks = scheduledTasks.filter((t) => t.date === dateStr);
                  const isHovered = draggedOverDate === dateStr;

                  return (
                    <div
                      key={dateStr}
                      onDragOver={handleDragOver}
                      onDragEnter={(e) => { e.preventDefault(); setDraggedOverDate(dateStr); }}
                      onDragLeave={() => { if (draggedOverDate === dateStr) setDraggedOverDate(null); }}
                      onDrop={(e) => handleDrop(e, dateStr)}
                      className={cn(
                        "rounded-xl border border-[var(--border)] p-2 flex flex-col justify-between transition-all duration-200 group relative min-h-[75px] max-h-[140px] overflow-y-auto cursor-default",
                        isCurrentMonth ? "bg-[var(--background)]" : "bg-[var(--secondary)]/20 opacity-45",
                        isHovered && "border-dashed border-2 border-[var(--primary)] bg-[var(--secondary)]/60 scale-102"
                      )}
                    >
                      {/* Top Header inside day block */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]">
                          {dayNum}
                        </span>
                        <button
                          onClick={() => openScheduleDialog(dateStr)}
                          className="w-5 h-5 rounded-md hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Day Tasks List */}
                      <div className="space-y-1.5 mt-2 flex-1 overflow-y-auto">
                        {dayTasks.map((task) => {
                          const style = colorStyles[task.color] || colorStyles.sage;
                          return (
                            <div
                              key={task.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, task.id, "scheduled")}
                              className={cn(
                                "flex items-start gap-1 px-1.5 py-1 rounded-lg border text-[10px] font-semibold leading-tight cursor-grab active:cursor-grabbing transition-all select-none shadow-xs truncate group/card relative",
                                style.bg,
                                style.hoverBg,
                                style.border,
                                style.text
                              )}
                            >
                              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0 mt-1", style.dot)} />
                              <span className="truncate flex-1">{task.title}</span>
                              
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteTask(task.id, false); }}
                                className="w-3.5 h-3.5 rounded hover:bg-black/10 absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity cursor-pointer shrink-0"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Week View (7 column lists)
              <div className="grid grid-cols-7 gap-3 flex-1 min-h-0 overflow-y-auto">
                {getWeekDays().map(({ dateStr, dayNum, dayLabel }) => {
                  const dayTasks = scheduledTasks.filter((t) => t.date === dateStr);
                  const isHovered = draggedOverDate === dateStr;

                  return (
                    <div
                      key={dateStr}
                      onDragOver={handleDragOver}
                      onDragEnter={(e) => { e.preventDefault(); setDraggedOverDate(dateStr); }}
                      onDragLeave={() => { if (draggedOverDate === dateStr) setDraggedOverDate(null); }}
                      onDrop={(e) => handleDrop(e, dateStr)}
                      className={cn(
                        "rounded-2xl border border-[var(--border)] bg-[var(--background)] p-3 flex flex-col justify-between min-h-[220px] transition-all duration-200 cursor-default",
                        isHovered && "border-dashed border-2 border-[var(--primary)] bg-[var(--secondary)]/60 scale-102"
                      )}
                    >
                      {/* Week header info */}
                      <div>
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border)]">
                          <div className="text-left">
                            <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase block">{dayLabel}</span>
                            <span className="text-base font-extrabold text-[var(--foreground)] block">{dayNum}</span>
                          </div>
                          <button
                            onClick={() => openScheduleDialog(dateStr)}
                            className="p-1 rounded-md hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Week Tasks Index */}
                        <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-280px)]">
                          {dayTasks.map((task) => {
                            const style = colorStyles[task.color] || colorStyles.sage;
                            return (
                              <div
                                key={task.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, task.id, "scheduled")}
                                className={cn(
                                  "p-2.5 rounded-xl border text-xs font-semibold leading-normal cursor-grab active:cursor-grabbing transition-all select-none shadow-xs group/card relative",
                                  style.bg,
                                  style.hoverBg,
                                  style.border,
                                  style.text
                                )}
                              >
                                <div className="flex items-start gap-1.5 pr-4">
                                  <span className={cn("w-1.5 h-1.5 rounded-full shrink-0 mt-1.5", style.dot)} />
                                  <span className="break-words">{task.title}</span>
                                </div>
                                <div className="flex items-center justify-between mt-2.5 text-[9px] text-[var(--muted-foreground)]">
                                  <span className="capitalize font-extrabold">{task.type}</span>
                                  <span className="opacity-80">{task.category}</span>
                                </div>

                                <button
                                  onClick={(e) => { e.stopPropagation(); deleteTask(task.id, false); }}
                                  className="w-4 h-4 rounded hover:bg-black/10 absolute right-1.5 top-1.5 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity cursor-pointer shrink-0"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Draft Task Panel */}
        <aside
          onDragOver={handleDragOver}
          onDragEnter={(e) => { e.preventDefault(); setIsDraggingOverDraft(true); }}
          onDragLeave={() => setIsDraggingOverDraft(false)}
          onDrop={handleDropToDraft}
          className={cn(
            "bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-xs relative transition-all duration-200 select-none",
            isDraggingOverDraft && "border-dashed border-2 border-[var(--primary)] bg-[var(--secondary)]/60 scale-102"
          )}
        >
          <div className="flex flex-col min-h-0 flex-1 space-y-4">
            {/* Panel Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h2 className="text-sm font-bold text-[var(--foreground)] tracking-tight">Draft Task Panel</h2>
                <p className="text-[10px] text-[var(--muted-foreground)]">Drag these cards onto the calendar to schedule them.</p>
              </div>
              <button
                onClick={openDraftDialog}
                className="p-1 rounded-md border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Drag Target Visual Box Helper when dragging */}
            {isDraggingOverDraft && (
              <div className="absolute inset-0 bg-[var(--secondary)]/30 backdrop-blur-xs flex items-center justify-center border-dashed border-2 border-[var(--primary)] m-4 rounded-xl pointer-events-none z-10 animate-pulse">
                <span className="text-xs font-bold text-[var(--primary)]">Drop scheduled card to unschedule</span>
              </div>
            )}

            {/* List of Draft Tasks */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[200px]">
              {draftTasks.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-4">
                  <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                    No unscheduled items. Click "+" or drag a card here from the calendar to store it.
                  </p>
                </div>
              ) : (
                draftTasks.map((task) => {
                  const style = colorStyles[task.color] || colorStyles.sage;
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id, "draft")}
                      className={cn(
                        "p-3 rounded-xl border text-xs font-semibold leading-normal cursor-grab active:cursor-grabbing transition-all select-none shadow-xs group relative",
                        style.bg,
                        style.hoverBg,
                        style.border,
                        style.text
                      )}
                    >
                      <div className="flex items-start gap-1.5 pr-4">
                        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0 mt-1.5", style.dot)} />
                        <span className="break-words">{task.title}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-[9px] text-[var(--muted-foreground)]">
                        <span className="capitalize font-extrabold">{task.type}</span>
                        <span className="opacity-80">{task.category}</span>
                      </div>

                      <button
                        onClick={() => deleteTask(task.id, true)}
                        className="w-4 h-4 rounded hover:bg-black/10 absolute right-1.5 top-1.5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border)] text-[9px] text-[var(--muted-foreground)] text-center">
            💡 Drop calendar items back here to revert them to draft stage.
          </div>
        </aside>
      </div>

      {/* Cozy Create Task Modal Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-scale-up select-none">
            {/* Dialog Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
              <h2 className="text-sm font-extrabold text-[var(--foreground)] tracking-tight">
                {dialogSource === "scheduled" ? "Schedule New Card" : "Create Unscheduled Draft"}
              </h2>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="p-1 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dialog Form */}
            <form onSubmit={handleSaveTask} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="What needs to get done?"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all font-semibold"
                />
              </div>

              {/* Type Switcher */}
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                  Type
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType("task")}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg border text-xs font-bold cursor-pointer inline-flex items-center justify-center gap-1.5 transition-all",
                      formType === "task"
                        ? "bg-[#E8F0FE] border-[#B7D2FC] text-[#1C54B2]"
                        : "border-[var(--border)] text-[var(--muted-foreground)]"
                    )}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Task</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType("reminder")}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg border text-xs font-bold cursor-pointer inline-flex items-center justify-center gap-1.5 transition-all",
                      formType === "reminder"
                        ? "bg-[#FCECE7] border-[#F5C7BA] text-[#B34B2E]"
                        : "border-[var(--border)] text-[var(--muted-foreground)]"
                    )}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Reminder</span>
                  </button>
                </div>
              </div>

              {/* Category & Date Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] cursor-pointer font-semibold"
                  >
                    <option value="Design">Design</option>
                    <option value="Tech">Tech</option>
                    <option value="Personal">Personal</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Content">Content</option>
                  </select>
                </div>

                {dialogSource === "scheduled" && (
                  <div>
                    <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] cursor-pointer font-semibold"
                    />
                  </div>
                )}
              </div>

              {/* Color Coding Picker */}
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-2">
                  Color Theme Badge
                </label>
                <div className="flex gap-2">
                  {(["sage", "coral", "lavender", "honey", "blue"] as const).map((col) => {
                    const style = colorStyles[col];
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setFormColor(col)}
                        className={cn(
                          "w-7 h-7 rounded-lg border flex items-center justify-center cursor-pointer transition-transform shrink-0 relative",
                          style.bg,
                          style.border,
                          formColor === col ? "scale-110 ring-2 ring-[var(--primary)] ring-offset-2" : "hover:scale-105"
                        )}
                      >
                        <span className={cn("w-2 h-2 rounded-full", style.dot)} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:opacity-90 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Item</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
