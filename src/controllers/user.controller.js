import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ErrorHandler.js"
import {User} from "../models/User.model.js"
import {uploadToFirebase} from "../utils/uploadToFirebase.js"
import { Api_res } from "../utils/Api_res.js";
import { refreshToken } from "firebase-admin/app";
import jwt from "jsonwebtoken"
import { Subscription } from "../models/Subscriber.model.js";
import { UserInfo } from "firebase-admin/auth";
import mongoose from "mongoose";


const generateRefreshAccessToken=async (userId)=>{
   const user=await User.findById(userId)
   const refreshToken=await user.generateRefreshToken()
   const accsessToken=await user.generateAccesToken()
   user.refreshToken=refreshToken
   await user.save({validateBeforeSave:false}) //this is because when we save all the required field in user model kick in and it give error enter like enter password,email
   return {accsessToken,refreshToken}
}
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
   
   const firebasefilepath_avatar=req.files?.avatar[0].originalname
   const firebasefilepath_coverImage=req.files?.coverImage[0].originalname
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

   const createdUser=await User.findById(userDetails._id).select(" -password -refreshToken")
   
   if(!createdUser){throw new ApiError("Server mistake ",500 )}
   res.status(200).json(
      new Api_res(200,createdUser,"!!!!Congratulation Successfully regitered")
   )
})
const loginUser=asyncHandler(async (req,res)=>{
   const {password,username,email}=req.body

   
   if(!(username||email)){throw new ApiError("Please Enter Username or Email",400)}
const user= await User.findOne({
   $or:[{email},{username}]
})
if(!user){
   throw new ApiError("Incorrect Username or email",404)
}
const passwordcorrect = await user.isPasswordCorrect(password)
if(!passwordcorrect){throw new ApiError(" invalid user's Credential ",400) }
 const {accsessToken,refreshToken}=await generateRefreshAccessToken(user._id)

 const options={
   httpOnly:true,
   secure:true
 }
user.refreshToken=refreshToken;
user.password= ""
res.status(200).cookie("refreshToken",refreshToken,options).cookie("accessToken",accsessToken,options).json(new Api_res(200,
   {
      user,
      accsessToken,
      refreshToken
   }
   ,
   "User Log In Successfully"
))

})
const logoutUser=asyncHandler(async (req,res)=>{
   //  const newUser=await User.findById(req.user._id)
   //  newUser.refreshToken=""
   //  newUser.save({validateBeforeSave:false})  Another Method

   User.findByIdAndUpdate(req._id,{
      $set:{
         refreshToken:undefined
      }
   },{
      new:true
   })
    const options={
      "httpOnly":true,
      "secure": true
    }
    res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new Api_res(200,{},"User logged out"))
})
const RefreshAccessToken=asyncHandler(async (req,res)=>{
   
 const refreshTokenOld=req.cookies?.refreshToken|| req.body.refreshToken ;
 if(!refreshTokenOld){throw new ApiError("invalid request",400)}
const info=jwt.verify(refreshTokenOld,process.env.REFRESH_TOKEN_SECRET);
if(!info){throw new ApiError("invalid token",400)}
const {accsessToken,refreshToken}=await generateRefreshAccessToken(info.id);
 const options={
   httpOnly:true,
   secure:true
 }
 res.status(200).cookie("accessToken",accsessToken,options).cookie("refreshToken",refreshToken,options).json(new Api_res(200,{accsessToken,refreshToken},"Generation of access and refresh token is successfull"))
})
const changeUserCurrentPassword=asyncHandler(async(req,res)=>{
   const {newPassword,oldPassword}=req.body
   
   if(!(newPassword||oldPassword)){
      throw new ApiError("Both OLD and NEW password are required",404)

   }
const user=await User.findById(req.user._id)

const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)
 if(!isPasswordCorrect)
   {throw new ApiError("Enter correct old password",400)}

 user.password=newPassword

 await user.save({validateBeforeSave:false})


return res.status(200).json({"message":"password change successfully"})
})
const getUser=asyncHandler(async(req,res)=>{
   res.status(200).json(new Api_res(200,req.user,"User fecthed successfully !!"))
})
const updateUserCredential=asyncHandler(async (req,res)=>{
   const user=req.user
   const {username,fullName,email}=req.body
   if(username){
     user.username=username;
   }
   if(fullName){
   user.fullName=fullName;
   }
   if(email){

      user.email=email;
   }
   await user.save({validateBeforeSave:false})
   res.status(200).json(
      new Api_res(200,{},"Credentiall successfully changed")
   )
})
const changeUserAvatar=asyncHandler(async (req,res)=>{
   const newAvatar=req.file.path
   const Firebasefilepath_avatar=req.file.originalname 
   const avatar=await uploadToFirebase(newAvatar,Firebasefilepath_avatar)
   await User.findByIdAndUpdate(req.user._id,{
      $set:{
         avatar
      }
   })
   res.status(200).json({"message":"Avatar is successfully cahnged!!!!!!!!!!!!"})
})
const updateUserCoverImage=asyncHandler(async (req,res)=>{
   console.log("zero")
   const coverImage=req.file.path
   const coverImageFirebasePath=req.file.originalname

   const coverImageNew=await uploadToFirebase(coverImage,coverImageFirebasePath);
   await User.findByIdAndUpdate(req.user._id,{
      $set:{
         coverImage
      }
   })
  res.status(200).json({"message":"CoverImage is Successfully uploaded"})
})
const getUserInfo=asyncHandler(async (req,res)=>{
   const {username}=req.params
   if(!username?.trim()){

      throw new ApiError("Invalid Request",404)
   }
   console.log(username.toLowerCase())
  const channel=await User.aggregate([
   {
      $match:{
         username:username
      }
   },
   {
      $lookup:{
         from:"subscriptions", // people who subscribe the channel
         localField:"_id",    // here in subscription both channel and subcriber is User so the also conatin _id field
         foreignField:"channel" // if we select the particular channel and count its occurence it will give the count of user as channel is same but different subscriber
         ,as:"subscribers" 
      }
   },
   {
      $lookup:{
         from:"subscriptions",
         localField:"_id",
         foreignField:"subscriber", // here consider subcriber same all the documnet is come with subscriber and channel detail 
         as :"toSubscribe"
      },
   },
   {
         $addFields:{
            channelsSubscribed:{ $size:"$toSubscribe" },
            channelsubscribers:{ $size:"$subscribers" },
            isSubscribe:{
               $cond:{
                  if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                  then:true,
                  else:false
               }
            }
         }
   },
   {
      $project:{
         username:1,
         email:1,
         coverImage:1,
         avatar:1,
         channelsSubscribed:1,
         channelsubscribers:1,
         isSubscribe:1



      }
   }

  ])
  if(channel.length==0){
   throw new ApiError("Invalid User",404)
}
res.status(200).json( new Api_res(200,channel[0],"the info of user"))
})
const getUserhistory=asyncHandler(async (req,res)=>{

const History=await User.aggregate([
   {
      $match: 
      {
         _id:new mongoose.Types.ObjectId(req.user._id)

      }
   },
   {
      $lookup:{
         from:"videos",
         foreignField:"_id",
         localField:"watchHistory",
         as:"watchHistory",
         pipeline:[
            {
               $lookup:{
                  from:"User",
                  localField:"owner",
                  foreignField:"_id",
                  as:"owner",
                  pipeline:[
                     {
                        $project:{
                           username:1,
                           email:1,
                           fullName:1,
                           avatar:1
                        }
                     }
                  ],
               
                    
                  
                  }
               },
               {
                  $addFields:{
                     userInfo:{
                        $first:"$owner"
                     }}
               }
         ]
      }
   }
])
return res.status(200).json(new Api_res(200,History[0].watchHistory,"User History"))

})
export {registerUser
        ,loginUser
        ,logoutUser
        ,RefreshAccessToken,
        changeUserCurrentPassword,
        getUser,
        updateUserCredential,
        changeUserAvatar,
        updateUserCoverImage,
        getUserInfo,
        getUserhistory
      }