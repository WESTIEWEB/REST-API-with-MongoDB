import express, {Request, Response, NextFunction} from 'express';
import { registerSchema ,loginSchema, updateUserSchema, option, GeneratePassword, GenerateSalt, GenerateSignature, verifySignature, validatePassword, GenerateOtp, emailHtml, mailSender, requestOTP} from '../utils'
import { UserInstance, UserAttributes } from '../model/usersModel';
import { FromAdminMail, userSubject } from '../config'
import jwt, { JwtPayload } from 'jsonwebtoken';



export const Register = async(req: Request, res: Response, next: NextFunction) => {
    try {
       const {
        email,
        fullname,
        phone,
        password,
        address,
        confirm_password
       } = req.body;

       const validateResult = registerSchema.validate(req.body,option);
       const { error } = validateResult

       if(error) return res.status(400).json({ message: error.details[0].message }) 


       //generate salt and hash pwd
       const salt = await GenerateSalt()
       const userPassword = await GeneratePassword(password, salt);
       //    console.log(userPassword);

       //generate Otp
       const { otp, expiry } = GenerateOtp();
       
       //check if user exist
       const UserEmail = await UserInstance.findOne({
            email:email
       });

       const UserPhone = await UserInstance.findOne({
            phone:phone
       })
     

       if(!UserEmail && !UserPhone) {
        const User = await UserInstance.create({
            email,
            password: userPassword,
            fullname,
            firstName: '',
            lastName:'',
            salt,
            address,
            phone,
            otp,
            otp_expiry:expiry,
            verified: false,
            role:"user",
           }) as unknown as UserAttributes;

           const signature = jwt.sign({email:User.email, _id:User._id, role:User.role},process.env.JWT_SECRET!,{expiresIn:'2w'}) as unknown as JwtPayload;
    
        //    send Otp to user
         //   await requestOTP(otp, phone);
        

           const html = emailHtml(otp);

         //   send email to user
           await mailSender(FromAdminMail, email ,userSubject, html)

           return res.status(201).json({
            message: "User created succesfully, check your email or phone for OTP verification",
            signature,
            verified: User.verified,
           })
       }

       
      // const User = await UserInstance.findOne({
    //     where: { email:email}
    //    })
       
       return res.status(400).json({
        message: "User already exist please login"
       })


    } catch (error) {
        return res.status(500).json({
            message: "Internal server Error",
            route: "/users/signup",
            Error : error
        })
    }
}

/**
 * 
 * @param req req.params.signature
 * @param res 
 * @returns res.status(201) if verified
 * 
 */

export const verifyUser = async( req:Request, res:Response) => {
   try {

      //users/verify/id

      //verify if its user
      const token = req.params.signature;
      const toVerify = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      console.log(toVerify)

      const User = await UserInstance.findOne({
         email: toVerify.email
      }) as unknown as JwtPayload;

      console.log(User.otp_expiry)

      if(User) {
         const { otp } = req.body;


         if(User.otp === Number(otp) && User.otp_expiry >= new Date()) {
           
            const User = await UserInstance.findOneAndUpdate(
               { email: toVerify.email},
               {$set:{
                  verified: true
               }},
               {new: true}
            )as unknown as UserAttributes;

               console.log(User)
            //Generate a new signature

            if(User){
               let signature = jwt.sign({email:User.email, _id:User._id, role:User.role},process.env.JWT_SECRET!,{expiresIn:'2w'}) as unknown as JwtPayload;
   

               return res.status(200).json({
                  message: "Your account was succesfully updated",
                  signature,
                  verified: User.verified
               })
             }
            }
         return res.status(400).json({
            Error : "invalid credential or token already expired"
         })
      }
      return res.status(400).json({
            Error : "invalid cridentials"
         })
   }
    catch(error) {
      res.status(500).json({
         Error: "Internal server Error occoured",
         route: "/users/verify/:signature",
         error
      })
   }
}

/**
 * User login
 */

export const Login = async ( req:Request, res:Response) => {
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
      const User = await UserInstance.findOne({
         email: email
      }) as unknown as UserAttributes;
      
      console.log(User,"user")
   

      if(User.verified === true){
         const validation = await validatePassword(password, User.password, User.salt);

         if(validation){
            let signature = jwt.sign({email:User.email, _id:User._id, role:User.role},process.env.JWT_SECRET!,{expiresIn:'2w'}) as unknown as JwtPayload;

            return res.status(200).json({
               message: "succesfully logged in",
               signature,
               email: User.email,
               verified: User.verified,
               role: User.role
            })
         }

         return res.status(400).json({
            Error: "wrong email or password"
         })

      }

      return res.status(400).json({
         message: "User not verified"
      })

   } catch(error) {
      console.log(error)
      return res.status(500).json({
         Error: "Internal server Error",
         route: "/users/login"
      })

   }

}

/**
 * Resend OTP router , if User does not receive otp
 */

export const resendOTP = async (req:Request, res:Response) => {
   try {

      const token = req.params.signature;
      const toVerify = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      //check if User
      const User = await UserInstance.findOne({
         email:toVerify.email,
      }) as unknown as  JwtPayload

      if(User) {
         const { 
            otp,
            expiry
         } = GenerateOtp();

         const updatedUser = await User.update({
            otp,
            otp_expiry:expiry,
         }) as unknown as JwtPayload;

         // resend otp to user
         // await requestOTP(otp, updatedUser.phone);

         const html = emailHtml(otp);

         //   re send email to user
         await mailSender(FromAdminMail, updatedUser.email ,userSubject, html)

         return res.status(200).json({
         message: "OTP resend to your Email and Phone number",

         })
      }

      return res.status(400).json({
         Error: "Error sending OTP"
      })

   } catch(error) {
      return res.status(500).json({
         Error: "Internal server Error",
         route: "/users/resend-otp/:signature"
      })
   }

}

/**
 * get user profile
 */

export const getAllUser = async (req:JwtPayload, res:Response) => {

   try {
      //setting a search limit
      const { email } = req.user;
      const limit = req.query.limit as number | undefined;

      // const Users = await UserInstance.findAll({});
      const User = await UserInstance.findOne({
         email:email,
      })as unknown as UserAttributes;

      if(User.role === 'admin') {
         const Users = await UserInstance.find({
            role:"user",
            limit: limit
          }).select({'_id': 0, 'salt': 0, 'password': 0, 'otp':0, 'otp_expiry':0});
    
          return res.status(200).json({
             message: "Users successfully fetched",
             Users,
          })
      }
      return res.status(401).json({
         msg: "unathorized"
      })
   } catch(error) {
      return res.status(500).json({
         Error: "Internal Server error occoures",
         message: "No Users found",
         route: "/users/get-all-users"
      })
   }

}

export const getUser = async(req:JwtPayload, res:Response) => {
   try {
     
      const {email} = req.user

      //find user by id
      const User = await UserInstance.find({
         email: email,
      }).select({'_id': 0, 'salt': 0, 'password': 0, 'otp':0, 'otp_expiry':0});

      if(User) {
         return res.status(200).json({
            message: "user fetched successfully",
            User
         })
         
      }
      return res.status(404).json({
         Error: "user not found;"
      })


      
   } catch(error) {
      return res.status(500).json({
         err: "internal server error occoured",
         route: "/users/get-user"
      })
   }
}

/**
 * Update user profile
 */

export const updateUserProfile = async(req:JwtPayload, res:Response) => {
   try {
      const { email } = req.user;
      // const { firstName, lastName, address, phone} = req.body;

      const { error } = updateUserSchema.validate(req.body, option);

      if(error) return res.status(400).json({Error: error.details[0].message});

      const User = await UserInstance.findOneAndUpdate({email:email},req.body,{new:true})as unknown as JwtPayload

        if(!User) return res.status(401).json({ 
            Error: "Not authorized to update profile "
        });

        return res.status(200).json({
            message: "profile successfully update",
            User
        })
    }
      // return res.status(200).json({
      //    message: "profile successfully update",
      //    updateUser,
      // })

   catch(error) {
      return res.status(500).json({
         err: "Internal error occoured",
         route: "patch/users/update-user"
      })
   }
}

export const deleteProfile = async (req:JwtPayload, res:Response) => {
   try{
      const { email } = req.user;

      const User = await UserInstance.findOne({
         email:email,
      })

      if(User) {
         const deleteUser = await UserInstance.findOneAndDelete({
            email:email,
         })

         return res.status(200).json({
            message: "user deleted successfully",
            deleteUser,
         })
      }
      return res.status(401).json({
         mesg: "Not authorised"
      })

   }catch(error) {
      return res.status(500).json({
         error: "an Internal server error occoured",
         route: "delete/users/delete-user"
      })
   }

}