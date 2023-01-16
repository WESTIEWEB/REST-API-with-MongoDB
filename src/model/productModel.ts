import { ObjectId } from "mongodb";
import mongoose,{Schema} from "mongoose";

export interface ProductAttributes{
    countInstock:number;
	image:string;
	brand:string;
	category:string;
	description:string;
	price:number;
    numReviews:number;
	countInStock:number;
	rating:number;
    authorId:ObjectId;
    name:string;
}


const productSchema = new Schema<ProductAttributes>({
    image:{
        type:String,
        required:true
    },
    name:{
        type:String,
        trim:true,
        required:true
    },
    authorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    brand: {
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    countInStock:{
        type:Number,
        default:0,
    },
    rating:{
        type:Number,
        required:true,
        default:0,
    },
    numReviews: {
        type:Number,
        default:0,
    }
})

export const ProductInstance = mongoose.model<ProductAttributes>('Product', productSchema)