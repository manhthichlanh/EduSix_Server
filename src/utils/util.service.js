import { to as awaitTo } from 'await-to-js';
import pe from 'parse-error';

export async function to(promise) {
    let err, res;
    [err, res] = await awaitTo(promise);
    if (err) return [pe(err)];

    return [null, res];
}

export function ReE(res, err, statusCode = 200, code = 0) {
    // Error Web Response
    console.error(err);
    if (typeof err === 'object' && typeof err.message !== 'undefined') {
        err = err.message;
        console.error(err);
    }

    if (typeof code !== 'undefined') res.statusCode = statusCode;

    return res.json({ success: false, error: err, code: code });
}

export function ReS(res, data, statusCode = 200) {
    // Success Web Response
    let send_data = { success: true };

    if (typeof data === 'object') {
        send_data = Object.assign(data, send_data); //merge the objects
    }

    if (typeof code !== 'undefined') res.statusCode = statusCode;

    return res.json(send_data);
}

export function TE(err_message, log) {
    // TE stands for Throw Error
    if (log === true) {
        console.error(err_message);
    }
    throw new Error(err_message);
}
