"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

export default function SellerChatPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [chatId, setChatId] = useState("");

  useEffect(() => {
    const socketInstance = io("http://localhost:3000", {
      path: "/api/socket",
    });

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to socket server");
    });

    socketInstance.on("receive_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on("message_read", (message: Message) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === message.id ? message : msg)),
      );
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinChat = (chatId: string) => {
    if (socket) {
      socket.emit("join_chat", { chatId });
      setChatId(chatId);
    }
  };

  const sendMessage = () => {
    if (socket && inputMessage.trim() && chatId) {
      socket.emit("send_message", {
        chatId,
        senderId: "vendor-id-placeholder",
        content: inputMessage,
      });
      setInputMessage("");
    }
  };

  const markAsRead = (messageId: string) => {
    if (socket) {
      socket.emit("mark_as_read", { messageId });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">고객과 채팅</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            채팅방 ID
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-4 py-2"
            placeholder="채팅방 ID를 입력하세요"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
          />
          <button
            onClick={() => joinChat(chatId)}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            채팅방 입장
          </button>
        </div>

        <div className="border rounded-lg p-4 h-96 overflow-y-auto mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 p-2 rounded-lg ${
                message.senderId === "vendor-id-placeholder"
                  ? "bg-blue-100 ml-auto"
                  : "bg-gray-100 mr-auto"
              }`}
              onClick={() => markAsRead(message.id)}
            >
              <p>{message.content}</p>
              <p className="text-xs text-gray-500">
                {new Date(message.createdAt).toLocaleTimeString("ko-KR")}
                {message.isRead && " ✓"}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded-lg px-4 py-2"
            placeholder="메시지를 입력하세요"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
