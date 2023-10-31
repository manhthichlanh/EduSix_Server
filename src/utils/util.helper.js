import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
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
    for (const line of m3u8Content.split('\n')) {
        if (line.startsWith('#EXTINF:')) {
            const segmentFileName = m3u8Content.split('\n')[m3u8Content.split('\n').indexOf(line) + 1];
            await fs.promises.unlink(segmentFilePath + segmentFileName);
        }
    }
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


// export const convertToHLS = async (uploadedFile, fileName, res) => {
//     const hlsPath = `public/videos/hls/`;
//     const videoPath = `public/videos/`;
//     const inputFilePath = path.join(videoPath, fileName);
//     await fs.promises.writeFile(inputFilePath, uploadedFile?.buffer)
//     const m3u8FilePath = path.join(hlsPath, fileName + ".m3u8");
//     const command = ffmpeg()
//         .input(inputFilePath)
//         .addOption('-f', 'hls')
//         .addOption('-hls_time', 10)
//         .addOption('-hls_list_size', 0)
//         .addOption('-codec:v', 'libx264')
//         .addOption('-preset', 'ultrafast')
//         .addOption('-hls_flags', 'delete_segments')
//         .output(m3u8FilePath)
//         .on('progress', function (progress) {
//             console.log('Processing: ' + progress.percent + '% done');
//             // userIO.emit("process_percent", progress.percent)
//         })
//         .on('end', async () => {
//             console.log('HLS conversion finished.');
//             // Remove the temporary input file
//             await fs.promises.unlink(inputFilePath)
//             console.log("ngừng")
//             // userIO.emit("render-status", { status: "success", filePath: fileName.split(".").slice(0, -1).join("") + ".m3u8" })
//             return res.send('HLS generation completed.');
//         })
//         .on('error', async (err) => {
//             console.error('Error:', err);
//             try {
//                 await getAndDeleteHLSFile(m3u8FilePath, hlsPath);
//                 await fs.promises.unlink(inputFilePath);
//             } catch (error) {
//                 console.log(error)
//                 // return res.status(500).json({ amessge: error?.message })
//             }
//             return res.status(500).json({ messge: err })

//         });

//     command.run();
//     const selectAction = switchAction(command);
//     await wait(2000)
//         .then(() => {
//             selectAction.Pause();
//         })
//     await wait(2000)
//         .then(() => {
//             selectAction.Remuse();
//         })
//     await wait(3000)
//         .then(() => {
//             selectAction.Cancel();
//         })
// }

