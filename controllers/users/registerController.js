import validator from "validator";
import { Op } from "sequelize";
import {User} from '../../models/association.js'
import { hashPassword } from "../../services/passwordHash.js";
import generateOTP from "../../services/otpGenerator.js";
import sendMail from "../../services/sendMail.js";
import { createJWT } from "../../services/jwt.js";
import MAIL_TEMPLATE from "../../config/mail.template.js";

const register = async (req, res, next) => {
  const { first_name, last_name, email, phone_number, password } = req.body;

  // Password structure
  const passwordReqirement = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  };
  let errorMessage = "";

  // Validate fields and build an error message
  if (!first_name || !last_name || !email || !phone_number || !password) {
    errorMessage = "All fields are compulsory.";
  }
  else if(!validator.isAlpha(first_name) || !validator.isAlpha(last_name) ){
    errorMessage = "Only alphabets are allowed.";
  }
  else if(first_name.length >= 10 || last_name.length >= 10){
    errorMessage = "More than 10 character are not allowed.";
  }
  else if (!validator.isEmail(email)) {
    errorMessage = "Please enter a valid email.";
  } else if (!validator.isMobilePhone(phone_number) || phone_number.length !== 10 || phone_number == 0) {
    errorMessage = "Please enter a valid 10-digit phone number.";
  } else if (!validator.isStrongPassword(password, passwordReqirement)) {
    errorMessage =
      "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.";
  }

  // Error handler
  if (errorMessage) {
    const error = new Error(errorMessage);
    error.status = 400; // Bad Request
    return next(error);
  }

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { phone_number }],
      },
    });
    if (existingUser) {
      const error = new Error("User already exist with phone or email");
      error.status = 400;
      return next(error);
    }

    // Generate the hash password
    const password_hash = await hashPassword(password);

    // Generate the otp
    const otp = generateOTP(6);


    // Otp will expire after 10 minutes
    const current_time = new Date();
    const expiration_time = process.env.OTP_EXPIRATION_TIME || 10;
    const otp_expiration_time = new Date(current_time.getTime() + expiration_time * 60000);

    
    // Adding user into the database
    const newUser = await User.create({
        first_name,
        last_name,
        email,
        phone_number,
        password_hash,
        otp,
        otp_expiration_time,
    });
    
    // Generate json web token
    const payload = {
        id: newUser.user_id,
        email: newUser.email
    }
    const token = createJWT(payload);


    // Sending otp to client
    const subject = "OTP verification"
    sendMail(email, subject, MAIL_TEMPLATE(otp));

    // Sending response back to the the client
    res.status(201).json({
      message: "User registered successfully",
      user: {
        user_id: newUser.user_id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        phone_number: newUser.phone_number,
      },
      token
    });
  } catch (error) {
    console.error("registercontroller\n" + error);
    return next(error);
  }
};

export default register;