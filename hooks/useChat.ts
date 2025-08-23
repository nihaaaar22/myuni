'use client';

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Message } from '@/components/chat/MessageList';

interface UseChatProps {
  classroomId: string;
  userEmail: string;
  enabled: boolean; // To control when the hook should connect
}

export const useChat = ({ classroomId, userEmail, enabled }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!enabled || !classroomId) {
      return;
    }

    // This fetch request is crucial to "wake up" the API route and initialize the socket server.
    fetch('/api/socket').finally(() => {
      socketRef.current = io({
        path: '/api/socket',
        addTrailingSlash: false,
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
        console.log('Socket connected!');
        setIsConnected(true);
        socket.emit('join-classroom', classroomId);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected.');
        setIsConnected(false);
      });

      socket.on('message-history', (history: Message[]) => {
        setMessages(history || []);
      });

      socket.on('new-message', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        setIsConnected(false);
      });
    });

    // Cleanup on unmount or when disabled
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [classroomId, userEmail, enabled]);

  const sendMessage = (messageText: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('chat-message', {
        classroomId,
        sender: userEmail,
        message: messageText,
      });
    } else {
      console.error('Socket not connected, cannot send message.');
    }
  };

  return { messages, sendMessage, isConnected };
};
