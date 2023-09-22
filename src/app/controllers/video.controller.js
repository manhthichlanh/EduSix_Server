import videoModel from "../models/video.model";
import fs from "fs";
import uploadVideo from "../configs/uploadVideo.config";
export const createVideo = async (req, res) => {
    const { filename } = req.file;
    const { lesson_id, youtube_id, duration, status, type } = req.body;
    try {
        const newRecord = await videoModel.create({
            lesson_id,
            file_videos: filename,
            youtube_id,
            duration,
            status,
            type
        });
        res.status(201).json(newRecord);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            // Xử lý lỗi khi trường lesson_id bị trùng lặp
            res.status(400).json({ error: 'Trường lesson_id bị trùng lặp.' });
        } else {
            // Xử lý các lỗi khác
            res.status(400).json({ error: error.message });
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
    try {
        const record = await videoModel.findByPk(req.params.id);

        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }


        uploadVideo.single('file_videos')(req, res, async (err) => {
            if (err) {
                console.error('Lỗi khi tải lên tệp:', err);
                res.status(500).send('Lỗi khi tải lên tệp.');
            } else {
                const oldFilePath = 'public/videos/' + record.file_videos;

                // Kiểm tra xem tệp cũ có tồn tại không và xóa nó
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                } else {
                    res.status(400).json({ error: 'Video file không tồn tại!.' });

                }

                const { filename } = req.file;
                const { lesson_id, youtube_id, duration, status, type } = req.body;

                await record.update({
                    lesson_id,
                    file_videos: filename,
                    youtube_id,
                    duration,
                    status,
                    type,
                    update_at: Date.now(),
                })
                .then((updatedRecord) => {
                    // Xử lý khi cập nhật thành công
                    res.status(200).json({ message: 'Cập nhật thông tin video thành công.' });
                })
                .catch((error) => {
                    if (error.name === 'SequelizeUniqueConstraintError') {
                        console.error('Trường lesson_id bị :', error);
                        res.status(400).json({ error: 'Trường lesson_id bị trùng lặp.' });
                    }
                });

            }
        });


    } catch (error) {
        console.error('Lỗi khi cập nhật video:', error);
        res.status(500).json({ error: 'Lỗi khi cập nhật video.' });
    }

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

