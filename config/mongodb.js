import mongoose from "mongoose";

export async function mongoconnect(){
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI_PROD)
        console.log("Connected to mongodb")
    } catch (error) {
        console.log("Cannot connect to mongodb")
        console.log(error)
        process.exit(1)
    }
}