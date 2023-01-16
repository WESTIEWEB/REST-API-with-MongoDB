import mongoose from "mongoose";
const connectDB = async(url) => {
    return  mongoose.connect(url, ()=> {
        console.log("MngoDB connected Successfully...")
    })
}

export default connectDB;