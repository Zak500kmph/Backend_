import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongooose-aggregate-paginate-v2"
const Users=mongoose.Schema({
     username:{
        type:String,
        required:true,
        unique:[true,"please Enter the unique username"]
        
     },
     email:{
        type:String,
        required:true,
        unique:true,
     },
     fullName:{
        type:String,
        required:true,
        unique:true
     },
     avtar:{
        type:String,//comes from cloud
        required:true
     },
     coverImage:{
        type:String // comes from cloud
     },
     password:{
        type:String,
        required:[true,"Please Enter unique password"]
        ,unique:true
     },
     refreshToken:{
        type:String,
        required:true
     },
     watchHistory:
        [
            {
            type:mongoose.Schema.Types.ObjectId,
             ref:"Video"
            }
        ]
        
        },{timestamps:true})
Users.plugin(mongooseAggregatePaginate)  
export const User=mongoose.model("User",Users)