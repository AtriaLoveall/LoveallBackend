import { Business } from '../../models/association.js';
import sendMail from "../../services/sendMail.js";
import { getTempBusinessData, deleteTempBusinessData } from "../../helper/tempStorage.js"; // Import the temporary storage functions
import B_MAIL_TEMPLATE from "../../config/bMail.template.js"

const verifyBusinessOtp = async (req, res, next) => {
  try {
    const { business_email, otp } = req.body;

    // Check if email and OTP fields are present
    if (!business_email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP fields should not be empty" });
    }

    // Retrieve temporary business data
    const tempBusinessData = getTempBusinessData(business_email);

    // Check if the business data exists in the temporary storage
    if (!tempBusinessData) {
      return res.status(404).json({ success: false, message: "Business not found in the registration process." });
    }

    // Check if the entered OTP is correct
    if (tempBusinessData.otp !== otp) {
      return res.status(401).json({ success: false, message: "Incorrect verification code." });
    }
    console.log("Check1")

    // Check if the OTP has expired
    const current_time = new Date().getTime();
    console.log("Check2")
    const expiration_time = tempBusinessData.otp_expiration_time;
    if (current_time > expiration_time) {
      return res.status(403).json({ success: false, message: "OTP has expired. Please resend the OTP." });
    }
    console.log("Check2")


    // const otp_expiration_time = new Date(current_time + expiration_time * 60000);
    // const otp_expiration_time_iso = otp_expiration_time.toISOString();
    // // const otp_expiration_time_iso = "2024-11-03T10:30:00Z";
    // console.log(otp_expiration_time)
    // console.log(otp_expiration_time_iso)
    const password_hash="";
    // Create the business record in the database
    const newBusiness = await Business.create({
      business_name: tempBusinessData.business_name,
      business_email: tempBusinessData.business_email,
      password_hash:password_hash,
      business_type: tempBusinessData.business_type,
      entity_type: tempBusinessData.entity_type,
      contact_number: tempBusinessData.contact_number,
      gstin: tempBusinessData.gstin,
      tan: tempBusinessData.tan,
      owner_name: tempBusinessData.owner_name,
      owner_contact_number: tempBusinessData.owner_contact_number,
      otp_expiration_time: null,
      verified: true // Mark as verified
    });

    // Send a thank-you email after successful verification
    const subject = "Business Registration Successful";
    await sendMail(business_email, subject, B_MAIL_TEMPLATE(""));

    // Cleanup: Remove the temporary data after successful verification
    deleteTempBusinessData(business_email);

    return res.status(200).json({ success: true, message: "Business successfully verified", newBusiness });
  } catch (error) {
    return next(error);
  }
};

export default verifyBusinessOtp;