import { createSlice } from "@reduxjs/toolkit";
import { gameExtraReducers, listGames,getParticipantsRequest,createNewGame } from "../../services/gameServices";
import { act } from "react";
const initialState = {
  waitingGames:[],
  completedGames:[],
  isLoading:false,
  error:null,
  participantsRequest:[],
  currentMcq:{},
  gameRemTime:{
    seconds:0,
    minutes:0

  },
  isGameStarted:false,
  isParticipant:false,
  
}

export const gameSlice = createSlice({
    name:'games',
    initialState,
    reducers:{
        addGame: (state,action)=>{
            console.log("action paylod",action.payload)
           state.waitingGames = [...state.waitingGames,action.payload]
        },
        setCurrentMcq: (state,action)=>{
            state.currentMcq = action.payload;
            console.log(action.payload);
        },
        setGameRemTime: (state,action)=>{
           
            state.gameRemTime.seconds = action.payload.seconds;
            state.gameRemTime.minutes = action.payload.minutes;
        },
    setIsGameStarted:(state,action)=>{
        console.log(action.payload);
        state.isGameStarted = action.payload;
    },
    setIsParticpant:(state,action)=>{
        state.isParticipant = action.payload;
    }

    },
    extraReducers:gameExtraReducers,

})
export {listGames,getParticipantsRequest,createNewGame}
export const {addGame,setCurrentMcq,setGameRemTime,setIsGameStarted,setIsParticpant} = gameSlice.actions;
export  default gameSlice.reducer;