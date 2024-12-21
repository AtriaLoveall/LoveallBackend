import { verifyJWT } from '../../services/jwt.js';
import { OfferTransaction, Business, Store } from '../../models/association.js';
import { Op } from 'sequelize';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

export const BusinessTransactionController = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyJWT(token);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const business = await Business.findByPk(decoded.id, {
      include: [{ model: Store, attributes: ['store_id'] }]
    });

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const storeIds = business.stores.map(store => store.store_id);

    const transactions = await OfferTransaction.findAll({
      where: { store_id: { [Op.in]: storeIds } },
      attributes: ['transaction_id', 'transaction_date', 'amount', 'discount_applied', 'status'],
      order: [['transaction_date', 'DESC']]
    });

    const processedTransactions = transactions.map(t => ({
      ...t.toJSON(),
      afterDiscountPrice: parseFloat(t.amount) - parseFloat(t.discount_applied || 0)
    }));

    const metrics = {
      totalAmount: transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0).toFixed(2),
      completedTransactions: transactions.filter(t => t.status === 'completed').length,
      pendingTransactions: transactions.filter(t => t.status === 'pending').length,
      averageAmount: (transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0) / transactions.length || 0).toFixed(2)
    };

    return res.status(200).json({ transactions: processedTransactions, metrics });
  } catch (error) {
    console.error('Error in BusinessTransactionController:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const exportCSV = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyJWT(token);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const business = await Business.findByPk(decoded.id, {
      include: [{ model: Store, attributes: ['store_id'] }]
    });
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const storeIds = business.stores.map(store => store.store_id);

    const transactions = await OfferTransaction.findAll({
      where: { store_id: { [Op.in]: storeIds } },
      attributes: ['transaction_id', 'transaction_date', 'amount', 'discount_applied', 'status'],
      order: [['transaction_date', 'DESC']]
    });

    const processedTransactions = transactions.map(t => ({
      ...t.toJSON(),
      afterDiscountPrice: parseFloat(t.amount) - parseFloat(t.discount_applied || 0)
    }));

    const fields = ['transaction_id', 'transaction_date', 'amount', 'discount_applied', 'afterDiscountPrice', 'status'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(processedTransactions);

    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    return res.send(csv);
  } catch (error) {
    console.error('Error in exportCSV:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const downloadInvoices = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyJWT(token);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const business = await Business.findByPk(decoded.id, {
      include: [{ model: Store, attributes: ['store_id'] }]
    });
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const storeIds = business.stores.map(store => store.store_id);

    const transactions = await OfferTransaction.findAll({
      where: { store_id: { [Op.in]: storeIds } },
      attributes: ['transaction_id', 'transaction_date', 'amount', 'discount_applied', 'status'],
      order: [['transaction_date', 'DESC']]
    });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoices.pdf');
    doc.pipe(res);

    transactions.forEach((transaction, index) => {
      if (index > 0) {
        doc.addPage();
      }
      doc.fontSize(18).text('Invoice', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Transaction ID: ${transaction.transaction_id}`);
      doc.text(`Date: ${new Date(transaction.transaction_date).toLocaleDateString()}`);
      doc.text(`Amount: ₹${parseFloat(transaction.amount).toFixed(2)}`);
      doc.text(`Discount Applied: ${transaction.discount_applied ? `₹${parseFloat(transaction.discount_applied).toFixed(2)}` : 'N/A'}`);
      doc.text(`After Discount Price: ₹${(parseFloat(transaction.amount) - parseFloat(transaction.discount_applied || 0)).toFixed(2)}`);
      doc.text(`Status: ${transaction.status}`);
    });

    doc.end();
  } catch (error) {
    console.error('Error in downloadInvoices:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

