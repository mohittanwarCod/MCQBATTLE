import { Router } from "express";
import { createUser,loginUser,logoutUser,refreshAccessToken,authCheck} from "../contorllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/signup").post(createUser);

userRouter.route("/login").post(loginUser);
userRouter.route("/logout").get(verifyJWT,logoutUser);
userRouter.route("/profile").get(authCheck);





export {userRouter}