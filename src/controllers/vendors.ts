import {Request, Response, NextFunction} from 'express';
import { loginSchema, option, GenerateSignature, validatePassword, productSchema, updateVendorSchema } from '../utils'
import jwt, { JwtPayload } from 'jsonwebtoken';
import { VendorAttributes, VendorInstance } from '../model/vendorModel';
import { ProductAttributes, ProductInstance } from '../model/productModel';


/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * 
 *  CREATE VENDOR, VENDORLOGIN, 
 */


/** ============================== Vendor Login ============================== **/
export const vendorLogin = async ( req:Request, res:Response, next:NextFunction) => {
    try {
       const {
        email,
        password,
       } = req.body;
 
       const validateResult = loginSchema.validate(req.body,option);
       const { error } = validateResult
    //    console.log(error)
       if(error) return res.status(400).json({ message: error.details[0].message }) 
 
    // check if user exist
       const Vendor = await VendorInstance.findOne({
          email:email
       }).select({'password':0, 'salt':0,'products':0, 'address':0}) as unknown as VendorAttributes;
       
 
       if(Vendor){
          const validation = await validatePassword(password, Vendor.password, Vendor.salt);
 
          if(validation){
             let signature = jwt.sign({
                email:Vendor.email,
                role:Vendor.role,
             }, process.env.JWT_SECRET!, {expiresIn:'2w'})
 
             return res.status(200).json({
                message: "succesfully logged in",
                signature,
                Vendor
             })
          }
 
          return res.status(400).json({
             Error: "wrong email or password"
          })
 
       }
 
       return res.status(400).json({
          message: "not authorized"
       })
 
    } catch(error) {
       return res.status(500).json({
          Error: "Internal server Error",
          route: "/vendors/login"
       })
    }
 }


 /**
 * =========================== Vendor Add Product ================================
 */

export const createProduct = async(req:JwtPayload, res:Response) => {
    try {
        const { email } = req.vendor;
        const {
            name,
            image,
            price,
            ProductType,
            readyTime,
            description,
            category,
        } = req.body;

        const validateResult = productSchema.validate(req.body,option);
        const { error } = validateResult;
     //    console.log(error)
        if(error) return res.status(400).json({ message: error.details[0].message });

        const isExistVendor = await VendorInstance.findOne({
            email:email,
        }) as unknown as VendorAttributes;

        if(isExistVendor) {
            const Product = await ProductInstance.create({
                name,
                image: req.file.path,
                price,
                ProductType,
                readyTime,
                description,
                category,
                rating: 0,
                vendorId: isExistVendor.id
            }) as unknown as ProductAttributes;
            return res.status(200).json({
                message: "successfully created Product",
                Product,
            });
        }
        return res.status(400).json({
            message: "not authorised"
         })

    } catch(error) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/create-Product"
         });
    }
}
 /**
 * =========================== Get Vendor Profile ================================
 */

export const vendorProfile = async(req:JwtPayload, res:Response) => {
    try {
        const { email } = req.vendor;

        //check if vendor exist
         const Vendor = await VendorInstance.findOne(
            {email: email}
            ).select({
               vendorId:0
            }) as unknown as VendorAttributes;

         return res.status(200).json({
            message: "Vendor successfully fetched",
            Vendor,
         })
        

    } catch(error) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/create-Product"
         });
    }
}

 /**
 * ===========================Vendor Delete Product ================================
 */

  export const updateVendorProfile = async(req:JwtPayload, res:Response) => {
   try {
      const { email } = req.vendor;
      const { name, coverImage, address, phone} = req.body;

      const { error } = updateVendorSchema.validate(req.body, option);

      if(error) return res.status(400).json({Error: error.details[0].message});

      const Vendor = await VendorInstance.findOne({
         email:email
      }) as unknown as JwtPayload
      if(!Vendor) return res.status(401).json({ Error: "Not authorized to update profile "});

      const updateVendor = await VendorInstance.findOneAndUpdate({
         email:email
      },req.body,{
         new:true
      })as unknown as VendorAttributes

      if(updateVendor) {
         const vendor = await VendorInstance.findOne({
            email:email,
            // attributes: ["firstName","coverImage","lastName","email","address","phone","verified","role"]
         }).select({
            'fullName': 1, 'phone':1, 'email':0
         }) as unknown as VendorAttributes;

         return res.status(200).json({
            message: "profile successfully update",
            vendor,
         })
      }
      // return res.status(200).json({
      //    message: "profile successfully update",
      //    updateUser,
      // })

   }catch(error) {
      return res.status(500).json({
         err: "Internal error occoured",
         route: "patch/vendors/update-vendor"
      })
   }
}

 /**
 * =========================== Vendor Delete Product ================================
 */

export const deleteProduct = async(req:JwtPayload, res:Response) => {
    try {
         const { email } = req.vendor;
         const productId = req.params.productId

         const Vendor = await VendorInstance.findOne({
            email: email,
         })

        //check if vendor exist
        if(Vendor) {
            const deletedProduct = await ProductInstance.findByIdAndDelete({
               _id: productId
            }) as unknown as ProductAttributes;

            
            
            // const deletedProduct = 


            return res.status(200).json({
               message: "Deleted successfully",
               deletedProduct,
            })
         }

         return res.status(400).json({
            message: "unauthorized",
            route: "/vendors/delete-Product/"
         })
        
        

    } catch(error) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/vendors/delete-Product"
         });
    }
}
