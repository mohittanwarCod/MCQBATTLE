
import { io } from "socket.io-client";
import { BASE_URL } from "./constants/constant";

export const initSocket = async ()=>{
    // console.log(" we get here init Scoket")
    const options = {
        'force new connection':true,
        reconnectionAttempt:'Infinity',
        timeout:10000,
        transports:['websocket']



    };

    return io(BASE_URL,options);

    // This will return an instance 



}



