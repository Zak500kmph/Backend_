import mongoose from "mongoose";
import { BACKEND_db } from "../constants.js";
const Database=async ()=>{
    try{
    const connectionInstance=await mongoose.connect(`${process.env.MONGODB_url}/${BACKEND_db}`)
    console.log(`Database is connected ${connectionInstance.connection.host}`)// to check where data base is connect(host)
    }catch(error){
    console.log(`ERROR HAS OCCURED zz : ${error}`)
    process.exit(1)
    }
}
export default Database