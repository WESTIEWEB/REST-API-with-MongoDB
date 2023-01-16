import mongoose,{Schema} from "mongoose";

export interface UserAttributes {
    fullname: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phone: string,
    salt: string,
    otp: number,
    gender: string,
    otp_expiry: Date,
    password: string;
    role: string;
    verified: boolean;
    _id: string;
}

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
    salt: {
        type:String,
    },
    gender: {
        type:String,
    },
    lastName: {
        type:String,
        trim:true,
    },
    otp: {
        type: Number,
    },
    otp_expiry: {
        type:Date,
    },
    role: {
        type:String,
    },
    verified: {
        type:Boolean,
        default: false,
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

export const UserInstance = mongoose.model<UserAttributes>('User',userSchema);