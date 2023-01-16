"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfile = exports.updateUserProfile = exports.getUser = exports.getAllUser = exports.resendOTP = exports.Login = exports.verifyUser = exports.Register = void 0;
const utils_1 = require("../utils");
const usersModel_1 = require("../model/usersModel");
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Register = async (req, res, next) => {
    try {
        const { email, fullname, phone, password, address, confirm_password } = req.body;
        const validateResult = utils_1.registerSchema.validate(req.body, utils_1.option);
        const { error } = validateResult;
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        //generate salt and hash pwd
        const salt = await (0, utils_1.GenerateSalt)();
        const userPassword = await (0, utils_1.GeneratePassword)(password, salt);
        //    console.log(userPassword);
        //generate Otp
        const { otp, expiry } = (0, utils_1.GenerateOtp)();
        //check if user exist
        const UserEmail = await usersModel_1.UserInstance.findOne({
            email: email
        });
        const UserPhone = await usersModel_1.UserInstance.findOne({
            phone: phone
        });
        if (!UserEmail && !UserPhone) {
            const User = await usersModel_1.UserInstance.create({
                email,
                password: userPassword,
                fullname,
                firstName: '',
                lastName: '',
                salt,
                address,
                phone,
                otp,
                otp_expiry: expiry,
                verified: false,
                role: "user",
            });
            const signature = jsonwebtoken_1.default.sign({ email: User.email, _id: User._id, role: User.role }, process.env.JWT_SECRET, { expiresIn: '2w' });
            //    send Otp to user
            //   await requestOTP(otp, phone);
            const html = (0, utils_1.emailHtml)(otp);
            //   send email to user
            await (0, utils_1.mailSender)(config_1.FromAdminMail, email, config_1.userSubject, html);
            return res.status(201).json({
                message: "User created succesfully, check your email or phone for OTP verification",
                signature,
                verified: User.verified,
            });
        }
        // const User = await UserInstance.findOne({
        //     where: { email:email}
        //    })
        return res.status(400).json({
            message: "User already exist please login"
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server Error",
            route: "/users/signup",
            Error: error
        });
    }
};
exports.Register = Register;
/**
 *
 * @param req req.params.signature
 * @param res
 * @returns res.status(201) if verified
 *
 */
const verifyUser = async (req, res) => {
    try {
        //users/verify/id
        //verify if its user
        const token = req.params.signature;
        const toVerify = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log(toVerify);
        const User = await usersModel_1.UserInstance.findOne({
            email: toVerify.email
        });
        console.log(User.otp_expiry);
        if (User) {
            const { otp } = req.body;
            if (User.otp === Number(otp) && User.otp_expiry >= new Date()) {
                const User = await usersModel_1.UserInstance.findOneAndUpdate({ email: toVerify.email }, { $set: {
                        verified: true
                    } }, { new: true });
                console.log(User);
                //Generate a new signature
                if (User) {
                    let signature = jsonwebtoken_1.default.sign({ email: User.email, _id: User._id, role: User.role }, process.env.JWT_SECRET, { expiresIn: '2w' });
                    return res.status(200).json({
                        message: "Your account was succesfully updated",
                        signature,
                        verified: User.verified
                    });
                }
            }
            return res.status(400).json({
                Error: "invalid credential or token already expired"
            });
        }
        return res.status(400).json({
            Error: "invalid cridentials"
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error occoured",
            route: "/users/verify/:signature",
            error
        });
    }
};
exports.verifyUser = verifyUser;
/**
 * User login
 */
const Login = async (req, res) => {
    try {
        const { email, password, } = req.body;
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.option);
        const { error } = validateResult;
        //    console.log(error)
        if (error)
            return res.status(400).json({ message: error.details[0].message });
        // check if user exist
        const User = await usersModel_1.UserInstance.findOne({
            email: email
        });
        console.log(User, "user");
        if (User.verified === true) {
            const validation = await (0, utils_1.validatePassword)(password, User.password, User.salt);
            if (validation) {
                let signature = jsonwebtoken_1.default.sign({ email: User.email, _id: User._id, role: User.role }, process.env.JWT_SECRET, { expiresIn: '2w' });
                return res.status(200).json({
                    message: "succesfully logged in",
                    signature,
                    email: User.email,
                    verified: User.verified,
                    role: User.role
                });
            }
            return res.status(400).json({
                Error: "wrong email or password"
            });
        }
        return res.status(400).json({
            message: "User not verified"
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/login"
        });
    }
};
exports.Login = Login;
/**
 * Resend OTP router , if User does not receive otp
 */
const resendOTP = async (req, res) => {
    try {
        const token = req.params.signature;
        const toVerify = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        //check if User
        const User = await usersModel_1.UserInstance.findOne({
            email: toVerify.email,
        });
        if (User) {
            const { otp, expiry } = (0, utils_1.GenerateOtp)();
            const updatedUser = await User.update({
                otp,
                otp_expiry: expiry,
            });
            // resend otp to user
            // await requestOTP(otp, updatedUser.phone);
            const html = (0, utils_1.emailHtml)(otp);
            //   re send email to user
            await (0, utils_1.mailSender)(config_1.FromAdminMail, updatedUser.email, config_1.userSubject, html);
            return res.status(200).json({
                message: "OTP resend to your Email and Phone number",
            });
        }
        return res.status(400).json({
            Error: "Error sending OTP"
        });
    }
    catch (error) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/resend-otp/:signature"
        });
    }
};
exports.resendOTP = resendOTP;
/**
 * get user profile
 */
const getAllUser = async (req, res) => {
    try {
        //setting a search limit
        const { email } = req.user;
        const limit = req.query.limit;
        // const Users = await UserInstance.findAll({});
        const User = await usersModel_1.UserInstance.findOne({
            email: email,
        });
        if (User.role === 'admin') {
            const Users = await usersModel_1.UserInstance.find({
                role: "user",
                limit: limit
            }).select({ '_id': 0, 'salt': 0, 'password': 0, 'otp': 0, 'otp_expiry': 0 });
            return res.status(200).json({
                message: "Users successfully fetched",
                Users,
            });
        }
        return res.status(401).json({
            msg: "unathorized"
        });
    }
    catch (error) {
        return res.status(500).json({
            Error: "Internal Server error occoures",
            message: "No Users found",
            route: "/users/get-all-users"
        });
    }
};
exports.getAllUser = getAllUser;
const getUser = async (req, res) => {
    try {
        const { email } = req.user;
        //find user by id
        const User = await usersModel_1.UserInstance.find({
            email: email,
        }).select({ '_id': 0, 'salt': 0, 'password': 0, 'otp': 0, 'otp_expiry': 0 });
        if (User) {
            return res.status(200).json({
                message: "user fetched successfully",
                User
            });
        }
        return res.status(404).json({
            Error: "user not found;"
        });
    }
    catch (error) {
        return res.status(500).json({
            err: "internal server error occoured",
            route: "/users/get-user"
        });
    }
};
exports.getUser = getUser;
/**
 * Update user profile
 */
const updateUserProfile = async (req, res) => {
    try {
        const { email } = req.user;
        // const { firstName, lastName, address, phone} = req.body;
        const { error } = utils_1.updateUserSchema.validate(req.body, utils_1.option);
        if (error)
            return res.status(400).json({ Error: error.details[0].message });
        const User = await usersModel_1.UserInstance.findOneAndUpdate({ email: email }, req.body, { new: true });
        if (!User)
            return res.status(401).json({
                Error: "Not authorized to update profile "
            });
        return res.status(200).json({
            message: "profile successfully update",
            User
        });
    }
    // return res.status(200).json({
    //    message: "profile successfully update",
    //    updateUser,
    // })
    catch (error) {
        return res.status(500).json({
            err: "Internal error occoured",
            route: "patch/users/update-user"
        });
    }
};
exports.updateUserProfile = updateUserProfile;
const deleteProfile = async (req, res) => {
    try {
        const { email } = req.user;
        const User = await usersModel_1.UserInstance.findOne({
            email: email,
        });
        if (User) {
            const deleteUser = await usersModel_1.UserInstance.findOneAndDelete({
                email: email,
            });
            return res.status(200).json({
                message: "user deleted successfully",
                deleteUser,
            });
        }
        return res.status(401).json({
            mesg: "Not authorised"
        });
    }
    catch (error) {
        return res.status(500).json({
            error: "an Internal server error occoured",
            route: "delete/users/delete-user"
        });
    }
};
exports.deleteProfile = deleteProfile;
//# sourceMappingURL=users.js.map