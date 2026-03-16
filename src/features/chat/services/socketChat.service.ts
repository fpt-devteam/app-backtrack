import { SOCKET_CONFIG } from "@/src/features/chat/constants";
import type { MessageItem } from "@/src/features/chat/types";
import type { MessageSendRequest, MessageSendResponse } from "@/src/features/chat/types/chat.dto";
import { auth } from "@/src/shared/lib/firebase";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";

export class SocketChatService {
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

      const user = auth.currentUser;
      if (!user) {
        reject(new Error("User not authenticated"));
        return;
      }

      user
        .getIdToken()
        .then((token) => {
          this.socket = io(this.serverUrl, {
            path: SOCKET_CONFIG.PATH,
            transports: [...SOCKET_CONFIG.TRANSPORTS],
            timeout: SOCKET_CONFIG.TIMEOUT,
            auth: { token },
            extraHeaders: { Authorization: `Bearer ${token}` },
            query: { access_token: token },
          });

          this.socket.on("connect", () => {
            console.log("Socket connected:", this.socket?.id);
            resolve();
          });

          this.socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            reject(error);
          });

          this.socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
          });
        })
        .catch((error) => {
          reject(error);
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

    console.log("Join conversation: ", conversationId);
    this.socket.emit("join:conversation", conversationId);
  }

  leaveConversation(conversationId: string): void {
    if (!this.socket?.connected) {
      return;
    }

    console.log("Leave conversation: ", conversationId);
    this.socket.emit("leave:conversation", conversationId);
  }

  onReceiveMessage(callback: (message: MessageItem) => void): () => void {
    if (!this.socket) {
      console.warn("Socket not initialized");
      return () => { };
    }

    this.socket.on("message:new", callback);
    return () => {
      this.socket?.off("message:new", callback);
    };
  }

  sendMessage(payload: MessageSendRequest): Promise<MessageSendResponse> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      const onSuccess = (data: MessageSendResponse) => {
        cleanup();
        resolve(data);
      };

      const onError = (data: { message?: string }) => {
        cleanup();
        reject(new Error(data?.message || "Failed to send message"));
      };

      const cleanup = () => {
        this.socket?.off("message:send:success", onSuccess);
        this.socket?.off("message:send:error", onError);
      };

      this.socket.on("message:send:success", onSuccess);
      this.socket.on("message:send:error", onError);
      this.socket.emit("message:send", payload);
    });
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketChatService = new SocketChatService();
