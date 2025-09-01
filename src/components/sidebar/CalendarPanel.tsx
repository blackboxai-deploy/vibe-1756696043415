"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  location?: string;
}

export function CalendarPanel() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Check if calendar is connected and fetch events
    fetchTodayEvents();
  }, []);

  const fetchTodayEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/calendar/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
        setConnected(true);
      }
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const connectCalendar = async () => {
    try {
      const response = await fetch('/api/calendar/auth');
      const data = await response.json();
      if (data.authUrl) {
        window.open(data.authUrl, '_blank');
      }
    } catch (error) {
      console.error('Failed to initiate calendar connection:', error);
    }
  };

  if (!connected) {
    return (
      <div className="p-4 space-y-4">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <span className="text-4xl">📅</span>
            <p className="mt-2 text-sm">Connect your Google Calendar</p>
          </div>
          <Button
            onClick={connectCalendar}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Connect Calendar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Today's Events</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchTodayEvents}
            disabled={loading}
            className="text-gray-400 hover:text-white"
          >
            {loading ? "⟳" : "↻"}
          </Button>
        </div>
      </div>

      {/* Events List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {events.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="text-sm">No events today</p>
            </div>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="p-3 bg-gray-900 border-gray-700 hover:bg-gray-800 transition-colors">
                <h4 className="font-medium text-sm text-white mb-1">{event.title}</h4>
                <p className="text-xs text-gray-400">
                  {new Date(event.start).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                  {event.end && (
                    <>
                      {" - "}
                      {new Date(event.end).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </>
                  )}
                </p>
                {event.location && (
                  <p className="text-xs text-gray-500 mt-1">📍 {event.location}</p>
                )}
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-800">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-white"
          onClick={() => window.open('https://calendar.google.com', '_blank')}
        >
          Open Google Calendar
        </Button>
      </div>
    </div>
  );
}