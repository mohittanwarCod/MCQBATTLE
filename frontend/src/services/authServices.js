import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../constants/constant";

const authCheck = createAsyncThunk('auth/check',async(thunkApi)=>{
    
    const response = await axios.get(`${BASE_URL}/api/v1/users/profile`,{
       withCredentials:true,
    });
   
    
    if(!response.status){
        thunkApi.rejectWithValue(response.data.message);
    }
 
  
    return response.data.data
})

 const login = createAsyncThunk('auth/login',async (credentials,thunkApi)=>{
    try{
       
       const response = await axios.post(`${BASE_URL}/api/v1/users/login`,credentials,{
        httpOnly:true,
        withCredentials:true
       });
     
       if(!response.status){
        thunkApi.rejectWithValue(response.data.message);
       }
       
       return response.data.data;
    }catch(error){
        // console.log(error);
       return thunkApi.rejectWithValue(error.response.data);
    }
})

 const signup = createAsyncThunk('auth/signup',async (userData,thunkApi)=>{
    try{
          const response = await axios.post(`${BASE_URL}/api/v1/users/signup`,userData,{
            withCredentials:true,
          });
          
          if(!response.status){
              thunkApi.rejectWithValue(response.data.message);
          }
          
          return response.data;
    }catch(err){
   
   
        return thunkApi.rejectWithValue(err.response.data);
    }
})


const logout = createAsyncThunk(`${BASE_URL}/auth/logout`,async (credentials,thunkApi)=>{
    try{
        const response = await axios.get(`${BASE_URL}/api/v1/users/logout`,{
            withCredentials:true,
        });
        // console.log(response);
        if(!response.status){
            thunkApi.rejectWithValue(response.data.message);
        }

        return response.data;

    }catch(err){
        return thunkApi.rejectWithValue(err.response.data);

    }
})

const authExtraReducers = (builder)=>{
    builder
    .addCase(login.pending,(state,action)=>{
     state.isLoading = true;
     state.error=null;
    })
    .addCase(login.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.isLoggedin = true;
        state.user = action.payload.user.username;
        state.userId = action.payload.user._id
    })
    .addCase(login.rejected,(state,action)=>{
        
        state.isLoading = false;
        state.isLoggedin = false;
        state.user = null;
        state.error = action.payload;
        
    })
    .addCase(signup.pending,(state,action)=>{
        state.isLoading = true;
        state.error=null;
    })
    .addCase(signup.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.isLoggedin = true;
        state.userId = action.payload.data._id,
        state.user = action.payload.data.username;
    })
    .addCase(signup.rejected,(state,action)=>{
        state.isLoading = false;
        state.isLoggedin = false;
        state.user = null;
        state.error = action.payload;
    })
    .addCase(authCheck.pending,(state,action)=>{
        state.isLoading = true;
        state.error=null;
    })
    .addCase(authCheck.fulfilled,(state,action)=>{
       state.isLoggedin = true;
       state.isLoading = false;
       state.user = action.payload.username;
       state.userId = action.payload._id;
    
    })
    .addCase(authCheck.rejected,(state,action)=>{
        state.isLoading = false;
        state.isLoggedin = false;
        state.user = null;
        
    })
    .addCase(logout.pending,(state,action)=>{
        state.isLoading = true;
        state.error=null;
    })
    .addCase(logout.rejected,(state,action)=>{
        state.isLoading=false;
        state.error = action.payload.error
    })
    .addCase(logout.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.isLoggedin = false;
        state.user = null;
        state.userId = null;
        state.error = null;
        localStorage.removeItem('token');
        // console.log(action.payload);
    })

}

export {authExtraReducers,login,signup,logout,authCheck}