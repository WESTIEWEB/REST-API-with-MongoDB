import mongoose,{Schema} from "mongoose";

export interface UserAttributes {
    fullname: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phone: string,
    salt: string,
    password: string;
    role: string;
    verified: boolean;
}

const userSchema = new Schema({
    fullname:{
        type: String,
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
    },
    salt: {
        type:String,
    },
    lastName: {
        type:String,
    },
    role: {
        type:String,
    },
    verified: {
        type:Boolean,
        default: true,
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

export const AdminInstance = mongoose.model<UserAttributes>('Admin',userSchema);