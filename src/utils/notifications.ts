import twilio from 'twilio'
import { fromAdminPhone, authToken, accountSid,GMAIL_PW, GMAIL_USER,FromAdminMail, userSubject } from '../config'
import nodemailer from 'nodemailer'


export const GenerateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000)
    let expiry = new Date()

    expiry = new Date(expiry.getTime() + ( 30 * 60 * 1000))
    return {otp, expiry}
}

export const requestOTP = async(otp:number, toPhoneNumber:string) => {
    const client = twilio(accountSid, authToken);

    const response = await client.messages 
      .create({
            body: `Your OTP is ${otp}`,         
            to: toPhoneNumber,
            from: fromAdminPhone, 
       }) 
    return response;
} 

// service and host are thesame
//create a transporter object
const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
  auth: {
    type: "login", // default
    user: "ilochibuike@gmail.com",
    pass: "rkdcxcyzgaxvscmi"
  },
    tls:{
        rejectUnauthorized:false,
    }
});

// interface mailInfo {
//     from:string,
//     to:string,
//     subject:string,
//     text:string,
//     html:string,
// }

export const mailSender = async(
    from:string,
    to:string,
    subject:string,
    html:string,) => {

        try {

            const response = await transport.sendMail({
                from: FromAdminMail,
                subject: process.env.userSubject,
                to,
                html
            })
            return response;

        } catch(error) {
            console.log(error)
        }

}

export const emailHtml = (otp:number) => {
    let response = `
    <div style="max-width:700px; height:auto; margin:auto; border:10px solid #ddd; padding:50px 20px; font-size:110%;">
        <h2 style="text-align:center;text-transform:uppercase; color:teal;">
            Welcome to ${process.env.userSubject} Food Hub
        </h2>
        <p>Hi dear, Your otp is ${otp}</p>
    </div> 
    `
    return response;
}


