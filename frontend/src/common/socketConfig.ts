import openSocket from 'socket.io-client';

export const production_server_location = 'https://trendwars.io';
export const local_server_location = 'http://localhost:8000';
const mode = import.meta.env.MODE || 'production';
let server_location = production_server_location;
if (mode === 'development') {
  server_location = local_server_location;
}

export const ws = openSocket(server_location, {
  transports: ['websocket', 'polling'], // Allow fallback to polling
  upgrade: true,
  rememberUpgrade: true,
  timeout: 30000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Add connection event listeners for debugging
ws.on('connect', () => {
  console.log('Connected to server');
});

ws.on('disconnect', (reason) => {
  console.log('Disconnected from server:', reason);
});

ws.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

ws.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after', attemptNumber, 'attempts');
});

ws.on('reconnect_error', (error) => {
  console.error('Reconnection error:', error);
});
