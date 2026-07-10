"use client";

import React, { useState, useEffect } from "react";
import {
  Wand2,
  Plus,
  Sparkles,
  RefreshCw,
  Trash2,
  ExternalLink,
  PlusCircle,
  MinusCircle,
  FileCheck,
  ChevronRight,
  HelpCircle,
  Layout,
  Flame,
  DollarSign,
  Utensils,
  BookOpen,
  Activity,
  Box
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface GeneratedApp {
  id: string;
  appName: string;
  description: string;
  icon: string;
  color: string;
  layout: string;
  createdDate: string;
  sections: any[];
}

const getAppIcon = (iconName: string) => {
  switch (iconName) {
    case "Flame": return Flame;
    case "DollarSign": return DollarSign;
    case "Utensils": return Utensils;
    case "BookOpen": return BookOpen;
    case "Activity": return Activity;
    default: return Box;
  }
};

export default function TemplateBuilder() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [apps, setApps] = useState<GeneratedApp[]>([]);
  const [sidebarApps, setSidebarApps] = useState<any[]>([]);

  // Load apps from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const savedApps = JSON.parse(localStorage.getItem("generated-apps") || "[]");
      const savedSidebar = JSON.parse(localStorage.getItem("sidebar-apps") || "[]");
      setApps(savedApps);
      setSidebarApps(savedSidebar);
    };
    loadData();
    window.addEventListener("sidebar-apps-changed", loadData);
    return () => window.removeEventListener("sidebar-apps-changed", loadData);
  }, []);

  // AI template builder simulation
  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setGenerating(true);

    setTimeout(() => {
      const q = prompt.toLowerCase();
      let appName = "Cozy Task Tracker";
      let desc = "Track goals and list checks on the go.";
      let icon = "Activity";
      let color = "#7F56D9";
      let sections: any[] = [];

      // Keyword matching procedural generator
      if (q.includes("habit") || q.includes("routine") || q.includes("streak") || q.includes("health")) {
        appName = "Habit Streak Tracker";
        desc = "Track daily habits, streaks, and healthy routines.";
        icon = "Flame";
        color = "#F97316"; // Orange
        sections = [
          {
            id: "sec-stats",
            title: "Streak Summary",
            type: "stats",
            items: [
              { label: "Completed Today", value: "3 / 4", sub: "75% complete" },
              { label: "Longest Streak", value: "18 Days", sub: "Flame Active 🔥" },
              { label: "Weekly Average", value: "88%", sub: "Up 5% this week" }
            ]
          },
          {
            id: "sec-progress",
            title: "Weekly Success Rate",
            type: "progress",
            value: 75,
            label: "Overall Progress"
          },
          {
            id: "sec-checks",
            title: "My Daily Habits",
            type: "checklist",
            items: [
              { id: "h1", text: "Drink 3L of Water", checked: true },
              { id: "h2", text: "Read 10 Book Pages", checked: true },
              { id: "h3", text: "Exercise 30 mins", checked: false },
              { id: "h4", text: "Meditate 10 mins", checked: true }
            ]
          },
          {
            id: "sec-form",
            title: "Add New Habit Track",
            type: "form",
            fields: ["Habit Name", "Frequency", "Time of Day"]
          }
        ];
      } else if (q.includes("budget") || q.includes("money") || q.includes("finance") || q.includes("expense") || q.includes("spend")) {
        appName = "Cozy Budget Planner";
        desc = "Track cash flow, recent spendings, and budget goals.";
        icon = "DollarSign";
        color = "#10B981"; // Emerald Green
        sections = [
          {
            id: "sec-stats",
            title: "Balance Outlook",
            type: "stats",
            items: [
              { label: "Monthly Income", value: "$4,200", sub: "Salary locked" },
              { label: "Spent So Far", value: "$1,840", sub: "43.8% of budget" },
              { label: "Remainder Balance", value: "$2,360", sub: "Safe to spend" }
            ]
          },
          {
            id: "sec-progress",
            title: "Budget Safe Limit",
            type: "progress",
            value: 43.8,
            label: "Monthly Limit"
          },
          {
            id: "sec-table",
            title: "Recent Transactions Log",
            type: "table",
            headers: ["Merchant/Item", "Category", "Amount"],
            items: [
              { id: "t1", values: ["Cozy Coffee Corner", "Food & Drink", "$6.50"] },
              { id: "t2", values: ["City Transit Subway", "Transport", "$12.00"] },
              { id: "t3", values: ["Workspace SaaS Sub", "SaaS Tools", "$15.00"] },
              { id: "t4", values: ["Whole Foods Market", "Groceries", "$84.90"] }
            ]
          },
          {
            id: "sec-form",
            title: "Log Expense Entry",
            type: "form",
            fields: ["Merchant Name", "Category Select", "Amount ($)"]
          }
        ];
      } else if (q.includes("meal") || q.includes("diet") || q.includes("food") || q.includes("recipe") || q.includes("cook")) {
        appName = "Cozy Meal Planner";
        desc = "Plan weekly dinner recipes and shopping lists.";
        icon = "Utensils";
        color = "#EF4444"; // Red
        sections = [
          {
            id: "sec-table",
            title: "Dinner Meal Plan Grid",
            type: "table",
            headers: ["Weekday", "Meal Dish", "Cook Duration"],
            items: [
              { id: "m1", values: ["Monday", "Taco Bowl salad", "15 mins"] },
              { id: "m2", values: ["Tuesday", "Pesto Chicken Pasta", "20 mins"] },
              { id: "m3", values: ["Wednesday", "Garlic Butter Salmon", "25 mins"] },
              { id: "m4", values: ["Thursday", "Stir-fry Veggie Rice", "12 mins"] }
            ]
          },
          {
            id: "sec-checks",
            title: "Grocery Shopping Checklist",
            type: "checklist",
            items: [
              { id: "g1", text: "Organic Spinach pack", checked: true },
              { id: "g2", text: "Pesto Sauce jar", checked: false },
              { id: "g3", text: "Salmon fillets 500g", checked: false },
              { id: "g4", text: "Avocados bag", checked: true }
            ]
          },
          {
            id: "sec-form",
            title: "Add Weekday Recipe",
            type: "form",
            fields: ["Weekday Target", "Dish Name", "Cooking Duration"]
          }
        ];
      } else if (q.includes("study") || q.includes("exam") || q.includes("learn") || q.includes("course") || q.includes("school")) {
        appName = "Study Revision Planner";
        desc = "Plan study modules, revision checklists, and track subjects.";
        icon = "BookOpen";
        color = "#8B5CF6"; // Purple
        sections = [
          {
            id: "sec-stats",
            title: "Study Tracker",
            type: "stats",
            items: [
              { label: "Total Subjects", value: "5 Modules", sub: "Active sem" },
              { label: "Completed Topics", value: "14 / 22", sub: "63.6% complete" },
              { label: "Countdown to Exams", value: "24 Days", sub: "June 4th target" }
            ]
          },
          {
            id: "sec-progress",
            title: "Sem Completion Rate",
            type: "progress",
            value: 63.6,
            label: "Semester Goals"
          },
          {
            id: "sec-checks",
            title: "Exam Topic Checklist",
            type: "checklist",
            items: [
              { id: "s1", text: "Algorithms: Graph DFS / BFS", checked: true },
              { id: "s2", text: "Databases: SQL Join Queries", checked: true },
              { id: "s3", text: "Compilers: Lexical Tokenization", checked: false },
              { id: "s4", text: "Networks: TCP Handshake loops", checked: false }
            ]
          },
          {
            id: "sec-form",
            title: "Log Study Session Hours",
            type: "form",
            fields: ["Subject Module", "Study Duration (mins)", "Notes summary"]
          }
        ];
      } else {
        // Generic dynamic dashboard builder based on prompt
        const formattedPrompt = prompt.charAt(0).toUpperCase() + prompt.slice(1);
        appName = `${formattedPrompt.substring(0, 24)} Dashboard`;
        desc = `AI Generated template for: "${prompt}"`;
        icon = "Box";
        color = "#3B82F6"; // Blue
        sections = [
          {
            id: "sec-stats",
            title: "KPI Overview Summary",
            type: "stats",
            items: [
              { label: "Logs Created", value: "8 Entries", sub: "Synced just now" },
              { label: "Status Rate", value: "Good", sub: "Active workspace" },
              { label: "Remaining Checks", value: "4 Tasks", sub: "In-progress" }
            ]
          },
          {
            id: "sec-checks",
            title: "Active Tracker Checklist",
            type: "checklist",
            items: [
              { id: "c1", text: "Review first checklist target", checked: false },
              { id: "c2", text: "Finalize parameter updates", checked: true },
              { id: "c3", text: "Optimize design grid margins", checked: false }
            ]
          },
          {
            id: "sec-form",
            title: "Scaffold Log Form",
            type: "form",
            fields: ["Item Name", "Status Choice", "Target date"]
          }
        ];
      }

      const newApp: GeneratedApp = {
        id: `app-${Date.now()}`,
        appName,
        description: desc,
        icon,
        color,
        layout: "single-page",
        createdDate: new Date().toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }),
        sections
      };

      const updatedApps = [newApp, ...apps];
      localStorage.setItem("generated-apps", JSON.stringify(updatedApps));
      setApps(updatedApps);

      setPrompt("");
      setGenerating(false);

      // Navigate to the newly generated app's preview page
      router.push(`/template-builder/${newApp.id}`);
    }, 2000);
  };

  // Add / Pin app to sidebar
  const handlePinToSidebar = (app: GeneratedApp, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const isAlreadyPinned = sidebarApps.some((s) => s.id === app.id);
    if (isAlreadyPinned) {
      // Remove it
      const updated = sidebarApps.filter((s) => s.id !== app.id);
      localStorage.setItem("sidebar-apps", JSON.stringify(updated));
      setSidebarApps(updated);
      window.dispatchEvent(new Event("sidebar-apps-changed"));
    } else {
      // Add it
      if (sidebarApps.length >= 3) {
        alert("Maximum 3 generated apps can be added to the sidebar! Please remove an existing app first.");
        return;
      }
      const updated = [...sidebarApps, { id: app.id, appName: app.appName, icon: app.icon, color: app.color }];
      localStorage.setItem("sidebar-apps", JSON.stringify(updated));
      setSidebarApps(updated);
      window.dispatchEvent(new Event("sidebar-apps-changed"));
    }
  };

  // Delete App
  const handleDeleteApp = (appId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this template app?")) return;

    const updatedApps = apps.filter((a) => a.id !== appId);
    localStorage.setItem("generated-apps", JSON.stringify(updatedApps));
    setApps(updatedApps);

    // Also remove from sidebar if pinned
    const updatedSidebar = sidebarApps.filter((s) => s.id !== appId);
    localStorage.setItem("sidebar-apps", JSON.stringify(updatedSidebar));
    setSidebarApps(updatedSidebar);
    window.dispatchEvent(new Event("sidebar-apps-changed"));
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl w-full mx-auto space-y-6 select-none">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-[#D95B96]/10 text-[#D95B96] flex items-center justify-center">
              <Wand2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-bold text-[#D95B96] uppercase tracking-wider">AI Generator Labs</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
            AI Template Builder
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5 font-medium">
            Describe your productivity workflow idea and let AI generate complete single-page trackers, planners, or expense loggers.
          </p>
        </div>
      </header>

      {/* Main prompt input panel */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-4">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-2">
              Describe your dynamic template idea
            </label>
            <div className="relative">
              <input
                type="text"
                required
                disabled={generating}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Habit Tracker for routines, or Budget Tracker with grocery logs..."
                className="w-full pl-4 pr-32 py-3.5 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-1 focus:ring-[#D95B96] text-[var(--foreground)] font-semibold shadow-xs"
              />
              
              <button
                type="submit"
                disabled={generating || !prompt.trim()}
                className="absolute right-2 top-1.5 bottom-1.5 px-4 rounded-lg bg-[#D95B96] text-white hover:bg-[#C24E83] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Compiling...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>Build App</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Created Apps Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-xs font-extrabold text-[var(--foreground)] uppercase tracking-wider">
            Created Mini-Apps ({apps.length})
          </h2>
        </div>

        {apps.length === 0 ? (
          <div className="text-center py-20 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-xs">
            <Layout className="w-8 h-8 mx-auto text-[var(--muted-foreground)] opacity-40 mb-2" />
            <p className="text-xs font-bold text-[var(--muted-foreground)]">No mini-apps created yet.</p>
            <p className="text-[10px] text-[var(--muted-foreground)] mt-1 font-semibold">Enter a prompt above to compile a habit tracker, budget planner, or meal grid.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {apps.map((app) => {
              const IconComponent = getAppIcon(app.icon);
              const isPinned = sidebarApps.some((s) => s.id === app.id);
              return (
                <div
                  key={app.id}
                  onClick={() => router.push(`/template-builder/${app.id}`)}
                  className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group h-[180px]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                        style={{
                          backgroundColor: `${app.color}15`,
                          color: app.color
                        }}
                      >
                        <IconComponent className="w-4.5 h-4.5" />
                      </div>

                      {/* Dropdown Options */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        
                        {/* Pin/Unpin Sidebar */}
                        <button
                          onClick={(e) => handlePinToSidebar(app, e)}
                          className={cn(
                            "p-1.5 rounded-lg hover:bg-[var(--secondary)] transition-all cursor-pointer",
                            isPinned ? "text-[#D95B96]" : "text-[var(--muted-foreground)]"
                          )}
                          title={isPinned ? "Remove from Sidebar" : "Pin to Sidebar"}
                        >
                          {isPinned ? <MinusCircle className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={(e) => handleDeleteApp(app.id, e)}
                          className="p-1.5 rounded-lg hover:bg-[#F9EAEB] text-[var(--muted-foreground)] hover:text-[#D36A73] transition-all cursor-pointer"
                          title="Delete App"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-sm text-[var(--foreground)] group-hover:text-[#D95B96] transition-colors truncate">
                      {app.appName}
                    </h3>
                    <p className="text-[11px] text-[var(--muted-foreground)] mt-1 line-clamp-2 leading-relaxed">
                      {app.description}
                    </p>
                  </div>

                  <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between mt-4 text-[10px] font-bold text-[var(--muted-foreground)]">
                    <span>Created: {app.createdDate}</span>
                    <span className="text-[#D95B96] group-hover:underline flex items-center gap-0.5">
                      <span>Preview</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-2xl text-[10px] font-bold text-[var(--muted-foreground)] leading-normal flex items-start gap-2 shadow-xs">
        <HelpCircle className="w-4.5 h-4.5 text-[#D95B96] shrink-0 mt-0.5" />
        <div>
          <p className="text-[var(--foreground)] font-extrabold mb-0.5">How it works</p>
          <span>Describe your tracker idea. AI will compile stats, lists, grids, forms, and charts layout into a dynamic mini dashboard. You can add up to 3 generated apps to the main sidebar for quick shortcut accessibility.</span>
        </div>
      </div>

    </div>
  );
}
