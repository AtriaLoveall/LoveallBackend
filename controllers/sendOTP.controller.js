import {User, Business} from '../models/association.js'
import generateOTP from "../services/otpGenerator.js";
import sendMail from "../services/sendMail.js";
import validator from "validator";
import MAIL_TEMPLATE from '../config/mail.template.js';
const sendOTP = async (req, res, next) => {
    try {
        const {email} = req.body;
        let isBusiness;
        // validate email
        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({success: false, message: "Kindly enter the valid email"});
        }
        let user = await User.findOne({where: {email}});

        // check if user exist
        if (!user) {
            user = await Business.findOne({ where: { business_email: email } });
            isBusiness = true;
            if (!user) {
                return res.status(404).json({success: false, message: "You have not been registered", redirectTo: "register"});
            }
        }
    
        const otp = generateOTP(6);
    
        // Otp will expire after 10 minutes
        const current_time = new Date();
        const expiration_time = Number(process.env.OTP_EXPIRATION_TIME) || 10;
        const otp_expiration_time = new Date(current_time.getTime() + expiration_time * 60000);

        // Updated data
        const updateData = { otp, otp_expiration_time };
    
        // Update otp and expiration time
        if (isBusiness) {
            const [updatedBusiness] = await Business.update(
                updateData,
                { where: { business_email: email } }
            );
        }
        else {
            const [updatedUser] = await User.update(
                updateData,
                {where: {email}}
            );
        }
        const subject = "OTP verification"
        await sendMail(email, subject, MAIL_TEMPLATE(otp));
        return res.status(200).json({success: true, message: "Kindly verify the OTP"});
    } catch (error) {
        return next(error);
    }
}

export default sendOTP;