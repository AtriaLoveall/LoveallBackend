import { verifyJWT } from "../../services/jwt.js";
import { Offers, QrCodeBusiness } from "../../models/association.js";

export const getQrCode = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization token provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = verifyJWT(token);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { offerId } = req.params;

    const offer = await Offers.findOne({
      where: { offer_id: offerId },
      include: [{ model: QrCodeBusiness }],
    });

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    let qrCode = await QrCodeBusiness.findOne({ where: { offer_id: offer.offer_id } });

    if (!qrCode) {
      // If QR code doesn't exist, create one
      const qrCodeData = JSON.stringify({
        offer_id: offer.offer_id,
        offer_type: offer.offer_type,
        description: offer.description,
      });

      qrCode = await QrCodeBusiness.create({
        offer_id: offer.offer_id,
        data: qrCodeData,
      });

      return res.status(201).json(qrCode);
    }

    return res.status(200).json(qrCode);
  } catch (error) {
    console.error("Error in getQrCode:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const deleteQrCode = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "No authorization token provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = verifyJWT(token);
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { offerId } = req.params;

    const qrCode = await QrCodeBusiness.findOne({
      where: { offer_id: offerId },
    });

    if (!qrCode) {
      return res.status(404).json({ message: "QR code not found" });
    }

    await qrCode.destroy();

    return res.status(200).json({ message: "QR code deleted successfully" });
  } catch (error) {
    console.error("Error in deleteQrCode:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
