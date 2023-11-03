import LessonModel from "../models/lesson.model";
import VideoModel from "../models/video.model";
import QuizzModel from "./../models/quizz.models";
import SectionModel from "./../models/section.model"
import AnswerModel from "../models/answer.model";
import AppError from "../../utils/appError";
import sequelize from "../models/db";
import path from "path";
import fs from "fs"
import { ReE, ReS } from '../../utils/util.service';

export const createLessonWithVideo = async (req, res) => {
    const { section_id, name, content, lesson_type, file_videos, youtube_id, duration, video_type, fileName } = req.body;
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
    await convertToHLS(uploadedFile, res);
    // await convertToHLS(uploadedFile, res);
    console.log(_io)
}

//Lesson And quizz
export async function getAllLessonQuizz(req, res, next) {
    try {
        const { lesson_id } = req.params.lesson_id;
        const LessonQuizzDoc = await QuizzModel.findAll({
            where: lesson_id, include: [{
                model: LessonModel
            }]
        });
        res.json(LessonQuizzDoc);
    } catch (error) {
        next(error)
    }
}

export async function createLessonQuizz(req, res, next) {
    try {
        const { section_id, name, content, type, duration, ordinal_number, quizzes } = req.body;

        const result = await sequelize.transaction(async (t) => {

            const LessonQuizzDoc = await LessonModel.create({
                section_id,
                name,
                content,
                duration,
                status: true,
                type,
                ordinal_number,
            }, { transaction: t });

            console.log("hai123");

            const createdQuizzes = await Promise.all(quizzes.map(async (questionData) => {
                const { question, status, answers } = questionData;

                const newQuiz = await QuizzModel.create({
                    question,
                    lesson_id: LessonQuizzDoc.lesson_id,
                    status,
                }, { transaction: t });

                console.log("run Question", newQuiz);

                if (answers && answers.length > 0) {
                    const answerRecords = await AnswerModel.bulkCreate(
                        answers.map((answer) => ({
                            answer: answer.answer,
                            isCorrect: answer.isCorrect,
                            quizz_id: newQuiz.id,
                            explain: answer.explain,
                        })), { transaction: t }
                    );
                }

                return newQuiz;
            }));

            return { LessonQuizzDoc, createdQuizzes };
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
}

export async function deleteLessonQuizz(req, res, next) {
    const { lesson_id } = req.params; // Get lesson_id from req.params

    try {
        await sequelize.transaction(async (t) => {
            // Find all quizzes based on lesson_id
            const quizzes = await QuizzModel.findAll({
                where: {
                    lesson_id: lesson_id
                }
            }, { transaction: t });

            if (quizzes && quizzes.length > 0) {
                // Iterate through quizzes and delete them one by one
                for (const quiz of quizzes) {
                    const quizz_id = quiz.id;

                    // Delete the quiz
                    await QuizzModel.destroy({
                        where: {
                            lesson_id: lesson_id
                        }
                    }, { transaction: t })

                    // Delete all answers related to the quiz
                    await AnswerModel.destroy({
                        where: {
                            quizz_id: quizz_id,
                        },
                    }, { transaction: t });
                    console.log("den day");
                    // Delete the lesson
                    await LessonModel.destroy({
                        where: {
                            lesson_id: lesson_id
                        },
                    }, { transaction: t });
                    console.log("den dsdsdsdy");

                }

                return res.status(200).json({ message: "Câu hỏi đã được xóa thành công." });

            } else {
                // Case where no quizzes are found
                res.status(404).json({ message: "Không tìm thấy câu hỏi cho bài học này" });
            }
        })
    } catch (error) {
        next(error);
    }
}
export async function getAllLessonQuizzVideo(req, res, next) {
    try {
        const section_id = req.params.section_id;

        const LessonDoc = await LessonModel.findAll({
            where: { section_id: section_id },
            attributes: ['lesson_id', 'section_id', 'name', 'content', 'status', 'type', 'duration', 'ordinal_number'],
            include: [{
                model: VideoModel,
                attributes: ['video_id', 'lesson_id', 'file_videos', 'youtube_id', 'duration', 'status', 'type']
            },
            {
                model: QuizzModel,
                attributes: ['id', 'question', 'process', 'status', 'lesson_id']
            }
            ]
        })
        return ReS(
            res,
            {
                LessonDoc
            },
            200
        );
    } catch (error) {
        next(error);
    }
}