
import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,'email is required']
    },
    otp:{
        type:String,
        required:[true,'otp is required']
    }
},{timestamps:true})

export const Otp = mongoose.model('Otp',otpSchema)