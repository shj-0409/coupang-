import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { prisma } from "@/lib/prisma/client";

/**
 * Socket.IO 서버 초기화 함수
 * @description HTTP 서버에 Socket.IO를 연결하여 실시간 채팅 기능을 제공
 */
export function initializeSocket(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    path: "/api/socket",
    addTrailingSlash: false,
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    /**
     * 채팅방 입장 이벤트 핸들러
     * @description 사용자가 채팅방에 입장하면 이전 메시지를 로드
     */
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

    /**
     * 메시지 전송 이벤트 핸들러
     * @description 메시지를 DB에 저장하고 채팅방에 브로드캐스트
     */
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

    /**
     * 메시지 읽음 처리 이벤트 핸들러
     * @description 메시지를 읽음 상태로 변경하고 채팅방에 알림
     */
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

    /**
     * 연결 종료 이벤트 핸들러
     * @description 클라이언트 연결이 종료되면 로그 출력
     */
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}
