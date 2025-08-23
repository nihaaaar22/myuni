import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "@/types/socket";

// In-memory store for chat messages.
// This fulfills the "temporary" history requirement as it's cleared on server restart.
const messagesByClassroom: Record<string, { sender: string; message: string; timestamp: string }[]> = {};

const handler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log("Socket is already running.");
  } else {
    console.log("Socket is initializing...");
    const io = new Server(res.socket.server as any, {
      path: "/api/socket",
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // Handle a user joining a classroom chat
      socket.on("join-classroom", (classroomId: string) => {
        if (!classroomId) {
          return;
        }
        socket.join(classroomId);
        console.log(`Socket ${socket.id} joined classroom ${classroomId}`);
        // Send the current message history to the user who just joined
        socket.emit("message-history", messagesByClassroom[classroomId] || []);
      });

      // Handle a new chat message from a user
      socket.on("chat-message", (data: { classroomId: string; sender: string; message: string }) => {
        const { classroomId, sender, message } = data;
        if (!classroomId || !sender || !message) {
          return;
        }

        const newMessage = {
          sender,
          message,
          timestamp: new Date().toISOString(),
        };

        // Store the new message in our in-memory store
        if (!messagesByClassroom[classroomId]) {
          messagesByClassroom[classroomId] = [];
        }
        messagesByClassroom[classroomId].push(newMessage);

        // Broadcast the new message to all clients in the classroom
        io.to(classroomId).emit("new-message", newMessage);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
      });
    });
  }
  res.end();
};

export default handler;
