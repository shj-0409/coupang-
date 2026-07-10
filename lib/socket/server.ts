import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { prisma } from "@/lib/prisma/client";

export function initializeSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    path: "/api/socket",
    addTrailingSlash: false,
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join_chat", async ({ chatId }) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);

      // 채팅방의 이전 메시지 로드
      const messages = await prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: "asc" },
      });

      socket.emit("chat_history", messages);
    });

    socket.on("send_message", async (data) => {
      const { chatId, senderId, content } = data;

      // 메시지 DB 저장
      const message = await prisma.message.create({
        data: {
          chatId,
          senderId,
          content,
          isRead: false,
        },
      });

      // 채팅방에 메시지 브로드캐스트
      io.to(chatId).emit("receive_message", message);
    });

    socket.on("mark_as_read", async ({ messageId }) => {
      await prisma.message.update({
        where: { id: messageId },
        data: { isRead: true },
      });

      const message = await prisma.message.findUnique({
        where: { id: messageId },
      });

      if (message) {
        io.to(message.chatId).emit("message_read", message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}
