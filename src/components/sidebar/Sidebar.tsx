"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CalendarPanel } from "./CalendarPanel";
import { TimeTrackingPanel } from "./TimeTrackingPanel";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeView: "chat" | "dashboard";
  onViewChange: (view: "chat" | "dashboard") => void;
}

export function Sidebar({ collapsed, onToggle, activeView, onViewChange }: SidebarProps) {
  const [activePanel, setActivePanel] = useState<"calendar" | "time" | null>("calendar");

  return (
    <div className={cn(
      "bg-gray-950 border-r border-gray-800 flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-80"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Assistant
            </h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            {collapsed ? "→" : "←"}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        <Button
          variant={activeView === "chat" ? "default" : "ghost"}
          className={cn(
            "w-full justify-start",
            collapsed && "justify-center px-2",
            activeView === "chat" 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          )}
          onClick={() => onViewChange("chat")}
        >
          <span className="text-lg mr-2">💬</span>
          {!collapsed && "Chat"}
        </Button>
        
        <Button
          variant={activeView === "dashboard" ? "default" : "ghost"}
          className={cn(
            "w-full justify-start",
            collapsed && "justify-center px-2",
            activeView === "dashboard" 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "text-gray-400 hover:text-white hover:bg-gray-800"
          )}
          onClick={() => onViewChange("dashboard")}
        >
          <span className="text-lg mr-2">📊</span>
          {!collapsed && "Dashboard"}
        </Button>
      </div>

      {/* Panels */}
      {!collapsed && (
        <div className="flex-1 flex flex-col">
          {/* Panel Tabs */}
          <div className="border-b border-gray-800">
            <div className="flex">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex-1 rounded-none border-b-2 border-transparent",
                  activePanel === "calendar" && "border-blue-500 text-blue-400"
                )}
                onClick={() => setActivePanel(activePanel === "calendar" ? null : "calendar")}
              >
                📅 Calendar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex-1 rounded-none border-b-2 border-transparent",
                  activePanel === "time" && "border-blue-500 text-blue-400"
                )}
                onClick={() => setActivePanel(activePanel === "time" ? null : "time")}
              >
                ⏰ Time
              </Button>
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            {activePanel === "calendar" && <CalendarPanel />}
            {activePanel === "time" && <TimeTrackingPanel />}
          </div>
        </div>
      )}
    </div>
  );
}