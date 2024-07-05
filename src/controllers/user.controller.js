import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ErrorHandler.js"
import {User} from "../models/User.model.js"
import {uploadToFirebase} from "../utils/uploadToFirebase.js"
const registerUser=asyncHandler( async (req,res)=>{
      
      const {username,email,fullName,password}=req.body
      

      if([username,email,fullName,password].some((field)=>field?.trim()==="")){throw new ApiError("All fields are compulsory",404)}

      if(!email.includes("@"))
            {
            throw new ApiError("Please Enter valid Email address",400)
      }

   const existedUser=User.findOne({
      $or : [{username} , {email}]
   })

   if(existedUser){
      throw new ApiError("User Already exist",409)
   }
  const avatarLocalFilePath= req.files?.avatar[0]?.path // avatar[0] it means avatar first property first 
  const coverImageLocalFilePath=req.files?.avatar[0]?.path
  if(!avatarLocalFilePath){throw new ApiError("Avatar is compulsory",400)}
   console.log(req.files)

  const avatar= await uploadToFirebase(avatarLocalFilePath,Avatar)

  const coverImage= await uploadToFirebase(coverImageLocalFilePath,CoverImage)


   if(!avatar){throw new ApiError("Avatr is not upload successfully",501)}

   User.create({
      fullName,
      avatar:avatar.url,
      coverImage:coverImage?.url,
      password,
      username,
      email
   })
      res.json({message:"ok"})
})

export {registerUser}