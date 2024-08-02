import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../constants/constant";
import { act } from "react";

const create = createAsyncThunk(`mcqs/new`,async (mcqData,thunkApi)=>{
    try{
        
        const response = await axios.post(`${BASE_URL}/api/v1/question/new`,mcqData,{
            httpOnly:true,
        withCredentials:true
        });
        // // console.log(response.data.data);
        return response.data.data;
    }catch(err){
        return thunkApi.rejectWithValue(err.response.data)
    
    }
})

const getMcq = createAsyncThunk(`mcqs/get`,async (thunkApi)=>{

    try{
         const response = await axios.get(`${BASE_URL}/api/v1/question`,{
            withCredentials:true,
         })

         
         return response.data.data;
    }catch(err){
         return thunkApi.rejectWithValue(err.response.data)
    }
})
const updateMcq = createAsyncThunk(`mcqs/update`,async ({mcqData,questionId},thunkApi)=>{
    try{
         // console.log(typeof(questionId));
        const response = await axios.put(`${BASE_URL}/api/v1/question/${questionId}`,{...mcqData},{
          withCredentials:true,
          httpOnly:true,
          headers: {    
            'Content-Type': 'application/json',
          },

        }
        
        )

        // console.log(response);
        return response.data.data;
   }catch(err){
       // console.log(err);
        return thunkApi.rejectWithValue(err.response.data)
   }
})

const deleteMcq = createAsyncThunk('mcq/delete',async (questionId,thunkApi)=>{
    try{
        // console.log("********************************************************************",questionId)
        questionId = questionId.toString();
   
    const response = await axios.delete(`${BASE_URL}/api/v1/question/${questionId}`,{
        withCredentials:true,
        httpOnly:true,
        headers:{
            'Content-Type': 'application/json',
        }
    })
      
    return response.data.data
} catch(err){
    // console.log(err)
}
})
const mcqExtraReducer = (builer)=>{
    builer
    .addCase(create.fulfilled,(state,action)=>{
        state.mcqs = [...state.mcqs,action.payload]
    })
    .addCase(create.rejected,(state,action)=>{
        // console.log(action.payload);
      
    })
    .addCase(getMcq.pending,(state,action)=>{
       
    })
    .addCase(getMcq.fulfilled,(state,action)=>{
      
        state.mcqs = action.payload;
        
    })
    .addCase(updateMcq.pending,(state,action)=>{
        // console.log("pending");
        // console.log(Date())
}) 
.addCase(updateMcq.rejected,(state,action)=>{
        // console.log("rejected");
        // console.log(action.payload);
    })
    .addCase(updateMcq.fulfilled,(state,action)=>{
        // console.log("fulfilled");
        // console.log(action.payload);
    })
    .addCase(deleteMcq.fulfilled,(state,action)=>{
        // console.log(action.payload )
          state.mcqs = state.mcqs.filter(mcq=>(
            mcq._id.toString()!==action.payload._id.toString()
          ))
    })
}

export {mcqExtraReducer,create,getMcq,updateMcq,deleteMcq}