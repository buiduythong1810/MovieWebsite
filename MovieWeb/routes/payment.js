const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const querystring = require('querystring');
const moment = require('moment');

// Import dateformat dynamically
let dateFormat;
import('dateformat').then((module) => {
    dateFormat = module.default;
});


router.post('/create_payment_url', async (req, res) => {
    const tmnCode = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_HASH_SECRET;
    const vnpUrl = process.env.VNPAY_URL;
    const returnUrl = process.env.VNPAY_RETURN_URL;

    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = dateFormat(new Date(), "HHmmss");
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan don hang test';
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = req.body.amount * 100; // số tiền * 100 (VND)
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = dateFormat(new Date(), "yyyymmddHHmmss");
    var bankCode = req.body.bankCode;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    const vnpUrlWithParams = vnpUrl + '?' + querystring.stringify(vnp_Params, { encode: false });
    console.log(vnp_Params);

    res.redirect(vnpUrlWithParams);

});

function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
        sorted[key] = obj[key];
    }
    return sorted;
}


module.exports = router;
