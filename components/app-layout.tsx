"use client";

import React from "react";
import { Sidebar } from "@/components/sidebar";
import { usePathname } from "next/navigation";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Exclude auth routes and landing page from receiving the sidebar layout frame
  const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up") || pathname.startsWith("/landing");


  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-[var(--background)]">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)] font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />
      
      {/* Scrollable Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative bg-[var(--background)]">
        {children}
      </main>
    </div>
  );
}
