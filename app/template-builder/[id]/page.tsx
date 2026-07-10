"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Wand2,
  ArrowLeft,
  PlusCircle,
  MinusCircle,
  Plus,
  Check,
  HelpCircle,
  Trash2,
  Activity,
  Flame,
  DollarSign,
  Utensils,
  BookOpen,
  Box,
  Layers,
  ChevronRight,
  TrendingUp,
  PieChart,
  Layout
} from "lucide-react";
import Link from "next/link";
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

export default function AppPreview() {
  const params = useParams();
  const router = useRouter();
  const appId = params.id as string;

  const [app, setApp] = useState<GeneratedApp | null>(null);
  const [sidebarApps, setSidebarApps] = useState<any[]>([]);
  const [formInputs, setFormInputs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Load app details
  useEffect(() => {
    const loadData = () => {
      const savedApps = JSON.parse(localStorage.getItem("generated-apps") || "[]");
      const targetApp = savedApps.find((a: any) => a.id === appId);
      const savedSidebar = JSON.parse(localStorage.getItem("sidebar-apps") || "[]");
      
      if (targetApp) {
        setApp(targetApp);
      }
      setSidebarApps(savedSidebar);
      setLoading(false);
    };
    loadData();
    window.addEventListener("sidebar-apps-changed", loadData);
    return () => window.removeEventListener("sidebar-apps-changed", loadData);
  }, [appId]);

  const isPinned = useMemo(() => {
    return sidebarApps.some((s) => s.id === appId);
  }, [sidebarApps, appId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF8F5]">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary)]" />
          <span className="text-xs font-bold text-[var(--muted-foreground)]">Loading Mini-App...</span>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="p-10 text-center space-y-4 max-w-md mx-auto">
        <Layout className="w-10 h-10 mx-auto text-[var(--muted-foreground)] opacity-40" />
        <h2 className="text-sm font-bold text-[var(--foreground)]">Template app not found</h2>
        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">This template app does not exist or was deleted by the user.</p>
        <Link href="/template-builder" className="inline-block px-4 py-2 bg-[#7F56D9] text-white text-xs font-semibold rounded-xl">
          Back to Builder
        </Link>
      </div>
    );
  }

  const IconComponent = getAppIcon(app.icon);



  // Helper: Recalculate stats and progress rate dynamically based on current sections data
  const syncStatsAndProgress = (sections: any[]): any[] => {
    let updated = [...sections];

    // Find checklist details
    let totalCheckboxes = 0;
    let checkedCount = 0;
    let checklistSec = updated.find((s) => s.type === "checklist");
    if (checklistSec) {
      checklistSec.items.forEach((item: any) => {
        totalCheckboxes++;
        if (item.checked) checkedCount++;
      });
    }

    // Find table details (for Budget expenses)
    let totalSpent = 0;
    let tableSec = updated.find((s) => s.type === "table");
    if (tableSec && app?.appName.includes("Budget")) {
      tableSec.items.forEach((item: any) => {
        if (item.values && item.values[2]) {
          const valStr = item.values[2].toString().replace(/[$,\s]/g, "");
          const num = parseFloat(valStr);
          if (!isNaN(num)) {
            totalSpent += num;
          }
        }
      });
    }

    // Update Progress Bars
    updated = updated.map((sec) => {
      if (sec.type === "progress") {
        if (app?.appName.includes("Budget")) {
          const pct = Math.min(100, Math.round((totalSpent / 4200) * 100));
          return { ...sec, value: pct };
        } else if (totalCheckboxes > 0) {
          const pct = Math.round((checkedCount / totalCheckboxes) * 100);
          return { ...sec, value: pct };
        }
      }
      return sec;
    });

    // Update Stats Cards
    updated = updated.map((sec) => {
      if (sec.type === "stats") {
        const updatedItems = sec.items.map((stat: any) => {
          if (stat.label === "Completed Today" && totalCheckboxes > 0) {
            return { ...stat, value: `${checkedCount} / ${totalCheckboxes}`, sub: `${Math.round((checkedCount / totalCheckboxes) * 100)}% complete` };
          }
          if (stat.label === "Spent So Far") {
            return { ...stat, value: `$${totalSpent.toLocaleString([], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: `${Math.round((totalSpent / 4200) * 100)}% of budget` };
          }
          if (stat.label === "Remainder Balance") {
            const remainder = 4200 - totalSpent;
            return { ...stat, value: `$${remainder.toLocaleString([], { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: remainder >= 0 ? "Safe to spend" : "Budget exceeded!" };
          }
          if (stat.label === "Completed Topics" && totalCheckboxes > 0) {
            return { ...stat, value: `${checkedCount} / ${totalCheckboxes} Topics`, sub: `${Math.round((checkedCount / totalCheckboxes) * 100)}% complete` };
          }
          return stat;
        });
        return { ...sec, items: updatedItems };
      }
      return sec;
    });

    return updated;
  };

  // Toggle checklist check items state
  const handleToggleCheckItem = (sectionId: string, itemId: string) => {
    if (!app) return;

    let updatedSections = app.sections.map((sec) => {
      if (sec.id === sectionId && sec.type === "checklist") {
        const updatedItems = sec.items.map((item: any) =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        );
        return { ...sec, items: updatedItems };
      }
      return sec;
    });

    updatedSections = syncStatsAndProgress(updatedSections);

    const updatedApp = { ...app, sections: updatedSections };
    setApp(updatedApp);

    const savedApps = JSON.parse(localStorage.getItem("generated-apps") || "[]");
    const updatedAll = savedApps.map((a: any) => (a.id === app.id ? updatedApp : a));
    localStorage.setItem("generated-apps", JSON.stringify(updatedAll));
  };

  // Add a item dynamically via form logs input
  const handleFormSubmit = (e: React.FormEvent, sectionId: string) => {
    e.preventDefault();
    if (!app) return;

    const formSection = app.sections.find((s) => s.id === sectionId);
    if (!formSection || !formSection.fields) return;

    const values = formSection.fields.map((field: string) => formInputs[`${sectionId}-${field}`] || "");
    if (values.some((v: string) => !v.trim())) {
      alert("Please fill out all form inputs!");
      return;
    }

    let updatedSections = [...app.sections];
    let added = false;

    const checklistSectionIdx = updatedSections.findIndex((s) => s.type === "checklist");
    if (checklistSectionIdx !== -1 && app.appName.includes("Habit")) {
      const targetSec = updatedSections[checklistSectionIdx];
      const newItem = {
        id: `item-${Date.now()}`,
        text: values[0],
        checked: false
      };
      updatedSections[checklistSectionIdx] = {
        ...targetSec,
        items: [...targetSec.items, newItem]
      };
      added = true;
    }

    const tableSectionIdx = updatedSections.findIndex((s) => s.type === "table");
    if (tableSectionIdx !== -1 && !added) {
      const targetSec = updatedSections[tableSectionIdx];
      const newRow = {
        id: `row-${Date.now()}`,
        values
      };
      updatedSections[tableSectionIdx] = {
        ...targetSec,
        items: [...targetSec.items, newRow]
      };
      added = true;
    }

    if (!added && checklistSectionIdx !== -1) {
      const targetSec = updatedSections[checklistSectionIdx];
      const newItem = {
        id: `item-${Date.now()}`,
        text: values.join(" - "),
        checked: false
      };
      updatedSections[checklistSectionIdx] = {
        ...targetSec,
        items: [...targetSec.items, newItem]
      };
      added = true;
    }

    const clearedInputs = { ...formInputs };
    formSection.fields.forEach((field: string) => {
      delete clearedInputs[`${sectionId}-${field}`];
    });
    setFormInputs(clearedInputs);

    updatedSections = syncStatsAndProgress(updatedSections);

    const updatedApp = { ...app, sections: updatedSections };
    setApp(updatedApp);

    const savedApps = JSON.parse(localStorage.getItem("generated-apps") || "[]");
    const updatedAll = savedApps.map((a: any) => (a.id === app.id ? updatedApp : a));
    localStorage.setItem("generated-apps", JSON.stringify(updatedAll));
  };

  const handlePinToSidebar = () => {
    const isAlreadyPinned = sidebarApps.some((s) => s.id === appId);
    if (isAlreadyPinned) {
      const updated = sidebarApps.filter((s) => s.id !== appId);
      localStorage.setItem("sidebar-apps", JSON.stringify(updated));
      setSidebarApps(updated);
      window.dispatchEvent(new Event("sidebar-apps-changed"));
    } else {
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

  const handleInputChange = (sectionId: string, field: string, value: string) => {
    setFormInputs((prev) => ({
      ...prev,
      [`${sectionId}-${field}`]: value
    }));
  };

  const topSections = useMemo(() => {
    return app ? app.sections.filter((s) => s.type === "stats" || s.type === "progress") : [];
  }, [app]);

  const mainSections = useMemo(() => {
    return app ? app.sections.filter((s) => s.type === "checklist" || s.type === "table") : [];
  }, [app]);

  const formSections = useMemo(() => {
    return app ? app.sections.filter((s) => s.type === "form") : [];
  }, [app]);

  const renderSection = (section: any) => {
    if (section.type === "stats") {
      return (
        <div key={section.id} className="space-y-2">
          <h2 className="text-xs font-extrabold text-[var(--foreground)] uppercase tracking-wider text-left">
            {section.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {section.items.map((stat: any, idx: number) => (
              <div key={idx} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <span className="text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase text-left">
                  {stat.label}
                </span>
                <div className="text-xl font-extrabold mt-2 text-left" style={{ color: app.color }}>
                  {stat.value}
                </div>
                <span className="text-[9px] text-[var(--muted-foreground)] font-semibold mt-1 text-left">
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (section.type === "progress") {
      return (
        <div key={section.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-2.5">
          <div className="flex justify-between items-center text-xs font-extrabold">
            <span>{section.title}</span>
            <span style={{ color: app.color }}>{section.value}%</span>
          </div>
          <div className="w-full bg-[var(--secondary)] h-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${section.value}%`,
                backgroundColor: app.color
              }}
            />
          </div>
        </div>
      );
    }

    if (section.type === "checklist") {
      return (
        <div key={section.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-3.5">
          <h3 className="text-xs font-extrabold text-[var(--foreground)] uppercase tracking-wider text-left">
            {section.title}
          </h3>
          <div className="space-y-2">
            {section.items.map((item: any) => (
              <label
                key={item.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--secondary)]/40 transition-colors cursor-pointer border border-transparent font-semibold text-xs text-[var(--foreground)]",
                  item.checked && "opacity-60 line-through"
                )}
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleToggleCheckItem(section.id, item.id)}
                  className="rounded border-[var(--border)] text-[#7F56D9] focus:ring-[#7F56D9] cursor-pointer w-4 h-4"
                />
                <span>{item.text}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    if (section.type === "table") {
      return (
        <div key={section.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[var(--border)] bg-[var(--secondary)]/10">
            <h3 className="text-xs font-extrabold text-[var(--foreground)] uppercase tracking-wider text-left">
              {section.title}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-semibold">
              <thead>
                <tr className="border-b border-[var(--border)] text-[9px] font-extrabold uppercase text-[var(--muted-foreground)] bg-[var(--secondary)]/30">
                  {section.headers.map((h: string, idx: number) => (
                    <th key={idx} className="py-2.5 px-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {section.items.map((item: any) => (
                  <tr key={item.id} className="hover:bg-[var(--secondary)]/10 transition-colors">
                    {item.values.map((v: string, idx: number) => (
                      <td key={idx} className="py-3 px-4">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (section.type === "form") {
      return (
        <div key={section.id} className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-extrabold text-[var(--foreground)] uppercase tracking-wider text-left">
            {section.title}
          </h3>
          <form onSubmit={(e) => handleFormSubmit(e, section.id)} className="space-y-4">
            {section.fields.map((field: string) => (
              <div key={field} className="space-y-1.5 text-left">
                <label className="block text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase">
                  {field}
                </label>
                <input
                  type="text"
                  required
                  value={formInputs[`${section.id}-${field}`] || ""}
                  onChange={(e) => handleInputChange(section.id, field, e.target.value)}
                  placeholder={`Enter ${field.toLowerCase()}...`}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#D95B96] transition-all font-semibold"
                />
              </div>
            ))}
            
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs mt-2"
              style={{ backgroundColor: app.color }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Entry</span>
            </button>
          </form>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl w-full mx-auto space-y-6 select-none font-sans">
      
      {/* Breadcrumb path */}
      <div className="flex items-center gap-1 text-[10px] font-extrabold text-[var(--muted-foreground)]">
        <Link href="/template-builder" className="hover:text-[#D95B96]">
          AI Template Builder
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--foreground)] truncate max-w-[150px]">{app.appName}</span>
      </div>

      {/* Header bar actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <Link
            href="/template-builder"
            className="p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border border-black/5"
            style={{
              backgroundColor: `${app.color}15`,
              color: app.color
            }}
          >
            <IconComponent className="w-5 h-5" />
          </div>

          <div className="text-left">
            <h1 className="text-lg md:text-xl font-extrabold text-[var(--foreground)] tracking-tight">
              {app.appName}
            </h1>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {app.description}
            </p>
          </div>
        </div>

        {/* Pin to sidebar option */}
        <button
          onClick={handlePinToSidebar}
          className={cn(
            "px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs",
            isPinned
              ? "bg-[#FCEAF3] border-[#F5C7BA] text-[#D95B96] hover:bg-[#F7DBD0]"
              : "bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
          )}
        >
          {isPinned ? <MinusCircle className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          <span>{isPinned ? "Remove Shortcut" : "Add to Sidebar"}</span>
        </button>
      </div>

      {/* Dynamic Section rendering from App Schema JSON */}
      <div className="space-y-6">
        {/* Render Top sections (Stats & Progress) */}
        {topSections.length > 0 && (
          <div className="space-y-6">
            {topSections.map(renderSection)}
          </div>
        )}

        {/* Render Main content and forms side-by-side */}
        {(mainSections.length > 0 || formSections.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 space-y-6">
              {mainSections.map(renderSection)}
            </div>
            <div className="md:col-span-1 space-y-6">
              {formSections.map(renderSection)}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

// Loading state helper component
function RefreshCw(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
      <path d="M16 16h5v5" />
    </svg>
  );
}
