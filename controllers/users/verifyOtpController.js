import {User} from '../../models/association.js'
const verifyOtp = async (req, res, next) => {
    try {
        const {email, otp} = req.body;

        // If email is present or not
        if (!email || !otp) {
            return res.status(400).json({success: false, message: "Email and OTP field should not be empty"});
        }
        const user = await User.findOne({where:{email}});

        // Check the user exist in the database
        if (!user) {
            return res.status(404).json({success: false, message: "You have not been registered.", redirectTo: "register"})
        }

        // Check if the user is already verified or not
        if (user.verified) {
            return res.status(404).json({success: false, message: "You have already been verified."})
        }

        // Check if the entered otp is correct or not
        if (user.otp !== otp) {
            return res.status(401).json({success: false, message: "You have entered wrong verification code."})
        }

        // Check if the otp is expired or not
        const current_time = new Date().getTime();
        const expiration_time = new Date(user.otp_expiration_time).getTime();
        if (current_time > expiration_time) {
            return res.status(403).json({success: true, message: "OTP has been expired. Kindly resend the otp"});
        }

        // Update the user as verified
        const [updatedUser] = await User.update(
            {otp: null, verified: true},
            {where: {email}}
        );
        return res.status(200).json({success: true, message: "You have been successfully verified"})
    } catch (error) {
        return next(error);
    }
}

export default verifyOtp;