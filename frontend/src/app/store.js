import { configureStore } from "@reduxjs/toolkit";
import authReducer  from "../features/auth/authSlice";
import gameReducer from "../features/game/gameSlice";
import mcqReducer from '../features/mcqs/mcqSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        games: gameReducer,
        mcqs: mcqReducer, 
      
    },
})
export {store};