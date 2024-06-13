import mongoose from "mongoose"
import mongooseAggregatePaginate from "mongooose-aggregate-paginate-v2"

const video=mongoose.Schema({
    videoFile:{
        type:String,
        required:true}
    ,thumbnail:{
        type:String,
        required:true}
    ,owner:{type:mongoose.Schema.Types.objectId
        ,ref:"User"},
    title:{
        type:String,
        required:[true,"please enter title"],
    },
    description:{
        type:String,
        required:[true,"decription is compulsory"]
    },
    duration:{
        type:Number,//cloud computes it from video we provide
        reuired:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:false
    }


},{timestamps:true})
video.plugin(mongooseAggregatePaginate)  
export const Video=mongoose.model("Video",video)