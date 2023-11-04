const crypto = require("crypto")
function generateRandomNumberWithRandomDigits(x, y) {
    if (x <= 0 || y <= 0 || x > y) {
        throw new Error('Số chữ số tối thiểu (x) và số chữ số tối đa (y) không hợp lệ');
    }

    // Tạo một số ngẫu nhiên để xác định số chữ số
    const randomDigits = generateRandomNumberInRange(x, y);

    // Tạo một số có số chữ số ngẫu nhiên
    const minN = Math.pow(10, randomDigits - 1);
    const maxN = Math.pow(10, randomDigits) - 1;

    const randomValue = generateRandomNumberInRange(minN, maxN);
    return randomValue;
}

function generateRandomNumberInRange(minN, maxN) {
    const range = maxN - minN + 1;

    const randomBytes = crypto.randomBytes(4); // 4 bytes for 32 bits
    const randomValue = (parseInt(randomBytes.toString('hex'), 16) % range) + minN;

    return randomValue;
}

const x = 1; // Số chữ số tối thiểu
const y = 11; // Số chữ số tối đa
const randomNumbWithRandomDigits = generateRandomNumberWithRandomDigits(x, y);
console.log(randomNumbWithRandomDigits);