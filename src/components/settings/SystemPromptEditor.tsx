"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface SystemPromptEditorProps {
  onClose: () => void;
}

const DEFAULT_SYSTEM_PROMPT = `You are an intelligent AI assistant with access to calendar and time tracking capabilities. 

Your key responsibilities:
- Help users manage their schedule and appointments
- Assist with time tracking and productivity
- Provide insights on calendar data and time usage
- Answer questions and complete tasks efficiently
- Maintain a helpful, professional, and concise communication style

When users ask about calendar or time tracking:
- Use the available API integrations to provide real-time data
- Suggest optimizations for scheduling and time management
- Help resolve scheduling conflicts
- Provide productivity insights

Always be helpful, accurate, and respect user privacy.`;

export function SystemPromptEditor({ onClose }: SystemPromptEditorProps) {
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved system prompt from localStorage
    const savedPrompt = localStorage.getItem('ai-assistant-system-prompt');
    if (savedPrompt) {
      setSystemPrompt(savedPrompt);
    }
  }, []);

  const savePrompt = () => {
    localStorage.setItem('ai-assistant-system-prompt', systemPrompt);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const resetToDefault = () => {
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
    setSaved(false);
  };

  return (
    <Card className="m-4 bg-gray-900 border-gray-700">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">System Prompt Configuration</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">
              Customize how the AI assistant behaves and responds. This prompt defines the AI's personality, capabilities, and response style.
            </p>
          </div>

          <Textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Enter your system prompt..."
            className="min-h-[200px] bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500"
          />

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                onClick={savePrompt}
                disabled={saved}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saved ? "✓ Saved" : "Save Changes"}
              </Button>
              <Button
                onClick={resetToDefault}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Reset to Default
              </Button>
            </div>

            <div className="text-xs text-gray-500">
              {systemPrompt.length} characters
            </div>
          </div>

          <div className="bg-gray-800 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-white mb-2">Tips for effective system prompts:</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Be specific about the AI's role and capabilities</li>
              <li>• Include examples of desired behavior</li>
              <li>• Specify the tone and communication style</li>
              <li>• Mention any constraints or limitations</li>
              <li>• Keep it concise but comprehensive</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}