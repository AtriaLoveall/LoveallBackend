import transporter from "../config/mail.Config.js";

const sendMail = async (to, subject, content) => {
    const options = {
        from: process.env.EMAIL, // sender address
        to, // receiver email
        subject, // Subject line
        text: content,
        html: content,
    }
    try {
        const info = await transporter.sendMail(options);  // Await the result of sendMail
        console.log('Email sent: ' + info.response);
    } catch (err) {
        console.log(err)
        console.log("I am getting error in the sendMail");
        throw new Error("Error in sending OTP. Kindly resend the OTP.");
    }
}

export default sendMail;