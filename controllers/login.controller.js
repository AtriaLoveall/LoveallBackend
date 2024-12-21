import { User, Business, Admin } from "../models/association.js";
import { createJWT } from "../services/jwt.js";
import { comparePassword } from "../services/passwordHash.js";

const login = async (req, res, next) => {
  const { email, password, otp } = req.body;
  // Check if email and otp or password is provided or not
  if (!email || !(otp || password)) {
    return res.status(400).json({ success: true, message: "Kindly fill the required field." });
  }
  try {
    // Check if user is registered or not
    let token, redirectTo;
    const user = await User.findOne({ where: { email } });
    if (user) {
        // Check if user is verified or not
        if (!user.verified) {
          return res
            .status(400)
            .json({
              success: false,
              message: "Kindly verify your account.",
              redirectTo: "verify-otp",
            });
        }
        // If otp is provide do all check
        if (otp) {
          const currentTime = new Date().getTime();
          const otp_expiration_time = user.otp_expiration_time.getTime();
          if (currentTime > otp_expiration_time) {
            return res
              .status(400)
              .json({ success: false, message: "OTP has been expired" });
          }
          if (otp !== user.otp) {
            return res
              .status(400)
              .json({ success: false, message: "It is an invalid OTP." });
          }
        }
        // If password is provided do proper check
        else {
          const hashedPassword = user.password_hash;
          const isMatched = await comparePassword(password, hashedPassword);
          if (!isMatched) {
            return res
              .status(401)
              .json({ success: false, message: "Password is incorrect." });
          }
        }
    
        // Create jwt token for each login session
        const payload = {
          id: user.user_id,
          email: user.email,
          type: 'user'
        };
        token = createJWT(payload);
        redirectTo = "/";
        return res.status(200).json({
            success: true,
            message: "You have logged in successfully",
            token,
            redirectTo,
        });
    }

    // Check for the business email
    const business = await Business.findOne({
      where: { business_email: email },
    });
    if (business) {
        if (!business.verified) {
          return res
            .status(403)
            .json({ success: false, message: "Please verify your account." });
        }
        // Check if business is manually verified
        if (!business.manual_verified) {
          return res
            .status(403)
            .json({
              success: false,
              message: "Account pending manual verification. Contact support.",
            });
        }

        // If otp is provide do all check
        if (otp) {
          const currentTime = new Date().getTime();
          const otp_expiration_time = business.otp_expiration_time.getTime();
          if (currentTime > otp_expiration_time) {
            return res
              .status(400)
              .json({ success: false, message: "OTP has been expired" });
          }
          if (otp !== business.otp) {
            return res
              .status(400)
              .json({ success: false, message: "It is an invalid OTP." });
          }
        }
        else {
          // If password is provided do proper check
          const isMatched = await comparePassword(password, business.password_hash);
          if (!isMatched) {
            return res
              .status(400)
              .json({ success: false, message: "Incorrect password." });
          }
        }
        // Create JWT token
        const payload = {
          id: business.business_id,
          email: business.business_email,
          type: 'business'
        };
        token = createJWT(payload);
        redirectTo = "/business";
        return res.status(200).json({
            success: true,
            message: "You have logged in successfully",
            token,
            redirectTo,
        });
    }

    // Check for the business email
    const admin = await Admin.findOne({
      where: { admin_email: email },
    });
    if (admin) {
        // If otp is provide do all check
        if (otp) {
          const currentTime = new Date().getTime();
          const otp_expiration_time = business.otp_expiration_time.getTime();
          if (currentTime > otp_expiration_time) {
            return res
              .status(400)
              .json({ success: false, message: "OTP has been expired" });
          }
          if (otp !== admin.otp) {
            return res
              .status(400)
              .json({ success: false, message: "It is an invalid OTP." });
          }
        }
        else {
          // If password is provided do proper check
          const isMatched = await comparePassword(password, admin.password_hash);
          if (!isMatched) {
            return res
              .status(400)
              .json({ success: false, message: "Incorrect password." });
          }
          // Create JWT token
        }
        const payload = {
          id: admin.admin_id,
          email: admin.admin_email,
          type: 'admin'
        };
        token = createJWT(payload);
        redirectTo = "/admin";
        return res.status(200).json({
            success: true,
            message: "You have logged in successfully",
            token,
            redirectTo,
        });
    }

    return res.status(400).json({success: false, message: "User Not found. Kindly register.", redirectTo: '/register'});
    
  } catch (error) {
    next(error);
  }
};

export default login;
