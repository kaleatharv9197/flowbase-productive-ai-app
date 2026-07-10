"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles, Bot, SquareKanban, Calendar, FileText, Palette,
  Layout, Users, Zap, Check, ChevronDown, ArrowRight, Star,
  Shield, Globe, Clock, TrendingUp, Layers, MessageSquare,
  Play, X, Menu, Target, Lightbulb, BookOpen, Briefcase,
  GraduationCap, Coffee, BarChart3, Bell, Settings,
  ExternalLink, Twitter, Github, Linkedin, ChevronRight, Flame
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function GradientText({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("bg-gradient-to-r from-[#7F56D9] via-[#9B72EF] to-[#C084FC] bg-clip-text text-transparent", className)}>
      {children}
    </span>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border", className)}>
      {children}
    </span>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled
        ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100"
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/landing" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7F56D9] to-[#C084FC] flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-extrabold text-gray-900 tracking-tight">Nook &amp; Canvas</span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-sm font-semibold text-gray-600 hover:text-[#7F56D9] transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/sign-in" className="text-sm font-bold text-gray-700 hover:text-[#7F56D9] transition-colors px-3 py-1.5">
            Sign In
          </Link>
          <Link href="/sign-up" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#7F56D9] to-[#9B72EF] text-white text-sm font-bold hover:opacity-90 transition-all shadow-sm">
            Get Started Free
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 px-6 py-4 space-y-3">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
              className="block text-sm font-semibold text-gray-700 hover:text-[#7F56D9] py-2 transition-colors">
              {l.label}
            </a>
          ))}
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <Link href="/sign-in" className="text-sm font-bold text-gray-700 py-2">Sign In</Link>
            <Link href="/sign-up" className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7F56D9] to-[#9B72EF] text-white text-sm font-bold">
              Get Started Free <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden bg-gradient-to-b from-[#FAF8FF] via-white to-[#F5F0FF]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#7F56D9]/20 to-[#C084FC]/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-[#3B82F6]/15 to-[#7F56D9]/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#C084FC]/8 to-transparent blur-3xl" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(#7F56D9_0.8px,transparent_0.8px)] [background-size:28px_28px] opacity-[0.035] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7F56D9]/10 border border-[#7F56D9]/20 text-[#7F56D9] text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>AI-Powered Productivity Workspace</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.05] tracking-tight">
          Your AI-Powered Workspace<br />
          for <GradientText>Notes, Tasks,</GradientText><br />
          <GradientText>Whiteboards</GradientText> &amp; Teams
        </h1>

        <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
          Nook &amp; Canvas unifies Notion-style notes, Miro-style whiteboards, Kanban boards, AI assistant, calendar, and real-time collaboration into one beautiful, intelligent platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#7F56D9] to-[#9B72EF] text-white font-extrabold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#7F56D9]/30 group">
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <button className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm text-gray-800 font-bold text-sm hover:bg-white transition-all group">
            <div className="w-5 h-5 rounded-full bg-[#7F56D9]/15 flex items-center justify-center">
              <Play className="w-2.5 h-2.5 text-[#7F56D9] fill-[#7F56D9]" />
            </div>
            Watch Demo
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {[
            { icon: <Bot className="w-3.5 h-3.5" />, label: "AI Assistant" },
            { icon: <Users className="w-3.5 h-3.5" />, label: "Real-time Collaboration" },
            { icon: <Shield className="w-3.5 h-3.5" />, label: "SOC2 Compliant" },
            { icon: <Zap className="w-3.5 h-3.5" />, label: "Instant Setup" },
          ].map((b) => (
            <Badge key={b.label} className="bg-white/80 border-gray-200 text-gray-600 backdrop-blur-sm">
              <span className="text-[#7F56D9]">{b.icon}</span>
              {b.label}
            </Badge>
          ))}
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="relative mt-10 mx-auto max-w-4xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#7F56D9]/20 to-transparent blur-2xl opacity-60" />
          <div className="relative rounded-2xl border border-gray-200/60 bg-white/80 backdrop-blur-sm shadow-2xl shadow-[#7F56D9]/10 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/80">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              <div className="flex-1 mx-4 h-6 rounded-lg bg-gray-200/60 flex items-center px-3">
                <span className="text-[10px] text-gray-400 font-medium">app.nookcanvas.io/dashboard</span>
              </div>
            </div>

            <div className="flex h-64 md:h-80">
              <div className="w-14 md:w-44 border-r border-gray-100 bg-gray-50/60 p-2 md:p-3 space-y-1 shrink-0">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#7F56D9]/10">
                  <div className="w-4 h-4 rounded bg-[#7F56D9]/30" />
                  <div className="hidden md:block h-2.5 bg-[#7F56D9]/40 rounded w-16" />
                </div>
                {["#4A7C70","#4285F4","#D8A035","#E07A5F","#8E75C4"].map((c,i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg">
                    <div className="w-4 h-4 rounded shrink-0" style={{ backgroundColor: `${c}30` }} />
                    <div className="hidden md:block h-2 rounded w-20" style={{ backgroundColor: `${c}40` }} />
                  </div>
                ))}
              </div>
              <div className="flex-1 p-4 space-y-3 overflow-hidden">
                <div className="grid grid-cols-3 gap-2">
                  {[{color:"#7F56D9",label:"24 Tasks"},{color:"#4A7C70",label:"12 Notes"},{color:"#D8A035",label:"5 Events"}].map((c,i) => (
                    <div key={i} className="p-3 rounded-xl border border-gray-100 bg-white space-y-1">
                      <div className="w-5 h-5 rounded-lg" style={{ backgroundColor: `${c.color}20` }} />
                      <div className="h-2.5 rounded w-12" style={{ backgroundColor: `${c.color}50` }} />
                      <div className="text-[10px] font-bold" style={{ color: c.color }}>{c.label}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-gray-100 bg-white p-3 space-y-2">
                    <div className="h-2.5 rounded bg-gray-200 w-20" />
                    {[1,2,3].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border border-[#7F56D9]/30" />
                        <div className="h-2 rounded bg-gray-100 flex-1" />
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-white p-3 space-y-2">
                    <div className="h-2.5 rounded bg-gray-200 w-24" />
                    <div className="h-2 rounded bg-gradient-to-r from-[#7F56D9] to-[#C084FC] w-3/4" />
                    <div className="text-[9px] text-gray-400">75% complete</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-2">
          <div className="flex -space-x-2">
            {["#E07A5F","#4A7C70","#8E75C4","#4285F4","#D8A035"].map((c,i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: c }}>
                {["A","B","C","D","E"][i]}
              </div>
            ))}
          </div>
          <span className="font-semibold"><strong className="text-gray-800">2,400+</strong> teams already building</span>
          <div className="flex gap-0.5">{[1,2,3,4,5].map((i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}</div>
        </div>
      </div>
    </section>
  );
}

// ─── Feature Highlights ───────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    { icon: <Bot className="w-5 h-5" />, title: "AI Assistant", desc: "Chat with AI to create tasks, write notes, schedule reminders, generate diagrams, and manage your workspace through natural language.", color: "from-[#7F56D9]/15 to-[#C084FC]/8", border: "border-[#7F56D9]/20", iconBg: "bg-[#7F56D9]/15 text-[#7F56D9]", badge: "Core AI" },
    { icon: <Layout className="w-5 h-5" />, title: "Smart Dashboard", desc: "Live productivity overview with real-time task progress, AI insights, upcoming events, recent pages, and activity feed — powered by your actual data.", color: "from-[#4285F4]/15 to-[#60A5FA]/8", border: "border-[#4285F4]/20", iconBg: "bg-[#4285F4]/15 text-[#4285F4]", badge: "Live Data" },
    { icon: <Calendar className="w-5 h-5" />, title: "Calendar & Reminders", desc: "Drag-and-drop calendar with month/week views, color-coded event categories, draft task scheduling, and real-time sync across your workspace.", color: "from-[#10B981]/15 to-[#34D399]/8", border: "border-[#10B981]/20", iconBg: "bg-[#10B981]/15 text-[#10B981]", badge: "Scheduling" },
    { icon: <SquareKanban className="w-5 h-5" />, title: "Kanban Task Boards", desc: "Multi-board Kanban workspace with custom columns, priority levels, labels, calendar sync, and real-time collaboration with your team.", color: "from-[#E07A5F]/15 to-[#F59E0B]/8", border: "border-[#E07A5F]/20", iconBg: "bg-[#E07A5F]/15 text-[#E07A5F]", badge: "Tasks" },
    { icon: <FileText className="w-5 h-5" />, title: "Notion-Style Notes", desc: "Rich text editor with slash commands, floating bubble menus, AI refine, color-coded notebooks, pinning, and auto-save.", color: "from-[#4A7C70]/15 to-[#10B981]/8", border: "border-[#4A7C70]/20", iconBg: "bg-[#4A7C70]/15 text-[#4A7C70]", badge: "Editor" },
    { icon: <Palette className="w-5 h-5" />, title: "Miro-Style Whiteboard", desc: "Excalidraw-powered infinite canvas with freehand draw, shapes, arrows, sticky notes, AI diagram generator, and PNG export.", color: "from-[#D8A035]/15 to-[#F59E0B]/8", border: "border-[#D8A035]/20", iconBg: "bg-[#D8A035]/15 text-[#D8A035]", badge: "Canvas" },
    { icon: <Sparkles className="w-5 h-5" />, title: "AI Template Builder", desc: "Describe any tool — habit tracker, budget log, study planner — and AI generates a fully interactive single-page mini-app instantly.", color: "from-[#8B5CF6]/15 to-[#C084FC]/8", border: "border-[#8B5CF6]/20", iconBg: "bg-[#8B5CF6]/15 text-[#8B5CF6]", badge: "AI Generate" },
    { icon: <Users className="w-5 h-5" />, title: "Live Collaboration", desc: "Real-time presence indicators, shared Kanban boards, task comments, user avatars, and Liveblocks-powered multi-user sync.", color: "from-[#EC4899]/15 to-[#F9A8D4]/8", border: "border-[#EC4899]/20", iconBg: "bg-[#EC4899]/15 text-[#EC4899]", badge: "Real-time" },
    { icon: <Settings className="w-5 h-5" />, title: "Custom Categories", desc: "Color-coded category tags for Calendar, Tasks, Notes and Reminders. Configure AI models, tones, notifications, and data exports.", color: "from-[#64748B]/15 to-[#94A3B8]/8", border: "border-[#64748B]/20", iconBg: "bg-[#64748B]/15 text-[#64748B]", badge: "Settings" },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-[#7F56D9]/10 border-[#7F56D9]/20 text-[#7F56D9]">
            <Layers className="w-3.5 h-3.5" /> Everything You Need
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            One platform. <GradientText>All your tools.</GradientText>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Stop juggling between apps. Nook &amp; Canvas brings your notes, tasks, calendar, whiteboard, and AI into a single cozy workspace.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className={cn("group relative p-6 rounded-2xl border bg-gradient-to-br transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer", f.color, f.border)}>
              <div className="flex items-start justify-between mb-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", f.iconBg)}>{f.icon}</div>
                <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-full bg-white/70 text-gray-600 border border-gray-200/50">{f.badge}</span>
              </div>
              <h3 className="text-base font-extrabold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-[#7F56D9] opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { number: "01", icon: <Layers className="w-6 h-6" />, title: "Organize Your Workspace", desc: "Set up Spaces, Kanban boards, and notes with custom categories, color tags, and your preferred layout — all in minutes.", color: "from-[#7F56D9] to-[#9B72EF]" },
    { number: "02", icon: <Sparkles className="w-6 h-6" />, title: "Let AI Plan, Create & Track", desc: "Ask AI to create tasks, schedule calendar events, refine notes, generate diagrams, or build mini-apps — just describe what you need.", color: "from-[#EC4899] to-[#F472B6]" },
    { number: "03", icon: <Users className="w-6 h-6" />, title: "Collaborate in Real Time", desc: "Invite teammates, see live presence indicators, share Kanban boards, leave comments, and work together — Liveblocks-powered.", color: "from-[#10B981] to-[#34D399]" },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-[#FAF8FF] to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]">
            <Zap className="w-3.5 h-3.5" /> Simple & Fast
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Up and running in <GradientText>3 steps</GradientText>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center gap-5 group">
              <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300", step.color)}>
                {step.icon}
              </div>
              <div>
                <div className="text-xs font-extrabold text-[#7F56D9] uppercase tracking-widest mb-2">Step {step.number}</div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Product Showcase ─────────────────────────────────────────────────────────
function ProductShowcaseSection() {
  const showcases = [
    {
      title: "Smart Dashboard", sub: "Real-time productivity overview",
      icon: <BarChart3 className="w-5 h-5" />, color: "#7F56D9",
      content: (
        <div className="space-y-3 p-4">
          <div className="grid grid-cols-4 gap-2">
            {[["24","Tasks","#FCECE7","#B34B2E"],["12","Notes","#E2ECE9","#4A7C70"],["5","Events","#E8F0FE","#1C54B2"],["3","Apps","#F0EBF8","#62479B"]].map(([v,l,bg,t]) => (
              <div key={l} className="p-2 rounded-xl text-center" style={{ backgroundColor: bg }}>
                <div className="text-lg font-black" style={{ color: t }}>{v}</div>
                <div className="text-[9px] font-bold" style={{ color: t }}>{l}</div>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-[#7F56D9]/8 border border-[#7F56D9]/15">
            <div className="text-[10px] font-extrabold text-[#7F56D9] mb-2">Sprint Progress · 75%</div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#7F56D9] to-[#C084FC] rounded-full w-3/4" />
            </div>
          </div>
          {["⚡ 3 high-priority tasks pending.","📅 2 reminders today.","🌟 Most active: Notes workspace."].map((msg) => (
            <div key={msg} className="text-[10px] p-2 rounded-lg bg-[#FBF3DB] border border-[#F2DEB1] text-[#8E640B] font-semibold">{msg}</div>
          ))}
        </div>
      ),
    },
    {
      title: "Notes Editor", sub: "Notion-style rich text with AI",
      icon: <FileText className="w-5 h-5" />, color: "#4A7C70",
      content: (
        <div className="p-4 space-y-3">
          <div className="text-sm font-extrabold text-gray-800">Product Architecture Spec</div>
          <div className="text-xs text-gray-700 leading-relaxed">We are creating a workspace that leverages the structural organization of <strong>Notion</strong> with the visual canvas flexibilities of <strong>Miro</strong>...</div>
          <div className="flex gap-1 flex-wrap">
            {["Bold","Italic","H1","H2","List","Code","Quote"].map((t) => (
              <div key={t} className="text-[8px] px-2 py-1 rounded-md bg-gray-100 text-gray-600 font-bold border border-gray-200">{t}</div>
            ))}
          </div>
          <div className="p-2 rounded-xl bg-[#F0EBF8] border border-[#DCD0F0] flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-[#8E75C4]" />
            <span className="text-[10px] font-bold text-[#62479B]">AI Refine: Rephrase · Shorter · Longer · Grammar</span>
          </div>
        </div>
      ),
    },
    {
      title: "Kanban Board", sub: "Multi-board task management",
      icon: <SquareKanban className="w-5 h-5" />, color: "#E07A5F",
      content: (
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2 h-36">
            {[["Todo","#E8F0FE","#1C54B2",["Design","Write docs"]],["In Progress","#FBF3DB","#8E640B",["Sidebar"]],["Done","#E2ECE9","#4A7C70",["Fix port","Auth"]]].map(([col,bg,t,tasks]) => (
              <div key={col as string} className="rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-2 py-1.5 text-[9px] font-extrabold uppercase tracking-wide" style={{ backgroundColor: bg as string, color: t as string }}>{col as string}</div>
                <div className="p-1.5 space-y-1">
                  {(tasks as string[]).map((task) => (
                    <div key={task} className="text-[8px] p-1.5 rounded-lg bg-white border border-gray-100 font-semibold text-gray-700">{task}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[9px] text-gray-500">
            <Users className="w-3 h-3" /><span>3 collaborators active</span>
            <span className="ml-auto text-[#10B981] font-bold">● Live Sync</span>
          </div>
        </div>
      ),
    },
    {
      title: "Whiteboard Canvas", sub: "Miro-style Excalidraw canvas",
      icon: <Palette className="w-5 h-5" />, color: "#D8A035",
      content: (
        <div className="p-4 bg-[radial-gradient(#7F56D9_0.6px,transparent_0.6px)] [background-size:18px_18px] rounded-xl h-36 relative overflow-hidden">
          <div className="absolute top-3 left-4 w-16 h-10 rounded-xl bg-[#FCECE7] border border-[#F5C7BA] flex items-center justify-center text-[10px] font-bold text-[#B34B2E] rotate-[-2deg]">Idea A</div>
          <div className="absolute top-6 right-6 w-20 h-10 rounded-xl bg-[#E8F0FE] border border-[#B7D2FC] flex items-center justify-center text-[10px] font-bold text-[#1C54B2] rotate-[1deg]">Idea B</div>
          <div className="absolute bottom-4 left-8 w-24 h-8 rounded-xl bg-[#E2ECE9] border border-[#B2D1C8] flex items-center justify-center text-[10px] font-bold text-[#4A7C70]">Architecture</div>
          <div className="absolute bottom-5 right-4 w-12 h-12 rounded-full bg-[#F0EBF8] border border-[#DCD0F0] flex items-center justify-center text-base">💡</div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-[#E07A5F]/10 border-[#E07A5F]/20 text-[#E07A5F]">
            <Palette className="w-3.5 h-3.5" /> Product Showcase
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            See it in <GradientText>action</GradientText>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {showcases.map((s) => (
            <div key={s.title} className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}18`, color: s.color }}>{s.icon}</div>
                <div>
                  <div className="text-sm font-extrabold text-gray-900">{s.title}</div>
                  <div className="text-[10px] text-gray-500 font-medium">{s.sub}</div>
                </div>
                <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </div>
              {s.content}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI Features ──────────────────────────────────────────────────────────────
function AIFeaturesSection() {
  const capabilities = [
    { icon: <SquareKanban className="w-4 h-4" />, text: "Create & assign Kanban tasks" },
    { icon: <Bell className="w-4 h-4" />, text: "Schedule calendar reminders" },
    { icon: <FileText className="w-4 h-4" />, text: "Write & refine note content" },
    { icon: <Palette className="w-4 h-4" />, text: "Generate whiteboard diagrams" },
    { icon: <Sparkles className="w-4 h-4" />, text: "Build mini-apps from prompts" },
    { icon: <TrendingUp className="w-4 h-4" />, text: "Surface productivity insights" },
    { icon: <MessageSquare className="w-4 h-4" />, text: "Voice-to-text with AssemblyAI" },
    { icon: <Target className="w-4 h-4" />, text: "Identify overdue & priorities" },
  ];

  return (
    <section className="py-24 px-6 bg-[#0D0B14] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-80 h-80 rounded-full bg-[#7F56D9]/15 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-[#C084FC]/10 blur-3xl" />
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-7">
            <Badge className="bg-[#7F56D9]/20 border-[#7F56D9]/30 text-[#C084FC]">
              <Sparkles className="w-3.5 h-3.5" /> Powered by AI
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
              Your AI does the <GradientText>heavy lifting</GradientText>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              The built-in AI Assistant acts as your central command center. Just describe what you want — and AI handles the rest across every feature.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {capabilities.map((c) => (
                <div key={c.text} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-[#7F56D9]/20 flex items-center justify-center text-[#C084FC] shrink-0">{c.icon}</div>
                  <span className="text-sm text-gray-300 font-semibold">{c.text}</span>
                </div>
              ))}
            </div>
            <Link href="/sign-up" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7F56D9] to-[#9B72EF] text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-[#7F56D9]/30">
              Try AI Assistant Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Chat Mockup */}
          <div className="rounded-2xl border border-white/10 bg-[#1A1228]/80 backdrop-blur-sm shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#7F56D9] to-[#C084FC] flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-white">CozyAI Assistant</div>
                <div className="flex items-center gap-1.5 text-[10px] text-green-400 font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Online
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4 h-72 overflow-hidden">
              {[
                { ai: true, msg: "Hello! I'm your CozyAI companion. Ask me to create tasks, schedule reminders, write notes, or build mini-apps!" },
                { ai: false, msg: "Create a task: Design the landing page hero section. Due tomorrow, High priority." },
                { ai: true, msg: "Done! Added to your Kanban board with High priority, due tomorrow. Want me to add a calendar reminder too?" },
                { ai: false, msg: "Yes, and list my overdue tasks." },
                { ai: true, msg: "You have 3 overdue tasks: Design palette (2d late), Write docs (1d late), Auth flow review (today). Reschedule any?" },
              ].map((m, i) => (
                <div key={i} className={cn("flex gap-2 max-w-[90%]", !m.ai && "ml-auto flex-row-reverse")}>
                  {m.ai && (
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#7F56D9] to-[#C084FC] flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={cn("px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed font-medium", m.ai ? "bg-white/8 text-gray-200 rounded-tl-none border border-white/8" : "bg-gradient-to-r from-[#7F56D9] to-[#9B72EF] text-white rounded-tr-none")}>
                    {m.msg}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/8 border border-white/10">
                <span className="text-xs text-gray-500 flex-1">Ask AI anything...</span>
                <div className="w-6 h-6 rounded-lg bg-[#7F56D9] flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Collaboration Section ────────────────────────────────────────────────────
function CollaborationSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="text-xs font-extrabold text-gray-700">Product Launch — Live Board</div>
                <div className="ml-auto flex -space-x-1.5">
                  {["#E07A5F","#4A7C70","#8E75C4"].map((c,i) => (
                    <div key={i} className="w-5 h-5 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
                  ))}
                  <div className="w-5 h-5 rounded-full bg-green-400 border-2 border-white flex items-center justify-center">
                    <span className="text-[7px] font-black text-white">+2</span>
                  </div>
                </div>
              </div>
              <div className="p-4 grid grid-cols-3 gap-2">
                {[["Backlog","#E8F0FE","#1C54B2",["Research","Wireframes"]],["In Progress","#FBF3DB","#8E640B",["UI Components"]],["Done","#E2ECE9","#4A7C70",["DB schema"]]].map(([col,bg,t,tasks]) => (
                  <div key={col as string} className="rounded-xl overflow-hidden border border-gray-100">
                    <div className="px-2 py-1.5 text-[9px] font-extrabold" style={{ backgroundColor: bg as string, color: t as string }}>{col as string}</div>
                    <div className="p-1.5 space-y-1">
                      {(tasks as string[]).map((task) => (
                        <div key={task} className="text-[8px] p-1.5 rounded-lg bg-white border border-gray-100 font-semibold text-gray-700">{task}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-bold text-gray-500">3 teammates online · Updated just now</span>
                <div className="ml-auto text-[9px] text-green-600 font-extrabold bg-green-50 px-2 py-1 rounded-full">Liveblocks</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white border border-gray-100 rounded-xl p-3 shadow-xl w-52">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-[#EC4899] flex items-center justify-center text-[8px] font-black text-white">S</div>
                <span className="text-[10px] font-bold text-gray-700">Sarah left a comment</span>
              </div>
              <p className="text-[9px] text-gray-500 leading-snug">"Move the API spec to this sprint? 🚀"</p>
            </div>
          </div>

          <div className="space-y-6">
            <Badge className="bg-[#EC4899]/10 border-[#EC4899]/20 text-[#EC4899]">
              <Users className="w-3.5 h-3.5" /> Real-time Collaboration
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              Build together, <GradientText>in sync</GradientText>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Invite your team, see who's online, and collaborate without conflicts. Powered by Liveblocks for millisecond-fast real-time updates.
            </p>
            {[
              { icon: <Users className="w-4 h-4 text-[#EC4899]" />, title: "Shared Kanban Boards", desc: "Assign tasks, track progress, see live cursor presence." },
              { icon: <MessageSquare className="w-4 h-4 text-[#4285F4]" />, title: "Task Comments Sidebar", desc: "Threaded comments on every card. Never lose context." },
              { icon: <Globe className="w-4 h-4 text-[#10B981]" />, title: "Liveblocks-Powered Sync", desc: "Sub-100ms real-time updates across all connected teammates." },
              { icon: <Shield className="w-4 h-4 text-[#D8A035]" />, title: "Team Workspace Security", desc: "Role-based access, presence control, and audit logging." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">{item.icon}</div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Use Cases ────────────────────────────────────────────────────────────────
function UseCasesSection() {
  const cases = [
    { icon: <Briefcase className="w-6 h-6" />, title: "Founders & Startups", desc: "Run your entire company from one place — plan sprints, track tasks, write product specs, and collaborate with your team.", color: "from-[#7F56D9]/15 to-[#9B72EF]/8", iconColor: "text-[#7F56D9] bg-[#7F56D9]/15" },
    { icon: <GraduationCap className="w-6 h-6" />, title: "Students & Researchers", desc: "Organize lecture notes, track assignment deadlines, build study plans, and use AI to summarize and synthesize content.", color: "from-[#4285F4]/15 to-[#60A5FA]/8", iconColor: "text-[#4285F4] bg-[#4285F4]/15" },
    { icon: <Lightbulb className="w-6 h-6" />, title: "Content Creators", desc: "Plan editorial calendars, brainstorm on whiteboards, write drafts with AI assistance, and track publishing workflows.", color: "from-[#EC4899]/15 to-[#F9A8D4]/8", iconColor: "text-[#EC4899] bg-[#EC4899]/15" },
    { icon: <Target className="w-6 h-6" />, title: "Project Managers", desc: "Manage multi-team projects with Kanban boards, assign tasks, set priorities, track overdue items, and view live reports.", color: "from-[#E07A5F]/15 to-[#F59E0B]/8", iconColor: "text-[#E07A5F] bg-[#E07A5F]/15" },
    { icon: <Coffee className="w-6 h-6" />, title: "Personal Productivity", desc: "Build your second brain — a cozy personal workspace for goals, daily notes, habit tracking, and life planning.", color: "from-[#D8A035]/15 to-[#F59E0B]/8", iconColor: "text-[#D8A035] bg-[#D8A035]/15" },
    { icon: <Users className="w-6 h-6" />, title: "Remote Teams", desc: "Bridge the gap with async-first collaboration, shared spaces, real-time whiteboards, and AI-powered standup summaries.", color: "from-[#10B981]/15 to-[#34D399]/8", iconColor: "text-[#10B981] bg-[#10B981]/15" },
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#FAF8FF] to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-[#D8A035]/10 border-[#D8A035]/20 text-[#D8A035]">
            <BookOpen className="w-3.5 h-3.5" /> Use Cases
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Built for <GradientText>everyone</GradientText>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">From solo creators to enterprise teams — Nook &amp; Canvas adapts to the way you work.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cases.map((c) => (
            <div key={c.title} className={cn("p-6 rounded-2xl border border-gray-100 bg-gradient-to-br hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer", c.color)}>
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", c.iconColor)}>{c.icon}</div>
              <h3 className="text-base font-extrabold text-gray-900 mb-2">{c.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
function PricingSection() {
  const plans = [
    {
      name: "Free", price: "$0", period: "forever",
      desc: "Perfect for individuals getting started.",
      color: "border-gray-200", badge: null,
      cta: "Get Started Free",
      ctaClass: "border border-gray-200 bg-white text-gray-800 hover:bg-gray-50",
      features: ["Up to 3 Kanban boards","50 notes limit","2 whiteboards","Basic AI Assistant (30 msg/day)","Calendar & reminders","1 workspace","Community support"],
    },
    {
      name: "Pro", price: "$12", period: "/month",
      desc: "For power users and growing teams.",
      color: "border-[#7F56D9]/40 ring-2 ring-[#7F56D9]/20", badge: "Most Popular",
      cta: "Start Pro Trial",
      ctaClass: "bg-gradient-to-r from-[#7F56D9] to-[#9B72EF] text-white hover:opacity-90 shadow-lg shadow-[#7F56D9]/30",
      features: ["Unlimited Kanban boards","Unlimited notes & whiteboards","Full AI Assistant (unlimited)","AI Template Builder (10 apps)","Real-time collaboration (up to 5)","Custom categories & settings","Data export & backups","Priority support"],
    },
    {
      name: "Team", price: "$29", period: "/month",
      desc: "For teams that need advanced collaboration.",
      color: "border-gray-200", badge: null,
      cta: "Contact Sales",
      ctaClass: "border border-gray-200 bg-white text-gray-800 hover:bg-gray-50",
      features: ["Everything in Pro","Unlimited teammates","Admin dashboard & roles","SSO & SAML authentication","Advanced analytics","Custom AI model config","Dedicated Slack support","SLA guarantee"],
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]">
            <Star className="w-3.5 h-3.5" /> Simple Pricing
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Start free, <GradientText>scale as you grow</GradientText>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">No hidden fees. Cancel anytime. All plans include a 14-day free trial.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div key={plan.name} className={cn("relative p-7 rounded-2xl border bg-white flex flex-col gap-6 hover:shadow-xl transition-all duration-300", plan.color)}>
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#7F56D9] to-[#9B72EF] text-white text-[10px] font-extrabold shadow-sm whitespace-nowrap">{plan.badge}</div>
              )}
              <div>
                <div className="text-sm font-extrabold text-gray-500 uppercase tracking-wider mb-1">{plan.name}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{plan.desc}</p>
              </div>
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />{f}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className={cn("w-full text-center py-3 rounded-xl text-sm font-bold transition-all block", plan.ctaClass)}>{plan.cta}</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const testimonials = [
    { name: "Aiden Park", role: "Co-founder at Horizons AI", avatar: "#7F56D9", initials: "AP", quote: "Nook & Canvas replaced 4 tools for our team. Sprint planning, documentation, and whiteboard sessions all in one place. The AI assistant alone saves us 2 hours per day." },
    { name: "Priya Sharma", role: "Product Designer, Freelance", avatar: "#EC4899", initials: "PS", quote: "The whiteboard feels like Miro but with Notion's structure built in. The AI template builder generated a project tracker in seconds. Absolutely love the cozy feel." },
    { name: "Marcus Williams", role: "Engineering Manager at Vercel", avatar: "#10B981", initials: "MW", quote: "Real-time collaboration is seamless. Our distributed team across 3 timezones uses the shared Kanban boards daily. Liveblocks integration is rock solid." },
  ];

  return (
    <section id="testimonials" className="py-24 px-6 bg-gradient-to-b from-[#FAF8FF] to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-amber-50 border-amber-200 text-amber-600">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> Loved by Teams
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Real teams. <GradientText>Real results.</GradientText>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col gap-4">
              <div className="flex gap-0.5">{[1,2,3,4,5].map((i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}</div>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-extrabold shrink-0" style={{ backgroundColor: t.avatar }}>{t.initials}</div>
                <div>
                  <div className="text-sm font-extrabold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "How does real-time collaboration work?", a: "Nook & Canvas uses Liveblocks to power sub-100ms real-time synchronization. You can see live user presence, edit Kanban boards simultaneously, and leave comments on tasks — all without page refreshes." },
    { q: "What can I do on the whiteboard?", a: "The whiteboard uses Excalidraw for an infinite, freehand canvas. Draw shapes, arrows, add text, upload images, create sticky notes, use color pickers, generate AI diagrams, and export as high-quality PNG." },
    { q: "How does the AI Template Builder work?", a: "Describe a tool in plain language — like 'habit tracker with weekly streaks' — and AI generates a fully interactive single-page mini-app with stats cards, checklists, tables, progress bars, and form inputs. Apps are saved to your sidebar." },
    { q: "Is my data private and secure?", a: "Yes. All data is encrypted at rest and in transit. We are SOC2 compliant, and you can export all workspace data as a JSON backup from Settings. We never use your data to train AI models." },
    { q: "Can I use the AI voice assistant?", a: "Yes! The AI Assistant supports voice input via AssemblyAI's real-time streaming API. Click the microphone button, speak your request, and it's transcribed and sent to AI instantly." },
    { q: "What happens to my data if I cancel?", a: "You can export all data before cancelling. We provide a 30-day data retention period after cancellation, and your data is never deleted without explicit confirmation." },
  ];

  return (
    <section id="faq" className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-[#7F56D9]/10 border-[#7F56D9]/20 text-[#7F56D9]">
            <MessageSquare className="w-3.5 h-3.5" /> FAQ
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Common <GradientText>questions</GradientText>
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden bg-white hover:border-[#7F56D9]/30 transition-colors">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left gap-4 cursor-pointer">
                <span className="text-sm font-bold text-gray-900">{faq.q}</span>
                <ChevronDown className={cn("w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200", open === i && "rotate-180 text-[#7F56D9]")} />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTASection() {
  return (
    <section className="py-24 px-6 bg-[#0D0B14] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-[#7F56D9]/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#C084FC]/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#7F56D9_0.8px,transparent_0.8px)] [background-size:28px_28px] opacity-[0.04]" />
      </div>
      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7F56D9]/20 border border-[#7F56D9]/30 text-[#C084FC] text-xs font-extrabold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5" /> Start Building Today — Free Forever
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight">
          Build your entire productivity<br />system in <GradientText>one AI workspace</GradientText>
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Join thousands of founders, students, and teams who've replaced 5+ tools with Nook &amp; Canvas. Set up in under 5 minutes. No credit card required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/sign-up" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#7F56D9] to-[#9B72EF] text-white font-extrabold text-base hover:opacity-90 transition-all shadow-2xl shadow-[#7F56D9]/40 group">
            Start for Free <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link href="/sign-in" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/20 text-white font-bold text-base hover:bg-white/8 transition-all">
            Sign In to Workspace
          </Link>
        </div>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500 flex-wrap">
          {["✓ Free plan forever","✓ No credit card needed","✓ Cancel anytime","✓ SOC2 Compliant"].map((t) => (
            <span key={t} className="font-semibold">{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { title: "Product", links: [
      { label: "Dashboard", href: "/" }, { label: "Kanban Boards", href: "/tasks" },
      { label: "Notes Editor", href: "/notes" }, { label: "Whiteboard", href: "/whiteboard" },
      { label: "Calendar", href: "/calendar" }, { label: "AI Assistant", href: "/ai" },
      { label: "Template Builder", href: "/template-builder" }, { label: "Pages & Spaces", href: "/spaces" },
    ]},
    { title: "Resources", links: [
      { label: "Documentation", href: "#" }, { label: "API Reference", href: "#" },
      { label: "Changelog", href: "#" }, { label: "Roadmap", href: "#" },
      { label: "Status Page", href: "#" }, { label: "Blog", href: "#" },
    ]},
    { title: "Company", links: [
      { label: "About Us", href: "#" }, { label: "Careers", href: "#" },
      { label: "Contact", href: "#" }, { label: "Press Kit", href: "#" },
    ]},
    { title: "Legal", links: [
      { label: "Privacy Policy", href: "#" }, { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" }, { label: "GDPR", href: "#" },
    ]},
  ];

  return (
    <footer className="bg-[#0A0812] text-gray-400 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7F56D9] to-[#C084FC] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-extrabold text-white">Nook &amp; Canvas</span>
            </div>
            <p className="text-sm leading-relaxed">The AI-powered productivity workspace for modern teams and individuals.</p>
            <div className="flex items-center gap-3">
              {[<Twitter className="w-4 h-4" />, <Github className="w-4 h-4" />, <Linkedin className="w-4 h-4" />].map((icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/8 hover:bg-[#7F56D9]/30 hover:text-[#C084FC] flex items-center justify-center transition-all">{icon}</a>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-300 mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm hover:text-[#C084FC] transition-colors font-medium">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <span>© 2026 Nook &amp; Canvas. All rights reserved. Made with ☕ and ✨</span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page Export ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans bg-white antialiased">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ProductShowcaseSection />
      <AIFeaturesSection />
      <CollaborationSection />
      <UseCasesSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
