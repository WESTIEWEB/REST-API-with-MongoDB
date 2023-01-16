"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSuperAdmin = exports.createAdmin = void 0;
const utils_1 = require("../utils");
const adminModel_1 = require("../model/adminModel");
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
        const vendorPassword = await (0, utils_1.GeneratePassword)(password, salt);
        //    console.log(vendorPassword);
        //generate Otp
        // const { otp, expiry } = GenerateOtp();
        const Admin = await adminModel_1.AdminInstance.findOne({
            role: role
        });
        // if(Admin.email === email) return res.status(400).json({ message: "Admin already exist, please login"})
        // if(Admin.phone === phone) return res.status(400).json({ message: "Phone number already exist, please login"})
        // check if Amin exist
        if (Admin.role === "superAdmin") {
            const adminEmail = await adminModel_1.AdminInstance.findOne({
                where: { email: email }
            });
            const adminPhone = await adminModel_1.AdminInstance.findOne({
                where: { phone: phone }
            });
            if (adminEmail === email)
                return res.status(400).json({ message: "Email already exist" });
            if (adminPhone === phone)
                return res.status(400).json({ message: "Phone number already exist" });
            if (!adminEmail && !adminPhone) {
                const User = await adminModel_1.AdminInstance.create({
                    email,
                    password: vendorPassword,
                    fullname,
                    firstName: '',
                    lastName: '',
                    salt,
                    address,
                    phone,
                    // otp,
                    // otp_expiry:expiry,
                    // lng: 0,
                    // lat: 0,
                    verified: true,
                    role: "admin",
                });
                // let signature = await GenerateSignature({
                // role:User.role,
                // email:email,
                // verified:User.verified
                // })
                return res.status(201).json({
                    message: "Admin created succesfully",
                    // signature,
                    // verified: User.verified,
                    User
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
        const vendorPassword = await (0, utils_1.GeneratePassword)(password, salt);
        //    console.log(vendorPassword);
        //generate Otp
        // const { otp, expiry } = GenerateOtp();
        const AdminPhone = await adminModel_1.AdminInstance.findOne({
            phone: phone
        });
        const AdminEmail = await adminModel_1.AdminInstance.findOne({
            email: email
        });
        // check if Amin exist
        if (!AdminPhone && !AdminEmail) {
            const User = await adminModel_1.AdminInstance.create({
                email,
                password: vendorPassword,
                fullname,
                firstName: '',
                lastName: '',
                salt,
                address,
                phone,
                //  otp,
                //  otp_expiry:expiry,
                verified: true,
                role: "superAdmin",
            });
            console.log(User);
            // let signature = await GenerateSignature({
            //     email: User.email,
            //     verified:User.verified,
            //     role: User.role
            // }) as unknown as JwtPayload
            // console.log(signature)
            if (User) {
                const user = await adminModel_1.AdminInstance.findOne({
                    email: email,
                }).select({
                    password: 0,
                    salt: 0,
                    _id: 0
                });
                // let signature = await GenerateSignature({
                //     email: user.email,
                //     verified:user.verified,
                //     role: user.role
                // }) as unknown as JwtPayload
                return res.status(201).json({
                    message: "Admin created succesfully",
                    user
                });
            }
            return res.status(404).json({
                error: "user not found"
            });
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
// export const createVendor = async(req: JwtPayload, res: Response, next: NextFunction) => {
//     try{
//         const { id } = req.user;
//         const {
//             name,
//             pincode,
//             restaurantName,
//             phone,
//             address,
//             email,
//             password,
//         } = req.body;
//         const uuidvendor = uuidv4()
//         const validateResult = vendorSchema.validate(req.body,option);
//         const { error } = validateResult
//      //    console.log(error)
//         if(error) return res.status(400).json({ message: error.details[0].message }) 
//         //generate salt and hash pwd
//         const salt = await GenerateSalt()
//         const vendorPassword = await GeneratePassword(password, salt);
//         const Vendor = await VendorInstance.findOne( {
//             where: {email: email }
//         }) as unknown as VendorAttributes;
//         const Admin = await UserIstance.findOne( {
//             where: {id: id }
//         }) as unknown as JwtPayload;
//         // check if Amin exist
//         if(Admin.role === 'superAdmin' || Admin.role === 'admin') {
//             if(!Vendor) {
//                 const vendor = await VendorInstance.create({
//                     id:uuidvendor,
//                     email,
//                     password: vendorPassword,
//                     coverImage: '',
//                     name,
//                     restaurantName,
//                     salt,
//                     address,
//                     phone,
//                     rating: 0,
//                     pincode,
//                     serviceAvailable: false,
//                     role:"vendor",
//                 }) as unknown as VendorAttributes;
//                 return res.status(201).json({
//                     message: "Vendor created succesfully",
//                     vendor,
//                 })
//             }
//             return res.status(400).json({
//                 message: "vendor already exist"
//                })
//         }
//         return res.status(400).json({
//             message: "unauthorized"
//            })
//     }catch(error){
//         return res.status(500).json({
//             message: "Internal server Error",
//             route: "/admins/create-vendors",
//         })
//     }
// }
//# sourceMappingURL=adminUsers.js.map