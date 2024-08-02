import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";
import Cookies from "js-cookie";
import { authExtraReducers,login,logout,signup,authCheck} from "../../services/authServices.js";
import { BASE_URL } from "../../constants/constant.jsx";
const initialState = {
    isLoggedin:false,
    isLoading:false,
    user:null,
    userId:null,
    error:null,
    
    accessToken:null,
    
}
 

export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        profile: (state,action)=>{
            state.isLoggedin=true,
            
            state.user=action.payload.response.data.data.user.username,
            state.userId=action.payload.response.data.user._id
            
            
        }
        
     
    },
    extraReducers:authExtraReducers,


})



export {signup,authCheck,login,logout,}
export const {profile} = authSlice.actions;
export default authSlice.reducer;