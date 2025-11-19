import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

// ✅ ADD: Health check endpoint (CRITICAL for Render)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// ✅ ADD: Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Chat Server is Live! 🚀',
    endpoints: {
      health: '/health',
      websocket: 'Connect via Socket.IO'
    }
  });
});

const server = http.createServer(app);
const port = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  // ✅ ADD: Transport methods for better compatibility
  transports: ['websocket', 'polling']
});

io.on("connection", (socket) => {
  console.log("User connected -", socket.id);

  socket.on("joinRoom", async (userName, room) => {
    console.log(`${userName} is joining the chat.`);
    await socket.join(room);
    console.log(`Notice sent to room: ${room}`);
    socket.to(room).emit("roomNotice", userName);
  });

  socket.on("chatMssg", (mssg, currRoom) => {
    console.log("Message sent to room:", currRoom);
    // ✅ FIX: Use io.to() instead of socket.to() to broadcast to all in room
    iosocket.to(currRoom).emit("chatmssg", mssg);
  });

  // ✅ ADD: Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log("User disconnected -", socket.id, "Reason:", reason);
  });
});

server.listen(port, () => { 
  console.log(`🚀 Server is listening on port: ${port}`);
  console.log(`📍 Health check available at: http://localhost:${port}/health`);
});