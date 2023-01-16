"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.verifySignature = exports.GenerateSignature = exports.GeneratePassword = exports.GenerateSalt = exports.option = exports.loginSchema = exports.updateProductSchema = exports.productSchema = exports.rateProductSchema = exports.updateVendorSchema = exports.vendorSchema = exports.adminSchema = exports.updateUserSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../config/index");
exports.registerSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    address: joi_1.default.string(),
    gender: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    fullname: joi_1.default.string().min(6).required(),
    // confirm_password: Joi.ref('password')
    confirm_password: joi_1.default.any().equal(joi_1.default.ref('password')).required().label('Confirm password').messages({ 'any.only': '{{#label}} does not match' })
});
exports.updateUserSchema = joi_1.default.object().keys({
    firstName: joi_1.default.string(),
    lastName: joi_1.default.string(),
    phone: joi_1.default.string(),
    address: joi_1.default.string(),
});
exports.adminSchema = joi_1.default.object().keys({
    fullname: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: joi_1.default.string().required(),
});
exports.vendorSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    restaurantName: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: joi_1.default.string().required(),
    pincode: joi_1.default.string().required(),
});
exports.updateVendorSchema = joi_1.default.object().keys({
    name: joi_1.default.string(),
    phone: joi_1.default.string(),
    address: joi_1.default.string(),
    coverImage: joi_1.default.string(),
});
exports.rateProductSchema = joi_1.default.object().keys({
    rating: joi_1.default.string().min(0)
});
exports.productSchema = joi_1.default.object().keys({
    brand: joi_1.default.string().max(225).required(),
    name: joi_1.default.string().min(5).max(225).required(),
    description: joi_1.default.string().max(225).required(),
    category: joi_1.default.string().max(225).required(),
    countInStock: joi_1.default.number().min(0).max(225).required(),
    numReviews: joi_1.default.string().min(0),
    price: joi_1.default.number().min(0).required(),
});
exports.updateProductSchema = joi_1.default.object().keys({
    brand: joi_1.default.string().max(225),
    description: joi_1.default.string().max(225),
    category: joi_1.default.string().max(225),
    countInStock: joi_1.default.number().min(0),
    numReviews: joi_1.default.string().min(0),
    price: joi_1.default.number().min(0),
});
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});
exports.option = {
    abortEarly: false,
    errors: {
        wrap: {
            label: ''
        }
    }
};
const GenerateSalt = async () => {
    return await bcrypt_1.default.genSalt();
};
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = async (password, salt) => {
    return await bcrypt_1.default.hash(password, salt);
};
exports.GeneratePassword = GeneratePassword;
const GenerateSignature = async (payload) => {
    return jsonwebtoken_1.default.sign(payload, index_1.App_Secret, { expiresIn: '1w' });
};
exports.GenerateSignature = GenerateSignature;
const verifySignature = async (signature) => {
    return jsonwebtoken_1.default.verify(signature, index_1.App_Secret);
};
exports.verifySignature = verifySignature;
const validatePassword = async (inputPWD, savedPWD, salt) => {
    return await (0, exports.GeneratePassword)(inputPWD, salt) === savedPWD;
};
exports.validatePassword = validatePassword;
//# sourceMappingURL=utils.js.map