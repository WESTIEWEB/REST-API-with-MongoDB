"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminInstance = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    fullname: {
        type: String,
        required: [true, "fullname is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
    },
    address: {
        type: String,
    },
    firstName: {
        type: String,
    },
    salt: {
        type: String,
    },
    lastName: {
        type: String,
    },
    role: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: true,
    },
    phone: {
        type: String,
        required: [true, "phone number is required"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
    }
});
exports.AdminInstance = mongoose_1.default.model('Admin', userSchema);
//# sourceMappingURL=adminModel.js.map