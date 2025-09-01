"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface InputAreaProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function InputArea({ onSendMessage, disabled, placeholder }: InputAreaProps) {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || disabled || isComposing) return;
    
    onSendMessage(input.trim());
    setInput("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const quickActions = [
    { label: "📅 Check calendar", text: "What's on my calendar today?" },
    { label: "⏰ Start timer", text: "Start a timer for current task" },
    { label: "📝 Schedule meeting", text: "Schedule a meeting for next week" },
    { label: "📊 Time report", text: "Show me my time tracking summary" },
  ];

  return (
    <div className="p-4 bg-gray-950">
      {/* Quick Actions */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setInput(action.text)}
              disabled={disabled}
              className="text-xs text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-white"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="flex items-end space-x-3">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder={placeholder || "Type your message..."}
            disabled={disabled}
            className={cn(
              "min-h-[50px] max-h-[200px] resize-none",
              "bg-gray-900 border-gray-700 text-white placeholder-gray-500",
              "focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            rows={1}
          />
          
          {/* Character count and hints */}
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-gray-500">
              {input.length > 0 && (
                <span>{input.length} characters</span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </div>

        {/* Send Button */}
        <div className="flex flex-col items-center space-y-2">
          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || disabled || isComposing}
            className={cn(
              "w-12 h-12 rounded-full",
              input.trim() && !disabled 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            )}
          >
            {disabled ? (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              "↑"
            )}
          </Button>

          {/* Voice input button (placeholder for future feature) */}
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 rounded-full text-gray-500 hover:text-gray-300"
            onClick={() => {
              // Voice input functionality would be implemented here
              console.log('Voice input not yet implemented');
            }}
          >
            🎤
          </Button>
        </div>
      </div>

      {/* Status indicators */}
      {disabled && (
        <div className="flex items-center justify-center mt-3 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>AI is thinking...</span>
          </div>
        </div>
      )}
    </div>
  );
}