import VideoModel from "../models/video.model";
import sequelize from "../models/db";
import fs, { existsSync, readFile, unlinkSync } from "fs";
// import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { generateRandomString, getAndDeleteHLSFile } from "../../utils/util.helper";
const uploadDir = "public/videos";
//Nếu không tìm thấy thư mục thì tạo lại
if (!existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// //Nếu không tìm thấy thư mục thì tạo lại

// import { findVideoDuration } from "../../utils/util.helper";
// import { fetchYoutube } from "../../utils/googleAPI";
// import AppError from "../../utils/appError";

export const createVideo = async (req, res) => {
    const { lesson_id, duration, youtube_id, lesson_type, videoObjectId } = req.body;

    try {
        await VideoModel.create({
            lesson_id: lesson_id,
            file_videos: videoObjectId,
            youtube_id: youtube_id,
            duration,
            type: lesson_type
        });
        return res.status(200).json({message: "Đăng tải video thành công!"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message })
    }
};
export const getAllVideo = async (req, res) => {
    try {
        const records = await VideoModel.findAll();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getVideoById = async (req, res) => {
    try {
        const record = await VideoModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            res.status(200).json(record);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// export const updateVideo = async (req, res) => {

//     const uploadedFile = req.file;
//     const { youtube_id, status, lesson_id, tagetLessonRecord } = req.body;

//     const t = await sequelize.transaction();

//     try {

//         //Tìm video theo khóa chính
//         const record = await VideoModel.findByPk(req.params.id);

//         if (!record) {
//             return res.status(404).json({ error: 'Không tìm thấy dữ liệu phù hợp với yêu cầu của bạn!' });
//         }
//         const { file_videos } = record;
//         //Tìm video theo khóa chính

//         //Tìm thời lượng video
//         let duration = 0;

//         if (tagetLessonRecord.type === 1) duration = findVideoDuration(uploadedFile?.buffer);
//         else if (tagetLessonRecord.type === 0) {
//             await fetchYoutube(youtube_id)
//                 .then(res => {
//                     duration = res.duration
//                 })
//                 .catch(err => {
//                     console.log(err)
//                     return res.status(402).json({ message: "Chưa thể xác định được thông tin từ youtube_id bạn cung cấp!" })
//                 })
//         }
//         //Tìm thời lượng video

//         //Cập nhật video trên database
//         const fileName = !uploadedFile ? null : Date.now() + '-' + uploadedFile.originalname.toLowerCase().split(" ").map(item => item.trim()).join("");

//         const result = await record.update(
//             {
//                 file_videos: fileName,
//                 lesson_id: lesson_id,
//                 youtube_id,
//                 duration,
//                 status,
//                 type: tagetLessonRecord.type,
//                 update_at: Date.now(),
//             }, { transaction: t }
//         )
//         if (result === 0) {
//             throw new Error("Cập nhất thất bại!");
//             return;
//         }
//         //Cập nhật video trên database

//         //Cập nhật video trên file path
//         if (uploadedFile) {
//             const oldFilePath = uploadDir + "/" + file_videos;
//             // Kiểm tra xem tệp cũ có tồn tại không và xóa nó
//             if (existsSync(oldFilePath)) {

//                 const filePath = path.join(uploadDir, fileName);

//                 fs.writeFile(filePath, uploadedFile.buffer, async (err) => {
//                     if (err) {
//                         await t.rollback();
//                         return res.status(500).json({ error: 'Lỗi khi lưu tệp.' });
//                     }
//                 });
//                 unlinkSync(oldFilePath)

//                 await t.commit();
//                 return res.status(200).json({ message: "Cập nhật thành công!", payload: await result.save() })


//             } else {
//                 await t.rollback();
//                 return res.status(400).json({ error: 'Video file không tồn tại!.' });
//             }
//         } else {
//             await t.commit();
//             return res.status(200).json({ message: "Cập nhật thành công!", payload: await result.save() })
//         }
//         //Cập nhật video trên file path
//     } catch (error) {
//         console.log(error);
//         return res.status()
//     }

// };

export const createVideoStream = async (req, res) => {
    // const { _videosDir, _segmentsDir, _tempDir, handlePath } = _staticPath;
    // const videosObjectId = generateRandomString(11);
    // const videosFile
}

export const deleteVideo = async (req, res) => {
    const t = await sequelize.transaction();

    try {

        const record = await VideoModel.findByPk(req.params.id);

        if (!record) {
            await t.commit();
            return res.status(404).json({ message: 'Không tìm thấy dữ liệu phù hợp với yêu cầu của bạn!' });
        }

        await record.destroy({ transaction: t });

        if (record.file_videos) {
            const videoFile = uploadDir + "/" + record.file_videos;
            if (existsSync(videoFile)) {
                unlinkSync(videoFile);
                await t.commit();
                return res.status(501).json({ message: "Xóa thành công video!" })
            } else {
                await t.commit();
                return res.status(200).json({ message: "File video không tồn tại!" })
            }
        } else {
            await t.commit();
            return res.status(200).json({ message: "Xóa thành công video!" });
        }
    } catch (error) {
        console.log(error);
        return res.status(501).json({ error })
    }
};
export const getVideoStream = async (req, res) => {
    const fileName = req.params.videoName;
    if (fileName.split(".").slice(0, -1) === "") {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('file not found: %s\n', fileName);
        return res.end();
    }
    // console.log(fileName)
    console.log(fileName)
    const hlsPath = "public/videos/hls/"
    const filePath = path.join(hlsPath, fileName)
    // console.log(filePath)
    // try {
    //     if (!fs.existsSync(filePath)) {
    //         // console.log("cóa")
    //         console.log('file not found: ' + fileName);
    //         res.writeHead(404, { 'Content-Type': 'text/plain' });
    //         res.write('file not found: %s\n', fileName);
    //         res.end();
    //     }
    // } catch (error) {
    //     console.log(error)
    // }

    switch (path.extname(fileName)) {
        case ".m3u8":
            fs.readFile(filePath, "utf-8", function (err, data) {
                if (data) {
                    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
                    res.end(data);
                }
                if (err) {
                    console.log(err)
                }
            });

            break;
        case ".ts":
            fs.stat(filePath, (err, stat) => {
                if (err) {
                    console.log(err)
                }
                if (stat) {
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
                }
            }
            );

            break;
        default:

            break;
    }
}
export const getVideoStreamV2 = async (req, res) => {
    const fileName = req.params.fileName;
    const objectId = req.params.objectId;
    if (fileName.split(".").slice(0, -1) === "") {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('file not found: %s\n', fileName);
        return res.end();
    }
    const { handlePath, _videosDir } = _staticPath;
    const currentVideoPath = handlePath(_videosDir, objectId).join;
    const segmentsPath = handlePath(currentVideoPath + "/segments", fileName).join;
    const manifestPath = handlePath(currentVideoPath, "master.m3u8").join
    switch (path.extname(fileName)) {
        case ".m3u8":
            console.log("đang select manifest File")
            fs.readFile(manifestPath, "utf-8", function (err, data) {
                if (data) {
                    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
                    res.end(data);
                }
                if (err) {
                    console.log(err)
                }
            });

            break;
        case ".ts":
            console.log("đang select segments File")
            fs.stat(segmentsPath, (err, stat) => {
                if (err) {
                    console.log(err)
                }
                if (stat) {
                    const fileSize = stat.size;
                    const range = req.headers.range;
                    if (range) {
                        const parts = range.replace(/bytes=/, "").split("-");
                        const start = parseInt(parts[0], 10);
                        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                        const chunksize = (end - start) + 1;
                        const file = fs.createReadStream(segmentsPath, { start, end });
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
                        fs.createReadStream(segmentsPath).pipe(res);
                    }
                }
            }
            );

            break;
        case ".jpg":
            try {
                const imagePath = handlePath(currentVideoPath + "/thumbnail", fileName).join;
                const file = await fs.promises.readFile(imagePath);
                console.log(file)
                return res.status(200).send(file);
            } catch (error) {
                return res.status(404).json({ message: "Không tìm thấy file!" })
            }

        default:

            break;
    }
}
export const getAllVideosJson = async (req, res) => {
    const videosPath = "public/videos/"

    // Sử dụng fs.readdir để đọc danh sách tên file trong thư mục
    const videos = {}

    try {
        const videosFolderFiles = await fs.promises.readdir(videosPath)
        const hlsFolderFiles = await fs.promises.readdir(videosPath + "hls")
        videos.videosFolderFiles = videosFolderFiles;
        videos.hlsFolderFiles = hlsFolderFiles;
    } catch (error) {
        console.error('Lỗi khi đọc thư mục:', err);
        return res.status(500).json({ error: 'Lỗi khi đọc thư mục videos' });
    }

    return res.status(200).json({ message: "Lấy file thành công!", videos })
}
export const deleteVideosTempFile = async (req, res) => {
    const files = req.body.files;
    const isAll = req.body.isAll;
    const type = req.params.type;
    const videosPath = "public/videos/";
    const hlsPath = "public/videos/hls/";
    const fileToExclude = "hls";
    try {
        switch (type) {
            case "temp":

                if (isAll) {
                    fs.readdir(videosPath, (err, files) => {
                        if (err) {
                            console.error('Lỗi khi đọc thư mục:', err);
                            return;
                        }

                        files.forEach((fileName) => {
                            if (fileName !== fileToExclude) {
                                const filePath = path.join(videosPath, fileName);
                                try {
                                    // Sử dụng fs.unlinkSync để xóa tệp
                                    fs.unlinkSync(filePath);
                                    console.log(`Đã xóa tệp: ${fileName}`);
                                } catch (error) {
                                    console.error(`Lỗi khi xóa tệp ${fileName}: ${error}`);
                                }
                            }
                        });
                    });
                } else {
                    if (!files || files?.length == 0) {
                        return res.status(400).json(`Không ${files ? "có" : "tìm thấy"} file để xóa!`)
                    }
                    console.log("cóa")
                    files.forEach((fileName) => {
                        if (fileName !== fileToExclude) {
                            const filePath = path.join(videosPath, fileName);
                            try {
                                // Sử dụng fs.unlinkSync để xóa tệp
                                fs.unlinkSync(filePath);
                                console.log(`Đã xóa tệp: ${fileName}`);
                            } catch (error) {
                                console.error(`Lỗi khi xóa tệp ${fileName}: ${error}`);
                            }
                        }
                    });
                }
                return res.status(200).json({ message: "Xóa temp files thành công" })

            case "hls":
                if (isAll) {
                    fs.readdir(hlsPath, (err, files) => {
                        if (err) {
                            console.error('Lỗi khi đọc thư mục:', err);
                            return;
                        }
                        files.forEach((fileName) => {
                            const filePath = path.join(hlsPath, fileName);
                            try {
                                // Sử dụng fs.unlinkSync để xóa tệp
                                fs.unlinkSync(filePath);
                                console.log(`Đã xóa tệp: ${fileName}`);
                            } catch (error) {
                                console.error(`Lỗi khi xóa tệp ${fileName}: ${error}`);
                            }

                        });
                    });
                } else {
                    files.forEach(async (fileName) => {
                        const filePath = path.join(hlsPath, fileName);
                        try {
                            // Sử dụng fs.unlinkSync để xóa tệp
                            await getAndDeleteHLSFile(filePath, hlsPath)
                        } catch (error) {
                            console.error(`Lỗi khi xóa tệp ${fileName}: ${error}`);
                        }

                    });

                }
                return res.status(200).json({ message: "Xóa hls files thành công" })
            default:
                break;
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }


}
