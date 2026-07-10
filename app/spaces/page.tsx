"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Folder,
  FolderOpen,
  Plus,
  Search,
  MoreVertical,
  ArrowLeft,
  Users,
  FileText,
  Palette,
  Star,
  Trash2,
  Archive,
  Share2,
  Copy,
  ChevronRight,
  ExternalLink,
  Edit2,
  FolderSymlink,
  Check,
  Grid,
  List as ListIcon,
  MessageSquare,
  Link2,
  User,
  Layers,
  X
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Types definition
interface Space {
  id: string;
  name: string;
  description: string;
  color: "purple" | "sage" | "coral" | "lavender" | "honey" | "blue";
  isFavorited: boolean;
  isArchived: boolean;
  lastOpenedAt?: number;
  updatedAt: string;
  members: string[]; // Initials of members
}

interface PageItem {
  id: string;
  spaceId: string;
  title: string;
  template: "Blank Page" | "Project Plan" | "Meeting Notes" | "PRD" | "Research Notes" | "Task Plan";
  isFavorited: boolean;
  isArchived: boolean;
  updatedAt: string;
  updatedBy: string;
  description: string;
  commentsCount: number;
  linkedTasksCount: number;
  content: string;
}

// Color schemes matching cozy layout with soft purple accents
const spaceColors: Record<
  "purple" | "sage" | "coral" | "lavender" | "honey" | "blue",
  { bg: string; text: string; dot: string; hoverBg: string; border: string; iconBg: string }
> = {
  purple: { bg: "bg-[#F4F0FA] dark:bg-[#20173A]", text: "text-[#7F56D9] dark:text-[#BF92FF]", dot: "bg-[#7F56D9]", hoverBg: "hover:bg-[#EAE2F7] dark:hover:bg-[#2A1E4A]", border: "border-[#DCD0F0] dark:border-[#42345C]", iconBg: "bg-[#7F56D9]/10 text-[#7F56D9]" },
  sage: { bg: "bg-[#E2ECE9] dark:bg-[#1D322B]", text: "text-[#2D5A4E] dark:text-[#91C8BA]", dot: "bg-[#4A7C70]", hoverBg: "hover:bg-[#D2DDD9] dark:hover:bg-[#253D35]", border: "border-[#B2D1C8] dark:border-[#2C4D43]", iconBg: "bg-[#4A7C70]/10 text-[#4A7C70]" },
  coral: { bg: "bg-[#FCECE7] dark:bg-[#341F1A]", text: "text-[#B34B2E] dark:text-[#F19F88]", dot: "bg-[#E07A5F]", hoverBg: "hover:bg-[#F7DBD0] dark:hover:bg-[#432922]", border: "border-[#F5C7BA] dark:border-[#52312A]", iconBg: "bg-[#E07A5F]/10 text-[#E07A5F]" },
  lavender: { bg: "bg-[#F0EBF8] dark:bg-[#251D33]", text: "text-[#62479B] dark:text-[#BFABEC]", dot: "bg-[#8E75C4]", hoverBg: "hover:bg-[#E3DAF2] dark:hover:bg-[#322744]", border: "border-[#DCD0F0] dark:border-[#42345C]", iconBg: "bg-[#8E75C4]/10 text-[#8E75C4]" },
  honey: { bg: "bg-[#FBF3DB] dark:bg-[#332814]", text: "text-[#8E640B] dark:text-[#E9C37A]", dot: "bg-[#D8A035]", hoverBg: "hover:bg-[#F3E3B9] dark:hover:bg-[#40331D]", border: "border-[#F2DEB1] dark:border-[#544329]", iconBg: "bg-[#D8A035]/10 text-[#D8A035]" },
  blue: { bg: "bg-[#E8F0FE] dark:bg-[#17243B]", text: "text-[#1C54B2] dark:text-[#92B8F8]", dot: "bg-[#4285F4]", hoverBg: "hover:bg-[#D5E4FC] dark:hover:bg-[#202E4C]", border: "border-[#B7D2FC] dark:border-[#293E62]", iconBg: "bg-[#4285F4]/10 text-[#4285F4]" }
};

// Initial spaces
const initialSpaces: Space[] = [
  {
    id: "s1",
    name: "Productivity Hub",
    description: "Daily planning, notes, tasks, and productivity workflows.",
    color: "purple",
    isFavorited: true,
    isArchived: false,
    updatedAt: "just now",
    members: ["JD", "SK", "TL"]
  },
  {
    id: "s2",
    name: "Work Projects",
    description: "Project plans, documentation, and team collaboration.",
    color: "blue",
    isFavorited: false,
    isArchived: false,
    updatedAt: "2h ago",
    members: ["AN", "AM", "TL"]
  },
  {
    id: "s3",
    name: "Personal",
    description: "Personal notes, goals, and life organization.",
    color: "sage",
    isFavorited: true,
    isArchived: false,
    updatedAt: "yesterday",
    members: ["JD"]
  },
  {
    id: "s4",
    name: "Learning & Growth",
    description: "Courses, books, and research notes.",
    color: "lavender",
    isFavorited: false,
    isArchived: false,
    updatedAt: "2 days ago",
    members: ["SK", "AM"]
  },
  {
    id: "s5",
    name: "Ideas & Research",
    description: "Brainstorming, references, and future ideas.",
    color: "honey",
    isFavorited: false,
    isArchived: false,
    updatedAt: "3 days ago",
    members: ["AN", "SK"]
  },
  {
    id: "s6",
    name: "Archive",
    description: "Old projects and completed work.",
    color: "coral",
    isFavorited: false,
    isArchived: true,
    updatedAt: "last week",
    members: ["TL", "AM"]
  }
];

// Initial pages
const initialPages: PageItem[] = [
  {
    id: "p1",
    spaceId: "s2",
    title: "02 Roadmap - Project Plan",
    template: "Project Plan",
    isFavorited: true,
    isArchived: false,
    updatedAt: "just now",
    updatedBy: "JD",
    description: "Development milestones mapping and feature releases calendar.",
    commentsCount: 8,
    linkedTasksCount: 14,
    content: "This roadmap outlines our strategic direction for Q3 and Q4. Main tasks include resolving Clerk Auth setups and Excalidraw custom vectors."
  },
  {
    id: "p2",
    spaceId: "s2",
    title: "Sprint Planning",
    template: "Task Plan",
    isFavorited: false,
    isArchived: false,
    updatedAt: "2h ago",
    updatedBy: "AN",
    description: "Task lists and checklists for current engineering sprint.",
    commentsCount: 3,
    linkedTasksCount: 9,
    content: "Sprint 14 deliverables include implementing downsampled Speech-to-Text streaming and updating board columns to screen height."
  },
  {
    id: "p3",
    spaceId: "s2",
    title: "Meeting Notes 12 May",
    template: "Meeting Notes",
    isFavorited: false,
    isArchived: false,
    updatedAt: "yesterday",
    updatedBy: "SK",
    description: "Client alignment meeting summary regarding AI builder.",
    commentsCount: 12,
    linkedTasksCount: 2,
    content: "Aligned on design style: soft purple accents, rounded cards, subtle borders, and borderless directories."
  },
  {
    id: "p4",
    spaceId: "s2",
    title: "Project PRD Document",
    template: "PRD",
    isFavorited: true,
    isArchived: false,
    updatedAt: "2 days ago",
    updatedBy: "TL",
    description: "Product Requirements Document for collaborative workspaces.",
    commentsCount: 22,
    linkedTasksCount: 5,
    content: "Product requirements document outlining real-time updates and Excalidraw diagram loading APIs."
  },
  {
    id: "p5",
    spaceId: "s2",
    title: "Resources & Links",
    template: "Research Notes",
    isFavorited: false,
    isArchived: false,
    updatedAt: "3 days ago",
    updatedBy: "AM",
    description: "Research references, API docs, and Tailwind styling classes.",
    commentsCount: 0,
    linkedTasksCount: 0,
    content: "Drizzle Schema references: https://orm.drizzle.team/. Excalidraw details: https://excalidraw.com/."
  }
];

export default function PagesSpaces() {
  const [spaces, setBoards] = useState<Space[]>(initialSpaces);
  const [pages, setPages] = useState<PageItem[]>(initialPages);

  // Layout View levels: "all-spaces" | "inside-space" | "page-preview"
  const [currentView, setCurrentView] = useState<"all-spaces" | "inside-space" | "page-preview">("all-spaces");
  
  // Navigation pointers
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);
  const [activePageId, setActivePageId] = useState<string | null>(null);

  // Search & Filter controls
  const [search, setSearch] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "favorites" | "recent" | "archived">("all");
  const [isGridView, setIsGridView] = useState(true);
  const [sortBy, setSortBy] = useState<"updated" | "name" | "pages" | "favorites">("updated");

  // Create Space form state
  const [isNewSpaceModalOpen, setIsNewSpaceModalOpen] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const [spaceDesc, setSpaceDesc] = useState("");
  const [spaceColor, setSpaceColor] = useState<Space["color"]>("purple");

  // Create Page form state
  const [isNewPageModalOpen, setIsNewPageModalOpen] = useState(false);
  const [pageName, setPageName] = useState("");
  const [pageSpaceId, setPageSpaceId] = useState("");
  const [pageTemplate, setPageTemplate] = useState<PageItem["template"]>("Blank Page");
  const [pageDesc, setPageDesc] = useState("");

  // Edit Space form state
  const [editingSpaceId, setEditingSpaceId] = useState<string | null>(null);
  const [editingSpaceName, setEditingSpaceName] = useState("");
  const [editingSpaceDesc, setEditingSpaceDesc] = useState("");

  // Quick edit page properties
  const [editingPageTitle, setEditingPageTitle] = useState("");
  const [editingPageDesc, setEditingPageDesc] = useState("");

  // Active space object
  const activeSpace = useMemo(() => {
    return spaces.find((s) => s.id === activeSpaceId) || null;
  }, [spaces, activeSpaceId]);

  // Active page object
  const activePage = useMemo(() => {
    return pages.find((p) => p.id === activePageId) || null;
  }, [pages, activePageId]);

  // Color changer handler
  const handleChangeColor = (spaceId: string, col: Space["color"]) => {
    setBoards((prev) =>
      prev.map((s) => (s.id === spaceId ? { ...s, color: col } : s))
    );
  };

  // Sync edits when active page changes
  useEffect(() => {
    if (activePage) {
      setEditingPageTitle(activePage.title);
      setEditingPageDesc(activePage.description);
    }
  }, [activePageId]);

  // Sync edit space fields
  const startEditingSpace = (space: Space, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSpaceId(space.id);
    setEditingSpaceName(space.name);
    setEditingSpaceDesc(space.description);
  };

  // Save renamed space
  const handleSaveSpaceEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpaceId || !editingSpaceName.trim()) return;

    setBoards((prev) =>
      prev.map((s) =>
        s.id === editingSpaceId
          ? { ...s, name: editingSpaceName, description: editingSpaceDesc, updatedAt: "just now" }
          : s
      )
    );
    setEditingSpaceId(null);
  };

  // Sync opening times
  const openSpace = (spaceId: string) => {
    setBoards((prev) =>
      prev.map((s) => (s.id === spaceId ? { ...s, lastOpenedAt: Date.now() } : s))
    );
    setActiveSpaceId(spaceId);
    setCurrentView("inside-space");
  };

  // Open page details
  const openPage = (pageId: string) => {
    setActivePageId(pageId);
    setCurrentView("page-preview");
  };

  // Add Space
  const handleCreateSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spaceName.trim()) return;

    const newSpace: Space = {
      id: `space-${Date.now()}`,
      name: spaceName,
      description: spaceDesc,
      color: spaceColor,
      isFavorited: false,
      isArchived: false,
      lastOpenedAt: Date.now(),
      updatedAt: "just now",
      members: ["JD"]
    };

    setBoards([newSpace, ...spaces]);
    setSpaceName("");
    setSpaceDesc("");
    setSpaceColor("purple");
    setIsNewSpaceModalOpen(false);
    openSpace(newSpace.id);
  };

  // Add Page
  const handleCreatePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageName.trim() || !pageSpaceId) return;

    const newPage: PageItem = {
      id: `page-${Date.now()}`,
      spaceId: pageSpaceId,
      title: pageName,
      template: pageTemplate,
      isFavorited: false,
      isArchived: false,
      updatedAt: "just now",
      updatedBy: "JD",
      description: pageDesc || "Draft workspace documentation",
      commentsCount: 0,
      linkedTasksCount: 0,
      content: "Write page details here..."
    };

    setPages([newPage, ...pages]);
    setPageName("");
    setPageDesc("");
    setPageTemplate("Blank Page");
    setIsNewPageModalOpen(false);

    // Navigate directly to this new page
    setActiveSpaceId(pageSpaceId);
    openPage(newPage.id);
  };

  // Toggle Favorite Status
  const toggleFavoriteSpace = (spaceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBoards((prev) =>
      prev.map((s) => (s.id === spaceId ? { ...s, isFavorited: !s.isFavorited } : s))
    );
  };

  const toggleFavoritePage = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, isFavorited: !p.isFavorited } : p))
    );
  };

  // Archive / Delete Space
  const handleArchiveSpace = (spaceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBoards((prev) =>
      prev.map((s) => (s.id === spaceId ? { ...s, isArchived: !s.isArchived } : s))
    );
  };

  const handleDeleteSpace = (spaceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this Space and all pages inside it?")) {
      setBoards((prev) => prev.filter((s) => s.id !== spaceId));
      setPages((prev) => prev.filter((p) => p.spaceId !== spaceId));
      if (activeSpaceId === spaceId) {
        setCurrentView("all-spaces");
        setActiveSpaceId(null);
      }
    }
  };

  // Actions for page
  const handleSavePageTitleAndDesc = () => {
    if (!activePageId || !editingPageTitle.trim()) return;
    setPages((prev) =>
      prev.map((p) =>
        p.id === activePageId
          ? { ...p, title: editingPageTitle, description: editingPageDesc, updatedAt: "just now" }
          : p
      )
    );
  };

  const handleDeletePage = (pageId: string) => {
    if (confirm("Are you sure you want to delete this page?")) {
      setPages((prev) => prev.filter((p) => p.id !== pageId));
      setCurrentView("inside-space");
      setActivePageId(null);
    }
  };

  const handleDuplicatePage = (page: PageItem) => {
    const duplicated: PageItem = {
      ...page,
      id: `page-dup-${Date.now()}`,
      title: `${page.title} (Copy)`,
      updatedAt: "just now"
    };
    setPages([duplicated, ...pages]);
    openPage(duplicated.id);
  };

  const handleMovePage = (pageId: string, targetSpaceId: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, spaceId: targetSpaceId, updatedAt: "just now" } : p))
    );
    if (activePageId === pageId) {
      setActiveSpaceId(targetSpaceId);
    }
  };

  // Compute counts
  const spacePageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    pages.forEach((p) => {
      if (!p.isArchived) {
        counts[p.spaceId] = (counts[p.spaceId] || 0) + 1;
      }
    });
    return counts;
  }, [pages]);

  // Filtering Spaces
  const filteredSpaces = useMemo(() => {
    let result = spaces;

    // Filter by Tab
    if (filterTab === "all") {
      result = result.filter((s) => !s.isArchived);
    } else if (filterTab === "favorites") {
      result = result.filter((s) => s.isFavorited && !s.isArchived);
    } else if (filterTab === "recent") {
      result = result.filter((s) => !s.isArchived && s.lastOpenedAt).sort((a, b) => (b.lastOpenedAt || 0) - (a.lastOpenedAt || 0));
    } else if (filterTab === "archived") {
      result = result.filter((s) => s.isArchived);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "pages") {
      result = [...result].sort((a, b) => (spacePageCounts[b.id] || 0) - (spacePageCounts[a.id] || 0));
    } else if (sortBy === "favorites") {
      result = [...result].sort((a, b) => (b.isFavorited ? 1 : 0) - (a.isFavorited ? 1 : 0));
    }

    return result;
  }, [spaces, filterTab, search, sortBy, spacePageCounts]);

  // Filtering Pages inside active space
  const activeSpacePages = useMemo(() => {
    if (!activeSpaceId) return [];
    return pages.filter((p) => p.spaceId === activeSpaceId && !p.isArchived);
  }, [pages, activeSpaceId]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#FAF8F5] overflow-y-auto select-none min-h-screen text-[var(--foreground)] font-sans">
      
      {/* View 1: ALL Spaces list */}
      {currentView === "all-spaces" && (
        <div className="p-6 md:p-10 max-w-6xl w-full mx-auto space-y-6">
          
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg bg-[#7F56D9]/10 text-[#7F56D9] flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-[#7F56D9] uppercase tracking-wider">Workspace Explorer</span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[var(--foreground)]">
                ALL Spaces
              </h1>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Organize your documents, roadmaps, checksheets, and research drafts into top-level spaces.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsNewSpaceModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#7F56D9] hover:bg-[#6C42C8] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Space</span>
              </button>
              <button
                onClick={() => {
                  if (spaces.length > 0) {
                    setPageSpaceId(spaces[0].id);
                  }
                  setIsNewPageModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>New Page</span>
              </button>
            </div>
          </div>

          {/* Filtering bar widget */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3.5 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(["all", "favorites", "recent", "archived"] as const).map((tab) => {
                const label = tab === "all" ? "All Spaces" : tab === "favorites" ? "Favorites" : tab === "recent" ? "Recently Opened" : "Archived";
                return (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-extrabold rounded-lg select-none transition-all cursor-pointer whitespace-nowrap",
                      filterTab === tab
                        ? "bg-[#7F56D9]/10 text-[#7F56D9]"
                        : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/50"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3.5">
              
              {/* Search box input */}
              <div className="relative w-full md:w-56">
                <Search className="w-3.5 h-3.5 text-[var(--muted-foreground)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search spaces or pages..."
                  className="w-full pl-8 pr-3 py-1.5 text-[11px] rounded-lg border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] text-[var(--foreground)] font-semibold"
                />
              </div>

              {/* Sort dropdown */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase hidden lg:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-[11px] border border-[var(--border)] rounded-lg px-2 py-1.5 font-bold text-[var(--muted-foreground)] focus:outline-none cursor-pointer"
                >
                  <option value="updated">Recently Updated</option>
                  <option value="name">Name</option>
                  <option value="pages">Most Pages</option>
                  <option value="favorites">Favorites First</option>
                </select>
              </div>

              {/* View layout toggle grid / list */}
              <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden shrink-0">
                <button
                  onClick={() => setIsGridView(true)}
                  className={cn("p-1.5 cursor-pointer", isGridView ? "bg-[var(--secondary)] text-[#7F56D9]" : "text-[var(--muted-foreground)]")}
                  title="Grid view"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsGridView(false)}
                  className={cn("p-1.5 cursor-pointer", !isGridView ? "bg-[var(--secondary)] text-[#7F56D9]" : "text-[var(--muted-foreground)]")}
                  title="List view"
                >
                  <ListIcon className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

          {/* Spaces lists/grids display container */}
          {filteredSpaces.length === 0 ? (
            <div className="text-center py-20 bg-[var(--card)] border border-[var(--border)] rounded-2xl">
              <Folder className="w-8 h-8 mx-auto text-[var(--muted-foreground)] opacity-40 mb-2" />
              <p className="text-xs font-bold text-[var(--muted-foreground)]">No spaces found matching filters.</p>
              <button
                onClick={() => setIsNewSpaceModalOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-[#7F56D9] text-white text-xs font-semibold cursor-pointer"
              >
                Create new space
              </button>
            </div>
          ) : isGridView ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSpaces.map((space) => {
                const colors = spaceColors[space.color] || spaceColors.purple;
                const count = spacePageCounts[space.id] || 0;
                return (
                  <div
                    key={space.id}
                    onClick={() => openSpace(space.id)}
                    className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 hover:shadow-xs transition-all duration-200 cursor-pointer flex flex-col justify-between group h-[190px]"
                  >
                    <div>
                      {/* Top icon and favorite star */}
                      <div className="flex items-center justify-between mb-3.5">
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-all", colors.iconBg)}>
                          <Folder className="w-4.5 h-4.5" />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => toggleFavoriteSpace(space.id, e)}
                            className={cn(
                              "p-1.5 rounded-lg hover:bg-[var(--secondary)] transition-colors cursor-pointer",
                              space.isFavorited ? "text-amber-500" : "text-[var(--muted-foreground)]"
                            )}
                          >
                            <Star className="w-3.5 h-3.5" fill={space.isFavorited ? "currentColor" : "none"} />
                          </button>
                          
                          {/* More dropdown options inline */}
                          <div className="relative group/more">
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] cursor-pointer"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 hidden group-hover/more:block bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg w-36 z-30 p-1 font-semibold text-[10px]">
                              <button
                                onClick={(e) => startEditingSpace(space, e)}
                                className="w-full text-left px-2 py-1.5 hover:bg-[var(--secondary)] rounded-lg flex items-center gap-1.5"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Rename Space</span>
                              </button>
                              <button
                                onClick={(e) => handleArchiveSpace(space.id, e)}
                                className="w-full text-left px-2 py-1.5 hover:bg-[var(--secondary)] rounded-lg flex items-center gap-1.5"
                              >
                                <Archive className="w-3 h-3" />
                                <span>{space.isArchived ? "Unarchive" : "Archive"}</span>
                              </button>
                              <button
                                onClick={(e) => handleDeleteSpace(space.id, e)}
                                className="w-full text-left px-2 py-1.5 hover:bg-[#F9EAEB] text-[#D36A73] rounded-lg flex items-center gap-1.5"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete Space</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Info titles */}
                      <h3 className="font-extrabold text-sm text-[var(--foreground)] group-hover:text-[#7F56D9] transition-colors truncate">
                        {space.name}
                      </h3>
                      <p className="text-[11px] text-[var(--muted-foreground)] mt-1 line-clamp-2 leading-relaxed">
                        {space.description || "Organized team workspace repository."}
                      </p>
                    </div>

                    {/* Card Footer details */}
                    <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between mt-4">
                      <span className="text-[10px] font-bold text-[#7F56D9] bg-[#7F56D9]/5 px-2.5 py-1 rounded-md shrink-0">
                        {count} {count === 1 ? "Page" : "Pages"}
                      </span>

                      {/* Avatars */}
                      <div className="flex -space-x-1.5 overflow-hidden">
                        {space.members.map((initial, idx) => (
                          <div
                            key={idx}
                            className="w-5 h-5 rounded-full border border-[var(--card)] bg-[var(--secondary)] text-[var(--foreground)] flex items-center justify-center text-[8px] font-bold shrink-0 shadow-xs"
                            title={initial}
                          >
                            {initial}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xs divide-y divide-[var(--border)]">
              {filteredSpaces.map((space) => {
                const colors = spaceColors[space.color] || spaceColors.purple;
                const count = spacePageCounts[space.id] || 0;
                return (
                  <div
                    key={space.id}
                    onClick={() => openSpace(space.id)}
                    className="px-5 py-4 hover:bg-[var(--secondary)]/30 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", colors.iconBg)}>
                        <Folder className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-xs text-[var(--foreground)] group-hover:text-[#7F56D9] transition-colors truncate">
                          {space.name}
                        </h4>
                        <p className="text-[10px] text-[var(--muted-foreground)] truncate mt-0.5">
                          {space.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 shrink-0 text-[10px] font-semibold text-[var(--muted-foreground)]">
                      <span className="text-[#7F56D9] bg-[#7F56D9]/5 px-2 py-0.5 rounded font-extrabold">
                        {count} Pages
                      </span>
                      <span>Last Update: {space.updatedAt}</span>
                      
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => toggleFavoriteSpace(space.id, e)}
                          className={cn("p-1 hover:bg-[var(--secondary)] rounded", space.isFavorited ? "text-amber-500" : "text-[var(--muted-foreground)]")}
                        >
                          <Star className="w-3.5 h-3.5" fill={space.isFavorited ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={(e) => handleDeleteSpace(space.id, e)}
                          className="p-1 hover:bg-[#F9EAEB] text-[#D36A73] rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* View 2: Inside a Space (Explorer view) */}
      {currentView === "inside-space" && activeSpace && (
        <div className="p-6 md:p-10 max-w-6xl w-full mx-auto space-y-6">
          
          {/* Breadcrumb path */}
          <div className="flex items-center gap-1 text-[10px] font-extrabold text-[var(--muted-foreground)] select-none">
            <button
              onClick={() => setCurrentView("all-spaces")}
              className="hover:text-[#7F56D9] transition-colors"
            >
              All Spaces
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[var(--foreground)] truncate max-w-[150px]">{activeSpace.name}</span>
          </div>

          {/* Header card details */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
            <div className="flex items-start gap-3.5 min-w-0 flex-1">
              <button
                onClick={() => setCurrentView("all-spaces")}
                className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-all cursor-pointer shrink-0 mt-0.5"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg md:text-xl font-extrabold text-[var(--foreground)] truncate leading-normal">
                    {activeSpace.name}
                  </h1>
                  <span className="text-[9px] font-extrabold text-[#7F56D9] bg-[#7F56D9]/5 px-2 py-0.5 rounded-full select-none shrink-0">
                    {activeSpacePages.length} {activeSpacePages.length === 1 ? "page" : "pages"}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-foreground)] mt-1 font-medium">
                  {activeSpace.description || "Organized space checklist outlines."}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setPageSpaceId(activeSpace.id);
                  setIsNewPageModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-[#7F56D9] hover:bg-[#6C42C8] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Page</span>
              </button>
              
              {/* Space settings menu inline trigger */}
              <div className="relative group/sedit">
                <button
                  type="button"
                  className="p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                <div className="absolute right-0 top-full mt-1.5 hidden group-hover/sedit:block bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg w-40 z-30 p-1 font-semibold text-[10px]">
                  <button
                    onClick={(e) => startEditingSpace(activeSpace, e)}
                    className="w-full text-left px-2 py-1.5 hover:bg-[var(--secondary)] rounded-lg flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Rename Space</span>
                  </button>
                  <button
                    onClick={() => {
                      const list = ["sage", "coral", "lavender", "honey", "blue", "purple"] as const;
                      const next = list[(list.indexOf(activeSpace.color) + 1) % list.length];
                      handleChangeColor(activeSpace.id, next);
                    }}
                    className="w-full text-left px-2 py-1.5 hover:bg-[var(--secondary)] rounded-lg flex items-center gap-1.5"
                  >
                    <Palette className="w-3 h-3" />
                    <span>Change Color Theme</span>
                  </button>
                  <button
                    onClick={(e) => handleArchiveSpace(activeSpace.id, e)}
                    className="w-full text-left px-2 py-1.5 hover:bg-[var(--secondary)] rounded-lg flex items-center gap-1.5"
                  >
                    <Archive className="w-3 h-3" />
                    <span>Archive Space</span>
                  </button>
                  <button
                    onClick={(e) => handleDeleteSpace(activeSpace.id, e)}
                    className="w-full text-left px-2 py-1.5 hover:bg-[#F9EAEB] text-[#D36A73] rounded-lg flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete Space</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Table display list of pages */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xs">
            {activeSpacePages.length === 0 ? (
              <div className="text-center py-20">
                <FileText className="w-8 h-8 mx-auto text-[var(--muted-foreground)] opacity-40 mb-2" />
                <p className="text-xs font-bold text-[var(--muted-foreground)]">No pages inside this Space.</p>
                <button
                  onClick={() => {
                    setPageSpaceId(activeSpace.id);
                    setIsNewPageModalOpen(true);
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#7F56D9] text-white text-xs font-semibold cursor-pointer"
                >
                  Add a page
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto min-h-[220px] pb-16">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[9px] font-extrabold uppercase text-[var(--muted-foreground)] tracking-wider select-none bg-[var(--secondary)]/30">
                      <th className="py-3 px-4">Page Name</th>
                      <th className="py-3 px-4">Type / Template</th>
                      <th className="py-3 px-4">Last Updated</th>
                      <th className="py-3 px-4">Updated By</th>
                      <th className="py-3 px-4 text-center">Favorite</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] text-xs font-semibold text-[var(--foreground)]">
                    {activeSpacePages.map((page) => (
                      <tr
                        key={page.id}
                        onClick={() => openPage(page.id)}
                        className="hover:bg-[var(--secondary)]/20 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4 font-bold text-[#7F56D9] hover:underline">
                          <div className="flex items-center gap-2">
                            <span className="text-xs">📄</span>
                            <span className="truncate max-w-[200px]">{page.title}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-lg bg-[var(--secondary)] border border-[var(--border)] text-[9px] font-bold text-[var(--muted-foreground)] whitespace-nowrap">
                            {page.template}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[10px] text-[var(--muted-foreground)] whitespace-nowrap">
                          {page.updatedAt}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="w-5 h-5 rounded-full bg-[#7F56D9]/10 text-[#7F56D9] text-[8px] font-extrabold flex items-center justify-center shadow-xs">
                            {page.updatedBy}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => toggleFavoritePage(page.id, e)}
                            className={cn("p-1 hover:bg-[var(--secondary)] rounded", page.isFavorited ? "text-amber-500" : "text-slate-300 hover:text-amber-500")}
                          >
                            <Star className="w-3.5 h-3.5" fill={page.isFavorited ? "currentColor" : "none"} />
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="relative group/paction inline-block">
                            <button className="p-1 rounded hover:bg-[var(--secondary)] text-[var(--muted-foreground)]">
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute right-0 top-full mt-0.5 hidden group-hover/paction:block bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-lg w-36 z-30 p-1 font-semibold text-[10px] text-left">
                              <button
                                onClick={() => openPage(page.id)}
                                className="w-full text-left px-2 py-1.5 hover:bg-[var(--secondary)] rounded-lg flex items-center gap-1.5"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Preview Detail</span>
                              </button>
                              <button
                                onClick={() => handleDuplicatePage(page)}
                                className="w-full text-left px-2 py-1.5 hover:bg-[var(--secondary)] rounded-lg flex items-center gap-1.5"
                              >
                                <Copy className="w-3 h-3" />
                                <span>Duplicate Page</span>
                              </button>
                              <button
                                onClick={() => handleDeletePage(page.id)}
                                className="w-full text-left px-2 py-1.5 hover:bg-[#F9EAEB] text-[#D36A73] rounded-lg flex items-center gap-1.5"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete Page</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* View 3: Page Detail & Preview Card view */}
      {currentView === "page-preview" && activePage && activeSpace && (
        <div className="p-6 md:p-10 max-w-6xl w-full mx-auto space-y-6">
          
          {/* Breadcrumbs path */}
          <div className="flex items-center gap-1 text-[10px] font-extrabold text-[var(--muted-foreground)] select-none">
            <button onClick={() => setCurrentView("all-spaces")} className="hover:text-[#7F56D9]">All Spaces</button>
            <ChevronRight className="w-3 h-3" />
            <button onClick={() => setCurrentView("inside-space")} className="hover:text-[#7F56D9]">{activeSpace.name}</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[var(--foreground)] truncate max-w-[150px]">{activePage.title}</span>
          </div>

          {/* Action header bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <button
              onClick={() => setCurrentView("inside-space")}
              className="px-3.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Space</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => toggleFavoritePage(activePage.id, e)}
                className={cn("p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--secondary)] transition-colors cursor-pointer", activePage.isFavorited ? "text-amber-500" : "text-[var(--muted-foreground)]")}
              >
                <Star className="w-4 h-4" fill={activePage.isFavorited ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => handleDuplicatePage(activePage)}
                className="p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                title="Duplicate document"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeletePage(activePage.id)}
                className="p-2 rounded-xl border border-[#F5C7BA] bg-[#FCECE7] text-[#B34B2E] hover:bg-[#F7DBD0] transition-colors cursor-pointer"
                title="Delete document"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Splitted view: Left Editor & Right Metadata card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Content text canvas */}
            <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-xs space-y-5">
              
              {/* editable Title input */}
              <input
                type="text"
                value={editingPageTitle}
                onChange={(e) => setEditingPageTitle(e.target.value)}
                onBlur={handleSavePageTitleAndDesc}
                onKeyDown={(e) => e.key === "Enter" && handleSavePageTitleAndDesc()}
                className="w-full text-xl md:text-2xl font-extrabold text-[var(--foreground)] bg-transparent border-none focus:outline-none tracking-tight py-1 font-sans"
              />

              {/* Sub-tags */}
              <div className="flex items-center gap-2.5 text-[10px] text-[var(--muted-foreground)] border-b border-[var(--border)] pb-3">
                <span className="px-2 py-0.5 rounded-lg bg-[var(--secondary)] font-extrabold text-[9px]">
                  {activePage.template}
                </span>
                <span>Space: <span className="font-extrabold text-[var(--foreground)]">{activeSpace.name}</span></span>
                <span>Last updated {activePage.updatedAt}</span>
              </div>

              {/* Page content draft placeholder */}
              <textarea
                value={activePage.content}
                onChange={(e) => {
                  const val = e.target.value;
                  setPages((prev) =>
                    prev.map((p) => (p.id === activePageId ? { ...p, content: val, updatedAt: "just now" } : p))
                  );
                }}
                className="w-full h-80 bg-transparent text-xs md:text-sm text-[var(--foreground)] font-medium leading-relaxed resize-none focus:outline-none"
                placeholder="Write page markdown or task logs here..."
              />
            </div>

            {/* Right metadata preview panel */}
            <aside className="space-y-6">
              
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-extrabold text-[var(--foreground)] tracking-tight">Page Specifications</h3>
                
                {/* Description editable input */}
                <div>
                  <label className="block text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingPageDesc}
                    onChange={(e) => setEditingPageDesc(e.target.value)}
                    onBlur={handleSavePageTitleAndDesc}
                    placeholder="Add brief details about this document page..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] transition-all font-semibold resize-none h-16"
                  />
                </div>

                <div className="space-y-2.5 pt-1 text-[10px] font-semibold text-[var(--muted-foreground)] divide-y divide-[var(--border)]">
                  
                  <div className="flex justify-between items-center py-2.5">
                    <span>Space Location</span>
                    <span className="text-[#7F56D9] font-extrabold">{activeSpace.name}</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5">
                    <span>Template Type</span>
                    <span className="px-2 py-0.5 rounded-lg bg-[var(--secondary)] font-extrabold text-[9px] border border-[var(--border)]">
                      {activePage.template}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2.5">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>Comments Thread</span>
                    </span>
                    <span className="text-[var(--foreground)] font-extrabold">{activePage.commentsCount} Threads</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5">
                    <span className="flex items-center gap-1">
                      <Link2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Linked Tasks</span>
                    </span>
                    <span className="text-[var(--foreground)] font-extrabold">{activePage.linkedTasksCount} Tasks</span>
                  </div>

                  <div className="flex justify-between items-center py-2.5">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Last Edited By</span>
                    </span>
                    <span className="w-5 h-5 rounded-full bg-[#7F56D9]/10 text-[#7F56D9] text-[8px] font-extrabold flex items-center justify-center shadow-xs">
                      {activePage.updatedBy}
                    </span>
                  </div>

                </div>

                {/* Move to another Space trigger select */}
                <div className="pt-2 border-t border-[var(--border)]">
                  <label className="block text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                    Move to another space
                  </label>
                  <select
                    value={activePage.spaceId}
                    onChange={(e) => handleMovePage(activePage.id, e.target.value)}
                    className="w-full px-2 py-1.5 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none cursor-pointer font-bold"
                  >
                    {spaces.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Duplicate or link buttons */}
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 text-[9px] font-bold text-[var(--muted-foreground)] leading-normal flex items-start gap-2 select-none shadow-xs">
                <Share2 className="w-4 h-4 text-[#7F56D9] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[var(--foreground)]">Share Link Access</p>
                  <p className="font-semibold text-[8px] opacity-75 mt-0.5">Copy link address and invite other workspaces members to check document contents.</p>
                </div>
              </div>

            </aside>
          </div>

        </div>
      )}

      {/* MODAL: Create New Space */}
      {isNewSpaceModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4.5 h-4.5 text-[#7F56D9]" />
                <h2 className="text-sm font-extrabold text-[var(--foreground)] tracking-tight">Create Workspace Space</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsNewSpaceModalOpen(false)}
                className="p-1 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSpace} className="space-y-4">
              
              {/* Space Name */}
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                  Space Name
                </label>
                <input
                  type="text"
                  required
                  value={spaceName}
                  onChange={(e) => setSpaceName(e.target.value)}
                  placeholder="e.g. Design Studio Team"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] transition-all font-semibold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                  Short Description
                </label>
                <textarea
                  value={spaceDesc}
                  onChange={(e) => setSpaceDesc(e.target.value)}
                  placeholder="Describe what will be organized inside this folder..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] transition-all font-semibold resize-none h-16"
                />
              </div>

              {/* Color selector */}
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                  Folder Accent Color
                </label>
                <div className="flex gap-2">
                  {(["purple", "sage", "coral", "lavender", "honey", "blue"] as const).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSpaceColor(color)}
                      className={cn(
                        "w-6 h-6 rounded-full block border border-black/10 hover:scale-110 transition-transform cursor-pointer",
                        spaceColors[color].dot,
                        spaceColor === color && "ring-2 ring-offset-2 ring-[#7F56D9]"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsNewSpaceModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted-foreground)] hover:bg-[var(--secondary)] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#7F56D9] text-white text-xs font-semibold hover:bg-[#6C42C8] transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Space</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: Create New Page */}
      {isNewPageModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-[#7F56D9]" />
                <h2 className="text-sm font-extrabold text-[var(--foreground)] tracking-tight">Create Document Page</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsNewPageModalOpen(false)}
                className="p-1 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePage} className="space-y-4">
              
              {/* Page Name */}
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                  Page Title
                </label>
                <input
                  type="text"
                  required
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  placeholder="e.g. Q3 Strategic Plan"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] transition-all font-semibold"
                />
              </div>

              {/* Add to Space Dropdown */}
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                  Add to Space Location
                </label>
                <select
                  value={pageSpaceId}
                  onChange={(e) => setPageSpaceId(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none cursor-pointer font-bold"
                >
                  {spaces.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Template dropdown selection */}
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                  Template Format
                </label>
                <select
                  value={pageTemplate}
                  onChange={(e) => setPageTemplate(e.target.value as any)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none cursor-pointer font-bold"
                >
                  <option value="Blank Page">Blank Page</option>
                  <option value="Project Plan">Project Plan</option>
                  <option value="Meeting Notes">Meeting Notes</option>
                  <option value="PRD">PRD (Requirements)</option>
                  <option value="Research Notes">Research Notes</option>
                  <option value="Task Plan">Task Plan</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                  Brief description (Optional)
                </label>
                <input
                  type="text"
                  value={pageDesc}
                  onChange={(e) => setPageDesc(e.target.value)}
                  placeholder="e.g. Outlines team task lists..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] transition-all font-semibold"
                />
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsNewPageModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted-foreground)] hover:bg-[var(--secondary)] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#7F56D9] text-white text-xs font-semibold hover:bg-[#6C42C8] transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Page</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: Rename / Edit Space */}
      {editingSpaceId !== null && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4.5 h-4.5 text-[#7F56D9]" />
                <h2 className="text-sm font-extrabold text-[var(--foreground)] tracking-tight">Rename Workspace Space</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingSpaceId(null)}
                className="p-1 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSpaceEdit} className="space-y-4">
              
              {/* Space Name */}
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                  Space Name
                </label>
                <input
                  type="text"
                  required
                  value={editingSpaceName}
                  onChange={(e) => setEditingSpaceName(e.target.value)}
                  placeholder="e.g. Design Studio Team"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] transition-all font-semibold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                  Short Description
                </label>
                <textarea
                  value={editingSpaceDesc}
                  onChange={(e) => setEditingSpaceDesc(e.target.value)}
                  placeholder="Describe what will be organized inside this folder..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] transition-all font-semibold resize-none h-16"
                />
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setEditingSpaceId(null)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted-foreground)] hover:bg-[var(--secondary)] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#7F56D9] text-white text-xs font-semibold hover:bg-[#6C42C8] transition-all cursor-pointer flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
