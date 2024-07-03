import { asyncHandler } from "../utils/asyncHandler.js";


const registerUser=asyncHandler(async (req,res)=>{
      res.status(200).json({message:"Your request is accepted and user is Registered"})
})

export {registerUser}