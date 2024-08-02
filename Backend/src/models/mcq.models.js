import mongoose from "mongoose"
import {User} from "./user.models.js"
const mcqSchema = new mongoose.Schema({
    question:{
        type:String,
        required:true,
    },
    options:[
        {type:String, required:true}
    ],
    correctAnswer:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
      
        
    }

},{timestamps:true})


export const Mcq =mongoose.model('Mcq',mcqSchema);




