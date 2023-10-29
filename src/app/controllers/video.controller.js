// import VideoModel from "../models/video.model";
// import sequelize from "../models/db";
// import fs, { existsSync, readFile, unlinkSync } from "fs";
// import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
// import ffmpeg from "fluent-ffmpeg";
// ffmpeg.setFfmpegPath(ffmpegPath);
// import path from "path";
// const uploadDir = "public/videos";
// //Nếu không tìm thấy thư mục thì tạo lại
// if (!existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }

// //Nếu không tìm thấy thư mục thì tạo lại

// import { findVideoDuration } from "../../utils/util.helper";
// import { fetchYoutube } from "../../utils/googleAPI";
// import AppError from "../../utils/appError";

// export const createVideo = async (req, res) => {
//     const uploadedFile = req.file;
//     const { lesson_id, youtube_id, status, tagetLessonRecord } = req.body;
//     const fileName = !uploadedFile ? null : uploadedFile.originalname + ".m3u8";
//     // try {
//     // const { buffer } = uploadedFile
//     let duration = 0;

//     if (tagetLessonRecord.type === 1) duration = findVideoDuration(uploadedFile?.buffer);
//     else if (tagetLessonRecord.type === 0) {
//         await fetchYoutube(youtube_id)
//             .then(res => {
//                 duration = res.duration
//             })
//             .catch(err => {
//                 console.log(err)
//                 return res.status(402).json({ message: "Chưa thể xác định được thông tin từ youtube_id bạn cung cấp!" })
//             })
//     }
//     try {
//         await sequelize.transaction(async (transaction) => {
//             const [row, created] = await VideoModel.findOrCreate({
//                 where: { lesson_id: lesson_id },
//                 defaults: {
//                     lesson_id,
//                     file_videos: fileName,
//                     youtube_id,
//                     duration,
//                     status,
//                     type: tagetLessonRecord.type
//                 },
//                 transaction
//             },)
            
//             if (created) throw new AppError(500, "fail","Tạo mới database thất bại!")

//             if (uploadedFile) {
//                 const filePath = path.join(uploadDir, fileName);

//                 const newBuffer = Buffer.from("Chào mày")
//                 //Create file hls type (m3u4)
//                 new ffmpeg() // Use the videoFileName based on your database query
//                     .input(newBuffer)
//                     .addOption('-hls_time', 10)
//                     .addOption('-hls_list_size', 0)
//                     .addOption('-f', 'hls')
//                     .addOption('-codec:v', 'libx264')
//                     .addOption('-preset', 'ultrafast')
//                     .addOption('-hls_flags', 'delete_segments')
//                     .output(filePath)
//                     .on('end', () => {
//                         console.log('HLS generation finished.');
//                         return res.status(201).json(row);
//                     })
//                     .on('error', (err) => {
//                         console.error('Error:', err);
//                         throw new AppError(500, "fail", err.message)
//                         return
//                     })
//                     .on('progress', function (progress) {
//                         console.log('Processing: ' + progress.percent + '% done');
//                         console.log(progress);
//                     })
//                     .run();
//             }
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(error.statusCode ? error.statusCode : 500).json({ message: error.message })
//     }


//     // } catch (error) {
//     //     console.log(error);
//     //     return res.status(error.statusCode ? error.statusCode : 500).json({ message: error?.message });
//     // }

// };
// export const getAllVideo = async (req, res) => {
//     try {
//         const records = await VideoModel.findAll();
//         res.status(200).json(records);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
// export const getVideoById = async (req, res) => {
//     try {
//         const record = await VideoModel.findByPk(req.params.id);
//         if (!record) {
//             res.status(404).json({ error: 'Record not found' });
//         } else {
//             res.status(200).json(record);
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
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
// export const deleteVideo = async (req, res) => {
//     const t = await sequelize.transaction();

//     try {

//         const record = await VideoModel.findByPk(req.params.id);

//         if (!record) {
//             await t.commit();
//             return res.status(404).json({ message: 'Không tìm thấy dữ liệu phù hợp với yêu cầu của bạn!' });
//         }

//         await record.destroy({ transaction: t });

//         if (record.file_videos) {
//             const videoFile = uploadDir + "/" + record.file_videos;
//             if (existsSync(videoFile)) {
//                 unlinkSync(videoFile);
//                 await t.commit();
//                 return res.status(501).json({ message: "Xóa thành công video!" })
//             } else {
//                 await t.rollback();
//                 return res.status(501).json({ message: "File video không tồn tại!" })
//             }
//         } else {
//             await t.commit();
//             return res.status(200).json({ message: "Xóa thành công video!" });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(501).json({ error })
//     }
// };
// export const getVideoStream = (req, res) => {
//     const videoName = req.params.videoName;
//     console.log(req.method)
//     const videoPath = `public/videos/${videoName}`; // Đường dẫn tới video
//     // Kiểm tra xem tệp video có tồn tại không
//     console.log(videoName)

//     if (!existsSync(videoPath)) {
//         return res.status(404).json({ error: 'Video not found' });
//     }

//     const stat = fs.statSync(videoPath);
//     const fileSize = stat.size;
//     const range = req.headers.range;
//     if (range) {
//         const parts = range.replace(/bytes=/, "").split("-");
//         const start = parseInt(parts[0], 10);
//         const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//         const chunksize = (end - start) + 1;
//         const file = fs.createReadStream(videoPath, { start, end });
//         const head = {
//             'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//             'Accept-Ranges': 'bytes',
//             'Content-Length': chunksize,
//             'Content-Type': 'video/mp2t',
//         };

//         res.writeHead(206, head);
//         file.pipe(res);
//     } else {
//         const head = {
//             'Content-Length': fileSize,
//             'Content-Type': 'video/mp2t',
//         };
//         res.writeHead(200, head);
//         fs.createReadStream(videoPath).pipe(res);
//     }
// };

