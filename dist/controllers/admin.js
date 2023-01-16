"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVendor = exports.createSuperAdmin = exports.createAdmin = void 0;
const utils_1 = require("../utils");
const adminModel_1 = require("../model/adminModel");
const vendorModel_1 = require("../model/vendorModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// /*==============================Register Admin======================*/
const createAdmin = async (req, res) => {
    try {
        const { role } = req.user;
        const { email, phone, password, address, fullname } = req.body;
        const validateResult = utils_1.adminSchema.validate(req.body, utils_1.option);
        const { error } = validateResult;
        //    console.log(error)
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        //generate salt and hash pwd
        const salt = await (0, utils_1.GenerateSalt)();
        const adminPassword = await (0, utils_1.GeneratePassword)(password, salt);
        const superAdmin = await adminModel_1.AdminInstance.findOne({
            role: role
        });
        // if(Admin.email === email) return res.status(400).json({ message: "Admin already exist, please login"})
        // if(Admin.phone === phone) return res.status(400).json({ message: "Phone number already exist, please login"})
        // check if Amin exist
        if (superAdmin.role === 'superAdmin') {
            const adminEmail = await adminModel_1.AdminInstance.findOne({
                where: { email: email }
            });
            const adminPhone = await adminModel_1.AdminInstance.findOne({
                where: { phone: phone }
            });
            if (adminEmail === email && adminPhone === phone)
                return res.status(400).json({ message: "Email or Phone number already exist" });
            if (!adminEmail && !adminPhone) {
                const admin = await adminModel_1.AdminInstance.create({
                    email,
                    password: adminPassword,
                    fullname,
                    firstName: '',
                    lastName: '',
                    salt,
                    address,
                    phone,
                    verified: true,
                    role: "admin",
                });
                const signature = jsonwebtoken_1.default.sign({
                    email: admin.email,
                    role: admin.role
                }, process.env.JWT_SECRET, { expiresIn: '2w' });
                return res.status(201).json({
                    message: "Admin created succesfully",
                    signature,
                    role: admin.role
                });
            }
            return res.status(400).json({
                message: "Admin with Email or Phone credentials already exist"
            });
        }
        return res.status(400).json({
            message: "please signin to create admin"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server Error",
            route: "/admins/signup",
        });
    }
};
exports.createAdmin = createAdmin;
/*==============================Super Admin======================*/
const createSuperAdmin = async (req, res) => {
    try {
        const { email, phone, password, address, fullname, } = req.body;
        const validateResult = utils_1.adminSchema.validate(req.body, utils_1.option);
        const { error } = validateResult;
        //    console.log(error)
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        //generate salt and hash pwd
        const salt = await (0, utils_1.GenerateSalt)();
        const adminPassword = await (0, utils_1.GeneratePassword)(password, salt);
        //    console.log(vendorPassword);
        const AdminPhone = await adminModel_1.AdminInstance.findOne({
            phone: phone
        });
        const AdminEmail = await adminModel_1.AdminInstance.findOne({
            email: email
        });
        // check if Amin exist
        if (!AdminPhone && !AdminEmail) {
            const admin = await adminModel_1.AdminInstance.create({
                email,
                password: adminPassword,
                fullname,
                firstName: '',
                lastName: '',
                salt,
                address,
                phone,
                verified: true,
                role: "superAdmin",
            });
            let signature = jsonwebtoken_1.default.sign({
                email: admin.email,
                role: admin.role
            }, process.env.JWT_SECRET, { expiresIn: '2w' });
            console.log(signature);
            if (admin) {
                const superAdmin = await adminModel_1.AdminInstance.findOne({
                    email: email,
                }).select({
                    password: 0,
                    salt: 0,
                    _id: 0
                });
                return res.status(201).json({
                    message: "Admin created succesfully",
                    superAdmin,
                });
            }
        }
        return res.status(400).json({
            message: "Admin already exist, please login"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server Error",
            route: "/admins/signup",
        });
    }
};
exports.createSuperAdmin = createSuperAdmin;
// /**============================== Create Vendor ============================== **/
const createVendor = async (req, res, next) => {
    try {
        const { role } = req.user;
        const { name, profileName, pincode, phone, address, email, password, } = req.body;
        const validateResult = utils_1.vendorSchema.validate(req.body, utils_1.option);
        const { error } = validateResult;
        //    console.log(error)
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        //generate salt and hash pwd
        const salt = await (0, utils_1.GenerateSalt)();
        const vendorPassword = await (0, utils_1.GeneratePassword)(password, salt);
        const vendor = await vendorModel_1.VendorInstance.findOne({
            where: { email: email }
        });
        const Admin = await adminModel_1.AdminInstance.findOne({
            role: role
        });
        // check if Amin exist
        if (Admin.role === 'superAdmin' || Admin.role === 'admin') {
            if (!vendor) {
                const vendor = await vendorModel_1.VendorInstance.create({
                    email,
                    password: vendorPassword,
                    profileImage: '',
                    name,
                    profileName,
                    product: {},
                    salt,
                    address,
                    phone,
                    rating: 0,
                    pincode,
                    serviceAvailable: false,
                    role: "vendor",
                });
                return res.status(201).json({
                    message: "Vendor created succesfully",
                    vendor,
                });
            }
            return res.status(400).json({
                message: "vendor already exist"
            });
        }
        return res.status(400).json({
            message: "unauthorized"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server Error",
            route: "/admins/create-vendors",
        });
    }
};
exports.createVendor = createVendor;
//# sourceMappingURL=admin.js.map