const moment = require('moment');
import { stringify } from "qs";
import { createHmac } from "crypto";
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
export const createPaymentUrl = (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    // let config = require('config');
    const { vnp_TmnCode: tmnCode, vnp_HashSecret: secretKey, vnp_Url, vnp_ReturnUrl: returnUrl } = process.env;
    // let tmnCode = vnp_TmnCode;
    // let secretKey = vnp_HashSecret;
    let vnpUrl = vnp_Url;
    // let returnUrl = vnp_ReturnUrl;
    let orderId = moment(date).format('DDHHmmss');
    const { amount, bankCode, language: locale } = req.body;
    // let amount = req.body.amount;
    // let bankCode = req.body.bankCode;
    // let locale = req.body.language;
    if (locale === null || locale === '') {
        locale = 'vn';
    }
    const currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl+`/1/2`;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    const signData = stringify(vnp_Params, { encode: false });
    const hmac = createHmac("sha512", secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + stringify(vnp_Params, { encode: false });
    console.log(vnpUrl)
    return res.redirect(vnpUrl)
}
export const vnpayReturn = (req, res) => {
    const vnp_Params = req.query;
    const {secureHash}= vnp_Params;
    const {user_id, course_id} = req.params;
    const { vnp_HashSecret: secretKey } = process.env;
    console.log(user_id, course_id)

    // delete vnp_Params['vnp_SecureHash'];
    // delete vnp_Params['vnp_SecureHashType'];

    const signData = stringify(vnp_Params, { encode: false });
    const hmac = createHmac("sha512", secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

        return res.status(200).json(vnp_Params)
    } else {
        return res.status(400).json(vnp_Params)
    }
}
