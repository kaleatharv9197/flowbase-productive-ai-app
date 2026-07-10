"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  FileText,
  SquareKanban,
  Calendar,
  Palette,
  Bot,
  Layers,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Circle,
  TrendingUp,
  Zap,
  Star,
  Activity,
  Target,
  MessageSquare,
  Layout,
  ChevronRight,
  BarChart3,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Data Types ───────────────────────────────────────────────────────────────

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
  color: string;
  columns: KanbanColumn[];
}

interface CalendarTask {
  id: string;
  title: string;
  date?: string;
  type: "task" | "reminder";
  category: string;
  color: "sage" | "coral" | "lavender" | "honey" | "blue";
}

interface CozyNote {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  color: string;
  isPinned: boolean;
  isDeleted: boolean;
  icon: string;
}

interface WhiteboardFile {
  id: string;
  name: string;
  updatedAt: string;
  color: string;
  elements: any[];
}

interface GeneratedApp {
  id: string;
  appName: string;
  description: string;
  icon: string;
  color: string;
  createdAt: string;
}

interface ActivityEntry {
  id: string;
  type: "task" | "note" | "calendar" | "whiteboard" | "template" | "ai";
  label: string;
  time: string;
  icon: React.ReactNode;
  color: string;
}

// ─── Color helpers ────────────────────────────────────────────────────────────

const calColorMap: Record<string, { bg: string; text: string; border: string }> = {
  sage: { bg: "bg-[#E2ECE9]", text: "text-[#2D5A4E]", border: "border-[#B2D1C8]" },
  coral: { bg: "bg-[#FCECE7]", text: "text-[#B34B2E]", border: "border-[#F5C7BA]" },
  lavender: { bg: "bg-[#F0EBF8]", text: "text-[#62479B]", border: "border-[#DCD0F0]" },
  honey: { bg: "bg-[#FBF3DB]", text: "text-[#8E640B]", border: "border-[#F2DEB1]" },
  blue: { bg: "bg-[#E8F0FE]", text: "text-[#1C54B2]", border: "border-[#B7D2FC]" },
};

const priorityBadge: Record<string, string> = {
  High: "bg-[#FCECE7] text-[#B34B2E]",
  Medium: "bg-[#FBF3DB] text-[#8E640B]",
  Low: "bg-gray-100 text-gray-600",
};

// ─── Utility ──────────────────────────────────────────────────────────────────

function isOverdue(dateStr: string): boolean {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr) < today;
}

function formatDateLabel(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  // If it's already a "X ago" style string, return as-is
  if (/ago|yesterday|today|am|pm/i.test(dateStr)) return dateStr;
  try {
    const d = new Date(dateStr);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 2) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  } catch {
    return dateStr;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 p-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xs hover:shadow-md hover:border-[var(--primary)]/20 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", color)}>
          {icon}
        </div>
        <ArrowUpRight className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div>
        <div className="text-2xl font-extrabold text-[var(--foreground)] tracking-tight">{value}</div>
        <div className="text-xs font-semibold text-[var(--muted-foreground)] mt-0.5">{label}</div>
        {sub && <div className="text-[10px] text-[var(--muted-foreground)]/70 mt-0.5">{sub}</div>}
      </div>
    </Link>
  );
}

function SectionHeader({
  icon,
  title,
  href,
  linkLabel = "View all",
}: {
  icon: React.ReactNode;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-extrabold text-[var(--foreground)] tracking-tight">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="text-[10px] font-bold text-[var(--primary)] hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          <span>{linkLabel}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({ name: " Atharv Creator", avatar: "☕" });

  // Real data from localStorage
  const [kanbanBoards, setKanbanBoards] = useState<KanbanBoard[]>([]);
  const [calendarScheduled, setCalendarScheduled] = useState<CalendarTask[]>([]);
  const [notes, setNotes] = useState<CozyNote[]>([]);
  const [whiteboards, setWhiteboards] = useState<WhiteboardFile[]>([]);
  const [generatedApps, setGeneratedApps] = useState<GeneratedApp[]>([]);

  // Load all real data on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("nook-profile");
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    const savedBoards = localStorage.getItem("nook-kanban-boards");
    if (savedBoards) setKanbanBoards(JSON.parse(savedBoards));
    else {
      // fallback defaults so dashboard isn't empty on first load
      setKanbanBoards([
        { id: "b1", name: "🚀 Product Launch", color: "coral", columns: [
          { id: "c1", name: "Todo", tasks: [
            { id: "t1", title: "Design cozy theme palette", desc: "", dueDate: "2026-07-10", priority: "High", labels: ["Design"], syncCalendar: true, syncNotes: false },
            { id: "t2", title: "Write weekly developer docs", desc: "", dueDate: "2026-07-12", priority: "Low", labels: ["Content"], syncCalendar: false, syncNotes: true }
          ]},
          { id: "c2", name: "In Progress", tasks: [
            { id: "t3", title: "Build collapsible sidebar", desc: "", dueDate: "2026-07-09", priority: "Medium", labels: ["Design"], syncCalendar: true, syncNotes: false }
          ]},
          { id: "c3", name: "Done", tasks: [
            { id: "t4", title: "Resolve dev server conflicts", desc: "", dueDate: "2026-07-08", priority: "High", labels: ["Tech"], syncCalendar: false, syncNotes: false }
          ]}
        ]}
      ]);
    }

    const savedScheduled = localStorage.getItem("nook-calendar-scheduled");
    if (savedScheduled) setCalendarScheduled(JSON.parse(savedScheduled));
    else {
      setCalendarScheduled([
        { id: "s1", title: "Finalize Miro Board design", date: "2026-07-10", type: "task", category: "Design", color: "coral" },
        { id: "s2", title: "Implement Next.js routing", date: "2026-07-14", type: "task", category: "Tech", color: "blue" },
        { id: "s3", title: "Daily tea break sync", date: "2026-07-14", type: "reminder", category: "Personal", color: "sage" },
        { id: "s4", title: "AI assistant fine-tuning", date: "2026-07-22", type: "task", category: "Tech", color: "lavender" },
        { id: "s5", title: "Weekly developer docs", date: "2026-07-28", type: "reminder", category: "Content", color: "honey" },
      ]);
    }

    const savedNotes = localStorage.getItem("nook-notes");
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    else {
      setNotes([
        { id: "n1", title: "📝 Product Architecture Spec", content: "", updatedAt: "10:15 AM", color: "coral", isPinned: true, isDeleted: false, icon: "🚀" },
        { id: "n2", title: "🍵 Coffee Recipes", content: "", updatedAt: "Yesterday", color: "sage", isPinned: false, isDeleted: false, icon: "☕" },
      ]);
    }

    const savedWB = localStorage.getItem("nook-whiteboards");
    if (savedWB) setWhiteboards(JSON.parse(savedWB));
    else {
      setWhiteboards([
        { id: "wb1", name: "🎨 Brainstorming Canvas", updatedAt: "11:30 AM", color: "sage", elements: [] },
        { id: "wb2", name: "📐 Architecture Mapping", updatedAt: "Yesterday", color: "blue", elements: [] },
      ]);
    }

    const savedApps = localStorage.getItem("generated-apps");
    if (savedApps) setGeneratedApps(JSON.parse(savedApps));

    setIsLoading(false);
  }, []);

  // ─── Computed stats ─────────────────────────────────────────────────────────

  const allTasks = useMemo(
    () => kanbanBoards.flatMap((b) => b.columns.flatMap((c) => c.tasks)),
    [kanbanBoards]
  );

  const doneTasks = useMemo(
    () =>
      kanbanBoards.flatMap((b) =>
        b.columns
          .filter((c) => c.name.toLowerCase().includes("done") || c.name.toLowerCase().includes("complete"))
          .flatMap((c) => c.tasks)
      ),
    [kanbanBoards]
  );

  const overdueTasks = useMemo(
    () => allTasks.filter((t) => isOverdue(t.dueDate) && !doneTasks.find((d) => d.id === t.id)),
    [allTasks, doneTasks]
  );

  const pendingTasks = allTasks.length - doneTasks.length;
  const progressPct = allTasks.length > 0 ? Math.round((doneTasks.length / allTasks.length) * 100) : 0;

  const activeNotes = useMemo(() => notes.filter((n) => !n.isDeleted), [notes]);

  const upcomingItems = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return calendarScheduled
      .filter((t) => t.date && new Date(t.date) >= today)
      .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
      .slice(0, 5);
  }, [calendarScheduled]);

  const todayItems = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    return calendarScheduled.filter((t) => t.date === todayStr);
  }, [calendarScheduled]);

  // ─── Activity Feed (synthetic from real data) ───────────────────────────────

  const activityFeed: ActivityEntry[] = useMemo(() => {
    const entries: ActivityEntry[] = [];

    // From notes
    activeNotes.slice(0, 2).forEach((n) => {
      entries.push({
        id: `note-${n.id}`,
        type: "note",
        label: `Updated note "${n.title.replace(/^[^\w\s]/u, "").trim()}"`,
        time: n.updatedAt,
        icon: <FileText className="w-3.5 h-3.5" />,
        color: "bg-[#E2ECE9] text-[#4A7C70]",
      });
    });

    // From kanban
    allTasks.slice(0, 2).forEach((t) => {
      entries.push({
        id: `task-${t.id}`,
        type: "task",
        label: `Task added: "${t.title}"`,
        time: t.dueDate ? formatDateLabel(t.dueDate) : "recently",
        icon: <SquareKanban className="w-3.5 h-3.5" />,
        color: "bg-[#FCECE7] text-[#B34B2E]",
      });
    });

    // From calendar
    calendarScheduled.slice(0, 2).forEach((c) => {
      entries.push({
        id: `cal-${c.id}`,
        type: "calendar",
        label: `${c.type === "reminder" ? "Reminder" : "Task"} scheduled: "${c.title}"`,
        time: c.date ? formatDateLabel(c.date) : "recently",
        icon: <Calendar className="w-3.5 h-3.5" />,
        color: "bg-[#E8F0FE] text-[#1C54B2]",
      });
    });

    // From whiteboards
    whiteboards.slice(0, 1).forEach((wb) => {
      entries.push({
        id: `wb-${wb.id}`,
        type: "whiteboard",
        label: `Whiteboard updated: "${wb.name.replace(/^[^\w\s]/u, "").trim()}"`,
        time: wb.updatedAt,
        icon: <Palette className="w-3.5 h-3.5" />,
        color: "bg-[#FBF3DB] text-[#8E640B]",
      });
    });

    // From generated apps
    generatedApps.slice(0, 2).forEach((app) => {
      entries.push({
        id: `app-${app.id}`,
        type: "template",
        label: `Generated AI template: "${app.appName}"`,
        time: timeAgo(app.createdAt),
        icon: <Sparkles className="w-3.5 h-3.5" />,
        color: "bg-[#F0EBF8] text-[#62479B]",
      });
    });

    return entries.slice(0, 7);
  }, [activeNotes, allTasks, calendarScheduled, whiteboards, generatedApps]);

  // ─── AI Insights ────────────────────────────────────────────────────────────

  const aiInsights = useMemo(() => {
    const insights: { icon: React.ReactNode; text: string; color: string }[] = [];

    if (overdueTasks.length > 0) {
      insights.push({
        icon: <AlertTriangle className="w-3.5 h-3.5" />,
        text: `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? "s" : ""}. Consider tackling them first.`,
        color: "bg-[#FCECE7] text-[#B34B2E] border-[#F5C7BA]",
      });
    }

    if (todayItems.length > 0) {
      insights.push({
        icon: <Calendar className="w-3.5 h-3.5" />,
        text: `You have ${todayItems.length} calendar item${todayItems.length > 1 ? "s" : ""} scheduled for today.`,
        color: "bg-[#E8F0FE] text-[#1C54B2] border-[#B7D2FC]",
      });
    }

    if (progressPct >= 70) {
      insights.push({
        icon: <TrendingUp className="w-3.5 h-3.5" />,
        text: `Great work! You've completed ${progressPct}% of your total tasks this sprint.`,
        color: "bg-[#E2ECE9] text-[#2D5A4E] border-[#B2D1C8]",
      });
    }

    const mostActive =
      activeNotes.length > kanbanBoards.length
        ? "Notes"
        : kanbanBoards.length > whiteboards.length
        ? "Kanban boards"
        : "Whiteboard canvas";
    insights.push({
      icon: <Star className="w-3.5 h-3.5" />,
      text: `Your most active workspace is ${mostActive}.`,
      color: "bg-[#FBF3DB] text-[#8E640B] border-[#F2DEB1]",
    });

    const highPrio = allTasks.filter((t) => t.priority === "High" && !doneTasks.find((d) => d.id === t.id));
    if (highPrio.length > 0) {
      insights.push({
        icon: <Target className="w-3.5 h-3.5" />,
        text: `Suggested focus: You have ${highPrio.length} high-priority task${highPrio.length > 1 ? "s" : ""} pending.`,
        color: "bg-[#F0EBF8] text-[#62479B] border-[#DCD0F0]",
      });
    }

    if (generatedApps.length > 0) {
      insights.push({
        icon: <Sparkles className="w-3.5 h-3.5" />,
        text: `You've generated ${generatedApps.length} AI template app${generatedApps.length > 1 ? "s" : ""}. Pin them to your sidebar for quick access!`,
        color: "bg-[#F0EBF8] text-[#62479B] border-[#DCD0F0]",
      });
    }

    return insights.slice(0, 5);
  }, [overdueTasks, todayItems, progressPct, activeNotes, kanbanBoards, whiteboards, allTasks, doneTasks, generatedApps]);

  // ─── Quick actions ───────────────────────────────────────────────────────────

  const quickActions = [
    { label: "Create Task", icon: <SquareKanban className="w-4 h-4" />, href: "/tasks", color: "bg-[#FCECE7] text-[#B34B2E]" },
    { label: "Add Reminder", icon: <Calendar className="w-4 h-4" />, href: "/calendar", color: "bg-[#E8F0FE] text-[#1C54B2]" },
    { label: "New Note", icon: <FileText className="w-4 h-4" />, href: "/notes", color: "bg-[#E2ECE9] text-[#4A7C70]" },
    { label: "Open Whiteboard", icon: <Palette className="w-4 h-4" />, href: "/whiteboard", color: "bg-[#FBF3DB] text-[#8E640B]" },
    { label: "Ask AI", icon: <Bot className="w-4 h-4" />, href: "/ai", color: "bg-[#F0EBF8] text-[#62479B]" },
    { label: "Generate Template", icon: <Sparkles className="w-4 h-4" />, href: "/template-builder", color: "bg-[#E2ECE9] text-[#4A7C70]" },
  ];

  // ─── Feature status cards ────────────────────────────────────────────────────

  const featureCards = [
    {
      name: "Calendar",
      icon: <Calendar className="w-4 h-4" />,
      color: "bg-[#E8F0FE] text-[#1C54B2]",
      href: "/calendar",
      stat: `${calendarScheduled.length} events`,
      sub: `${todayItems.length} today`,
      status: "active",
    },
    {
      name: "Kanban / Tasks",
      icon: <SquareKanban className="w-4 h-4" />,
      color: "bg-[#FCECE7] text-[#B34B2E]",
      href: "/tasks",
      stat: `${allTasks.length} total tasks`,
      sub: `${kanbanBoards.length} board${kanbanBoards.length !== 1 ? "s" : ""}`,
      status: "active",
    },
    {
      name: "Notes",
      icon: <FileText className="w-4 h-4" />,
      color: "bg-[#E2ECE9] text-[#4A7C70]",
      href: "/notes",
      stat: `${activeNotes.length} notes`,
      sub: `${activeNotes.filter((n) => n.isPinned).length} pinned`,
      status: "active",
    },
    {
      name: "Whiteboard",
      icon: <Palette className="w-4 h-4" />,
      color: "bg-[#FBF3DB] text-[#8E640B]",
      href: "/whiteboard",
      stat: `${whiteboards.length} board${whiteboards.length !== 1 ? "s" : ""}`,
      sub: "Excalidraw canvas",
      status: "active",
    },
    {
      name: "AI Assistant",
      icon: <Bot className="w-4 h-4" />,
      color: "bg-[#F0EBF8] text-[#62479B]",
      href: "/ai",
      stat: "Ready",
      sub: "Voice + chat",
      status: "active",
    },
    {
      name: "AI Template Builder",
      icon: <Sparkles className="w-4 h-4" />,
      color: "bg-[#E2ECE9] text-[#4A7C70]",
      href: "/template-builder",
      stat: `${generatedApps.length} app${generatedApps.length !== 1 ? "s" : ""} built`,
      sub: "Prompt → mini-app",
      status: "active",
    },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3 text-[var(--muted-foreground)]">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold">Loading your workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-7">
      
      {/* ── Welcome Header ───────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-[#F0EBF8]/30 dark:to-[#1E1829]/40 border border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E2ECE9] text-[#4A7C70] text-[10px] font-extrabold dark:bg-[#1E2D29] dark:text-[#7EB5A6] mb-3 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>Workspace Ready</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">
            Good day, <span className="text-[#7F56D9]">{profile.name}</span> {profile.avatar}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1.5 font-medium max-w-lg leading-relaxed">
            Here's everything happening across your workspace today. Stay cozy and productive! ☕
          </p>
        </div>
        <div className="flex gap-3 shrink-0 flex-wrap">
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-xs font-bold hover:bg-[var(--secondary)] transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#4A7C70]" />
            <span>New Note</span>
          </Link>
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7F56D9] text-white text-xs font-bold hover:bg-[#6C42C8] transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </Link>
        </div>
      </header>

      {/* ── Feature Status Cards Row ─────────────────────────────── */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {featureCards.map((f) => (
            <Link
              key={f.name}
              href={f.href}
              className="group flex flex-col gap-2.5 p-3.5 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xs hover:shadow-md hover:border-[var(--primary)]/25 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", f.color)}>
                  {f.icon}
                </div>
                <span className="text-[8px] font-extrabold uppercase tracking-wider text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-1.5 py-0.5 rounded-full">
                  Live
                </span>
              </div>
              <div>
                <div className="text-xs font-extrabold text-[var(--foreground)]">{f.name}</div>
                <div className="text-[10px] font-semibold text-[var(--primary)] mt-0.5">{f.stat}</div>
                <div className="text-[9px] text-[var(--muted-foreground)]">{f.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Main Grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Quick Actions */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs">
            <SectionHeader
              icon={<Zap className="w-4 h-4 text-amber-500" />}
              title="Quick Actions"
            />
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {quickActions.map((a) => (
                <Link
                  key={a.label}
                  href={a.href}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[var(--secondary)]/60 border border-transparent hover:border-[var(--border)] transition-all cursor-pointer group text-center"
                >
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", a.color)}>
                    {a.icon}
                  </div>
                  <span className="text-[10px] font-bold text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] leading-tight">{a.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Task Summary + Progress */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs">
            <SectionHeader
              icon={<BarChart3 className="w-4 h-4 text-[#7F56D9]" />}
              title="Task Progress Summary"
              href="/tasks"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] text-center">
                <div className="text-xl font-extrabold text-[var(--foreground)]">{allTasks.length}</div>
                <div className="text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase mt-0.5">Total</div>
              </div>
              <div className="p-3 rounded-xl bg-[#E2ECE9] border border-[#B2D1C8] text-center">
                <div className="text-xl font-extrabold text-[#2D5A4E]">{doneTasks.length}</div>
                <div className="text-[9px] font-extrabold text-[#4A7C70] uppercase mt-0.5">Completed</div>
              </div>
              <div className="p-3 rounded-xl bg-[#FBF3DB] border border-[#F2DEB1] text-center">
                <div className="text-xl font-extrabold text-[#8E640B]">{pendingTasks}</div>
                <div className="text-[9px] font-extrabold text-[#D8A035] uppercase mt-0.5">Pending</div>
              </div>
              <div className="p-3 rounded-xl bg-[#FCECE7] border border-[#F5C7BA] text-center">
                <div className="text-xl font-extrabold text-[#B34B2E]">{overdueTasks.length}</div>
                <div className="text-[9px] font-extrabold text-[#E07A5F] uppercase mt-0.5">Overdue</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--foreground)]">
                <span>Sprint Completion</span>
                <span className="text-[#7F56D9]">{progressPct}%</span>
              </div>
              <div className="w-full h-3 bg-[var(--secondary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#7F56D9] to-[#A78BFA] rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="text-[9px] text-[var(--muted-foreground)] font-semibold">
                {doneTasks.length} of {allTasks.length} tasks completed across {kanbanBoards.length} board{kanbanBoards.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* High priority tasks preview */}
            {overdueTasks.length > 0 && (
              <div className="mt-4 space-y-1.5">
                <div className="text-[9px] font-extrabold uppercase text-[var(--muted-foreground)] tracking-wider">Overdue Tasks</div>
                {overdueTasks.slice(0, 3).map((t) => (
                  <Link key={t.id} href="/tasks" className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[#F5C7BA] bg-[#FCECE7]/60 hover:bg-[#FCECE7] transition-colors cursor-pointer">
                    <AlertTriangle className="w-3 h-3 text-[#E07A5F] shrink-0" />
                    <span className="text-[10px] font-semibold text-[#B34B2E] truncate flex-1">{t.title}</span>
                    <span className="text-[9px] text-[#E07A5F] font-bold shrink-0">{formatDateLabel(t.dueDate)}</span>
                    <span className={cn("text-[8px] px-1.5 py-0.5 rounded-full font-extrabold", priorityBadge[t.priority])}>{t.priority}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Calendar Tasks */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs">
            <SectionHeader
              icon={<Calendar className="w-4 h-4 text-[#4285F4]" />}
              title="Upcoming Calendar"
              href="/calendar"
            />
            {upcomingItems.length === 0 ? (
              <p className="text-xs text-[var(--muted-foreground)] text-center py-6">No upcoming events scheduled.</p>
            ) : (
              <div className="space-y-2">
                {upcomingItems.map((item) => {
                  const cs = calColorMap[item.color] || calColorMap.sage;
                  return (
                    <Link key={item.id} href="/calendar" className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--secondary)]/40 transition-all cursor-pointer group">
                      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border", cs.bg, cs.border)}>
                        {item.type === "reminder" ? (
                          <Clock className={cn("w-3.5 h-3.5", cs.text)} />
                        ) : (
                          <CheckCircle2 className={cn("w-3.5 h-3.5", cs.text)} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-[var(--foreground)] truncate">{item.title}</div>
                        <div className="text-[9px] text-[var(--muted-foreground)] font-semibold mt-0.5">{item.category}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={cn("text-[9px] font-extrabold px-2 py-0.5 rounded-full", cs.bg, cs.text, "border", cs.border)}>
                          {formatDateLabel(item.date!)}
                        </div>
                        <div className="text-[8px] text-[var(--muted-foreground)] mt-0.5 capitalize">{item.type}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Pages */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs">
            <SectionHeader
              icon={<BookOpen className="w-4 h-4 text-[#D8A035]" />}
              title="Recent Pages & Documents"
              href="/spaces"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Notes */}
              {activeNotes.slice(0, 2).map((n) => (
                <Link key={n.id} href="/notes" className="group flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--secondary)]/40 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-xl bg-[#E2ECE9] text-[#4A7C70] flex items-center justify-center shrink-0 text-base">{n.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-[var(--foreground)] truncate">{n.title.replace(/^[^\w\s]/u, "").trim()}</div>
                    <div className="text-[9px] text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5" />{n.updatedAt}
                    </div>
                  </div>
                  <span className="text-[8px] font-extrabold uppercase text-[var(--muted-foreground)] bg-[var(--secondary)] px-1.5 py-0.5 rounded-full">Note</span>
                </Link>
              ))}
              {/* Whiteboards */}
              {whiteboards.slice(0, 2).map((wb) => (
                <Link key={wb.id} href="/whiteboard" className="group flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--secondary)]/40 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-xl bg-[#FBF3DB] text-[#8E640B] flex items-center justify-center shrink-0">
                    <Palette className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-[var(--foreground)] truncate">{wb.name.replace(/^[^\w\s]/u, "").trim()}</div>
                    <div className="text-[9px] text-[var(--muted-foreground)] flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5" />{wb.updatedAt}
                    </div>
                  </div>
                  <span className="text-[8px] font-extrabold uppercase text-[var(--muted-foreground)] bg-[var(--secondary)] px-1.5 py-0.5 rounded-full">Canvas</span>
                </Link>
              ))}
              {/* Kanban */}
              {kanbanBoards.slice(0, 2).map((b) => (
                <Link key={b.id} href="/tasks" className="group flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--secondary)]/40 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-xl bg-[#FCECE7] text-[#B34B2E] flex items-center justify-center shrink-0">
                    <SquareKanban className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-[var(--foreground)] truncate">{b.name.replace(/^[^\w\s]/u, "").trim()}</div>
                    <div className="text-[9px] text-[var(--muted-foreground)] mt-0.5">
                      {b.columns.flatMap((c) => c.tasks).length} tasks
                    </div>
                  </div>
                  <span className="text-[8px] font-extrabold uppercase text-[var(--muted-foreground)] bg-[var(--secondary)] px-1.5 py-0.5 rounded-full">Board</span>
                </Link>
              ))}
              {/* Generated Apps */}
              {generatedApps.slice(0, 2).map((app) => (
                <Link key={app.id} href={`/template-builder/${app.id}`} className="group flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--secondary)]/40 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base" style={{ backgroundColor: `${app.color}15` }}>
                    {app.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-[var(--foreground)] truncate">{app.appName}</div>
                    <div className="text-[9px] text-[var(--muted-foreground)] mt-0.5">{app.description.slice(0, 30)}...</div>
                  </div>
                  <span className="text-[8px] font-extrabold uppercase text-[var(--muted-foreground)] bg-[var(--secondary)] px-1.5 py-0.5 rounded-full">App</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT column (1/3 width) */}
        <div className="space-y-6">

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-[#F0EBF8] to-white dark:from-[#1E1A2E] dark:to-[var(--card)] border border-[#E5DBF0] dark:border-[#3E2D54] rounded-2xl p-5 shadow-xs">
            <SectionHeader
              icon={<Sparkles className="w-4 h-4 text-[#8E75C4]" />}
              title="AI Insights"
              href="/ai"
              linkLabel="Ask AI"
            />
            <div className="space-y-2.5">
              {aiInsights.length === 0 ? (
                <p className="text-[10px] text-[var(--muted-foreground)] text-center py-4">
                  Start using the app to get personalized insights!
                </p>
              ) : (
                aiInsights.map((ins, i) => (
                  <div key={i} className={cn("flex items-start gap-2.5 p-3 rounded-xl border text-xs font-semibold", ins.color)}>
                    <span className="shrink-0 mt-0.5">{ins.icon}</span>
                    <span className="leading-relaxed">{ins.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs">
            <SectionHeader
              icon={<Activity className="w-4 h-4 text-[#4A7C70]" />}
              title="Recent Activity"
            />
            {activityFeed.length === 0 ? (
              <p className="text-[10px] text-[var(--muted-foreground)] text-center py-6">No activity yet. Start creating!</p>
            ) : (
              <div className="space-y-2">
                {activityFeed.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[var(--secondary)]/40 transition-colors">
                    <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5", entry.color)}>
                      {entry.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-[var(--foreground)] leading-snug">{entry.label}</p>
                      <span className="text-[9px] text-[var(--muted-foreground)]">{entry.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Assistant quick shortcut */}
          <Link
            href="/ai"
            className="block group bg-gradient-to-br from-[#7F56D9] to-[#9B72EF] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-white">CozyAI Assistant</div>
                <div className="text-[10px] text-white/70 font-medium">Your workspace command center</div>
              </div>
            </div>
            <p className="text-[10px] text-white/80 leading-relaxed mb-3">
              Ask AI to create tasks, write notes, schedule reminders, or generate mini-apps — all with a single prompt.
            </p>
            <div className="flex items-center gap-1 text-[10px] font-extrabold text-white/90 group-hover:gap-2 transition-all">
              <span>Open AI Chat</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Spaces quick link */}
          <Link
            href="/spaces"
            className="block group bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[var(--primary)]/20 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#E2ECE9] text-[#4A7C70] flex items-center justify-center">
                <Layout className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-[var(--foreground)]">Pages & Spaces</div>
                <div className="text-[9px] text-[var(--muted-foreground)] font-semibold">Organize docs & folders</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--muted-foreground)] ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
