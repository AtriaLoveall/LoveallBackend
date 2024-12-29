    import { Business } from '../../models/association.js';
    import sendMail from '../../services/sendMail.js';
    import { hashPassword } from "../../services/passwordHash.js";
    import B_MAIL_TEMPLATE from "../../config/bMail.template.js"


    // Function to generate random password
    const generateRandomPassword = (length = 8) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    };

    const manualVerifyBusiness = async (req, res, next) => {
        const { business_email } = req.body;
        // console.log(req.body);

        try {
            // Find business with the provided email
            const business = await Business.findOne({ where: { business_email } });
            if (!business) {
                return res.status(404).json({ success: false, message: "Business not found" });
            }

            // Generate a random password
            const randomPassword = generateRandomPassword();
            
            // Hash the password
            const password_hash = await hashPassword(randomPassword);
            
            // Update business password and set manual verification status
            await Business.update(
                { password_hash, manual_verified: true, temp_pass: true},
                { where: { business_email } }
            );

            // Send email with user ID and password
            const subject = "Manual Verification Completed";
            const message = `Your account has been manually verified. Here are your login details:\nUser ID: ${business.business_email}\nPassword: ${randomPassword}`;
            await sendMail(business.business_email, subject, B_MAIL_TEMPLATE(message));

            return res.status(200).json({ success: true, message: "Manual verification completed and email sent." });
        } catch (error) {
            console.error("Error in manual verification:", error);
            return next(error);
        }
    };

    export default manualVerifyBusiness;