import { io } from "../app.js";


const emitEvent = (req, event, roomId, data) => {
   
   
    io.to(roomId).emit(event, data);
};

export {emitEvent}