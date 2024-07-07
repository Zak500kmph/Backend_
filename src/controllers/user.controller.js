import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ErrorHandler.js"
import {User} from "../models/User.model.js"
import {uploadToFirebase} from "../utils/uploadToFirebase.js"
import { Api_res } from "../utils/Api_res.js";
import { refreshToken } from "firebase-admin/app";
const registerUser=asyncHandler( async (req,res)=>{
      
      const {username,email,fullName,password}=req.body
      

      if([username,email,fullName,password].some((field)=>field?.trim()==="")){throw new ApiError("All fields are compulsory",404)}

      if(!email.includes("@"))
            {
            throw new ApiError("Please Enter valid Email address",400)
      }

   const existedUser=await User.findOne({
      $or : [{username} , {email}]
   })

   if(existedUser){
      throw new ApiError("User Already exist",409)
   }
  const avatarLocalFilePath= req.files?.avatar[0]?.path // avatar[0] it means avatar first property first 

  let coverImageLocalFilePath= null // avatar[0] it means avatar first property first 

if(!(req.files.coverImage[0]>0)){
   coverImageLocalFilePath=req.files.coverImage[0].path
}
  
  
  
  if(!avatarLocalFilePath){throw new ApiError("Avatar is compulsory",400)}
   
   const firebasefilepath_avatar=req.files.avatar[0].originalname
   const firebasefilepath_coverImage=req.files.coverImage[0].originalname
   const Avatar= await uploadToFirebase(avatarLocalFilePath,firebasefilepath_avatar)
   const CoverImage= await uploadToFirebase(coverImageLocalFilePath,firebasefilepath_coverImage)
   
   if(!Avatar){throw new ApiError("Avatr is not upload successfully",501)}
   
   let userDetails= await User.create({
      fullName,
      avatar:Avatar,
      coverImage:CoverImage || "",
      password,
      username,
      email,
      refreshToken:User.generateRefreshToken
   })
   const createdUser=await User.findById(userDetails._id)
   
   if(!createdUser){throw new ApiError("Server mistake ",500 )}
   res.status(200).json(
      new Api_res(200,createdUser,"!!!!Congratulation Successfully regitered")
   )
})

export {registerUser}