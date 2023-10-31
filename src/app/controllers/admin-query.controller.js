import LessonModel from "../models/lesson.model";
import VideoModel from "../models/video.model";
import AppError from "../../utils/appError";
import sequelize from "../models/db";
export const createLessonWithVideo = async (req, res) => {
    const { section_id, name, content, lesson_type, file_videos, youtube_id, duration, video_type,fileName } = req.body;
    try {
        await sequelize.transaction(async (t) => {
            // Tạo bài học mới
            const newLesson = await LessonModel.create({
                section_id, name, content, type: lesson_type, duration, ordinal_number: null
            }, { transaction: t });
            //Cập nhật trường thứ tự (ordinal_number = lesson_id) của lesson vừa tạo
            await newLesson.update({ ordinal_number: newLesson.lesson_id }, { fields: ['ordinal_number'], transaction: t });
            //Tạo video mới 
            const newVideo = await VideoModel.create({
                lesson_id: newLesson.lesson_id,
                file_videos: fileName,
                youtube_id: youtube_id,
                duration,
                type: video_type
            }, { transaction: t })

            res.status(201).json({ lesson: newLesson, video: newVideo });
        });
    } catch (error) {
        console.log(error)
        return res.status(error.status ? error.status : 500).json({ message: error.message })
    }
}
export const uploadFile = async (req, res) => {
    const uploadedFile = req.file;
    // await convertToHLS(uploadedFile, res);
    console.log(_io)
}

