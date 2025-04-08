import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"]
  }
});

// Store chat rooms and their messages
const chatRooms = {};

// Generate a random 6-character room code
function generateRoomCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  let currentRoom = null;
  let currentUsername = null;

  // Create a new chat room
  socket.on('createRoom', ({ username }) => {
    const roomCode = generateRoomCode();
    
    // Create new room with empty messages array
    chatRooms[roomCode] = {
      code: roomCode,
      messages: [],
      host: socket.id,
      users: [{ id: socket.id, username }]
    };
    
    // Join the socket to the room
    socket.join(roomCode);
    currentRoom = roomCode;
    currentUsername = username;
    
    // Send room info back to the creator
    io.to(socket.id).emit('roomCreated', chatRooms[roomCode]);
    
    console.log(`Room created: ${roomCode} by ${username}`);
  });

  // Join an existing chat room
  socket.on('joinRoom', ({ username, roomCode }) => {
    // Check if room exists
    if (!chatRooms[roomCode]) {
      io.to(socket.id).emit('error', { message: 'Room not found' });
      return;
    }
    
    // Join the socket to the room
    socket.join(roomCode);
    currentRoom = roomCode;
    currentUsername = username;
    
    // Add user to room users
    chatRooms[roomCode].users.push({ id: socket.id, username });
    
    // Send only the latest 10 messages to the joiner
    const latestMessages = chatRooms[roomCode].messages.slice(-10);
    io.to(socket.id).emit('roomJoined', { ...chatRooms[roomCode], messages: latestMessages });
    
    // Notify others in the room
    socket.to(roomCode).emit('userJoined', { username });
    
    console.log(`User ${username} joined room: ${roomCode}`);
  });

  // Handle new messages
  socket.on('message', ({ message, roomCode }) => {
    // Check if room exists
    if (!chatRooms[roomCode]) {
      return;
    }
    
    // Add message to room history
    chatRooms[roomCode].messages.push(message);
    
    // Keep only the last 50 messages to prevent memory issues
    if (chatRooms[roomCode].messages.length > 50) {
      chatRooms[roomCode].messages = chatRooms[roomCode].messages.slice(-50);
    }
    
    // Broadcast message to all users in the room
    io.to(roomCode).emit('message', message);
  });

  // Handle user leaving the room
  socket.on('leaveRoom', ({ roomCode }) => {
    if (!chatRooms[roomCode]) return;
    
    // Remove user from room users
    chatRooms[roomCode].users = chatRooms[roomCode].users.filter(user => user.id !== socket.id);
    
    // Notify others in the room
    socket.to(roomCode).emit('userLeft', { username: currentUsername });
    
    // Leave the socket room
    socket.leave(roomCode);
    
    console.log(`User ${currentUsername} left room: ${roomCode}`);
    
    // Reset current room and username
    currentRoom = null;
    currentUsername = null;
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // If user was in a room, handle leaving
    if (currentRoom && chatRooms[currentRoom]) {
      const room = chatRooms[currentRoom];
      
      // Check if user was the host
      if (room.host === socket.id) {
        // Notify all users that the host has left and they're being kicked
        io.to(currentRoom).emit('hostLeft', { message: 'The host has left the room. Everyone is being disconnected.' });
        
        // Remove the room
        delete chatRooms[currentRoom];
        
        console.log(`Host left room: ${currentRoom}, room deleted`);
      } else {
        // Remove user from room users
        room.users = room.users.filter(user => user.id !== socket.id);
        
        // Notify others in the room
        io.to(currentRoom).emit('userLeft', { username: currentUsername });
        
        console.log(`User ${currentUsername} disconnected from room: ${currentRoom}`);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});