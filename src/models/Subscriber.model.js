import mongoose from "mongoose";
import { User } from "./User.model.js";
const Subscription_Schema=mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId
        ,ref:User
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    }
},{timestamp:true})
const Subscription=mongoose.model("Subscription",Subscription_Schema)

export {Subscription} 