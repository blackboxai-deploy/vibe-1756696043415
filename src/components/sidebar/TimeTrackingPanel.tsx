"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface TimeEntry {
  id: string;
  description: string;
  project: string;
  duration: number;
  isRunning: boolean;
  startTime?: string;
}

export function TimeTrackingPanel() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Check if Clockify is connected and fetch recent entries
    fetchRecentEntries();
  }, []);

  const fetchRecentEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/clockify/entries');
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
        setActiveEntry(data.activeEntry || null);
        setConnected(true);
      }
    } catch (error) {
      console.error('Failed to fetch time entries:', error);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const connectClockify = () => {
    // For Clockify, we'll need API key setup
    // This would open a settings modal or redirect to setup
    window.alert('Clockify setup will be implemented in settings');
  };

  const startTimer = async (description: string, project: string = "General") => {
    try {
      const response = await fetch('/api/clockify/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, project })
      });
      
      if (response.ok) {
        const data = await response.json();
        setActiveEntry(data.entry);
        fetchRecentEntries();
      }
    } catch (error) {
      console.error('Failed to start timer:', error);
    }
  };

  const stopTimer = async () => {
    if (!activeEntry) return;
    
    try {
      const response = await fetch('/api/clockify/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId: activeEntry.id })
      });
      
      if (response.ok) {
        setActiveEntry(null);
        fetchRecentEntries();
      }
    } catch (error) {
      console.error('Failed to stop timer:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  if (!connected) {
    return (
      <div className="p-4 space-y-4">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <span className="text-4xl">⏰</span>
            <p className="mt-2 text-sm">Connect Clockify for time tracking</p>
          </div>
          <Button
            onClick={connectClockify}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Setup Clockify
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Active Timer */}
      {activeEntry && (
        <div className="p-4 border-b border-gray-800 bg-gray-900">
          <div className="text-center">
            <Badge variant="secondary" className="bg-green-600 text-white mb-2">
              Recording
            </Badge>
            <h4 className="font-medium text-sm mb-1">{activeEntry.description}</h4>
            <p className="text-xs text-gray-400 mb-3">{activeEntry.project}</p>
            <div className="text-lg font-mono text-green-400 mb-3">
              {formatDuration(activeEntry.duration)}
            </div>
            <Button
              onClick={stopTimer}
              size="sm"
              variant="destructive"
              className="w-full"
            >
              Stop Timer
            </Button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Time Tracking</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchRecentEntries}
            disabled={loading}
            className="text-gray-400 hover:text-white"
          >
            {loading ? "⟳" : "↻"}
          </Button>
        </div>
      </div>

      {/* Quick Start */}
      {!activeEntry && (
        <div className="p-4 border-b border-gray-800">
          <Button
            onClick={() => startTimer("New task")}
            className="w-full bg-green-600 hover:bg-green-700"
            size="sm"
          >
            ▶ Start Timer
          </Button>
        </div>
      )}

      {/* Recent Entries */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Recent Entries</h4>
          {entries.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">No recent entries</p>
            </div>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} className="p-3 bg-gray-900 border-gray-700 hover:bg-gray-800 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-white mb-1 truncate">
                      {entry.description}
                    </h4>
                    <p className="text-xs text-gray-400 mb-1">{entry.project}</p>
                    <p className="text-xs text-gray-500">
                      {formatDuration(entry.duration)}
                    </p>
                  </div>
                  {entry.isRunning && (
                    <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                      Live
                    </Badge>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-white"
          onClick={() => window.open('https://clockify.me', '_blank')}
        >
          Open Clockify
        </Button>
      </div>
    </div>
  );
}