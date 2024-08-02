import mongoose from "mongoose";

import { io} from "../app.js";


import { Game } from "../models/game.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { emitEvent } from "../utils/eventEmitter.js";
import { ACTIONS, ROOMS } from "../Action.js";
import { getUserSocket } from "../app.js";
import questionQueue from "../queue/questionQueue.js";

// const socket = CurrSocket;




const createGame = asyncHandler(async (req,res)=>{
    const owner = req.user;
    const {questions} = req.body;
   
try {
        if(!owner) {
            throw new ApiError(401,"owner of game Required")
        }
        if(questions.length===0) {
            throw new ApiError(400,"questions of Required")
        }
        const game = await Game.create({
            gameId: new mongoose.Types.ObjectId().toString(),
            owner,
            participants:[],       
            questions,
        });

        
       emitEvent(req,ACTIONS.GAME_CREATED,ROOMS.GAME_LIST,game);
    // io.to("game-list").emit("game_created",game);

      
        res.status(200).json(
            new ApiResponse(
                200,
                game,
                "Game created successfully"
            )
        )
    
} catch (error) {
    throw new ApiError(500,error?.message || "Something Went Wrong in creation of game");
}
    


})


const listGame = asyncHandler (async (req,res)=>{
   try {
     const games =await Game.find({
         
     }).populate([{path:"owner",select:"-password -refreshToken"},{path:"participants",select:"-password -refreshToken"}])

    res.status(200).json(
        new ApiResponse(
            200,
            games,
            "Games Listed"
        )
    )
 
   } catch (error) {
    // console.log(error);
     throw new ApiError(500,error?.myessage || "Something Went Wrong in listing games");
   }



})

const activeListGame = asyncHandler(async (req,res)=>{
    try{
        const games = await Game.find({
            status:'active',
        }).populate([{path:"owner",select:"-password -refreshToken"},{path:"participants",select:"-password -refreshToken"}])


        res.status(200).json(
            new ApiResponse(
                200,
                games,
                "Active Games Listed"
            )
        )
        
    }catch(err){
        throw new ApiError(500,error?.message || "Something went wrong in listing active games");
    }
    
})

const getParticipantStatus = asyncHandler(async (req,res)=>{
   try {
     const user = req.user;
     
     const gameId = req.params.gameId;
 
     const game = await Game.findOne({gameId}).populate({path:"participants",select:"-password -refreshToken"})
 
     if(!game){
         throw new ApiError(404,"No Game Found");
     }
 
     const participants = game.participants

     if(participants.some(p=>p._id.toString()===user._id.toString())){
        return res.status(200).json(
            new ApiResponse(
                200,
                {status: true},
                "You are participant of this game"
            )
        )
        
     }

     res.status(202).json((
        new ApiResponse(
            202,
            {status:false},

            "You are not participant of this game"

        )
     ))
 
   } catch (error) {
    
    throw new Error(404,"Error in checking participant or not");
   }
    
})



const  getParticipantRequest = asyncHandler(async (req,res)=>{
    // verify the user and owner is authenticated
    // verify game
    // send the particpants Requests

    const user = req.user;
   
   
    const gameId = req.params.gameId;
    

    const game  = await Game.findOne({gameId}).populate({path:"participantsRequest",select:"-password -refreshToken"})

    if(!game){
        throw new ApiError(404,"No Game Found");
    }

    const participantsRequest = game.participantsRequest
  
    if(game.owner._id.toString() !== user._id.toString()){
        throw new ApiError(404,"You are not creator this game");
    }

    res.status(200).json(
        new ApiResponse(
            200,
            participantsRequest,
            "All participantsRequest sent"
        )
    )
 


})


const joinGame = asyncHandler(async (req,res)=>{
    // get gameId participant clicked the join button
    // we can also get from the socket or io 
    // verify the game and participant 
    // emit a socket to user by sending the request 
    // game/:
    const gameId=req.params.gameId;
   
   
    const user = req.user;

try {
    
        if(!gameId){
            throw new ApiError(400,"gameId is required")
        }
    
        if(!user){
            throw new ApiError(400,"participant details are required")
        }
        
    
        const game = await Game.findOne({gameId}).populate('owner').populate("participants").populate("participantsRequest")
        const participantsRequest = game.participantsRequest
        const owner = game.owner._id;
       
     
        
     
       
       if(participantsRequest.length>0) participantsRequest.forEach(participant => {
            
            if(participant._id.toString()===user._id.toString()){
               
                io.to(getUserSocket(user._id)).emit('join-request',{message:"You have already sent Request"})
                throw new ApiError(
                    400,
                    "You already sent Request"
                )
            }
        })
       
        
        
        
         
        if(owner.toString()===user._id.toString()) {
          
            io.to(getUserSocket(owner)).emit('join-request',{user:owner,message:"You are owner of this game",participantsRequest:game.participantsRequest})
           return res.status(200).json(
                new ApiResponse(
                    200,
                    game,
                    "You are the owner of this game"

                )
            )
        }

        
      
        if(!game){
            throw new ApiError(400,"Game not found")
        }
    
        if(game.status!=='waiting'){
            throw new ApiError(400,"Game is already started || completed")
        }
    
        game.participantsRequest.push(user);
        await game.save();
    
        
        io.to(getUserSocket(owner)).emit('join-request',{user:user.username,message:`${user.username} sent a join request`,participantsRequest:game.participantsRequest});
        io.to(getUserSocket(user._id)).emit('join-request',{message:"Join request sent Successfully"});
        res.status(200).json(
            new ApiResponse(
                200,
                game,
                "Game Join Request successfully"
            )
        )
        
} catch (error) {
    throw new ApiError(400,error?.message||"Something went wrong during join request")
}





})



const acceptRequest =asyncHandler (async (req,res)=>{
    try {
        const {gameId,participant} = req.body;
    
        const game =await Game.findOne({gameId}).populate([{path:"owner",select:"-password -refreshToken"},{path:"participantsRequest"}])

       
        
        if(!game){
            throw new ApiError(400,"Game not found")
        }
    
        if(game.status!=='waiting'){
            throw new ApiError(400,"Game is already started || completed")
        }
    
        // game.status = 'active';
        const owner = game.owner
        game.startTime = new Date();

        const participantRequest = game.participantsRequest
        // console.log(participantRequest);
        
       
        
        // if(!participantRequest.includes(participant._id)){
        //     throw new ApiError(400,"Participant not found in request")
        // }
        if(!participantRequest.some(p=>participant._id.toString()===p._id.toString())){
            throw new ApiError(400,"Participant not found in request")
        }
       
        game.participants.push(participant);
        game.participantsRequest  = participantRequest.filter((p)=>p._id.toString()!==participant._id.toString());
       


    
        await game.save();
        // console.log("Participants after Accept", game.participantsRequest)
        // console.log("parcitpants Request",game.participantsRequest);
        // pusher.trigger('game-channel','game-start',{gameId})
    
        // pusher.trigger('game-channel','game-start',{gameId})
        // console.log(participant._id);
        io.to(getUserSocket(participant._id)).emit('request-status',{message:"Your request has been accepted",status:"Accepted",owner:owner});
        io.to(getUserSocket(owner._id)).emit('request-status',{message:"Request accepted",status:"Accepted",owner:game.owner,participantsRequest:game.participantsRequest});
        res.status(200).json(
            new ApiResponse(
                200,
                game,
                "Game Started successfully"
            )
        )
    
    } catch (error) {
        throw new ApiError(200,error?.message || "Error in Accepting Request");
    }
    
})

const rejectRequest = asyncHandler(async (req,res)=>{
    const {gameId,participant} = req.body;
    

    const game = await Game.findOne({gameId}).populate([{path:"owner",select:"-password -refreshToken"},{path:"participantsRequest"}]);

    if(!game){
        throw new ApiError(400,"Game not found")
    }

    if(game.status!=='waiting'){
        throw new ApiError(400,"Game is already started || completed")
    }
    
    const owner = game.owner
    const participantRequest = game.participantsRequest

    if(!participantRequest.some(p=>p._id.toString()===participant._id.toString())){
        throw new ApiError(400,"Participant not found in request")
    }

    game.participantsRequest = participantRequest.filter(p=>p._id.toString() !==participant._id.toString())
   

    game.save();
    
   
    io.to(getUserSocket(participant._id)).emit('request-status',{message:"Your request has been rejected",status:"Rejected",owner:game.owner,participantsRequest:game.participantsRequest});
    io.to(getUserSocket(owner._id)).emit('request-status',{message:"You Rejected the request",status:"Rejected",owner:game.owner,participantsRequest:game.participantsRequest});
    res.status(200).json(
        new ApiResponse(
            200,
            game,
            "Game request rejected successfully"
        )
    )
})

// game start
// 
// send the all the questions 
// 
const gameStart = asyncHandler(async(req,res)=>{
  
    const {gameId} =req.params;
  
    
    const game = await Game.findOne({gameId})


    if(!game){
        throw new ApiError(400,"Game not found");
    }

    const participants = game.participants

    if(participants.length < 2){
        throw new ApiError(400,"Not enough participants to start the game");
    }
    game.status = 'active';
    game.startTime = new Date();
    game.save();
    const roomId = gameId.toString();
    // TODO: use emitter function
    
    io.to(roomId).emit('game-started',{message: 'Game started',gameStartTime:game.startTime});
    const questions = game.questions;

    

    

    questions.forEach((mcq,index)=>{
        questionQueue.add({gameId,mcq,index},{delay:index*60*1000})
    });
 

  



    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        questions,
        "Game started successfully"
      )
    )
})



const submitAnswer = asyncHandler(async (req,res)=>{
    const {gameId,userId,questionId,answer} = req.body;
    const game = await Game.findOne({gameId}).populate([{path:"questions",select:"-correctAnswer"},{path:"participants",select:"-password -refreshToken"}]);
    const participant = userId;

    
    if(!game){
        throw new ApiError(400,"Game not found or already completed");
    }
    
    if(game.status !=='active'){
        throw new ApiError(400,"Game is already completed");
    }
       
    
    const question = game.questions.filter((mcq)=>{
        
        return (mcq._id.toString() === questionId);
    });
   
  
    if(question.size===0){
        throw new ApiError(400,"Question not found");
    }
     
    if(question[0].correctAnswer===answer){
        // if participants is scores in empty so add one to it 
       game.scores.set(participant,!(game.scores.get(participant))?4:game.scores.get(participant)+4);
       io.to(getUserSocket(participant)).emit('submit-response',{message:"Correct Answer",status:"correct"});

    //    console.log(game.scores);
    //    console.log(!(game.scores.get(participant)));

    }else{
        game.incorrectAnswers.set(participant,!(game.incorrectAnswers.get(participant))?1:game.incorrectAnswers.get(participant)+1);
        game.scores.set(participant,!(game.scores.get(participant))?-1:game.scores.get(participant)-1);
        // console.log("IncorrectAnswer",game.incorrectAnswers.get(participant))
        io.to(getUserSocket(participant)).emit('submit-response',{message:"Incorrect Answer",status:"wrong"});
      
       
    }

    await game.save();

    if(game.incorrectAnswers.get(participant) >=3 || new Date()-game.startTime>10*60*1000){
        game.status = 'completed'

        await game.save();

       
        const roomId = gameId.toString();
        const winner = determineWinner(game);
      
        io.to(roomId).emit('game-completed',{message: 'Game completed',status:"completed"});



    }

  

    
    



    res.status(200).json(
        new ApiResponse(
            200,
            game,
            "Answer submitted successfully"
        )
    )






})

const getGameResult = asyncHandler(async (req,res)=>{
    const user = req.user;

    const gameId = req.params.gameId;
    
    const game =await Game.findOne({gameId}).populate([{path:"participants",select:"-password -refreshToken"},{path:"scores"}])

    if(!game){
        throw new ApiError(400,"Game not found");
    }
   
    if(game.status!=="completed"){
        throw new ApiError(400,"Game not completed");
    }

      
    const winner=await determineWinner(game);

    
   const scores =  Array.from(game.scores).sort((a,b)=> b[1]-a[1])
    // console.log("winner",winner);
 
    

    return res.status(200).json(
        new ApiResponse(
            200,
            {winner:determineWinner(game)._id,game:game,scores},
            "Game result fetched successfully"
        )
    )
})

function determineWinner(game) {

    const participants = game.participants;
    
    
    // console.log("participants",participants);

    const scores = participants.map(participant => {
       
        return (game.scores.get(participant._id) || 0);
    });

    // console.log("game Participants",participants)

    // console.log("scores",scores);
  
    if(scores[0] > scores[1]) return participants[0]

    if (scores[1] > scores[0]) return participants[1]


}   




export {createGame,listGame,joinGame,acceptRequest,submitAnswer,gameStart,getParticipantRequest,rejectRequest,activeListGame,getParticipantStatus,getGameResult}

