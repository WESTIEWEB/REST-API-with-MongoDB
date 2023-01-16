import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.Cloud_Name , 
    api_key: process.env.Cloud_API_KEY, 
    api_secret: process.env.Cloud_API_SECRET,
  });

const storage = new CloudinaryStorage({
    cloudinary,
    params: async(req, file)=>{
        return {
            folder:"week9Abulms"
        }
    },

});

export const upload = multer({storage:storage})