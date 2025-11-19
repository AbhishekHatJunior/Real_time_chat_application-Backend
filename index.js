import {Server} from "socket.io"
import http from "http" 
import express from "express"  

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }  
}); 


io.on("connection", (socket) => {
    console.log("User connected -", socket.id);

    // socket.data.users = [];

    socket.on("joinRoom", async (userName, room) => {
        console.log(`${userName} is joining the chat.`);
        // socket.data.users.push(userName);
        // socket.data.room = roomUsers;
        // const roomUsers = socket.data.users;
        await socket.join(room);
        // io.to(room).emit("roomNotice", userName);
        console.log(`Notice sent to room: ${room}`);
        socket.to(room).emit("roomNotice", userName);
    })

    socket.on("chatMssg", (mssg, currRoom) => {
        // const room = socket.data.room;
        console.log("Message sent to room:", currRoom);
        socket.to(currRoom).emit("chatmssg", mssg, currRoom);
    })

})

server.listen(port, () => { 
    console.log("Server is listening on port:", port)
})