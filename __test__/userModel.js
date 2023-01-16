const mongoose = require('mongoose');

const {Schema} = mongoose;

const userSchema = new Schema<UserAttributes>({
    fullname:{
        type: String,
        trim:true,
        required:[true, "fullname is required"]
    },
    email: {
        type:String,
        required:[true, "email is required"],
    },
    address: {
        type:String,
    },
    firstName: {
        type:String,
        trim:true,
    },
    gender: {
        type:String,
    },
    lastName: {
        type:String,
        trim:true,
    },
    role: {
        type:String,
    },
    phone: {
        type:String,
        required:[true, "phone number is required"],
    },
    password: {
        type:String,
        required:[true, "password is required"],
    }
})

exports.UserInstance = mongoose.model<UserAttributes>('User',userSchema);