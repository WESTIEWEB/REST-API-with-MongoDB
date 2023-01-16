"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authVendor = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usersModel_1 = require("../model/usersModel");
const vendorModel_1 = require("../model/vendorModel");
//req.header or req.cookies are used for middleware
const auth = async (req, res, next) => {
    try {
        // const authorization = req.header.authorization
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log(token);
        if (!token)
            return res.status(401).json({
                message: "user not authorised, please signin"
            });
        //most developers structures authorization like 'Bearer yh64hjihdijjkh'
        // const token = authorization.slice(7, authorization.length)
        let verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({
                Error: "not a verified admin"
            });
        }
        const { email } = verified;
        const user = await usersModel_1.UserInstance.findOne({
            email: email
        });
        if (!user)
            return res.status(401).json({
                Error: "User does not exist ,please signup"
            });
        req.user = verified;
        next();
    }
    catch (error) {
        Error: "An error occoured";
    }
};
exports.auth = auth;
const authVendor = async (req, res, next) => {
    try {
        // const authorization = req.header.authorization
        const token = req.header('Authorization').replace('Bearer ', '');
        console.log(token);
        if (!token)
            return res.status(401).json({
                message: "user not authorised, please signin"
            });
        //most developers structures authorization like 'Bearer yh64hjihdijjkh'
        // const token = authorization.slice(7, authorization.length)
        let verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({
                Error: "not a verified admin"
            });
        }
        const { email } = verified;
        const vendor = await vendorModel_1.VendorInstance.findOne({
            email: email
        });
        if (!vendor)
            return res.status(401).json({
                Error: "User does not exist ,please signup"
            });
        req.vendor = verified;
        next();
    }
    catch (error) {
        Error: "An error occoured";
    }
};
exports.authVendor = authVendor;
//# sourceMappingURL=authorization.js.map