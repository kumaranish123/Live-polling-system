import { io } from 'socket.io-client';
const backend =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
export const socket = io(backend);
