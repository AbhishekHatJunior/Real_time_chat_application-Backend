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

const room = "groupChatRoom";

io.on("connection", (socket) => {
    console.log("User connected -", socket.id);

    socket.on("joinRoom", async (userName) => {
        console.log(`${userName} is joining the chat.`);
        await socket.join(room);
        // io.to(room).emit("roomNotice", userName);
        socket.to(room).emit("roomNotice", userName);
    })

    socket.on("chatMssg", (mssg) => {
        socket.to(room).emit("chatmssg", mssg);
    })

})

server.listen(port, () => { 
    console.log("Server is listening on port:", port)
})