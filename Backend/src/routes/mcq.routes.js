import { createMcq,listAllMcqs,deleteMcq,updateMcq} from "../contorllers/mcq.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";


const check = (req,res)=>{
    try {
        res.status(200).json({message:"Success"});
    } catch (error) {
        console.log(error);
    }
}
const mcqRouter = Router();

mcqRouter.route("/new").post(verifyJWT,createMcq);
mcqRouter.route("/").get(listAllMcqs);
mcqRouter.route("/:id").delete(verifyJWT,deleteMcq);
mcqRouter.route("/:id").put(verifyJWT,updateMcq);


export {mcqRouter};
