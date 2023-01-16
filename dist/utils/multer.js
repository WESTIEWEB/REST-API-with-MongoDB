"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_API_KEY,
    api_secret: process.env.Cloud_API_SECRET,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: "week9Abulms"
        };
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
//# sourceMappingURL=multer.js.map