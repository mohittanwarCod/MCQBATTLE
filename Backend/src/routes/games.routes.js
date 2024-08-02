import {Router} from "express"
import { createGame,listGame ,joinGame,acceptRequest, gameStart,submitAnswer,getParticipantRequest,rejectRequest,activeListGame,getParticipantStatus,getGameResult} from "../contorllers/game.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const gameRouter = Router();

gameRouter.route("/create").post(verifyJWT,createGame)
gameRouter.route("/").get(listGame)
gameRouter.route("/active").get(verifyJWT,activeListGame)
gameRouter.route("/join/:gameId").get(verifyJWT,joinGame)
gameRouter.route("/accept/:gameId").post(acceptRequest)
gameRouter.route("/reject/:gameId").post(verifyJWT,rejectRequest)
gameRouter.route("/start/:gameId").get(verifyJWT,gameStart)
gameRouter.route("/submit/:gameId").post(verifyJWT,submitAnswer)
gameRouter.route("/participants/status/:gameId").get(verifyJWT,getParticipantStatus)
gameRouter.route("/participantsRequest/:gameId").get(verifyJWT,getGameResult)
gameRouter.route("/result/:gameId").get(verifyJWT,getGameResult)


export {gameRouter} 


