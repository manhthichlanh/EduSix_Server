const moment = require('moment');
import { stringify } from "qs";
import { createHmac } from "crypto";
import OrderModel from "../models/order.model";
import sequelize from "../models/db";
import AppError from "../../utils/appError";
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
const transactionStatus = {
    "00": "Giao dịch thành công",
    "01": "Giao dịch chưa hoàn tất",
    "02": "Giao dịch bị lỗi",
    "04": "Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)",
    "05": "VNPAY đang xử lý giao dịch này (GD hoàn tiền)",
    "06": "VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)",
    "07": "Giao dịch bị nghi ngờ gian lận",
    "09": "GD Hoàn trả bị từ chối",
};
export const createPaymentUrl = async (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const { amount, bankCode, language: locale, user_id, course_id, } = req.body;
    const existOrder = await OrderModel.findOne({ where: { user_id, course_id } });
    if (existOrder) return res.status(400).json({ message: "User đã thanh toán khóa học này" })
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
    vnp_Params['vnp_ReturnUrl'] = `${returnUrl}/${user_id ? user_id + "/" : ""}${course_id ? course_id + "/" : ""}`;
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
export const vnpayReturn = async (req, res) => {
    try {
        let vnp_Params = req.query;
        const { user_id, course_id } = req.params;

        const {
            vnp_SecureHash: secureHash,
            vnp_CardType: payment_method,
            vnp_Amount:  price,
            vnp_OrderInfo: order_info,
            vnp_BankCode: bank_code,
            vnp_BankTranNo: transaction_code,
            vnp_TransactionStatus: transaction_status,
            vnp_PayDate: order_date
        } = vnp_Params;
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];
        
        vnp_Params = sortObject(vnp_Params);

        const { vnp_HashSecret: secretKey } = process.env;
        const signData = stringify(vnp_Params, { encode: false });
        const hmac = createHmac("sha512", secretKey);
        const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

        if (secureHash === signed) {
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
            let transaction_status_message = "Giao dịch thành công";
            for (const [key, value] of Object.entries(transactionStatus)) {
                if (key == transaction_status) transaction_status_message = value
            }
            const createNewOrder = {
                user_id,
                course_id,
                price: Number.parseFloat(price/100).toFixed(0),
                order_info,
                bank_code,
                transaction_code,
                payment_method,
                transaction_status: transaction_status_message,
                order_date
            }
            //Đây là host của đối tượng truy cập api 
            await OrderModel.create(createNewOrder)
            return res.status(200).json({ message: transaction_status })
        } else {
            throw new AppError(500, "fail", "Mã checksum không khớp!")
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
