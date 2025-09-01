"use client";

import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  streaming?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn(
      "flex w-full",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-3 relative",
        isUser 
          ? "bg-blue-600 text-white" 
          : "bg-gray-900 text-gray-100 border border-gray-700"
      )}>
        {/* Avatar */}
        <div className={cn(
          "absolute -top-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
          isUser 
            ? "-right-2 bg-blue-700 text-white" 
            : "-left-2 bg-gray-800 text-gray-300 border border-gray-600"
        )}>
          {isUser ? "U" : "AI"}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className={cn(
            "prose prose-sm max-w-none",
            isUser 
              ? "prose-invert prose-p:text-white prose-strong:text-white" 
              : "prose-invert prose-p:text-gray-100 prose-strong:text-gray-100"
          )}>
            <p className="whitespace-pre-wrap break-words mb-0">
              {message.content}
              {isStreaming && (
                <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse" />
              )}
            </p>
          </div>

          {/* Timestamp */}
          <div className={cn(
            "text-xs opacity-70 mt-2",
            isUser ? "text-blue-100" : "text-gray-400"
          )}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>

        {/* Actions for assistant messages */}
        {!isUser && !isStreaming && (
          <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-gray-700">
            <button
              onClick={() => navigator.clipboard.writeText(message.content)}
              className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
            >
              📋 Copy
            </button>
            <button
              onClick={() => {
                // Regenerate response functionality could be added here
                console.log('Regenerate response for:', message.id);
              }}
              className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
            >
              🔄 Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}