
import mongoose from "mongoose";

const presentationSlideSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required']
    },
    description: {
        type: String,
        required: [true, 'description is required']
    },
    category: {
        type: String,
        required: [true, 'category is required']
    },
    drivelink: {
        type: String,
        default: ''
    },
    slideType:{
        type:String,
        required:[true,'slide type is required']
    },
    speakerName:{
        type:String,
        required:[true,'speaker name is required']
    },
    speakerDesignation:{
        type:String,
        required:[true,'speaker designation is required']
    },
    speakerOrg:{
        type:String,
        required:[true,'speaker organization is required']
    },
    location:{
        type:String,
        required:[true,'location is required']
    },
    date:{
        type:Date,
        required:[true,'date is required']
    },
    time:{
        type:String,
        required:[true,'time is required']
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    thumbnail: {
        type: String,
        default: ''
    }
}, { timestamps: true })

export const PresentationSlide = mongoose.model('Slide', presentationSlideSchema)