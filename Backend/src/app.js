

import cors from "cors";
import express from "express"
import cookieParser from "cookie-parser";
import session from "express-session";
import { ACTIONS } from "./Action.js";
import dotenv from "dotenv"
const app = express();
import {socketAuthenticator} from "../src/contorllers/user.controller.js";
import { Server } from "socket.io";
import { createServer } from "http";


dotenv.config({
    path:'./.env'
})





app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.json({
    limit:"16kb",
}))
app.use(cookieParser());
app.use(express.static("public"))




// router 
import { userRouter } from "./routes/user.routes.js";
import {mcqRouter} from "./routes/mcq.routes.js";
import { gameRouter } from "./routes/games.routes.js";
import { isTypedArray } from "util/types";

app.use('/api/v1/users', userRouter);
app.use('/api/v1/question',mcqRouter);
app.use('/api/v1/games',gameRouter)



// socekt io 
const server = createServer(app);


const userSocketMap = {};
const userSocketIDs = new Map();
const onlineUsers = new Set();

export const getUserSocket = (userId)=>{
  return userSocketIDs.get(userId.toString());
}


const io = new Server(server,{
    cors: {
        origin:"http://localhost:5173",
        credentials:true
    }
});

function getAllConnectedClients(roomId){
    
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId)=>{
            return {

                socketId,
                username:userSocketMap[socketId]
            

            }
        }
    )
}

io.use((socket,next)=>{
     
    cookieParser()(
        socket.request,
        
        socket.request.res,
        async (err)=>await socketAuthenticator(err, socket, next)
    )
    
})
io.on('connection',(socket)=>{
userSocketIDs.set((socket.user._id).toString(), socket.id);

// console.log('connected to server',socket.id,socket.user._id);








socket.on(ACTIONS.JOIN,({roomId,username,userId})=>{
    userSocketMap[socket.id]=username;
    socket.join(roomId);
    // console.log("username",username)
    // console.log("roomId",roomId)
    
   
    const clients = getAllConnectedClients(roomId)
    clients.forEach(({socketId})=>{
     io.to(socketId).emit(ACTIONS.JOINED,{
        clients,
        username,
        socketId:socket.id
     })
    });
   
    

   
});

socket.on('disconnecting',()=>{

    const rooms = [...socket.rooms]

    rooms.forEach((roomId)=>{
      socket.in(roomId).emit(ACTIONS.DISCONNECTED,{
          socketId:socket.id,
          username:userSocketMap[socket.id]
      })
    })

    userSocketIDs.delete((socket.user._id).toString());

    delete userSocketMap[socket.id]

    socket.leave();

})


});


export {app,server,io,userSocketMap}
