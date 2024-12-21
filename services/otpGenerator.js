const generateOTP = (length = 6) => {
    const otp = Math.floor(Math.random() * (Math.pow(10, length))).toString().padStart(length, '0');
    return otp;
}
export default generateOTP;