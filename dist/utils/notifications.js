"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailHtml = exports.mailSender = exports.requestOTP = exports.GenerateOtp = void 0;
const twilio_1 = __importDefault(require("twilio"));
const config_1 = require("../config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const GenerateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    let expiry = new Date();
    expiry = new Date(expiry.getTime() + (30 * 60 * 1000));
    return { otp, expiry };
};
exports.GenerateOtp = GenerateOtp;
const requestOTP = async (otp, toPhoneNumber) => {
    const client = (0, twilio_1.default)(config_1.accountSid, config_1.authToken);
    const response = await client.messages
        .create({
        body: `Your OTP is ${otp}`,
        to: toPhoneNumber,
        from: config_1.fromAdminPhone,
    });
    return response;
};
exports.requestOTP = requestOTP;
// service and host are thesame
//create a transporter object
const transport = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    auth: {
        type: "login",
        user: "ilochibuike@gmail.com",
        pass: "rkdcxcyzgaxvscmi"
    },
    tls: {
        rejectUnauthorized: false,
    }
});
// interface mailInfo {
//     from:string,
//     to:string,
//     subject:string,
//     text:string,
//     html:string,
// }
const mailSender = async (from, to, subject, html) => {
    try {
        const response = await transport.sendMail({
            from: config_1.FromAdminMail,
            subject: process.env.userSubject,
            to,
            html
        });
        return response;
    }
    catch (error) {
        console.log(error);
    }
};
exports.mailSender = mailSender;
const emailHtml = (otp) => {
    let response = `
    <div style="max-width:700px; height:auto; margin:auto; border:10px solid #ddd; padding:50px 20px; font-size:110%;">
        <h2 style="text-align:center;text-transform:uppercase; color:teal;">
            Welcome to ${process.env.userSubject} Food Hub
        </h2>
        <p>Hi dear, Your otp is ${otp}</p>
    </div> 
    `;
    return response;
};
exports.emailHtml = emailHtml;
//# sourceMappingURL=notifications.js.map