import { ApiError } from "../utils/ErrorHandler.js";
import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken"

const verifyJWT=async (req,_,next)=>{
    try {
        const token =req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","")
        if(!token){throw new ApiError("Unauthorized Request",400)}
        const info=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)// it will decode the given token and find the username,_id,etc which we give while generating the token 
        const user = await User.findById(info?.id).select("-password -refreshToken")
        if(!user){
            new ApiError("Invalid access token (Token ne kaam nhi kiya) ",401)
    
        }
        req.user=user
        next()
    
    } catch (err) {
        throw new ApiError(err.message,400)
    }
}
export {verifyJWT}
