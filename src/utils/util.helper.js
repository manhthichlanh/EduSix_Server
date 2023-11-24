import fs from "fs";
import crypto from "crypto";
import { resume, pause } from "fluent-ffmpeg-util";
export const adminStatus = {
    None: 0,
    Active: 1,
    Inactive: 2,
};

export const gender = {
    Female: false,
    Male: true,
};

export const errorCode = {
    Unknow: 10000,
    TimeOut: 10001,
    Exception: 10002,
    DataNull: 10003,
    InvalidData: 10004,
    NotFound: 10005,
    Exist: 10006,
    Unconfimred: 10007,
    Incorrect: 10008,
    CanNot: 10009,
    Block: 10010,
    Forbidden: 10011,
};

export const successCode = {
    Confirmed: 20001,
};
export const wait = (second) => {
    return new Promise((resovle) => {
        setTimeout(() => {
            resovle()
        }, second)
    })
}
export const findVideoDuration = (buffer) => {
    //Tìm độ dài video s
    const start = buffer.indexOf(Buffer.from("mvhd")) + 16;
    const timeScale = buffer.readUInt32BE(start);
    const duration = buffer.readUInt32BE(start + 4);
    const movieLength = Math.floor(duration / timeScale);
    //Tìm độ dài video s
    return movieLength
}

export const getAndDeleteHLSFile = async (m3u8FilePath, segmentFilePath) => {
    const m3u8Content = await fs.promises.readFile(m3u8FilePath, 'utf8');
    console.log(m3u8Content)
    const m3u8LineArr = m3u8Content.split('\n');
    m3u8LineArr.map(async (item, index) => {
        if (item.startsWith(`#EXTINF:`)) {
            console.log(m3u8LineArr[index + 1])
            try {
                await fs.promises.unlink(segmentFilePath + m3u8LineArr[index + 1]);
            } catch (error) {
                console.log(error)
            }
        }
    })
    await fs.promises.unlink(m3u8FilePath);
}

export const switchAction = (command) => {
    return {
        Pause() {
            return pause(command);
        },
        Remuse() {
            return resume(command);
        },
        Cancel() {
            return command.kill();
        }
    }
}


export const generateRandomNumberWithRandomDigits = (x, y) => {
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

const generateRandomNumberInRange = (minN, maxN) => {
    const range = maxN - minN + 1;

    const randomBytes = crypto.randomBytes(4); // 4 bytes for 32 bits
    const randomValue = (parseInt(randomBytes.toString('hex'), 16) % range) + minN;

    return randomValue;
}
export const generateRandomString = (length) => {
    // Tạo buffer để lưu trữ dãy byte ngẫu nhiên
    const randomBytes = crypto.randomBytes(length);

    // Chuyển đổi dãy byte thành chuỗi hex
    const randomString = randomBytes.toString('hex');

    return randomString;
}