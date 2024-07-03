import { asyncHandler } from "../utils/asyncHandler.js";


const registerUser=asyncHandler( (req,res)=>{
      res.status(200).json({message:"Your request is accepted and user is Registered"})
})


export {registerUser}