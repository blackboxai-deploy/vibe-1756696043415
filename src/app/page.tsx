"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Dashboard } from "@/components/dashboard/Dashboard";

export default function Home() {
  const [activeView, setActiveView] = useState<"chat" | "dashboard">("chat");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeView === "chat" ? (
          <ChatInterface />
        ) : (
          <Dashboard />
        )}
      </div>
    </div>
  );
}