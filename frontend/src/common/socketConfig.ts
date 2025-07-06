import openSocket from 'socket.io-client';

export let server_location = 'https://trendwars.io';

export const ws = openSocket(server_location, {
    transports: ['websocket', 'polling'], // Allow fallback to polling
    upgrade: true,
    rememberUpgrade: true,
    timeout: 20000,
    forceNew: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000, // Enable debug logging (remove in production)
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
