"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  todayEvents: number;
  activeTimers: number;
  weekHours: number;
  upcomingMeetings: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    todayEvents: 0,
    activeTimers: 0,
    weekHours: 0,
    upcomingMeetings: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch dashboard statistics
      const [calendarRes, clockifyRes] = await Promise.all([
        fetch('/api/calendar/stats').catch(() => ({ ok: false })),
        fetch('/api/clockify/stats').catch(() => ({ ok: false }))
      ]);

      const calendarData = calendarRes.ok && 'json' in calendarRes ? await calendarRes.json() : {};
      const clockifyData = clockifyRes.ok && 'json' in clockifyRes ? await clockifyRes.json() : {};

      setStats({
        todayEvents: calendarData.todayEvents || 0,
        activeTimers: clockifyData.activeTimers || 0,
        weekHours: clockifyData.weekHours || 0,
        upcomingMeetings: calendarData.upcomingMeetings || 0,
      });

      // Combine recent activity from both services
      const activity = [
        ...(calendarData.recentEvents || []),
        ...(clockifyData.recentEntries || [])
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setRecentActivity(activity.slice(0, 10));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "New Calendar Event",
      description: "Schedule a meeting or appointment",
      action: () => console.log("Create calendar event"),
      icon: "📅",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Start Time Tracking",
      description: "Begin tracking time for a project",
      action: () => console.log("Start time tracking"),
      icon: "⏰",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "View Analytics",
      description: "See productivity insights",
      action: () => console.log("View analytics"),
      icon: "📊",
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "AI Chat",
      description: "Ask your assistant anything",
      action: () => console.log("Open chat"),
      icon: "💬",
      color: "bg-orange-600 hover:bg-orange-700"
    }
  ];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-black">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Your productivity overview and quick actions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gray-900 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Today's Events</p>
                <p className="text-2xl font-bold text-white">{stats.todayEvents}</p>
              </div>
              <div className="text-2xl">📅</div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Timers</p>
                <p className="text-2xl font-bold text-white">{stats.activeTimers}</p>
              </div>
              <div className="text-2xl">⏰</div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">This Week</p>
                <p className="text-2xl font-bold text-white">{stats.weekHours}h</p>
              </div>
              <div className="text-2xl">📊</div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Upcoming</p>
                <p className="text-2xl font-bold text-white">{stats.upcomingMeetings}</p>
              </div>
              <div className="text-2xl">🔜</div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="p-4 bg-gray-900 border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={action.action}
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">{action.icon}</div>
                  <h3 className="font-medium text-white mb-1">{action.title}</h3>
                  <p className="text-xs text-gray-400">{action.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchDashboardData}
              className="text-gray-400 hover:text-white"
            >
              ↻ Refresh
            </Button>
          </div>
          
          <Card className="bg-gray-900 border-gray-700">
            <div className="p-4">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activity</p>
                  <p className="text-sm mt-1">Connect your calendar and time tracking to see activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg">
                          {item.type === 'calendar' ? '📅' : '⏰'}
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{item.title}</p>
                          <p className="text-xs text-gray-400">{item.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="text-xs">
                          {item.source}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}