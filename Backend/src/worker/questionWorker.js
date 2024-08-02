import questionQueue  from "../queue/questionQueue.js";
import { io } from "../app.js";
import { Game } from "../models/game.models.js";
import { gameStart } from "../contorllers/game.controller.js";
var intervalId;
const questionWorker = async (job)=>{
    // console.log("Processing question", job.data);
    const {gameId,mcq,index}=job.data;
    // console.log("gameId",gameId);
    const game = await Game.findOne({gameId});
  
    // console.log("game",game);

    const roomId = gameId.toString();

    
    const gameDuration =60*10*1000;
    const interval = 1000;

  
    
   if(index===0) intervalId = setInterval(()=>{
        const currentTime = new Date();
        
        const elaspedTime = currentTime-game.startTime;

        const remainingTime = gameDuration-elaspedTime;
        if(game.status==='completed') clearInterval(intervalId)
        
        if(remainingTime<=0){
            
            clearInterval(intervalId);
            io.to(roomId).emit('timer',{remainingTime:0});
        }else{
            io.to(roomId).emit('timer',{remainingTime:remainingTime});
        }
      
    },1000);
    
    
    if(new Date()-game.startTime>10*1000*60) {
        game.status = "completed";
        await game.save();
    }

    if(!game || game.status === "completed"){
        
        return;
    }


  
    io.to(roomId).emit('next-question', {
        index: index,
        data: mcq
    });

    

    if(index>=9){
        game.status = "completed";
        await game.save();

        clearInterval(intervalId);

        io.to(roomId).emit("game-completed", {
            message: "Game completed!"
        });
    }
}

export default questionWorker;

