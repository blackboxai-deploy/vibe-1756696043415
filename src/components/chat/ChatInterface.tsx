"use client";

import { useState, useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { InputArea } from "./InputArea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SystemPromptEditor } from "@/components/settings/SystemPromptEditor";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  streaming?: boolean;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI assistant. I can help you manage your calendar, track time, and handle various tasks. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);

    // Create assistant message placeholder
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      streaming: true,
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages
            .filter(m => m.id !== "welcome")
            .concat(userMessage)
            .map(m => ({
              role: m.role,
              content: m.content
            }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Update the assistant message with the response
      setMessages(prev => prev.map(m => 
        m.id === assistantMessage.id
          ? { ...m, content: data.message, streaming: false }
          : m
      ));
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update with error message
      setMessages(prev => prev.map(m => 
        m.id === assistantMessage.id
          ? { ...m, content: "I apologize, but I encountered an error. Please try again.", streaming: false }
          : m
      ));
    } finally {
      setIsStreaming(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI assistant. I can help you manage your calendar, track time, and handle various tasks. How can I assist you today?",
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">AI Chat</h2>
            <p className="text-sm text-gray-400">Claude Sonnet-4 • Intelligent Assistant</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSystemPrompt(!showSystemPrompt)}
              className="text-gray-400 hover:text-white"
            >
              ⚙️ System
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-gray-400 hover:text-white"
            >
              🗑️ Clear
            </Button>
          </div>
        </div>
      </div>

      {/* System Prompt Editor */}
      {showSystemPrompt && (
        <div className="border-b border-gray-800">
          <SystemPromptEditor onClose={() => setShowSystemPrompt(false)} />
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isStreaming={message.streaming}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-gray-800">
        <InputArea
          onSendMessage={sendMessage}
          disabled={isStreaming}
          placeholder="Ask me anything about your calendar, time tracking, or general tasks..."
        />
      </div>
    </div>
  );
}