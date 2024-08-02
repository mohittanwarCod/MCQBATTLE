// verify jwt 
// access token from user and cookies 
// send userid to request


import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"

export const verifyJWT = asyncHandler(async (req,_,next)=>{
   try {
    
    //  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    const token = req.cookies["accessToken"];

    
     
     
    
 
     if(!token) {
         throw new ApiError(401,"Unauthorized Request");
     }
 
     const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
 
     const user =await User.findById(decodeToken?._id).select("-password -refreshToken");
    
     if(!user){
         throw new ApiError(401,"Invalid Access Token");
     }
 
     req.user = user;
     next();
   } catch (error) {
     throw new ApiError(401,error?.message || "Invalid Access Token");
   }
});
