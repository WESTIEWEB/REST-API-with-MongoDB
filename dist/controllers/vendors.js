"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateVendorProfile = exports.vendorProfile = exports.createProduct = exports.vendorLogin = void 0;
const utils_1 = require("../utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const vendorModel_1 = require("../model/vendorModel");
const productModel_1 = require("../model/productModel");
/**
 *
 * @param req
 * @param res
 * @param next
 *
 *  CREATE VENDOR, VENDORLOGIN,
 */
/** ============================== Vendor Login ============================== **/
const vendorLogin = async (req, res, next) => {
    try {
        const { email, password, } = req.body;
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.option);
        const { error } = validateResult;
        //    console.log(error)
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        // check if user exist
        const Vendor = await vendorModel_1.VendorInstance.findOne({
            email: email
        }).select({ 'password': 0, 'salt': 0, 'products': 0, 'address': 0 });
        if (Vendor) {
            const validation = await (0, utils_1.validatePassword)(password, Vendor.password, Vendor.salt);
            if (validation) {
                let signature = jsonwebtoken_1.default.sign({
                    email: Vendor.email,
                    role: Vendor.role,
                }, process.env.JWT_SECRET, { expiresIn: '2w' });
                return res.status(200).json({
                    message: "succesfully logged in",
                    signature,
                    Vendor
                });
            }
            return res.status(400).json({
                Error: "wrong email or password"
            });
        }
        return res.status(400).json({
            message: "not authorized"
        });
    }
    catch (error) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/login"
        });
    }
};
exports.vendorLogin = vendorLogin;
/**
* =========================== Vendor Add Product ================================
*/
const createProduct = async (req, res) => {
    try {
        const { email } = req.vendor;
        const { name, image, price, ProductType, readyTime, description, category, } = req.body;
        const validateResult = utils_1.productSchema.validate(req.body, utils_1.option);
        const { error } = validateResult;
        //    console.log(error)
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        const isExistVendor = await vendorModel_1.VendorInstance.findOne({
            email: email,
        });
        if (isExistVendor) {
            const Product = await productModel_1.ProductInstance.create({
                name,
                image: req.file.path,
                price,
                ProductType,
                readyTime,
                description,
                category,
                rating: 0,
                vendorId: isExistVendor.id
            });
            return res.status(200).json({
                message: "successfully created Product",
                Product,
            });
        }
        return res.status(400).json({
            message: "not authorised"
        });
    }
    catch (error) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/create-Product"
        });
    }
};
exports.createProduct = createProduct;
/**
* =========================== Get Vendor Profile ================================
*/
const vendorProfile = async (req, res) => {
    try {
        const { email } = req.vendor;
        //check if vendor exist
        const Vendor = await vendorModel_1.VendorInstance.findOne({ email: email }).select({
            vendorId: 0
        });
        return res.status(200).json({
            message: "Vendor successfully fetched",
            Vendor,
        });
    }
    catch (error) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/create-Product"
        });
    }
};
exports.vendorProfile = vendorProfile;
/**
* ===========================Vendor Delete Product ================================
*/
const updateVendorProfile = async (req, res) => {
    try {
        const { email } = req.vendor;
        const { name, coverImage, address, phone } = req.body;
        const { error } = utils_1.updateVendorSchema.validate(req.body, utils_1.option);
        if (error)
            return res.status(400).json({ Error: error.details[0].message });
        const Vendor = await vendorModel_1.VendorInstance.findOne({
            email: email
        });
        if (!Vendor)
            return res.status(401).json({ Error: "Not authorized to update profile " });
        const updateVendor = await vendorModel_1.VendorInstance.findOneAndUpdate({
            email: email
        }, req.body, {
            new: true
        });
        if (updateVendor) {
            const vendor = await vendorModel_1.VendorInstance.findOne({
                email: email,
                // attributes: ["firstName","coverImage","lastName","email","address","phone","verified","role"]
            }).select({
                'fullName': 1, 'phone': 1, 'email': 0
            });
            return res.status(200).json({
                message: "profile successfully update",
                vendor,
            });
        }
        // return res.status(200).json({
        //    message: "profile successfully update",
        //    updateUser,
        // })
    }
    catch (error) {
        return res.status(500).json({
            err: "Internal error occoured",
            route: "patch/vendors/update-vendor"
        });
    }
};
exports.updateVendorProfile = updateVendorProfile;
/**
* =========================== Vendor Delete Product ================================
*/
const deleteProduct = async (req, res) => {
    try {
        const { email } = req.vendor;
        const productId = req.params.productId;
        const Vendor = await vendorModel_1.VendorInstance.findOne({
            email: email,
        });
        //check if vendor exist
        if (Vendor) {
            const deletedProduct = await productModel_1.ProductInstance.findByIdAndDelete({
                _id: productId
            });
            // const deletedProduct = 
            return res.status(200).json({
                message: "Deleted successfully",
                deletedProduct,
            });
        }
        return res.status(400).json({
            message: "unauthorized",
            route: "/vendors/delete-Product/"
        });
    }
    catch (error) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/delete-Product"
        });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=vendors.js.map