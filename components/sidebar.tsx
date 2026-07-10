"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  Calendar,
  SquareKanban,
  FileText,
  Palette,
  FolderKanban,
  Wand2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Coffee,
  User,
  Flame,
  DollarSign,
  Utensils,
  BookOpen,
  Activity,
  Box
} from "lucide-react";
import { cn } from "@/lib/utils";

// Map string icon names to Lucide components
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

// Define menu item structure
interface MenuItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  darkColor: string;
  darkBgColor: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: "Workspace",
    items: [
      {
        label: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
        color: "text-[#4A7C70]",
        bgColor: "bg-[#E2ECE9]",
        darkColor: "dark:text-[#7EB5A6]",
        darkBgColor: "dark:bg-[#1E2D29]",
      },
      {
        label: "AI Assistant",
        path: "/ai",
        icon: Sparkles,
        color: "text-[#8E75C4]",
        bgColor: "bg-[#F0EBF8]",
        darkColor: "dark:text-[#B49FE6]",
        darkBgColor: "dark:bg-[#2C213D]",
      },
      {
        label: "Pages / Spaces",
        path: "/spaces",
        icon: FolderKanban,
        color: "text-[#5F9E77]",
        bgColor: "bg-[#EAF5E9]",
        darkColor: "dark:text-[#90C8A4]",
        darkBgColor: "dark:bg-[#1C2F24]",
      },
    ]
  },
  {
    title: "Productivity",
    items: [
      {
        label: "Whiteboard",
        path: "/whiteboard",
        icon: Palette,
        color: "text-[#E07A5F]",
        bgColor: "bg-[#FCECE7]",
        darkColor: "dark:text-[#F4A793]",
        darkBgColor: "dark:bg-[#3D251E]",
      },
      {
        label: "Task / Kanban",
        path: "/tasks",
        icon: SquareKanban,
        color: "text-[#D8A035]",
        bgColor: "bg-[#FBF3DB]",
        darkColor: "dark:text-[#E9C37A]",
        darkBgColor: "dark:bg-[#3D311B]",
      },
      {
        label: "Calendar",
        path: "/calendar",
        icon: Calendar,
        color: "text-[#D36A73]",
        bgColor: "bg-[#F9EAEB]",
        darkColor: "dark:text-[#E89BA2]",
        darkBgColor: "dark:bg-[#3D2224]",
      },
      {
        label: "Notes",
        path: "/notes",
        icon: FileText,
        color: "text-[#4285F4]",
        bgColor: "bg-[#E8F0FE]",
        darkColor: "dark:text-[#7CABFA]",
        darkBgColor: "dark:bg-[#1B2945]",
      },
    ]
  },
  {
    title: "Preferences",
    items: [
      {
        label: "AI Template Builder",
        path: "/template-builder",
        icon: Wand2,
        color: "text-[#D95B96]",
        bgColor: "bg-[#FCEAF3]",
        darkColor: "dark:text-[#EB94BD]",
        darkBgColor: "dark:bg-[#3D1E2C]",
      },
      {
        label: "Settings",
        path: "/settings",
        icon: Settings,
        color: "text-[#71717A]",
        bgColor: "bg-[#F1F1F4]",
        darkColor: "dark:text-[#A1A1AA]",
        darkBgColor: "dark:bg-[#27272A]",
      },
    ]
  }
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [customApps, setCustomApps] = useState<any[]>([]);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) {
      setIsCollapsed(saved === "true");
    }

    const loadCustomApps = () => {
      const savedApps = JSON.parse(localStorage.getItem("sidebar-apps") || "[]");
      setCustomApps(savedApps);
    };

    loadCustomApps();
    window.addEventListener("sidebar-apps-changed", loadCustomApps);

    setMounted(true);

    return () => {
      window.removeEventListener("sidebar-apps-changed", loadCustomApps);
    };
  }, []);

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem("sidebar-collapsed", String(nextState));
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-screen border-r border-[var(--border)] bg-[var(--card)] flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[72px]" : "w-64"
        )}
      />
    );
  }

  return (
    <aside
      className={cn(
        "h-screen border-r border-[var(--border)] bg-[var(--card)] flex flex-col justify-between transition-all duration-300 ease-in-out relative z-30 select-none",
        isCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Upper Section */}
      <div>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] shrink-0 shadow-sm animate-pulse-slow">
              <Coffee className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-sm text-[var(--foreground)] tracking-wide whitespace-nowrap">
                Nook & Canvas
              </span>
            )}
          </div>

          <button
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer shrink-0"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Menu Sections */}
        <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-160px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {menuSections.map((section, sIdx) => (
            <div key={section.title} className="space-y-1">
              {/* Group Label / Divider */}
              {!isCollapsed ? (
                <div className="px-3 text-[10px] font-extrabold tracking-wider text-[var(--muted-foreground)]/80 uppercase mb-2 mt-2">
                  {section.title}
                </div>
              ) : (
                sIdx > 0 && <div className="mx-2 my-3 border-t border-[var(--border)] opacity-60" />
              )}

              {/* Section Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={cn(
                        "group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer relative",
                        isActive
                          ? "bg-[var(--secondary)] text-[var(--foreground)] shadow-xs"
                          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/60"
                      )}
                    >
                      {/* Colorful Icon Pill */}
                      <div
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-transform duration-200 group-hover:scale-105",
                          item.bgColor,
                          item.color,
                          item.darkBgColor,
                          item.darkColor
                        )}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>

                      {/* Label (Hidden when collapsed) */}
                      {!isCollapsed && (
                        <span className="truncate tracking-wide">{item.label}</span>
                      )}

                      {/* Collapsed Tooltip */}
                      {isCollapsed && (
                        <div className="absolute left-16 scale-0 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold px-2.5 py-1.5 shadow-md transition-all duration-200 origin-left group-hover:scale-100 whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
          {customApps.length > 0 && (
            <div className="space-y-1 pt-1">
              {!isCollapsed ? (
                <div className="px-3 text-[10px] font-extrabold tracking-wider text-[var(--muted-foreground)]/80 uppercase mb-2 mt-2 flex items-center gap-1.5 select-none">
                  <span>Custom Apps</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                </div>
              ) : (
                <div className="mx-2 my-3 border-t border-[var(--border)] opacity-60" />
              )}

              <div className="space-y-1">
                {customApps.map((app) => {
                  const isActive = pathname === `/template-builder/${app.id}`;
                  const IconComponent = getAppIcon(app.icon);

                  return (
                    <Link
                      key={app.id}
                      href={`/template-builder/${app.id}`}
                      className={cn(
                        "group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer relative",
                        isActive
                          ? "bg-[var(--secondary)] text-[var(--foreground)] shadow-xs"
                          : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/60"
                      )}
                    >
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-transform duration-200 group-hover:scale-105"
                        style={{
                          backgroundColor: `${app.color}15`,
                          color: app.color
                        }}
                      >
                        <IconComponent className="w-4.5 h-4.5" />
                      </div>

                      {!isCollapsed && (
                        <span className="truncate tracking-wide">{app.appName}</span>
                      )}

                      {isCollapsed && (
                        <div className="absolute left-16 scale-0 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold px-2.5 py-1.5 shadow-md transition-all duration-200 origin-left group-hover:scale-100 whitespace-nowrap z-50">
                          {app.appName}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Footer Profile Section */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--secondary)]/30">
        <div
          className={cn(
            "flex items-center rounded-2xl p-2 transition-all duration-200",
            isCollapsed ? "justify-center" : "gap-3"
          )}
        >
          {/* Avatar Area */}
          <div className="w-8 h-8 rounded-full bg-[var(--primary)]/15 text-[var(--primary)] dark:bg-[var(--foreground)]/10 dark:text-[var(--foreground)] flex items-center justify-center shrink-0 border border-[var(--border)] shadow-xs">
            <User className="w-4 h-4" />
          </div>

          {/* User Info (Hidden when collapsed) */}
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-[var(--foreground)] truncate leading-none mb-1">
                AtharvCreator
              </span>
              <span className="text-[10px] text-[var(--muted-foreground)] truncate leading-none">
                kaleatharv9197@gmail.com
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
