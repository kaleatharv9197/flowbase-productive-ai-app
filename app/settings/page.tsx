"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Moon,
  Sun,
  ArrowLeft,
  Save,
  User,
  Bell,
  Shield,
  CreditCard,
  Sparkles,
  Layers,
  Trash2,
  Edit2,
  Plus,
  Check,
  Download,
  AlertCircle,
  HelpCircle,
  Clock,
  Calendar,
  CheckSquare,
  FileText,
  Pin
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface WorkspaceCategories {
  calendar: Category[];
  tasks: Category[];
  notes: Category[];
  reminders: Category[];
}

export default function SettingsPage() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"profile" | "subscription" | "categories" | "ai" | "preferences">("profile");
  
  // Profile settings
  const [profile, setProfile] = useState({
    name: "Atharv Creator",
    email: "kaleatharv9197@gmail.com",
    avatar: "☕"
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileName, setEditProfileName] = useState("");
  const [editProfileEmail, setEditProfileEmail] = useState("");
  const [editProfileAvatar, setEditProfileAvatar] = useState("☕");

  // Subscription Details
  const subscription = {
    plan: "Cozy Creator Pro",
    status: "Active",
    renewal: "June 15, 2027",
    limits: {
      aiApps: "3 / 3 Custom Apps Pinned",
      whiteboards: "4 / 10 Boards created",
      kanbans: "2 / 5 Kanban boards"
    }
  };

  // Category Manager details
  const [categoriesTab, setCategoriesTab] = useState<keyof WorkspaceCategories>("calendar");
  const [categories, setCategories] = useState<WorkspaceCategories>({
    calendar: [
      { id: "c-1", name: "Work Syncs", color: "#3B82F6", icon: "Calendar" },
      { id: "c-2", name: "Personal Life", color: "#10B981", icon: "User" },
      { id: "c-3", name: "Fitness & Sport", color: "#EF4444", icon: "Clock" }
    ],
    tasks: [
      { id: "t-1", name: "Urgent Hotfix", color: "#EF4444", icon: "AlertCircle" },
      { id: "t-2", name: "Backlog Tasks", color: "#8B5CF6", icon: "Clock" }
    ],
    notes: [
      { id: "n-1", name: "Meeting Drafts", color: "#F59E0B", icon: "FileText" },
      { id: "n-2", name: "Daily Journal", color: "#EC4899", icon: "Pin" }
    ],
    reminders: [
      { id: "r-1", name: "Healthy Habits", color: "#10B981", icon: "Clock" }
    ]
  });

  // Category modal states
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState("");
  const [catColor, setCatColor] = useState("#8B5CF6");
  const [catIcon, setCatIcon] = useState("Calendar");

  // AI settings
  const [aiSettings, setAiSettings] = useState({
    model: "Gemini 1.5 Pro",
    tone: "Cozy & Warm",
    behavior: "Concise & Bullets",
    features: {
      aiRefine: true,
      aiAssistant: true,
      aiTemplateBuilder: true
    }
  });

  // Preference settings
  const [preferences, setPreferences] = useState({
    theme: "light",
    cozyCreamBg: true,
    emailAlerts: true,
    defaultCalendarView: "Month",
    defaultTaskPriority: "Medium",
    autoSave: true,
    incognitoUsage: false
  });

  const [saving, setSaving] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("nook-profile");
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    const savedCategories = localStorage.getItem("nook-categories");
    if (savedCategories) setCategories(JSON.parse(savedCategories));

    const savedAi = localStorage.getItem("nook-ai-settings");
    if (savedAi) setAiSettings(JSON.parse(savedAi));

    const savedPrefs = localStorage.getItem("nook-preferences");
    if (savedPrefs) {
      const parsed = JSON.parse(savedPrefs);
      setPreferences(parsed);
      // Sync theme on HTML root element on mount
      const root = window.document.documentElement;
      if (parsed.theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, []);

  // Save Settings
  const handleSaveAll = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem("nook-profile", JSON.stringify(profile));
      localStorage.setItem("nook-categories", JSON.stringify(categories));
      localStorage.setItem("nook-ai-settings", JSON.stringify(aiSettings));
      localStorage.setItem("nook-preferences", JSON.stringify(preferences));
      
      // Save global theme trigger
      const root = window.document.documentElement;
      if (preferences.theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      setSaving(false);
      alert("✨ All settings and categories saved successfully!");
    }, 1200);
  };

  // Start editing profile details
  const startEditingProfile = () => {
    setEditProfileName(profile.name);
    setEditProfileEmail(profile.email);
    setEditProfileAvatar(profile.avatar);
    setIsEditingProfile(true);
  };

  // Save profile subform
  const saveProfileDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      name: editProfileName,
      email: editProfileEmail,
      avatar: editProfileAvatar
    };
    setProfile(updated);
    localStorage.setItem("nook-profile", JSON.stringify(updated));
    setIsEditingProfile(false);
  };

  // Create or update custom category
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const list = categories[categoriesTab];
    let updatedList;

    if (editingCatId) {
      // Update
      updatedList = list.map((c) =>
        c.id === editingCatId ? { ...c, name: catName, color: catColor, icon: catIcon } : c
      );
    } else {
      // Create
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: catName,
        color: catColor,
        icon: catIcon
      };
      updatedList = [...list, newCat];
    }

    const updatedCategories = {
      ...categories,
      [categoriesTab]: updatedList
    };

    setCategories(updatedCategories);
    localStorage.setItem("nook-categories", JSON.stringify(updatedCategories));
    
    // Reset Modal
    setIsCatModalOpen(false);
    setEditingCatId(null);
    setCatName("");
  };

  // Start editing category
  const startEditingCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setCatName(cat.name);
    setCatColor(cat.color);
    setCatIcon(cat.icon);
    setIsCatModalOpen(true);
  };

  // Delete Category
  const handleDeleteCategory = (catId: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    const updatedList = categories[categoriesTab].filter((c) => c.id !== catId);
    const updatedCategories = {
      ...categories,
      [categoriesTab]: updatedList
    };

    setCategories(updatedCategories);
    localStorage.setItem("nook-categories", JSON.stringify(updatedCategories));
  };

  // Export data JSON helper
  const handleExportData = () => {
    const data = {
      profile,
      categories,
      aiSettings,
      preferences,
      generatedApps: JSON.parse(localStorage.getItem("generated-apps") || "[]"),
      sidebarApps: JSON.parse(localStorage.getItem("sidebar-apps") || "[]")
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `nook-canvas-workspace-export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Category color options swatches
  const colorSwatches = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#6B7280", "#14B8A6"];

  // Category Icon components map list helper
  const renderCategoryIcon = (iconName: string, color: string) => {
    const classes = "w-3.5 h-3.5 shrink-0";
    switch (iconName) {
      case "Clock": return <Clock className={classes} style={{ color }} />;
      case "AlertCircle": return <AlertCircle className={classes} style={{ color }} />;
      case "FileText": return <FileText className={classes} style={{ color }} />;
      case "Pin": return <Pin className={classes} style={{ color }} />;
      case "User": return <User className={classes} style={{ color }} />;
      default: return <Calendar className={classes} style={{ color }} />;
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl w-full mx-auto space-y-6 select-none font-sans">
      
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer md:hidden shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="w-9 h-9 rounded-xl bg-[#FAF8F5] dark:bg-[var(--secondary)] border border-[var(--border)] text-[#7F56D9] flex items-center justify-center shrink-0 shadow-xs">
            <Settings className="w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[var(--foreground)]">Settings & Preferences</h1>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5 font-medium">Configure profile info, custom categories, AI variables, and data backups.</p>
          </div>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-[#7F56D9] hover:bg-[#6C42C8] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {saving ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saving ? "Saving..." : "Save Configuration"}</span>
        </button>
      </header>

      {/* Main settings tabs layout split columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        
        {/* Left Side Tabs */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 shadow-xs space-y-1 md:col-span-1">
          <button
            onClick={() => setActiveTab("profile")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer",
              activeTab === "profile"
                ? "bg-[#7F56D9]/10 text-[#7F56D9] font-extrabold"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/60"
            )}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Profile & Account</span>
          </button>
          
          <button
            onClick={() => setActiveTab("subscription")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer",
              activeTab === "subscription"
                ? "bg-[#7F56D9]/10 text-[#7F56D9] font-extrabold"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/60"
            )}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>Plan & limits</span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer",
              activeTab === "categories"
                ? "bg-[#7F56D9]/10 text-[#7F56D9] font-extrabold"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/60"
            )}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>Custom Categories</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer",
              activeTab === "ai"
                ? "bg-[#7F56D9]/10 text-[#7F56D9] font-extrabold"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/60"
            )}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>AI Assistant Config</span>
          </button>

          <button
            onClick={() => setActiveTab("preferences")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer",
              activeTab === "preferences"
                ? "bg-[#7F56D9]/10 text-[#7F56D9] font-extrabold"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/60"
            )}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>System Preferences</span>
          </button>
        </div>

        {/* Right side configuration panes */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Tab 1: Profile */}
          {activeTab === "profile" && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-5">
              <div>
                <h2 className="text-sm font-extrabold text-[var(--foreground)] uppercase tracking-wider">Profile Information</h2>
                <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">Manage details and personalized emoji identifiers.</p>
              </div>

              {!isEditingProfile ? (
                <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                  <div className="w-12 h-12 rounded-full border border-[var(--border)] bg-[#7F56D9]/10 flex items-center justify-center text-xl shadow-xs shrink-0 select-none">
                    {profile.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-sm text-[var(--foreground)] truncate">{profile.name}</h3>
                    <p className="text-[11px] text-[var(--muted-foreground)] truncate">{profile.email}</p>
                  </div>
                  <button
                    onClick={startEditingProfile}
                    className="px-3 py-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={saveProfileDetails} className="space-y-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase">Emoji Avatar</label>
                      <select
                        value={editProfileAvatar}
                        onChange={(e) => setEditProfileAvatar(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] text-[var(--foreground)] font-semibold"
                      >
                        <option value="☕">☕ Coffee Cup</option>
                        <option value="🎨">🎨 Artist Palette</option>
                        <option value="💡">💡 Idea Light</option>
                        <option value="🌟">🌟 Active Star</option>
                        <option value="🍀">🍀 Clover Leaf</option>
                        <option value="🚀">🚀 Spaceship</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase">User Name</label>
                      <input
                        type="text"
                        required
                        value={editProfileName}
                        onChange={(e) => setEditProfileName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase">Email address</label>
                      <input
                        type="email"
                        required
                        value={editProfileEmail}
                        onChange={(e) => setEditProfileEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3 py-1.5 text-[10px] font-bold rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 text-[10px] font-bold rounded-lg bg-[#7F56D9] text-white hover:bg-[#6C42C8] cursor-pointer"
                    >
                      Save details
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Tab 2: Subscription Plan */}
          {activeTab === "subscription" && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-sm font-extrabold text-[var(--foreground)] uppercase tracking-wider">Subscription Tier</h2>
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">Control billing schedules and track quotas.</p>
                </div>
                <span className="text-[10px] font-extrabold bg-[#10B981]/15 text-[#10B981] px-2.5 py-1 rounded-full uppercase select-none">
                  {subscription.status}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] bg-[#7F56D9]/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[var(--foreground)]">{subscription.plan}</span>
                  <span className="text-[10px] text-[var(--muted-foreground)] font-semibold">Renews: {subscription.renewal}</span>
                </div>

                <div className="border-t border-[var(--border)] pt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[10px] font-bold text-[var(--muted-foreground)]">
                  <div>
                    <span className="block text-[8px] uppercase font-extrabold tracking-wider">AI BUILDER LIMIT</span>
                    <span className="text-[var(--foreground)] font-extrabold block mt-0.5">{subscription.limits.aiApps}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase font-extrabold tracking-wider">WHITEBOARDS</span>
                    <span className="text-[var(--foreground)] font-extrabold block mt-0.5">{subscription.limits.whiteboards}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase font-extrabold tracking-wider">KANBAN BOARDS</span>
                    <span className="text-[var(--foreground)] font-extrabold block mt-0.5">{subscription.limits.kanbans}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => alert("Billing portal integrated with Stripe is in Sandbox mode.")}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] cursor-pointer"
                >
                  Manage Subscription
                </button>
                <button
                  type="button"
                  onClick={() => alert("Upgrade module details locked by workspace owner.")}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[#7F56D9] text-white hover:bg-[#6C42C8] cursor-pointer"
                >
                  Upgrade Tier Plan
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Dynamic Category Settings */}
          {activeTab === "categories" && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-[var(--foreground)] uppercase tracking-wider">Workspace Categories</h2>
                  <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">Define custom color tags and icons for your calendars, boards, and files.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingCatId(null);
                    setCatName("");
                    setCatColor("#8B5CF6");
                    setCatIcon("Calendar");
                    setIsCatModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-[#7F56D9] hover:bg-[#6C42C8] text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Category</span>
                </button>
              </div>

              {/* Subtabs for calendar events, tasks, notes, reminders */}
              <div className="flex border-b border-[var(--border)] gap-2 select-none">
                {(["calendar", "tasks", "notes", "reminders"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCategoriesTab(tab)}
                    className={cn(
                      "px-3 py-1.5 text-[10px] uppercase font-bold border-b-2 -mb-[2px] transition-all cursor-pointer",
                      categoriesTab === tab
                        ? "border-[#7F56D9] text-[#7F56D9]"
                        : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Category List */}
              <div className="space-y-2">
                {categories[categoriesTab].length === 0 ? (
                  <p className="text-[10px] text-center text-[var(--muted-foreground)] py-6">No custom categories in this category group yet.</p>
                ) : (
                  categories[categoriesTab].map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--secondary)]/20 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${cat.color}15` }}
                        >
                          {renderCategoryIcon(cat.icon, cat.color)}
                        </div>
                        <span className="text-xs font-bold text-[var(--foreground)] truncate">{cat.name}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEditingCategory(cat)}
                          className="p-1 hover:bg-[var(--secondary)] rounded text-[var(--muted-foreground)] hover:text-[#7F56D9] cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1 hover:bg-[#F9EAEB] rounded text-[var(--muted-foreground)] hover:text-[#D36A73] cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Dynamic Category Builder Modal inline form */}
              {isCatModalOpen && (
                <form onSubmit={handleSaveCategory} className="border border-[var(--border)] bg-[var(--secondary)]/20 rounded-xl p-4 space-y-4">
                  <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--foreground)]">
                    {editingCatId ? "Edit Custom Category" : "New Custom Category"}
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase">Category Name</label>
                      <input
                        type="text"
                        required
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        placeholder="e.g. Personal Project Sync"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase">Icon Symbol</label>
                      <select
                        value={catIcon}
                        onChange={(e) => setCatIcon(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--card)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] text-[var(--foreground)] font-semibold"
                      >
                        <option value="Calendar">Calendar</option>
                        <option value="User">Profile / User</option>
                        <option value="Clock">Clock / Time</option>
                        <option value="AlertCircle">Alert Circle</option>
                        <option value="FileText">File Text</option>
                        <option value="Pin">Pin / Tag</option>
                      </select>
                    </div>
                  </div>

                  {/* Swatches Color Picker */}
                  <div className="space-y-1">
                    <label className="block text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase mb-2">Category Color Swatch</label>
                    <div className="flex gap-2 flex-wrap">
                      {colorSwatches.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setCatColor(color)}
                          className={cn(
                            "w-5 h-5 rounded-full border border-black/5 flex items-center justify-center shrink-0 cursor-pointer",
                            catColor === color ? "ring-2 ring-[#7F56D9]" : ""
                          )}
                          style={{ backgroundColor: color }}
                        >
                          {catColor === color && <Check className="w-3 h-3 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
                    <button
                      type="button"
                      onClick={() => setIsCatModalOpen(false)}
                      className="px-3 py-1.5 text-[9px] font-bold rounded-lg border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 text-[9px] font-bold rounded-lg bg-[#7F56D9] text-white hover:bg-[#6C42C8] cursor-pointer"
                    >
                      {editingCatId ? "Update Tag" : "Create Tag"}
                    </button>
                  </div>

                </form>
              )}

            </div>
          )}

          {/* Tab 4: AI Settings */}
          {activeTab === "ai" && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-5">
              <div>
                <h2 className="text-sm font-extrabold text-[var(--foreground)] uppercase tracking-wider">AI Assistant Configurations</h2>
                <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">Select preferred default models and AI output structures.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase">AI Inference Model</label>
                  <select
                    value={aiSettings.model}
                    onChange={(e) => setAiSettings({ ...aiSettings, model: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] text-[var(--foreground)] font-semibold"
                  >
                    <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
                    <option value="Gemini 1.5 Flash">Gemini 1.5 Flash</option>
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                    <option value="GPT-4o Mini">GPT-4o Mini</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase">Response Tone</label>
                  <select
                    value={aiSettings.tone}
                    onChange={(e) => setAiSettings({ ...aiSettings, tone: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] text-[var(--foreground)] font-semibold"
                  >
                    <option value="Cozy & Warm">Cozy & Warm</option>
                    <option value="Professional & Clean">Professional & Clean</option>
                    <option value="Creative & Playful">Creative & Playful</option>
                    <option value="Concise Bullets">Concise Bullets</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase">Default Output Style</label>
                  <select
                    value={aiSettings.behavior}
                    onChange={(e) => setAiSettings({ ...aiSettings, behavior: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] text-[var(--foreground)] font-semibold"
                  >
                    <option value="Concise & Bullets">Concise & Bullets</option>
                    <option value="Verbose & Comprehensive">Verbose & Comprehensive</option>
                    <option value="Step-by-Step guides">Step-by-Step guides</option>
                  </select>
                </div>
              </div>

              {/* Checkbox triggers to toggle active features */}
              <div className="border-t border-[var(--border)] pt-4 space-y-3.5">
                <span className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase">Active AI Integration modules</span>
                
                <label className="flex items-start gap-3 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={aiSettings.features.aiRefine}
                    onChange={(e) =>
                      setAiSettings({
                        ...aiSettings,
                        features: { ...aiSettings.features, aiRefine: e.target.checked }
                      })
                    }
                    className="rounded border-[var(--border)] text-[#7F56D9] focus:ring-[#7F56D9] mt-0.5 cursor-pointer w-4 h-4"
                  />
                  <div>
                    <span className="block font-bold text-[var(--foreground)]">Enable AI Refine & Notes editing helper</span>
                    <span className="block text-[10px] text-[var(--muted-foreground)] font-medium">Auto-suggest structures and summarize text blocks inside Tiptap notes drafts.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={aiSettings.features.aiAssistant}
                    onChange={(e) =>
                      setAiSettings({
                        ...aiSettings,
                        features: { ...aiSettings.features, aiAssistant: e.target.checked }
                      })
                    }
                    className="rounded border-[var(--border)] text-[#7F56D9] focus:ring-[#7F56D9] mt-0.5 cursor-pointer w-4 h-4"
                  />
                  <div>
                    <span className="block font-bold text-[var(--foreground)]">Enable Floating AI Sidebar Assistant Drawer</span>
                    <span className="block text-[10px] text-[var(--muted-foreground)] font-medium">Adds access panel shortcuts to summon the conversational workspace helper.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={aiSettings.features.aiTemplateBuilder}
                    onChange={(e) =>
                      setAiSettings({
                        ...aiSettings,
                        features: { ...aiSettings.features, aiTemplateBuilder: e.target.checked }
                      })
                    }
                    className="rounded border-[var(--border)] text-[#7F56D9] focus:ring-[#7F56D9] mt-0.5 cursor-pointer w-4 h-4"
                  />
                  <div>
                    <span className="block font-bold text-[var(--foreground)]">Enable AI Template & Workspace generator</span>
                    <span className="block text-[10px] text-[var(--muted-foreground)] font-medium">Create single page mini-apps layout structures from plain descriptions.</span>
                  </div>
                </label>
              </div>

            </div>
          )}

          {/* Tab 5: Preferences */}
          {activeTab === "preferences" && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 shadow-xs space-y-5">
              <div>
                <h2 className="text-sm font-extrabold text-[var(--foreground)] uppercase tracking-wider">System Preferences</h2>
                <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">Customize global styles, auto-save actions, and security metrics.</p>
              </div>

              {/* Theme Settings */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPreferences({ ...preferences, theme: "light" })}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer",
                    preferences.theme === "light"
                      ? "border-[#7F56D9] bg-[#7F56D9]/5 text-[#7F56D9] font-extrabold"
                      : "border-[var(--border)] hover:bg-[var(--secondary)]/20 text-[var(--muted-foreground)]"
                  )}
                >
                  <Sun className="w-5 h-5 mb-1.5" />
                  <span className="text-xs">Light Palette</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreferences({ ...preferences, theme: "dark" })}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer",
                    preferences.theme === "dark"
                      ? "border-[#7F56D9] bg-[#7F56D9]/5 text-[#7F56D9] font-extrabold"
                      : "border-[var(--border)] hover:bg-[var(--secondary)]/20 text-[var(--muted-foreground)]"
                  )}
                >
                  <Moon className="w-5 h-5 mb-1.5" />
                  <span className="text-xs">Dark Palette</span>
                </button>
              </div>

              {/* Auto Save, Alerts, Views Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase">Default Calendar View</label>
                  <select
                    value={preferences.defaultCalendarView}
                    onChange={(e) => setPreferences({ ...preferences, defaultCalendarView: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] text-[var(--foreground)] font-semibold"
                  >
                    <option value="Day">Day Grid</option>
                    <option value="Week">Week view</option>
                    <option value="Month">Month Calendar</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-extrabold text-[var(--muted-foreground)] uppercase">Default Task Priority</label>
                  <select
                    value={preferences.defaultTaskPriority}
                    onChange={(e) => setPreferences({ ...preferences, defaultTaskPriority: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] focus:outline-none focus:ring-1 focus:ring-[#7F56D9] text-[var(--foreground)] font-semibold"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
              </div>

              {/* Auto save checkbox triggers */}
              <div className="border-t border-[var(--border)] pt-4 space-y-3.5">
                
                <label className="flex items-start gap-3 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={preferences.autoSave}
                    onChange={(e) => setPreferences({ ...preferences, autoSave: e.target.checked })}
                    className="rounded border-[var(--border)] text-[#7F56D9] focus:ring-[#7F56D9] mt-0.5 cursor-pointer w-4 h-4"
                  />
                  <div>
                    <span className="block font-bold text-[var(--foreground)]">Enable Auto-save on modification</span>
                    <span className="block text-[10px] text-[var(--muted-foreground)] font-medium">Tiptap editor and whiteboard canvas contents update automatically inside browser storage.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={preferences.emailAlerts}
                    onChange={(e) => setPreferences({ ...preferences, emailAlerts: e.target.checked })}
                    className="rounded border-[var(--border)] text-[#7F56D9] focus:ring-[#7F56D9] mt-0.5 cursor-pointer w-4 h-4"
                  />
                  <div>
                    <span className="block font-bold text-[var(--foreground)]">Receive Email notifications</span>
                    <span className="block text-[10px] text-[var(--muted-foreground)] font-medium">Daily digests of task kanbans, reminders, and workspace invitations.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    checked={preferences.incognitoUsage}
                    onChange={(e) => setPreferences({ ...preferences, incognitoUsage: e.target.checked })}
                    className="rounded border-[var(--border)] text-[#7F56D9] focus:ring-[#7F56D9] mt-0.5 cursor-pointer w-4 h-4"
                  />
                  <div>
                    <span className="block font-bold text-[var(--foreground)]">Enable Local-only Offline caching</span>
                    <span className="block text-[10px] text-[var(--muted-foreground)] font-medium">Prevents sending logs metrics to diagnostic servers (increases privacy).</span>
                  </div>
                </label>

              </div>

              {/* Data backups */}
              <div className="border-t border-[var(--border)] pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="block font-bold text-xs text-[var(--foreground)]">Export Workspace Data</span>
                  <span className="block text-[10px] text-[var(--muted-foreground)] font-medium">Downloads your complete custom categories, profile, settings, and generated templates as a JSON backup file.</span>
                </div>
                <button
                  type="button"
                  onClick={handleExportData}
                  className="px-4 py-2 border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup JSON</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
