const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    paymentId: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    payerId: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        required: true,
    }
});

const Invoice = mongoose.model('Invoice', InvoiceSchema);

module.exports = Invoice;
