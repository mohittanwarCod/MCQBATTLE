import { createSlice ,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import { mcqExtraReducer,create,getMcq,deleteMcq } from "../../services/mcqServices";
const initialState = {
   mcqs:[],
   question:null,
   options:[],
   answer:null,
   userId:null
}

export const mcqSlice = createSlice({
    name:'mcq',
    initialState,
    reducers:{
    },
    extraReducers: mcqExtraReducer
})


export {create,getMcq,deleteMcq}
export default mcqSlice.reducer;