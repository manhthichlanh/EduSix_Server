// const express = require("express")
// const fs = require("fs")
// const app = express();
// const ffmpeg = require('fluent-ffmpeg');
// const path = require("path")
// let count = 0;
// const cors = require("cors");
// const { sign, verify } = require("jsonwebtoken");
// const privateKey = fs.readFileSync("SSL/private-key.txt", "utf-8");
// const publicKey = fs.readFileSync("SSL/public-key.txt", "utf-8");

// const refreshToken = sign({ body: "Đây là refresh Token" }, privateKey, {
//     algorithm: 'RS256',
//     expiresIn: "1h",
// });
// const accessToken = sign({ body: "Đây là access Token" }, privateKey, {
//     algorithm: 'RS256',
//     expiresIn: "15m",
// });
// verify(accessToken, publicKey, (err, body) => {
//     if (err) {
//         console.log(err)
//     }
//     console.log(body)
// });
// console.log({ refreshToken, accessToken })

// app.use(cors())

// app.get("/", async (req, res) => {
//     let i = 0;
//     while (i < 100) {
//         await fs.promises.readFile("public/videos/1.Gitinitvagitconfig.mp4", (err, data) => {
//             if (err) {
//                 console.log(err);
//             }
//         });
//         console.log("READ " + i + "TIMES");
//         i++;
//     }
//     return res.send("Done!")
// });


// app.listen(3006, async () => {
//     console.log("🚀Server started Successfully! Running in port ");
// });
const fu = (params) => {
    return {
        first() {
            console.log("first " + params)
        },
        second() {
            console.log("second " + params)
        }
    }
}

fu("say").second()