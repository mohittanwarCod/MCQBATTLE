import mongoose from "mongoose";
import { User } from "./user.models.js";
const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true }
})
const gameSchema = new mongoose.Schema({

    gameId:{
        type:String,
        unique:true,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',

    },
    status:{
        type:String,
        enum:['waiting','active','completed'],
        default:'waiting' 
    },
    questions:[
        
        questionSchema

    ],
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        
    },
    
         
    
    
],
    participantsRequest:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    winner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    scores:{
        type:Map,
        of:Number,
        default:{}
        
    },
    incorrectAnswers:{
        type:Map,
        of:Number,
        default:{}
    },
    startTime:{
        type:Date
        
    }


});



export const Game = mongoose.model('Game',gameSchema);

