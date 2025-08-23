'use client';

import { cn } from "@/lib/utils";

export type Message = {
  sender: string;
  message: string;
  timestamp: string;
};

interface MessageListProps {
  messages: Message[];
  currentUserEmail: string; // To align user's messages to the right
}

export default function MessageList({ messages, currentUserEmail }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, index) => {
        const isCurrentUser = msg.sender === currentUserEmail;
        return (
          <div
            key={index}
            className={cn(
              "flex flex-col",
              isCurrentUser ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "rounded-lg px-3 py-2 max-w-xs lg:max-w-md",
                isCurrentUser
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-100 text-zinc-900"
              )}
            >
              {!isCurrentUser && (
                <p className="text-xs font-semibold text-zinc-600 pb-1">
                  {msg.sender}
                </p>
              )}
              <p className="text-sm">{msg.message}</p>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        );
      })}
    </div>
  );
}
