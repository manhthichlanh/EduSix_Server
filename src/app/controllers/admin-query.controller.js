import LessonModel from "../models/lesson.model";
import VideoModel from "../models/video.model";
import AppError from "../../utils/appError";
import sequelize from "../models/db";
import { where } from "sequelize";
import fs from "fs";
const ffmpeg = require("fluent-ffmpeg")
import path from "path";
import { resume, pause } from "fluent-ffmpeg-util";
import { wait } from "../../utils/util.helper";
import { convertToHLS } from "../../utils/util.helper";
export const createLessonWithVideo = async (req, res) => {
    const { section_id, name, content, type, video } = req.body;
    const uploadedFile = req.file;

    const fileName = !uploadedFile ? null : Date.now() + '-' + uploadedFile.originalname.toLowerCase().normalize("NFD").replace(/[\u0300-\u036F]/g, "").replace(/đ/g, "d").split(" ").map(item => item.trim()).join("");

    const duration = 123;
    try {

    } catch (error) {

    }

    try {
        const result = await sequelize.transaction(async (t) => {
            // Tạo bài học mới
            const newLesson = await LessonModel.create({
                section_id, name, content, type, duration, ordinal_number: null
            }, { transaction: t });
            //Cập nhật trường thứ tự (ordinal_number = lesson_id) của lesson vừa tạo
            await newLesson.update({ ordinal_number: newLesson.lesson_id }, { fields: ['ordinal_number'], transaction: t });
            //Tạo video mới 
            const newVideo = await VideoModel.create({
                lesson_id: newLesson.lesson_id,
                file_videos: fileName,
                youtube_id: video.youtube_id,
                duration,
                type: newLesson.type
            }, { transaction: t })
            res.status(201).json({ newLesson, video: newVideo });
        });
    } catch (error) {
        console.log(error)
        return res.status(error.status ? error.status : 500).json({ message: error.message })
    }
}
export const uploadFile = async (req, res) => {
    const uploadedFile = req.file; 
    await convertToHLS(uploadedFile,res);
}

