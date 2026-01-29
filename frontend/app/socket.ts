import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (token: string) => {
  // If socket exists but token changed, disconnect and reconnect
  if (socket) {
    if (socket.auth && (socket.auth as any).token !== token) {
      console.log("🔄 Token changed, reconnecting socket...");
      socket.disconnect();
      socket = null;
    } else {
      return socket;
    }
  }

  const SOCKET_URL = 'http://localhost:3001'; // Make sure this matches backend

  socket = io(SOCKET_URL, {
    auth: {
      token, // Send JWT token for auth
    },
    transports: ['websocket'], // Prefer WebSocket
    reconnection: true,
  });

  console.log('🔌 Initializing socket connection...');

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket?.id);
  });

  socket.on('connect_error', (err) => {
    console.error('❌ Socket connection error:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.warn('⚠️ Socket disconnected:', reason);
  });

  socket.on('reconnect', (attempt) => {
    console.log('🔄 Socket reconnected after attempt:', attempt);
  });

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
