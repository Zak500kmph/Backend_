import mongoose from "mongoose";
import { BACKEND_db } from "../constants.js";
const Database=async ()=>{
    try{
    const connectionInstance=await mongoose.connect(`${process.env.MONGODB_url}/${BACKEND_db}`)
    console.log(`Database is connected ${connectionInstance}`)
    }catch(error){
    console.log(`ERROR HAS OCCURED zz : ${error}`)
    process.send(1)
    }
}
export default Database