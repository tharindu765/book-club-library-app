import mongoose from "mongoose";

export const connectDB = async() => {
    try{
        await mongoose.connect(process.env.DB_URL as string)
        console.log("MongoDB connected")
    }catch{
        console.error("MongoDB connection error")
        process.exit(1)
    }
}