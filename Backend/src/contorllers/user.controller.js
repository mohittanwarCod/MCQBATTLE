import { User } from "../models/user.models.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"


// get data from user 
// validate
// create user
// check uniqueness of user

const generateAccessTokenandRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refershToken = user.generateRefreshToken();

        
    
        user.refreshToken =  refershToken;;
    
        user.save({validateBeforeSave:true});
    
        return { accessToken, refershToken};
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh token");
        
    }
}

const createUser = asyncHandler(async(req,res)=>{
    const {username,email,password} = req.body;
    
    if([username, email, password].some((field)=>field.trim()==="")){
        throw new ApiError(400,"All fields are required");

    }

    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(400,"User already exists");
    }

    
    let createdUser = await User.create({
        username,
        email,
        password,
    })
   
    if(!createdUser){
        throw new ApiError(500,"Something went wrong");
    }

    const {accessToken,refershToken} =await generateAccessTokenandRefreshToken(createdUser._id);
    createdUser = await User.findById(createdUser._id).select("-password -refreshToken");
    
  
    const options = {
        httpOnly:true,
        secure:true,
        
        // withCredentials:true
    }

   
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refershToken,options)
    .json(
        new ApiResponse(
          
            200,
            createdUser,
            "user created"
        )
    )
})

// body->data
// authecate email ya username 
// authenticate password 
// session creation
// jwt tokens banao
// cookies mein daalo 

const loginUser = asyncHandler(async (req,res)=>{
    const {username,email,password} = req.body;
    if(!username && !email){
        throw new ApiError(400,"username or email is required");
    }

    const user = await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
         throw new ApiError(401,"Invalid username or email");
    }

    const isPasswordCorrect =await user.isPasswordCorrect(password) // methdos are for mongodb not mongoose
   
    if(!isPasswordCorrect) {
        throw new ApiError(401,"Invalid password");
    }
    

    const {accessToken,refershToken} =await generateAccessTokenandRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly:true,
        secure:true,
        withCredentials:true,
       
    }
    

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refershToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refershToken,

            },
             "User logged In Successfully"

        )
    )
})



// verify jwt token 
// delete cookies 
// delete jwt token 

const logoutUser = asyncHandler(async (req,res)=>{
    
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken:null
            },
        },
        {
            new:true
        }
    )
   

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
           .status(200)
           .clearCookie("accessToken",options)
           .clearCookie("refreshToken",options)
           .json(
            new ApiResponse(
                200,
                {},
                "User Logged Out Successfully"

            )
           )

})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    // refresh Token from cookie
    // validate refresh token
    // generate access token and refresh token
    // update refresh token
    // send access token and refresh token to client

   const incomingRefreshToken =  req.cookies?.refreshToken || req.body.refershToken
  
   
   if(!incomingRefreshToken){
    throw new ApiError(401,"Unauthorized Request");
   }
try {
    
       const decodeToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
       
       const user = await User.findById(decodeToken?._id)
    
       if(!user){
        throw new ApiError(401,"Invalid Refresh Token");
    
       }
    
       if(incomingRefreshToken!=user?.refreshToken){
        throw new ApiError(401,"Refresh token is expired or used");
       }
    
       const options = {
        httpOnly:true,
        secure:true
       }
    
       const {accessToken, refershToken:newRefreshToken}=await generateAccessTokenandRefreshToken(user._id);
       
       return res
              .status(200)
              .cookie("accessToken",accessToken,options)
              .cookie("refreshToken",newRefreshToken,options)
              .json(
                new ApiResponse(
                    200,
                    {accessToken,refreshToken:newRefreshToken,user},
                    "Access Token Refreshed"
                )
              )
    
} catch (error) {
    throw new ApiError(400,error?.message || "Invalid Refresh Token")
}

})
const authCheck = asyncHandler(async (req,res)=>{
   try {
     
     const token = req.cookies["accessToken"]
     
     
    
     
    // const user = req.user
 

     const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     
     const user =await User.findById(decodeToken?._id).select("-password -refreshToken");
     if(!user){
         throw new ApiError(401,"Invalid Access Token");
     }
  
     res
     .status(200)
     .json(
         new ApiResponse(
             200,
             user,
             "User Authenticated"
         )
        )
        }catch (error) {
     throw new ApiError(401,error?.message || "Invalid Access Token");
   }



})
///

const socketAuthenticator = asyncHandler(async(err,socket,next)=>{
 try{
    if(err) throw new ApiError(401,"Unauthorized Request");
   
    const authToken = socket.request.cookies["accessToken"]

    if(!authToken) throw new ApiError(401,"Unauthorized Request");
    
    const decodeToken = jwt.verify(authToken,process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodeToken?._id).select("-password -refreshToken");
    
    if(!user) throw new ApiError(401,"Invalid Access Token");

    socket.user = user;
    
    return next();

 }catch(err){
    throw new ApiError(401,err?.message || "Invalid Access Token");

 }
})

export {createUser,loginUser,logoutUser,refreshAccessToken,authCheck,socketAuthenticator}