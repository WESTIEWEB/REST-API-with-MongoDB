import mongoose, {Schema} from "mongoose";
import { type } from 'os';

export interface VendorAttributes {
    name:string;
    pincode:string;
    profileName:string;
    profileImage:string;
    email:string;
    password:string;
    salt:string;
    phone:string;
    role:string;
    rating:number;
    id:string;
    serviceAvailability:boolean;
    address:string;
}

const vendorSchema = new Schema({
    name:{
        type:String,
        trim:true,
        require:[true, "fullname is required"]
    },
    profileName:{
        type:String,
        trim:true,
        require:[true, "fullname is required"]
    },
    pincode:{
        type:String,
        trim:true,
        require:[true, "pincode is required"]
    },
    profileImage:{
        type:String,
    },
    id:{
        type:mongoose.Schema.Types.ObjectId
    },
    email:{
        type:String,
        require:[true, "email is required"]
    },
    password:{
        type:String,
        trim:true,
        require:[true, "password is required"]
    },
    salt:{
        type:String,
    },
    phone:{
        type:String,
        require:[true, "phone number is required"]
    },
    role:{
        type:String,
        trim:true,
    },
    rating:{
        type:Number,
    },
    serviceAvailability:{
        type:Boolean,
        default:true,
    },
    address:{
        type:String,
        trim:true,
    },
})

export const VendorInstance = mongoose.model<VendorAttributes>('Vendor', vendorSchema);