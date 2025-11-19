import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors"; // ✅ ADD CORS import

const app = express();

// ✅ ADD: CORS middleware for Express
app.use(cors({
  origin: ["https://ustalkchat.vercel.app", "http://localhost:3000"],
  credentials: true
}));

// ✅ ADD: Health check endpoint
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
    origin: ["https://ustalkchat.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

io.on("connection", (socket) => {
  console.log("User connected -", socket.id);

  socket.on("joinRoom", async (userName, room) => {
    console.log(`${userName} is joining room: ${room}`);
    await socket.join(room);
    socket.to(room).emit("roomNotice", userName);
  });

  socket.on("chatMssg", (mssg, currRoom) => {
    console.log("Message in room:", currRoom, "Content:", mssg);
    // ✅ FIX: Broadcast to all users in the room including sender
    io.to(currRoom).emit("chatmssg", mssg, currRoom);
  });

  // ✅ ADD: Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log("User disconnected -", socket.id, "Reason:", reason);
  });
});

server.listen(port, () => { 
  console.log(`🚀 Server is listening on port: ${port}`);
  console.log(`📍 Health check: http://localhost:${port}/health`);
});