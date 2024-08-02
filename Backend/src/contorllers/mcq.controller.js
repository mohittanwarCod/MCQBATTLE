import { Mcq } from "../models/mcq.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";


// req.body->data
// validate
// mcq create

const createMcq = asyncHandler(async (req,res)=>{
   try {
     const {question,options,correctAnswer} = req.body
     
     const user = await User.findById(req.user._id);
     
   

    if(!user) {
        throw new ApiError(400,"User not found");
    }
     
     if([question,correctAnswer].some((field)=>field.trim()==="")){
         throw new ApiError(400,"All fields are required")
     }
 
     if(options.size < 4){
         throw new ApiError(400,"At least 4 options are required")
     }
     if(options.size > 4){
         throw new ApiError(400,"At most 4 options are allowed")
     }
 
     const existedMcq = await Mcq.findOne({question})
     if(existedMcq){
         throw new ApiError(400,"Question already exists")
     } 
       
     const newMcq = await Mcq.create({
         question,
         options,
         correctAnswer,
         createdBy:user._id,
        
     })

 
 
     return res
     .status(200)
     .json(
       new ApiResponse(200,
           newMcq,
           "New Mcq created successfully"
     ))
   } catch (error) {
    throw new ApiError(400,error || "Error creating new Mcq")
   }


});

// List mcqs 
// find mcsq from database
// return database 

const listAllMcqs = asyncHandler(async (req,res)=>{
   try {
     const mcqs = await Mcq.find()
 
     if(mcqs.length===0){
         throw new ApiError(404,"No mcqs found");
     }
 
     return res
     .status(200)
     .json(
         new ApiResponse(200,
             mcqs,
             "All mcqs retrieved successfully"
     )
 )
 
   } catch (error) {
    throw new ApiError(200,error || "Something went wrong during fetching all mcqs");
   }

})


// delete a mcq
// http://--/mcqs/:id
// find in database
// remove from database

const deleteMcq = asyncHandler(async (req,res)=>{
    try {
        const mcq = await Mcq.findByIdAndDelete(req.params.id)
        if(!mcq){
            throw new ApiError(404,"Mcq not found")
        }
  

        
    
        return res
       .status(200)
       .json(
            new ApiResponse(200,
                mcq,
                "Mcq deleted successfully"
        )
    )
    } catch (error) {
        throw new ApiError(400,error || "Something went wrong during deleting mcq");
    }
})

// update a mcq 
// /?id="" && field=""
// httt:// 
// update in database

const updateMcq = asyncHandler( async (req,res)=>{

  try {
    const user = req.user;
    if(!user){
      throw new ApiError(400,"User not found");
    }
   
   
    // TODO: CHECK UNIQUENESS 
   
    let mcq = await Mcq.findById(req.params.id);
 
    if(!mcq){
        throw new ApiError(404,"Mcq not found");
    }
     const update = {
        ...mcq._doc, // TODO: SEE ABOUT THIS 
        question:req.body.question,
        options:req.body.options,
        correctOption:req.body.correctOption,
     }
   
     mcq = await Mcq.findByIdAndUpdate(req.params.id,update,{
        new:false,
     }   // dynamic keyword 
)
mcq.save();
    return res
    .status(200)
    .json(
        new ApiResponse(200,
            mcq,
            "Mcq updated successfully"
        )
    )
  } catch (error) {
    throw new ApiError(400,error || "Something went wrong during update mcq");
  }



})
export {createMcq,listAllMcqs,deleteMcq,updateMcq}
