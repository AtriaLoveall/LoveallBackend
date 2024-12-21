import { User, Business, Admin} from "../models/association.js";
import { verifyJWT } from "../services/jwt.js";
const WhoAmI = async (req, res) => {
    const authorization = req.headers['authorization'];
    if (!authorization) {
        return res.status(403).json({
            message: "Unauthorized! Kindly log in",
            redirectTo: "login"
        });
    }
    const token = authorization.split(' ')[1];
    try {
        const decoded = verifyJWT(token);
        console.log(decoded);
        const user = await User.findByPk(decoded.id);
        if (decoded.type === 'user' && user) {
            return res.status(200).json({
                message: "User authenticated",
                id: decoded.id,
                redirectTo: "/"
            });
        }
        const business = await Business.findByPk(decoded.id);
        if (decoded.type === 'business' && business) {
            return res.status(200).json({
                message: "Business authenticated",
                id: decoded.id,
                redirectTo: "/business"
            });
        }
        const admin = await Admin.findByPk(decoded.id);
        if (decoded.type === 'admin' && admin) {
            return res.status(200).json({
                message: "Admin authenticated",
                id: decoded.id,
                redirectTo: "/admin"
            });
        }
    } catch (error) {
        return res.status(403).json({
            message: "Unauthorized! Kindly log in",
            redirectTo: "login"
        });
    }
}
export default WhoAmI;