import {mongoose} from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB =async ()=>{
  try{
    const connectInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log("Connected to MongoDB",connectInstance.connection.host);
  }catch(err){
    console.log("MONGODB CONNECTION FAILED", err);
    process.exit(1)
  }
}

export default connectDB; 

