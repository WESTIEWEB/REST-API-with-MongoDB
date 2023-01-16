import mongoose from "mongoose";

export const connectDB = async(url:string) => {
    return  mongoose.connect(url, ()=> {
        console.log("MngoDB connected Successfully...")
    })
}

  