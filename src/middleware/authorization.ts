import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { App_Secret } from '../config';
import { UserInstance } from '../model/usersModel';
import { VendorAttributes, VendorInstance } from '../model/vendorModel';


//req.header or req.cookies are used for middleware
export const auth = async(req:JwtPayload, res:Response, next: NextFunction) => {
    try {
        // const authorization = req.header.authorization
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log(token)
        
        if(!token) return res.status(401).json({
            message: "user not authorised, please signin"
        })

        //most developers structures authorization like 'Bearer yh64hjihdijjkh'
        // const token = authorization.slice(7, authorization.length)
        let verified = jwt.verify(token, process.env.JWT_SECRET!)

        if(!verified) {
            return res.status(401).json({
                Error: "not a verified admin"
            })
        }

        const { email } = verified as {[key:string]: string}

        const user = await UserInstance.findOne({
            email: email
        })

        if(!user) return res.status(401).json({
            Error: "User does not exist ,please signup"
        })

        req.user = verified;
        next()

    } catch(error) {
        Error: "An error occoured"
    }
}


export const authVendor = async(req:JwtPayload, res:Response, next: NextFunction) => {
    try {
        // const authorization = req.header.authorization
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log(token)
        
        if(!token) return res.status(401).json({
            message: "user not authorised, please signin"
        })

        //most developers structures authorization like 'Bearer yh64hjihdijjkh'
        // const token = authorization.slice(7, authorization.length)
        let verified = jwt.verify(token, process.env.JWT_SECRET!)

        if(!verified) {
            return res.status(401).json({
                Error: "not a verified admin"
            })
        }

        const { email } = verified as {[key:string]: string}

        const vendor = await VendorInstance.findOne({
            email: email
        })

        if(!vendor) return res.status(401).json({
            Error: "User does not exist ,please signup"
        })

        req.vendor = verified;
        next()

    } catch(error) {
        Error: "An error occoured"
    }
}