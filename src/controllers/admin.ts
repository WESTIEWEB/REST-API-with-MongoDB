import express, {Request, Response, NextFunction} from 'express';
import { adminSchema,vendorSchema,  loginSchema, updateUserSchema, option, GeneratePassword, GenerateSalt, GenerateSignature, verifySignature, validatePassword } from '../utils'
import { AdminInstance, UserAttributes } from '../model/adminModel';
import { VendorAttributes , VendorInstance } from '../model/vendorModel'
import jwt, { JwtPayload } from 'jsonwebtoken';
import _ from 'lodash';



// /*==============================Register Admin======================*/
export const createAdmin = async (req:JwtPayload, res:Response ) => {
    try {
    const { role } = req.user
        const {
         email,
         phone,
         password,
         address,
         fullname
        } = req.body;
 
        const validateResult = adminSchema.validate(req.body,option);
        const { error } = validateResult
     //    console.log(error)
        if(error) return res.status(400).json({ message: error.details[0].message }) 
 
        //generate salt and hash pwd
        const salt = await GenerateSalt()
        const adminPassword = await GeneratePassword(password, salt);
        
 
        const superAdmin = await AdminInstance.findOne( {
            role:role
        }) as unknown as UserAttributes;

        // if(Admin.email === email) return res.status(400).json({ message: "Admin already exist, please login"})
        
        // if(Admin.phone === phone) return res.status(400).json({ message: "Phone number already exist, please login"})
        
        // check if Amin exist
        if(superAdmin.role === 'superAdmin') {

            const adminEmail = await AdminInstance.findOne({
                where: {email: email}
            });

            const adminPhone = await AdminInstance.findOne({
                where: {phone: phone}
            });
            if(adminEmail === email && adminPhone === phone) return res.status(400).json({ message: "Email or Phone number already exist"})
        
            if(!adminEmail && !adminPhone) {
                const admin = await AdminInstance.create({
                    email,
                    password: adminPassword,
                    fullname,
                    firstName: '',
                    lastName: '',
                    salt,
                    address,
                    phone,
                    verified: true,
                    role:"admin",
                    }) as unknown as UserAttributes
                    
                    const signature = jwt.sign({
                        email: admin.email,
                        role: admin.role
                    }, process.env.JWT_SECRET!,{expiresIn:'2w'}) as unknown as JwtPayload
                    ;
                    return res.status(201).json({
                    message: "Admin created succesfully",
                    signature,
                    role: admin.role
                    })
            }

            return res.status(400).json({
                message: "Admin with Email or Phone credentials already exist"
            })
        }
 
        
        return res.status(400).json({
         message: "please signin to create admin"
        })
 
 
     } catch (error) {
         return res.status(500).json({
             message: "Internal server Error",
             route: "/admins/signup",
         })
     }
}

/*==============================Super Admin======================*/

export const createSuperAdmin = async (req:JwtPayload, res:Response) => {
    try {
        const {
            email,
            phone,
            password,
            address,
            fullname,
        } = req.body;
 
        const validateResult = adminSchema.validate(req.body,option);
        const { error } = validateResult
     //    console.log(error)
        if(error) return res.status(400).json({ message: error.details[0].message }) 
 
        //generate salt and hash pwd
        const salt = await GenerateSalt()
        const adminPassword = await GeneratePassword(password, salt);
        //    console.log(vendorPassword);

        const AdminPhone = await AdminInstance.findOne( {
            phone: phone 
        }) as unknown as UserAttributes;

        const AdminEmail = await AdminInstance.findOne( {
            email: email 
        }) as unknown as UserAttributes;

        
        // check if Amin exist
        if(!AdminPhone && !AdminEmail) {
            const admin = await AdminInstance.create({
                email,
                password: adminPassword,
                fullname,
                firstName: '',
                lastName: '',
                salt,
                address,
                phone,
                verified: true,
                role:"superAdmin",
            }) as unknown as UserAttributes
            

            let signature = jwt.sign({
                email: admin.email,
                role: admin.role
            }, process.env.JWT_SECRET!,{expiresIn: '2w'}) as unknown as JwtPayload
            console.log(signature)

            if(admin) {
                const superAdmin = await AdminInstance.findOne({
                    email:email,
                }).select({
                    password:0,
                    salt:0,
                    _id:0
                }) as unknown as UserAttributes;
            
                return res.status(201).json({
                    message: "Admin created succesfully",
                    superAdmin,
                });
            }
        }
        return res.status(400).json({
         message: "Admin already exist, please login"
        })
 
 
     } catch (error) {
         return res.status(500).json({
             message: "Internal server Error",
             route: "/admins/signup",
         })
     }
}


// /**============================== Create Vendor ============================== **/
export const createVendor = async(req: JwtPayload, res: Response, next: NextFunction) => {
    try{
        const { role } = req.user;
        const {
            name,
            profileName,
            pincode,
            phone,
            address,
            email,
            password,
        } = req.body;
 
        const validateResult = vendorSchema.validate(req.body,option);
        const { error } = validateResult
     //    console.log(error)
        if(error) return res.status(400).json({ message: error.details[0].message }) 
 
        //generate salt and hash pwd
        const salt = await GenerateSalt()
        const vendorPassword = await GeneratePassword(password, salt);

        const vendor = await VendorInstance.findOne( {
            where: {email: email }
        }) as unknown as VendorAttributes;

        const Admin = await AdminInstance.findOne({
            role:role
        }) as unknown as JwtPayload;

        
        // check if Amin exist
        if(Admin.role === 'superAdmin' || Admin.role === 'admin') {
            if(!vendor) {
                const vendor = await VendorInstance.create({
                    email,
                    password: vendorPassword,
                    profileImage: '',
                    name,
                    profileName,
                    product:{},
                    salt,
                    address,
                    phone,
                    rating: 0,
                    pincode,
                    serviceAvailable: false,
                    role:"vendor",
                }) as unknown as VendorAttributes;
    
                return res.status(201).json({
                    message: "Vendor created succesfully",
                    vendor,
                })
            }
            return res.status(400).json({
                message: "vendor already exist"
               })
        }
        return res.status(400).json({
            message: "unauthorized"
           })
    }catch(error){
        return res.status(500).json({
            message: "Internal server Error",
            route: "/admins/create-vendors",
        })
    }
}