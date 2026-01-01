import { MessageItem } from "@/src/features/chat/types";
import { SOCKET_CONFIG } from "@/src/shared/constants";
import { io, Socket } from "socket.io-client";

export class SocketService {
  private socket: Socket | null = null;
  private readonly serverUrl: string;

  constructor(serverUrl?: string) {
    this.serverUrl = serverUrl || SOCKET_CONFIG.getServerUrl() || "";
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io(this.serverUrl, {
        path: SOCKET_CONFIG.PATH,
        transports: [...SOCKET_CONFIG.TRANSPORTS],
        timeout: SOCKET_CONFIG.TIMEOUT,
      });

      this.socket.on("connect", () => {
        console.log("✅ Socket connected:", this.socket?.id);
        resolve();
      });

      this.socket.on("connect_error", (error) => {
        console.error("❌ Socket connection error:", error);
        reject(error);
      });

      this.socket.on("disconnect", (reason) => {
        console.log("🔌 Socket disconnected:", reason);
      });
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinConversation(conversationId: string): void {
    if (!this.socket?.connected) {
      console.warn("Socket not connected, cannot join conversation");
      return;
    }

    this.socket.emit("join_conversation", conversationId);
    console.log("🏠 Joined conversation:", conversationId);
  }

  leaveConversation(conversationId: string): void {
    if (!this.socket?.connected) {
      return;
    }

    this.socket.emit("leave_conversation", conversationId);
    console.log("🚪 Left conversation:", conversationId);
  }

  onReceiveMessage(callback: (message: MessageItem) => void): () => void {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return () => {};
    }

    this.socket.on("receive_message", callback);

    return () => {
      this.socket?.off("receive_message", callback);
    };
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
