// const fs = require("fs");
// const jwt = require("jsonwebtoken")
// const getKey = () => {
//     const keyDir = 'SSL/'
//     const publicKey = keyDir + "public-key.txt";
//     const privateKey = keyDir + "private-key.txt";
//     return Promise.all([
//         fs.promises.readFile(publicKey, "utf-8"),
//         fs.promises.readFile(privateKey, "utf-8"),
//     ])

// }
// getKey()
//     .then(([publicKey, privateKey]) => {
//         const manual_access_token = jwt.sign(
//             { email: "manhnguyenf.a123@gmail.com" }, privateKey, {
//             algorithm: 'RS256',
//             expiresIn: "7d",
//         })

//         const manual_refesh_token = jwt.sign(
//             { email: "manhnguyenf.a123@gmail.com" }, publicKey, {
//             algorithm: 'RS256',

//             expiresIn: "7d",
//         })

//         const isVerify = jwt.verify(manual_access_token, publicKey)
//         console.log({ manual_access_token, manual_refesh_token, isVerify })
//     })
//     .catch((err) => {
//         console.log(err)
//     })
const crypto = require('crypto');

// function generateRandomString(length) {
//     // Tạo buffer để lưu trữ dãy byte ngẫu nhiên
//     const randomBytes = crypto.randomBytes(length);

//     // Chuyển đổi dãy byte thành chuỗi hex
//     const randomString = randomBytes.toString('hex');

//     return randomString;
// }

// // Độ dài chuỗi ngẫu nhiên mong muốn (đơn vị: byte)
// const lengthOfRandomString = 10;

// // Tạo ra chuỗi ngẫu nhiên
// const randomString = generateRandomString(lengthOfRandomString);
// console.log(randomString.length)
// // In ra chuỗi ngẫu nhiên
// const arr = [1, 2, 3];
// const testFuction = (...arr) => {
//     //   arr.map(item=>console.log(item))
//     console.log(arr)
// }
// testFuction(1, 2, 3)
// const obj = { f: 213, s: 321 };
// const queryArr = [{}, {fields: []}]
// for (const [key, value] of Object.entries(obj)) {
//     queryArr[0][`${key}`] = value;
//     queryArr[1]['fields'].push(`${key}`)
// }
// console.log(queryArr)
const generateRandomNumberInRange = (minN, maxN) => {
    const range = maxN - minN + 1;

    const randomBytes = crypto.randomBytes(4); // 4 bytes for 32 bits
    const randomValue = (parseInt(randomBytes.toString('hex'), 16) % range) + minN;

    return randomValue;
}

const axios = require("axios");
const serverEndpoint = 'http://localhost:8080/';
const apiServer = axios.create({
    baseURL: serverEndpoint,
  });
const asynchorous = async () => {
  try {
    const response = await apiServer.post("admin-query/isUserEnrollCourse", {
        user_id: 6,
        course_id: 2 
      });
      
      return response
  } catch (error) {
    console.log(error)
  }
}
asynchorous()
.then(res=>console.log(res))


