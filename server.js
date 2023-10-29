const express = require("express")
const fs = require("fs")
const multer = require("multer")
const app = express();
const PORT = 3006;
const cors = require("cors");
app.use(cors())
//create server socket
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: "*"
});

//create server socket

// const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const util = require('fluent-ffmpeg-util');
const { spawn, process } = require('child_process');
const path = require("path");
// ffmpeg.setFfmpegPath(ffmpegPath);
let count = 0;

const upload = multer({
    storage: multer.memoryStorage(),
});

// io.on("connection", function (socket) {
//     console.log("Có người kết nối", socket.id);

//     //server lắng nghe dữ liệu từ client
//     socket.on("client-post-video", function (data) {
//         //sau khi lắng nghe dữ liệu, server phát lại dữ liệu này đến các client khác
//         console.log(socket.id)
//         const fileName = data.get("file").name;
//         console.log(fileName)
//         // data.get("file").mv(`uploads/${fileName}`, (err) => {
//         //     if (err) {
//         //         console.error("File upload failed:", err);
//         //     } else {
//         //         console.log(`File ${fileName} uploaded successfully.`);
//         //     }
//         // });
//     });

//     socket.on("disconnect", function (userSocket) {
//         console.log(`User: ${userSocket.id} ngắt kết nối`)
//     });
// });
const useSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Có người kết nối", socket.id);

        socket.on("post-video", async (data) => {
            const file = data.file;
            // fs.readFileSync(file)
            console.log(file)
        })
        socket.on("join-stream", () => {
            console.log("Có user join stream " + socket.id)
            socket.emit("get-stream-id", socket.id);
            socket.join("Stream-" + socket.id);
        })
        socket.on("custom-event", (dataa) => {
            console.log(dataa)
        })




        socket.on("disconnect", function (userSocket) {
            console.log(`User: ${userSocket.id} ngắt kết nối`)
        });
    })

}
useSocket(io)

// app.get("/send-message", async (req, res) => {
//     res.initSocket((socket) => {
//         socket.emit("message", "hello")
//     })
// }
// )
app.get("/", async (req, res) => {


    let i = 0;
    while (i < 100) {
        await fs.promises.readFile("public/videos/1697669735242-22.hoantacnhungfileokhuvucstagedchangestrangthaibandau.mp4", (err, data) => {
            if (err) {
                console.log(err);
            }
        });
        console.log("READ " + i + "TIMES");
        i++;
    }
    return res.send("Done!")
});
app.get('/generate-hls/:videoName', (req, res) => {
    const videoName = req.params.videoName;
    console.log(req.method)
    const videoPath = `public/videos/${"1.Gitinitvagitconfig.mp4"}`; // Đường dẫn tới video
    const hlsOutputPath = `public/hls/`;
    if (!fs.existsSync(videoPath)) {
        return res.status(404).json({ error: 'Video not found' });
    }


});
app.get("/read", (req, res) => {
    console.log(req.socket.localAddress)
    count++;
    res.json(req.count)
})
const wait = (second) => {
    return new Promise((resovle) => {
        setTimeout(() => {
            resovle()
        }, second)
    })
}

async function getSegmentFilesFromM3u8(m3u8FilePath, segmentFilePath) {
    const m3u8Content = await fs.promises.readFile(m3u8FilePath, 'utf8');
    for (const line of m3u8Content.split('\n')) {
        if (line.startsWith('#EXTINF:')) {
            const segmentFileName = m3u8Content.split('\n')[m3u8Content.split('\n').indexOf(line) + 1];
            await fs.promises.unlink(segmentFilePath + segmentFileName);
        }
    }
    await fs.promises.unlink(m3u8FilePath);
}
app.post("/upload", upload.single("file"), async (req, res) => {
    // // return file 
    // const socketID = req.headers["socket-id"];
    // const userIO = io.to(socketID);

    // Lấy file được upload
    const uploadedFile = req.file;
    // console.log({ uploadedFile, userIO })
    // return console.log(uploadedFile)
    const hlsOutputPath = `public/hls/`;
    const videoPath = `public/videos/`
    // Chuyển định dạng file sang m3u8
    const fileName = !uploadedFile ? null : Date.now() + '-' + uploadedFile.originalname.toLowerCase().normalize("NFD").replace(/[\u0300-\u036F]/g, "").replace(/đ/g, "d").split(" ").map(item => item.trim()).join("");
    console.log({ fileName })
    const inputFilePath = videoPath + "/" + fileName;
    console.log(inputFilePath)

    fs.writeFile(inputFilePath, uploadedFile?.buffer, async (err) => {
        if (err) {
            console.error('Error writing to temporary input file:', err);
        } else {
            const m3u8FilePath = hlsOutputPath + fileName.split(".").slice(0, -1).join("") + ".m3u8";
            const chunkFile = [m3u8FilePath]
            console.log(m3u8FilePath)
            const command = ffmpeg()
                .input(inputFilePath)
                .addOption('-hls_time', 10)
                .addOption('-hls_list_size', 5)
                .addOption('-f', 'hls')
                .addOption('-codec:v', 'libx264')
                .addOption('-preset', 'ultrafast')
                .addOption('-hls_flags', 'delete_segments')
                .output(m3u8FilePath)
                .on('progress', function (progress) {
                    console.log(new Date(progress.timemark).getTime())
                    console.log('Processing: ' + progress.percent + '% done');
                    chunkFile.push()
                    // userIO.emit("process_percent", progress.percent)
                })
                .on('end', async () => {
                    console.log('HLS conversion finished.');
                    // Remove the temporary input file
                    await fs.promises.unlink(inputFilePath)
                    console.log("ngừng")
                    // userIO.emit("render-status", { status: "success", filePath: fileName.split(".").slice(0, -1).join("") + ".m3u8" })
                    return res.send('HLS generation completed.');
                })
                .on('error', async (err) => {
                    console.error('Error:', err);
                    // Remove the temporary input file
                    // const outputFiles = await fs.promises.readdir(m3u8FilePath.split('.m3u8')[0]);
                    // console.log(outputFiles)
                    await getSegmentFilesFromM3u8(m3u8FilePath, hlsOutputPath)
                    await fs.promises.unlink(inputFilePath)
                    return res.status(500).send('Error generating HLS.');
                })
            command.run();

            await wait(2000)
                .then(() => {
                    util.pause(command)
                })
            await wait(2000)
                .then(() => {
                    util.resume(command)
                })
            // await wait(10000)
            //     .then(() => {
            //         command.kill("")
            //     })
        }

    });
});
app.post("/upload-and-listen", upload.single("file"), async (req, res) => {
    // Lấy file được upload
    const uploadedFile = req.file;
    const hlsOutputPath = `public/hls/`;
    const videoPath = `public/videos/`
    // Chuyển định dạng file sang m3u8
    const fileName = !uploadedFile ? null : Date.now() + '-' + uploadedFile.originalname.toLowerCase().normalize("NFD").replace(/[\u0300-\u036F]/g, "").replace(/đ/g, "d").split(" ").map(item => item.trim()).join("");

    const inputFilePath = videoPath + "/" + fileName;
    console.log(inputFilePath)
    fs.writeFile(inputFilePath, uploadedFile?.buffer, (err) => {
        if (err) {
            console.error('Error writing to temporary input file:', err);
        } else {
            const command = ffmpeg()
                .input(inputFilePath)
                .addOption('-hls_time', 10)
                .addOption('-hls_list_size', 0)
                .addOption('-f', 'hls')
                .addOption('-codec:v', 'libx264')
                .addOption('-preset', 'ultrafast')
                .addOption('-hls_flags', 'delete_segments')
                .output(hlsOutputPath + fileName.split(".").slice(0, -1).join("") + ".m3u8")
                .on('progress', function (progress) {
                    console.log('Processing: ' + progress.percent + '% done');
                })
                .on('end', async () => {
                    console.log('HLS conversion finished.');
                    // Remove the temporary input file
                    await fs.promises.unlink(inputFilePath)
                    console.log("ngừng")
                    return res.send('HLS generation completed.');
                })
                .on('error', async (err) => {
                    console.error('Error:', err);
                    // Remove the temporary input file
                    await fs.promises.unlink(inputFilePath)
                    return res.status(500).send('Error generating HLS.');
                });

            command.run();

            // setTimeout(() => {
            //     if (util.pause(command))
            //         console.log('ffmpeg paused');
            // }, 5000)
            // setTimeout(() => {
            //     if (util.resume(command))
            //         console.log('ffmpeg resumed');
            // }, 7000)

            // setTimeout(() => {
            //     command.kill()
            // }, 9000)
        }
    });
});
app.get("/stream/:fileName", async (req, res) => {
    const fileName = req.params.fileName;
    // console.log(fileName)
    const hlsPath = "public/hls/"
    const filePath = path.join(hlsPath, fileName)
    // console.log(filePath)
    if (!fs.existsSync(filePath)) {
        console.log('file not found: ' + fileName);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('file not found: %s\n', fileName);
        res.end();
    }
    switch (path.extname(fileName)) {
        case ".m3u8":
            try {
                const m3u8Data = fs.readFileSync(filePath, "utf-8");
                res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
                res.end(m3u8Data);

            } catch (error) {
                console.log(error)
            }
            break;
        case ".ts":
            const stat = fs.statSync(filePath);
            const fileSize = stat.size;
            const range = req.headers.range;
            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = (end - start) + 1;
                const file = fs.createReadStream(filePath, { start, end });
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp2t',
                };

                res.writeHead(206, head);
                file.pipe(res);
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp2t',
                };
                res.writeHead(200, head);
                fs.createReadStream(filePath).pipe(res);
            }
            break;
        default:

            break;
    }
}
)

http.listen(PORT, async () => {
    console.log("🚀Server started Successfully! Running in port " + PORT);
});
