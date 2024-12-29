import { OfferTransaction, Store } from '../../models/association.js';
import { Op } from 'sequelize';
import { createObjectCsvWriter } from 'csv-writer';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs';

const getTransactions = async (req, res) => {
    try {
        const { userId, storeId, status } = req.query;

        // Build the where clause based on filters
        const whereClause = {};
        if (userId) whereClause.user_id = userId;
        if (storeId) whereClause.store_id = storeId;
        if (status) whereClause.status = status;

        const transactions = await OfferTransaction.findAll({
            where: whereClause,
            include: [
                {
                    model: Store,
                    attributes: ['store_name'],
                    required: false
                }
            ],
            order: [['transaction_date', 'DESC']]
        });

        // Transform the data for frontend
        const transformedTransactions = transactions.map(transaction => ({
            transaction_id: transaction.transaction_id,
            transaction_date: transaction.transaction_date,
            user_id: transaction.user_id,
            store_name: transaction.Store ? transaction.Store.store_name : 'Unknown Store',
            amount: transaction.amount,
            status: transaction.status
        }));

        res.json({
            success: true,
            transactions: transformedTransactions
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching transactions',
            error: error.message
        });
    }
};

const exportTransactionsCSV = async (req, res) => {
    try {
        const transactions = await OfferTransaction.findAll({
            include: [
                {
                    model: Store,
                    attributes: ['store_name'],
                    required: false
                }
            ],
            order: [['transaction_date', 'DESC']]
        });

        const csvWriter = createObjectCsvWriter({
            path: 'transactions.csv',
            header: [
                { id: 'transaction_id', title: 'Transaction ID' },
                { id: 'transaction_date', title: 'Date' },
                { id: 'user_id', title: 'User ID' },
                { id: 'store_name', title: 'Store Name' },
                { id: 'amount', title: 'Amount' },
                { id: 'status', title: 'Status' }
            ]
        });

        const records = transactions.map(transaction => ({
            transaction_id: transaction.transaction_id,
            transaction_date: transaction.transaction_date,
            user_id: transaction.user_id,
            store_name: transaction.Store ? transaction.Store.store_name : 'Unknown Store',
            amount: transaction.amount,
            status: transaction.status
        }));

        await csvWriter.writeRecords(records);

        res.download('transactions.csv', 'transactions.csv', (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Error downloading file');
            }
            // Clean up the file after download
            fs.unlinkSync('transactions.csv');
        });
    } catch (error) {
        console.error('Error exporting transactions:', error);
        res.status(500).json({
            success: false,
            message: 'Error exporting transactions',
            error: error.message
        });
    }
};

const downloadInvoices = async (req, res) => {
    try {
        const transactions = await OfferTransaction.findAll({
            where: {
                invoice_path: {
                    [Op.ne]: null
                }
            }
        });

        const archive = archiver('zip');
        res.attachment('invoices.zip');
        archive.pipe(res);

        for (const transaction of transactions) {
            const invoicePath = path.join(process.cwd(), transaction.invoice_path);
            if (fs.existsSync(invoicePath)) {
                archive.file(invoicePath, { name: `invoice_${transaction.transaction_id}.pdf` });
            }
        }

        await archive.finalize();
    } catch (error) {
        console.error('Error downloading invoices:', error);
        res.status(500).json({
            success: false,
            message: 'Error downloading invoices',
            error: error.message
        });
    }
};

export { getTransactions, exportTransactionsCSV, downloadInvoices };

