import { io, Socket } from 'socket.io-client';
import { projectService } from './projectService';

let socket: Socket | null = null;
let currentProjectId: string | null = null;
export const socketService = {
  connect: (projectId: string): Socket => {
    if (socket && currentProjectId === projectId) {
      return socket;
    }

    if (socket) {
      socket.disconnect();
    }

    const origin = projectService.getOrigin();

    socket = io(`${origin}/editor`, {
      query: { projectId },
      transports: ['websocket'],
      reconnection: true,
    });

    currentProjectId = projectId;

    socket.removeAllListeners();

    socket.on('connect', () => {
      console.log('✅ Connected:', socket?.id);
    });

    socket.on('fileContent', (data) => {
      console.log("📄 File content:", data);
    });

    socket.on('fileChanged', (data) => {
      console.log("📢 File changed:", data);
    });

    socket.on('connect_error', (err) => {
      console.error("❌ Connection error:", err);
    });

    socket.on('error', (err) => {
      console.error("⚠️ Server error:", err);
    });

    return socket;
  },

  getFileContent: (filePath: string) => {
    socket?.emit("getFileContent", { path: filePath });
  },

  updateFile: (filePath: string, content: string) => {
    socket?.emit("fileUpdate", { path: filePath, content });
  },

  disconnect: () => {
    socket?.disconnect();
    socket = null;
    currentProjectId = null;
  },

  getSocket: () => socket
};