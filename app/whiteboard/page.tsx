"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  Sparkles,
  Download,
  MoreHorizontal,
  RefreshCw,
  FolderOpen,
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  FileCheck
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface WhiteboardFile {
  id: string;
  name: string;
  updatedAt: string;
  color: "sage" | "coral" | "lavender" | "honey" | "blue";
  elements: any[];
}

const boardColors: Record<
  "sage" | "coral" | "lavender" | "honey" | "blue",
  { bg: string; text: string; dot: string; hoverBg: string; border: string }
> = {
  sage: { bg: "bg-[#E2ECE9] dark:bg-[#1D322B]", text: "text-[#2D5A4E] dark:text-[#91C8BA]", dot: "bg-[#4A7C70]", hoverBg: "hover:bg-[#D2DDD9] dark:hover:bg-[#253D35]", border: "border-[#B2D1C8] dark:border-[#2C4D43]" },
  coral: { bg: "bg-[#FCECE7] dark:bg-[#341F1A]", text: "text-[#B34B2E] dark:text-[#F19F88]", dot: "bg-[#E07A5F]", hoverBg: "hover:bg-[#F7DBD0] dark:hover:bg-[#432922]", border: "border-[#F5C7BA] dark:border-[#52312A]" },
  lavender: { bg: "bg-[#F0EBF8] dark:bg-[#251D33]", text: "text-[#62479B] dark:text-[#BFABEC]", dot: "bg-[#8E75C4]", hoverBg: "hover:bg-[#E3DAF2] dark:hover:bg-[#322744]", border: "border-[#DCD0F0] dark:border-[#42345C]" },
  honey: { bg: "bg-[#FBF3DB] dark:bg-[#332814]", text: "text-[#8E640B] dark:text-[#E9C37A]", dot: "bg-[#D8A035]", hoverBg: "hover:bg-[#F3E3B9] dark:hover:bg-[#40331D]", border: "border-[#F2DEB1] dark:border-[#544329]" },
  blue: { bg: "bg-[#E8F0FE] dark:bg-[#17243B]", text: "text-[#1C54B2] dark:text-[#92B8F8]", dot: "bg-[#4285F4]", hoverBg: "hover:bg-[#D5E4FC] dark:hover:bg-[#202E4C]", border: "border-[#B7D2FC] dark:border-[#293E62]" }
};

const defaultBoards: WhiteboardFile[] = [
  {
    id: "wb1",
    name: "🎨 Brainstorming Nook Canvas",
    updatedAt: "11:30 AM",
    color: "sage",
    elements: []
  },
  {
    id: "wb2",
    name: "📐 Hybrid Architecture Mapping",
    updatedAt: "Yesterday",
    color: "blue",
    elements: []
  }
];

export default function WhiteboardWorkspace() {
  const [ExcalidrawComp, setExcalidrawComp] = useState<any>(null);

  useEffect(() => {
    // Dynamically load Excalidraw only on client side to prevent SSR issues
    import("@excalidraw/excalidraw").then((mod) => {
      setExcalidrawComp(() => mod.Excalidraw);
    });
  }, []);

  const [boards, setBoards] = useState<WhiteboardFile[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nook-whiteboards");
      if (saved) return JSON.parse(saved);
    }
    return defaultBoards;
  });

  // Sync whiteboard boards to localStorage (without elements to avoid size bloat)
  useEffect(() => {
    const boardsMeta = boards.map((b) => ({ ...b, elements: [] }));
    localStorage.setItem("nook-whiteboards", JSON.stringify(boardsMeta));
  }, [boards]);

  const [activeBoardId, setActiveBoardId] = useState("wb1");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Excalidraw Reference API
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

  // Keep track of elements version sum to prevent rendering infinite loops
  const lastVersionSumRef = useRef<number>(0);

  // Active Board helper
  const activeBoard = useMemo(() => {
    return boards.find((b) => b.id === activeBoardId) || boards[0];
  }, [boards, activeBoardId]);

  // Sync version ref on active board switch
  useEffect(() => {
    if (activeBoard) {
      const activeElements = activeBoard.elements.filter((el: any) => !el.isDeleted);
      lastVersionSumRef.current = activeElements.reduce((acc: number, el: any) => acc + el.version + el.x + el.y, 0);
    }
  }, [activeBoardId, activeBoard]);

  // AI Diagram Modal States
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [diagramType, setDiagramType] = useState<"flowchart" | "mindmap" | "architecture">("flowchart");
  const [isGenerating, setIsGenerating] = useState(false);

  // Load scene elements when active board changes
  useEffect(() => {
    if (excalidrawAPI && activeBoard) {
      excalidrawAPI.updateScene({
        elements: activeBoard.elements,
        appState: {
          viewBackgroundColor: "#FAF8F5", // Cozy warm cream canvas background
          zenModeEnabled: false,
          gridModeEnabled: true
        }
      });
    }
  }, [activeBoardId, excalidrawAPI]);

  // Save current elements back to state on changes
  const handleCanvasChange = (elements: readonly any[]) => {
    if (!activeBoard) return;

    // Filter out deleted elements and compute version sum
    const activeElements = elements.filter((el) => !el.isDeleted);
    const currentVersionSum = activeElements.reduce((acc, el) => acc + el.version + el.x + el.y, 0);

    // If the drawing nodes have not changed version, do not set state to avoid loops
    if (currentVersionSum === lastVersionSumRef.current) {
      return;
    }

    lastVersionSumRef.current = currentVersionSum;

    setIsSaving(true);
    setBoards((prevBoards) =>
      prevBoards.map((b) =>
        b.id === activeBoardId
          ? {
              ...b,
              elements: [...elements],
              updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : b
      )
    );

    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };

  // Switch boards safely
  const handleSelectBoard = (boardId: string) => {
    setActiveBoardId(boardId);
  };

  // Create Whiteboard
  const handleCreateBoard = () => {
    const newBoard: WhiteboardFile = {
      id: Date.now().toString(),
      name: "New Canvas Spec",
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      color: "sage",
      elements: []
    };

    setBoards([newBoard, ...boards]);
    setActiveBoardId(newBoard.id);
  };

  // Rename Whiteboard
  const handleRenameBoard = (boardId: string, newName: string) => {
    if (!newName.trim()) return;
    setBoards((prevBoards) =>
      prevBoards.map((b) =>
        b.id === boardId
          ? { ...b, name: newName, updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          : b
      )
    );
  };

  // Delete Whiteboard
  const handleDeleteBoard = (boardId: string) => {
    if (boards.length <= 1) {
      alert("You must keep at least one canvas in your workspace!");
      return;
    }
    if (!confirm("Are you sure you want to delete this whiteboard?")) return;
    
    const remaining = boards.filter((b) => b.id !== boardId);
    setBoards(remaining);
    setActiveBoardId(remaining[0].id);
  };

  // Change Board Color Tag
  const handleChangeColor = (boardId: string, col: "sage" | "coral" | "lavender" | "honey" | "blue") => {
    setBoards((prevBoards) =>
      prevBoards.map((b) => (b.id === boardId ? { ...b, color: col } : b))
    );
  };

  // Excalidraw PNG exporter using dynamic import of exportToBlob helper
  const handleExportPng = async () => {
    if (!excalidrawAPI) return;
    const elements = excalidrawAPI.getSceneElements();
    const appState = excalidrawAPI.getAppState();
    const files = excalidrawAPI.getFiles();

    const nonDeletedElements = elements.filter((el: any) => !el.isDeleted);
    if (nonDeletedElements.length === 0) {
      alert("The canvas is empty! Add shapes or generate an AI diagram first.");
      return;
    }

    try {
      const { exportToBlob } = await import("@excalidraw/excalidraw");
      
      const blob = await exportToBlob({
        elements: nonDeletedElements,
        appState: {
          ...appState,
          exportBackground: true,
          viewBackgroundColor: "#FAF8F5"
        },
        files,
        mimeType: "image/png"
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${activeBoard.name}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export to PNG failed:", err);
      alert("Failed to render and export whiteboard image.");
    }
  };

  // Helper: Create Excalidraw Node structure with required fields
  const makeNode = (type: string, props: any) => {
    const id = `${type}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      id,
      type,
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      strokeColor: "#2D5A4E",
      backgroundColor: "transparent",
      fillStyle: "hachure",
      strokeWidth: 1,
      strokeStyle: "solid",
      roughness: 1,
      opacity: 100,
      isDeleted: false,
      seed: Math.floor(Math.random() * 100000),
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      updated: Date.now(),
      ...props
    };
  };

  // Simulated AI diagram elements generator
  const handleGenerateAiDiagram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const newElements: any[] = [];
      const boardWidth = window.innerWidth;
      const boardHeight = window.innerHeight;
      const centerX = Math.max(300, boardWidth / 2 - 200);
      const centerY = Math.max(200, boardHeight / 2 - 150);

      const titleNode = makeNode("text", {
        x: centerX + 50,
        y: centerY - 100,
        width: 300,
        height: 30,
        text: `✨ AI: ${aiPrompt.substring(0, 30)}...`,
        fontSize: 18,
        strokeColor: "#B34B2E",
        fontFamily: 1,
        textAlign: "center"
      });
      newElements.push(titleNode);

      if (diagramType === "flowchart") {
        // Flowchart: Start (Ellipse) -> Process (Rect) -> Decision (Diamond) -> End (Ellipse)
        const startNode = makeNode("ellipse", { x: centerX + 120, y: centerY, width: 140, height: 60, strokeColor: "#4A7C70" });
        const startText = makeNode("text", { x: centerX + 140, y: centerY + 20, width: 100, height: 20, text: "Start Operation", fontSize: 13, textAlign: "center" });

        const arrow1 = makeNode("arrow", { x: centerX + 190, y: centerY + 60, width: 10, height: 50, points: [[0, 0], [0, 50]] });

        const processNode = makeNode("rectangle", { x: centerX + 90, y: centerY + 110, width: 200, height: 70, strokeColor: "#4285F4" });
        const processText = makeNode("text", { x: centerX + 110, y: centerY + 135, width: 160, height: 20, text: "Fetch Drizzle SQL rows", fontSize: 13, textAlign: "center" });

        const arrow2 = makeNode("arrow", { x: centerX + 190, y: centerY + 180, width: 10, height: 50, points: [[0, 0], [0, 50]] });

        const decisionNode = makeNode("diamond", { x: centerX + 110, y: centerY + 230, width: 160, height: 100, strokeColor: "#D8A035" });
        const decisionText = makeNode("text", { x: centerX + 130, y: centerY + 270, width: 120, height: 20, text: "Are results empty?", fontSize: 11, textAlign: "center" });

        newElements.push(startNode, startText, arrow1, processNode, processText, arrow2, decisionNode, decisionText);

      } else if (diagramType === "mindmap") {
        // Mindmap: Center Node -> 3 Branches extending
        const centerNode = makeNode("rectangle", { x: centerX + 110, y: centerY + 80, width: 180, height: 70, strokeColor: "#E07A5F" });
        const centerText = makeNode("text", { x: centerX + 120, y: centerY + 105, width: 160, height: 20, text: "Market Strategy Spec", fontSize: 14, textAlign: "center" });

        // Branch 1 (East)
        const node1 = makeNode("ellipse", { x: centerX + 340, y: centerY + 20, width: 120, height: 50, strokeColor: "#4A7C70" });
        const text1 = makeNode("text", { x: centerX + 350, y: centerY + 35, width: 100, height: 20, text: "Google SEO", fontSize: 12, textAlign: "center" });
        const arrow1 = makeNode("arrow", { x: centerX + 290, y: centerY + 100, width: 60, height: -50, points: [[0, 0], [60, -50]] });

        // Branch 2 (South)
        const node2 = makeNode("ellipse", { x: centerX + 140, y: centerY + 220, width: 120, height: 50, strokeColor: "#8E75C4" });
        const text2 = makeNode("text", { x: centerX + 150, y: centerY + 235, width: 100, height: 20, text: "Social Campaigns", fontSize: 12, textAlign: "center" });
        const arrow2 = makeNode("arrow", { x: centerX + 200, y: centerY + 150, width: 10, height: 70, points: [[0, 0], [0, 70]] });

        // Branch 3 (West)
        const node3 = makeNode("ellipse", { x: centerX - 100, y: centerY + 80, width: 120, height: 50, strokeColor: "#4285F4" });
        const text3 = makeNode("text", { x: centerX - 90, y: centerY + 95, width: 100, height: 20, text: "Newsletter Outlines", fontSize: 12, textAlign: "center" });
        const arrow3 = makeNode("arrow", { x: centerX + 110, y: centerY + 115, width: -110, height: 0, points: [[0, 0], [-110, 0]] });

        newElements.push(centerNode, centerText, node1, text1, arrow1, node2, text2, arrow2, node3, text3, arrow3);

      } else if (diagramType === "architecture") {
        // Architecture: Client -> Proxy (Gateway) -> Service 1 & Service 2
        const clientNode = makeNode("rectangle", { x: centerX + 130, y: centerY - 20, width: 140, height: 60, strokeColor: "#4285F4" });
        const clientText = makeNode("text", { x: centerX + 140, y: centerY, width: 120, height: 20, text: "Browser Client", fontSize: 13, textAlign: "center" });

        const arrow1 = makeNode("arrow", { x: centerX + 200, y: centerY + 40, width: 10, height: 50, points: [[0, 0], [0, 50]] });

        const gatewayNode = makeNode("rectangle", { x: centerX + 100, y: centerY + 90, width: 200, height: 60, strokeColor: "#E07A5F" });
        const gatewayText = makeNode("text", { x: centerX + 110, y: centerY + 110, width: 180, height: 20, text: "Next.js API Router", fontSize: 13, textAlign: "center" });

        const arrow2 = makeNode("arrow", { x: centerX + 150, y: centerY + 150, width: -50, height: 60, points: [[0, 0], [-50, 60]] });
        const arrow3 = makeNode("arrow", { x: centerX + 250, y: centerY + 150, width: 50, height: 60, points: [[0, 0], [50, 60]] });

        const dbNode = makeNode("diamond", { x: centerX + 30, y: centerY + 210, width: 120, height: 70, strokeColor: "#4A7C70" });
        const dbText = makeNode("text", { x: centerX + 40, y: centerY + 235, width: 100, height: 20, text: "Neon Postgres", fontSize: 11, textAlign: "center" });

        const authNode = makeNode("diamond", { x: centerX + 250, y: centerY + 210, width: 120, height: 70, strokeColor: "#8E75C4" });
        const authText = makeNode("text", { x: centerX + 260, y: centerY + 235, width: 100, height: 20, text: "Clerk Auth Service", fontSize: 11, textAlign: "center" });

        newElements.push(clientNode, clientText, arrow1, gatewayNode, gatewayText, arrow2, arrow3, dbNode, dbText, authNode, authText);
      }

      // Add to scene elements
      if (excalidrawAPI) {
        const currentElements = excalidrawAPI.getSceneElements();
        excalidrawAPI.updateScene({
          elements: [...currentElements, ...newElements]
        });
      }

      setIsGenerating(false);
      setIsAiModalOpen(false);
      setAiPrompt("");
    }, 2000);
  };

  const filteredBoards = useMemo(() => {
    return boards.filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [boards, searchQuery]);

  const activeColor = boardColors[activeBoard.color] || boardColors.sage;

  return (
    <div className="flex h-screen overflow-hidden font-sans text-[var(--foreground)] bg-[var(--background)] select-none">
      
      {/* Left directory panel */}
      <aside className="w-64 bg-[var(--card)] flex flex-col justify-between hidden sm:flex shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.015)]">
        <div className="flex-1 flex flex-col min-h-0">
          
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-4 shrink-0">
            <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase">Whiteboard Index</span>
            <button
              onClick={handleCreateBoard}
              className="p-1 rounded-md border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
              title="New Board"
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
                placeholder="Search boards..."
                className="bg-transparent text-xs w-full focus:outline-none placeholder-[var(--muted-foreground)] text-[var(--foreground)] font-semibold"
              />
            </div>
          </div>

          {/* Boards List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
            {filteredBoards.map((b) => {
              const isSelected = b.id === activeBoardId;
              const style = boardColors[b.color] || boardColors.sage;
              return (
                <div
                  key={b.id}
                  onClick={() => handleSelectBoard(b.id)}
                  className={cn(
                    "w-full flex items-center justify-between gap-1.5 px-3 py-2.5 rounded-2xl cursor-pointer transition-all group relative",
                    isSelected
                      ? cn(style.bg, style.text, "shadow-xs")
                      : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/40 hover:text-[var(--foreground)]"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-xs shrink-0 select-none">🎨</span>
                    <div className="min-w-0 flex-1 leading-normal">
                      <div className="text-xs font-bold truncate pr-1">{b.name}</div>
                      <div className="text-[9px] text-[var(--muted-foreground)] font-semibold mt-0.5">{b.updatedAt}</div>
                    </div>
                  </div>

                  {/* Actions list */}
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    
                    {/* Rename trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newName = prompt("Rename whiteboard:", b.name);
                        if (newName) handleRenameBoard(b.id, newName);
                      }}
                      className="p-1 rounded hover:bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>

                    {/* Color picker */}
                    <div className="relative group/color inline-block">
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded hover:bg-[var(--background)] text-[var(--muted-foreground)] cursor-pointer"
                      >
                        <span className={cn("w-2 h-2 rounded-full block border border-black/10", style.dot)} />
                      </button>
                      <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover/color:flex gap-1 bg-[var(--card)] border border-[var(--border)] p-1 rounded-lg shadow-lg z-50">
                        {(["sage", "coral", "lavender", "honey", "blue"] as const).map((c) => (
                          <button
                            key={c}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChangeColor(b.id, c);
                            }}
                            className={cn("w-3 h-3 rounded-full border border-black/10 cursor-pointer block hover:scale-110", boardColors[c].dot)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Delete trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBoard(b.id);
                      }}
                      className="p-1 rounded hover:bg-[#F9EAEB] text-[var(--muted-foreground)] hover:text-[#D36A73] cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredBoards.length === 0 && (
              <div className="text-center py-8 opacity-45">
                <p className="text-[10px] font-bold">No whiteboards found</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-3 text-[9px] text-[var(--muted-foreground)] leading-normal flex items-start gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
          <span>Select any board. Draw vector arrows, rectangles, and map designs cleanly.</span>
        </div>
      </aside>

      {/* Right Canvas viewport */}
      <div className="flex-1 flex flex-col min-w-0 bg-[var(--background)] overflow-hidden">
        
        {/* Topbar header */}
        <header className="h-14 bg-transparent px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 rounded-xl hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer sm:hidden">
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full", activeColor.dot)} />
              <h1 className="text-sm font-extrabold tracking-tight text-[var(--foreground)] truncate max-w-[180px] sm:max-w-xs">
                {activeBoard.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* AI diagram generator button */}
            <button
              onClick={() => {
                setAiPrompt("");
                setIsAiModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Generate diagram with AI"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Diagram</span>
            </button>

            {/* Export PNG */}
            <button
              onClick={handleExportPng}
              className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:opacity-90 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Download canvas as PNG image"
            >
              <Download className="w-3.5 h-3.5 text-amber-200" />
              <span>Export PNG</span>
            </button>

            <div className="h-6 w-px bg-[var(--border)]" />

            {/* Save indicator */}
            <div className="text-[10px] font-extrabold text-[var(--muted-foreground)] bg-[var(--secondary)] border border-[var(--border)] px-2 py-1.5 rounded-lg flex items-center gap-1 select-none">
              {isSaving ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-[var(--primary)]" />
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-3.5 h-3.5 text-[#5F9E77]" />
                  <span className="hidden sm:inline">Synced</span>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Excalidraw Component Container */}
        <div className="flex-1 relative overflow-hidden bg-[#FAF8F5]">
          {ExcalidrawComp ? (
            <ExcalidrawComp
              ref={(api: any) => setExcalidrawAPI(api)}
              onChange={handleCanvasChange}
            />
          ) : (
            <div className="flex-1 h-full flex items-center justify-center bg-[var(--background)]">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-[var(--primary)]" />
                <span className="text-xs font-bold text-[var(--muted-foreground)]">Loading Cozy Canvas...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Diagram Generator Dialog Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-amber-500" />
                <h2 className="text-sm font-extrabold text-[var(--foreground)] tracking-tight">AI Diagram Generator</h2>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-1 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] text-[var(--muted-foreground)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateAiDiagram} className="space-y-4">
              
              {/* Prompt Textarea */}
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                  Diagram Description Prompt
                </label>
                <textarea
                  required
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Draw a flowchart for user registration and database insert validation..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all font-semibold resize-none h-20"
                />
              </div>

              {/* Diagram type select */}
              <div>
                <label className="block text-[10px] font-extrabold text-[var(--muted-foreground)] uppercase mb-1.5">
                  Diagram Visual Structure
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["flowchart", "mindmap", "architecture"] as const).map((type) => {
                    const label = type === "flowchart" ? "Flowchart" : type === "mindmap" ? "Mind Map" : "Architecture";
                    const isSelected = diagramType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setDiagramType(type)}
                        className={cn(
                          "px-3 py-2 border rounded-xl text-[10px] font-extrabold cursor-pointer transition-all text-center",
                          isSelected
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-transparent"
                            : "border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]"
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--muted-foreground)] hover:bg-[var(--secondary)] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:opacity-90 transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      <span>Generate Diagram</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
