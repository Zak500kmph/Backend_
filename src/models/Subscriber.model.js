import mongoose from "mongoose";
const Subscription_Schema=mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId
        ,ref:User
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    }
},{timestamp:tue})
const Subscription=mongoose.model("Subscription",Subscription_Schema)

export {Subscription} 