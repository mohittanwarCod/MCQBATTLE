import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"
import { User } from "./models/user.models.js"
import { server } from "./app.js"

dotenv.config({
    path:'./.env'
})


connectDB()
.then(()=>{
    server.listen(process.env.PORT || 8000,()=>{
        // console.log(`Server listening on: ${process.env.PORT}`)
    })
}).catch((err)=>{
    console.log("MONGO db connection failed !!! ",err)})


app.get("/",(req,res)=>{
    res.send("Welcome");
})








