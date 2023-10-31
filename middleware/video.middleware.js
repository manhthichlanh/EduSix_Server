import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import LessonModel from "../src/app/models/lesson.model";
import { findVideoDuration, switchAction, getAndDeleteHLSFile, wait } from "../src/utils/util.helper";
import { fetchYoutube } from "../src/utils/googleAPI";
export const checkRequestVideo = async (req, res, next) => {
    const { lesson_id, youtube_id, lesson_type } = req.body;
    const uploadedFile = req.file;
    // Kiểm tra điều kiện 1: Chỉ có một trong hai được null
    if ((!uploadedFile && !youtube_id) || (uploadedFile && youtube_id)) {
        return res.status(400).json({ error: 'Bạn phải upload file video hoặc có youtube_id và chỉ được chọn 1 trong 2!' });
    }

    const record = await LessonModel.findByPk(lesson_id);
    let duration = 0;
    if (!record) {
        switch (parseInt(lesson_type)) {
            case 0:
                if (!youtube_id) return res.status(415).json({ message: "Vui lòng cung cấp dữ liệu youtube_id theo đúng yêu cầu của bài học", type: record.type });
                await fetchYoutube(youtube_id)
                    .then(res => {
                        duration = res.duration
                    })
                    .catch(err => {
                        console.log(err)
                        return res.status(402).json({ message: "Chưa thể xác định được thông tin từ youtube_id bạn cung cấp!" })
                    })
                break;
            case 1:
                if (!uploadedFile) return res.status(415).json({ message: "Vui lòng cung cấp dữ liệu file_videos theo đúng yêu cầu của bải học", lesson_type })
                duration = findVideoDuration(uploadedFile?.buffer);
                break;
            default:
                return res.status(401).json({ message: "Bài học không hỗ trợ đăng tải video!" })

        }
        console.log(duration)
        req.body.duration = duration;
        next();
    } else {
        return res.status(401).json({ message: `Bài học theo lesson_id:${lesson_id} trên đã tồn tại!` })
    }
}
export const convertToHLS = async (req, res, next) => {
    if (req.body.lesson_type != 1) return next();
    const hlsPath = `public/videos/hls/`;
    const videoPath = `public/videos/`;
    const uploadedFile = req.file;
    const socketID = req.headers["socket-id"];
    const status = {
        status : "pending",
        process_percent: 0,

    }
    if (socketID) return res.status(400).json({ message: "CLient chưa kết nối socket-id!" })
    const userIO = _io.to(socketID);
    const fileName = !uploadedFile ? null : uploadedFile.originalname;
    const inputFilePath = path.join(videoPath, fileName);
    await fs.promises.writeFile(inputFilePath, uploadedFile?.buffer)
    const m3u8FilePath = path.join(hlsPath, fileName + ".m3u8");
    const command = ffmpeg()
        .input(inputFilePath)
        .addOption('-f', 'hls')
        .addOption('-hls_time', 10)
        .addOption('-hls_list_size', 0)
        .addOption('-codec:v', 'libx264')
        .addOption('-preset', 'ultrafast')
        .addOption('-hls_flags', 'delete_segments')
        .output(m3u8FilePath)
        .on('progress', function (progress) {
            console.log('Processing: ' + progress.percent + '% done');
            userIO.emit("process_percent", progress.percent)
        })
        .on('end', async () => {
            console.log('HLS conversion finished.');
            // Remove the temporary input file
            await fs.promises.unlink(inputFilePath)
            console.log("ngừng")
            req.body.fileName = fileName;
            // userIO.emit("render-status", { status: "success", filePath: fileName.split(".").slice(0, -1).join("") + ".m3u8" })
            next();
        })
        .on('error', async (err) => {
            console.error('Error:', err);
            try {
                await getAndDeleteHLSFile(m3u8FilePath, hlsPath);
                await fs.promises.unlink(inputFilePath);
                return res.status(500).json({ messge: err })
            } catch (error) {
                console.log(error)
                return res.status(500).json({ messge: error?.message })
            }
        });

    command.run();

    const selectAction = switchAction(command);

    userIO.on("process-action", (action) => {
        let status = ""
            switch (action) {
                case "pause":
                    selectAction.Pause();
                    status = "";
                    break;
                case "remuse":
                    selectAction.Remuse();
                    break;
                case "cancle":
                    selectAction.Cancel();
                    break;
                default:
                    break;
            }
            // userIO.emit("process-status", {status: })

    })

    // await wait(2000)
    //     .then(() => {
    //     })
    // await wait(3000)
    //     .then(() => {
    //         selectAction.Cancel();
    //     })
}
