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

export const findVideoDuration = (buffer) => {
    //Tìm độ dài video s
    const start = buffer.indexOf(Buffer.from("mvhd")) + 16;
    const timeScale = buffer.readUInt32BE(start);
    const duration = buffer.readUInt32BE(start + 4);
    const movieLength = Math.floor(duration / timeScale);
    //Tìm độ dài video s
    return movieLength
}
