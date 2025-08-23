'use client';

import { useState } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, WifiOff } from "lucide-react";
import { useChat } from '@/hooks/useChat';

interface ChatWidgetProps {
  classroomId: string;
  userEmail: string;
}

export default function ChatWidget({ classroomId, userEmail }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  // The hook is enabled only when the widget is open, preventing connection until needed.
  const { messages, sendMessage, isConnected } = useChat({
    classroomId,
    userEmail,
    enabled: isOpen,
  });

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 rounded-full h-16 w-16 shadow-lg z-50"
        size="icon"
        aria-label="Open chat widget"
      >
        <MessageSquare className="h-8 w-8" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-8 right-8 w-[400px] h-[600px] z-50">
      <Card className="h-full flex flex-col shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <CardTitle className="text-lg">Classroom Chat</CardTitle>
            {!isConnected && (
              <div title="Disconnected">
                <WifiOff className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <MessageList messages={messages} currentUserEmail={userEmail} />
          <MessageInput onSendMessage={sendMessage} disabled={!isConnected} />
        </CardContent>
      </Card>
    </div>
  );
}
