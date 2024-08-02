import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { BASE_URL } from "../constants/constant"
import { useSelector } from "react-redux"



const listGames = createAsyncThunk("games/list",async (thunkApi)=>{
   try {
     const response = await axios.get(`${BASE_URL}/api/v1/games`);
     
     return response.data.data;
     
   } catch (error) {
    thunkApi.rejectWithValue(response.data.message);
   }
})

const getParticipantsRequest = createAsyncThunk("game/participantsRequest",async (gameId,thunkApi)=>{
    
    try{
           const response = await axios.get(`${BASE_URL}/api/v1/games/participantsRequest/${gameId}`,{
            withCredentials:true,
            headers:{
                'Content-Type': 'application/json',
            }
           
           })
           

           return response.data.data
    }catch(e){
        thunkApi.rejectWithValue(response.data.message)
    }
})


const createNewGame =createAsyncThunk("game/create",async(gameData,thunkApi)=>{
    try{
        const response = await axios.post(`${BASE_URL}/api/v1/games/create`,gameData,{
             withCredentials:true,
             httpOnly:true,
             headers:{
                 'Content-Type': 'application/json',
             }
        })


        return response.data.data;
    }catch(e){
        return (e?.data?.message);
    }
})


const gameExtraReducers = (builder)=>{
    builder.addCase(listGames.pending, (state,action)=>{
        state.isLoading = true;
    })
    builder.addCase(listGames.fulfilled, (state,action)=>{
        state.isLoading = false;
        state.waitingGames = action.payload.filter(game=>game.status==="waiting");
        state.completedGames = action.payload.filter(game=>game.status==="completed");
        // console.log(state);
    })
    builder.addCase(listGames.rejected, (state,action)=>{
        state.isLoading =false;
        state.error = action.payload;
        
    
    })
    builder.addCase(getParticipantsRequest.pending,(state,action)=>{
        state.isLoading = true;
    })
    builder.addCase(getParticipantsRequest.rejected,(state,action)=>{
        state.isLoading = false;
        state.error = action.payload;
    })
    builder.addCase(getParticipantsRequest.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.participantsRequest = action.payload;
        
        
       
    })
    builder.addCase(createNewGame.pending,(state,action)=>{
        state.isLoading = true;
    })
    builder.addCase(createNewGame.rejected,(state,action)=>{
        state.isLoading = false;
        state.error = action.payload;
    })
    builder.addCase(createNewGame.fulfilled,(state,action)=>{
        state.isLoading = false;
       
        state.error = null;
    })
    
    
}

export {listGames,getParticipantsRequest,gameExtraReducers,createNewGame}


