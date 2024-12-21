import { Business} from '../../models/association.js';
import validator from "validator";
import { hashPassword, comparePassword } from "../../services/passwordHash.js";

const changePassword = async (req, res, next) => {
    const { business_email, currentPassword, newPassword } = req.body;
    
    // Define password requirements
    const passwordRequirement = {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    };
    
    try {
        // Check if all required fields are provided
        if (!business_email || !currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        // Ensure new password meets strength requirements
        if (!validator.isStrongPassword(newPassword, passwordRequirement)) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character."
            });
        }

        // Find the user by email
        const business = await Business.findOne({ where: { business_email } });
        if (!business) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Check if the current password matches the stored hash
        const isPasswordMatch = await comparePassword(currentPassword, business.password_hash);
        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, message: "Current password is incorrect." });
        }

        // Hash the new password
        const newPasswordHash = await hashPassword(newPassword);

        // Update the user's password in the database
        await Business.update(
            { password_hash: newPasswordHash, temp_pass: false },
            { where: { business_email } }
        );

        return res.status(200).json({ success: true, message: "Password changed successfully." });
    } catch (error) {
        next(error);
    }
};

export default changePassword;