import videoModel from "../models/video.model";
import fs from "fs";
import uploadVideo from "../configs/uploadVideo.config";
import path from "path";
const uploadDir = "public/videos";
//Nếu không tìm thấy thư mục thì tạo lại
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
//Nếu không tìm thấy thư mục thì tạo lại

export const createVideo = async (req, res) => {
    const uploadedFile = req.file;
    const { lesson_id, youtube_id, duration, status, type } = req.body;

    // Kiểm tra điều kiện 1: Không có tệp tải lên thì phải có youtube_id
    if (!uploadedFile && !youtube_id) {
        return res.status(400).json({ error: 'Không có tệp tải lên hoặc youtube_id.' });
    }

    // Kiểm tra điều kiện 2: Chỉ có một trong hai được null
    if ((!uploadedFile && !youtube_id) || (uploadedFile && youtube_id)) {
        return res.status(400).json({ error: 'Bạn phải upload file video hoặc có youtube_id!' });
    }

    // Xử lý tiếp
    const fileName = !uploadedFile ? null : Date.now() + '-' + uploadedFile.originalname.toLowerCase().split(" ").map(item => item.trim()).join("");
    try {
        await videoModel.create({
            lesson_id,
            file_videos: fileName,
            youtube_id,
            duration,
            status,
            type: uploadedFile ? 1 : 0
        })
            .then((successData) => {
                if (uploadedFile) {
                    const filePath = path.join(uploadDir, fileName);
                    fs.writeFile(filePath, uploadedFile.buffer, (err) => {
                        if (err) {
                            return res.status(500).json({ error: 'Lỗi khi lưu tệp.' });
                        }
                        //Xóa nó khỏi bộ nhớ ram
                        uploadedFile.buffer = null;

                    });
                }
                // Trả về phản hồi thành công
                return res.status(201).json(successData);
            });
    } catch (err) {
        //Xóa nó khỏi bộ nhớ ram
        if (uploadedFile) uploadedFile.buffer = null;
        // Không tải lên tệp và trả về phản hồi
        if (err.name === 'SequelizeUniqueConstraintError') {
            console.log(err)
            return res.status(400).json({ error: err.errors[0].message });
        } else {
            return res.status(400).json({ error: err.errors[0].message });
        }
    }
};



export const getAllVideo = async (req, res) => {
    try {
        const records = await videoModel.findAll();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getVideoById = async (req, res) => {
    try {
        const record = await videoModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            res.status(200).json(record);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateVideo = async (req, res) => {

    const uploadedFile = req.file;

    if (!uploadedFile) {
        return res.status(400).json({ error: 'Không có tệp tải lên.' });
    }

    await videoModel.findByPk(req.params.id)
        .then(record => {
            if (!record) {
                return res.status(404).json({ error: 'Record not found' });
            }


            const oldFilePath = uploadDir + "/" + record.file_videos;
            // Kiểm tra xem tệp cũ có tồn tại không và xóa nó
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            } else {
                return res.status(400).json({ error: 'Video file không tồn tại!.' });
            }
            return record
        })
        .then(async record => {
            const { lesson_id, youtube_id, duration, status, type } = req.body;

            const fileName = Date.now() + '-' + uploadedFile.originalname.toLowerCase().split(" ").map(item => item.trim()).join("");

            await record.update({
                lesson_id,
                file_videos: fileName,
                youtube_id,
                duration,
                status,
                type,
                update_at: Date.now(),
            })
                .then((successData) => {
                    // Xử lý khi cập nhật thành công
                    const filePath = path.join(uploadDir, fileName);
                    fs.writeFile(filePath, uploadedFile.buffer, (err) => {
                        if (err) {
                            return res.status(500).json({ error: 'Lỗi khi lưu tệp.' });
                        }
                        //Xóa nó khỏi bộ nhớ ram
                        uploadedFile.buffer = null;

                        // Trả về phản hồi thành công
                        return res.status(201).json(successData);
                    });
                    return res.status(200).json({ message: 'Cập nhật thông tin video thành công.' });
                })
                .catch((error) => {

                    uploadedFile.buffer = null;

                    if (error.name === 'SequelizeUniqueConstraintError') {
                        console.error('Trường lesson_id bị :', error);
                        return res.status(400).json({ error: 'Trường lesson_id bị trùng lặp.' });
                    }
                });
        })
        .catch(err => {
            console.log(err)
            return res.status(501).json({ error: 'Server is error' });
        })

};

export const deleteVideo = async (req, res) => {
    try {
        const record = await videoModel.findByPk(req.params.id);

        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            await record.destroy();
            // Kiểm tra xem tệp cũ có tồn tại không và xóa nó
            const oldFilePath = 'public/videos/' + record.file_videos;

            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            } else {
                res.status(501).json({ message: "Video not exist!" })
            }

            res.status(200).json({ message: 'Video deleted successfully!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getVideoStream = (req, res) => {
    const videoName = req.params.videoName;
    const videoPath = `public/videos/${videoName}`; // Đường dẫn tới video
    // Kiểm tra xem tệp video có tồn tại không
    console.log(videoName)

    if (!fs.existsSync(videoPath)) {
        return res.status(404).json({ error: 'Video not found' });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(videoPath, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };

        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(videoPath).pipe(res);
    }
};

