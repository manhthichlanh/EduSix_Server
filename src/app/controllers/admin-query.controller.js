import LessonModel from "../models/lesson.model";
import VideoModel from "../models/video.model";
import QuizzModel from "./../models/quizz.models";
import AnswerModel from "../models/answer.model";
import { generateRandomNumberWithRandomDigits } from "../../utils/util.helper";
import AppError from "../../utils/appError";
import sequelize from "../models/db";
import path from "path";
import fs from "fs"
export const createLessonWithVideo = async (req, res, next) => {
    const { section_id, name, content, lesson_type, youtube_id, duration, video_type } = req.body;
    const uploadedFile = req.file;
    const fileName = !uploadedFile ? null : uploadedFile.originalname;
    const t = await sequelize.transaction();
    try {
        const ordinal_number = generateRandomNumberWithRandomDigits(1, 3);

        // await sequelize.transaction(async (t) => {
        // Tạo bài học mới
        const newLesson = await LessonModel.create({
            section_id, name, content, type: lesson_type, duration, ordinal_number
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

        if (newLesson.type == 1) {
            req.body.lessonWithVideo = { lesson: newLesson, video: newVideo }
            req.body.fileName = fileName;
            req.body.transaction = t;
            next();
        }
        else {
            res.status(201).json({ lesson: newLesson, video: newVideo });
            t.commit();
        }
        // });
    } catch (error) {
        await t.rollback();
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
        const { section_id, name, content, lesson_type, quizzes } = req.body;
        const duration = generateRandomNumberWithRandomDigits(1, 3);
        const ordinal_number = duration;
        const result = await sequelize.transaction(async (t) => {
            const LessonQuizzDoc = await LessonModel.create({
                section_id,
                name,
                content,
                status: true,
                type: lesson_type,
                duration,
                ordinal_number,
            }, { transaction: t });

            let durationSet = 0;
            const defaultTime = 60;
            console.log("hai123");

            const createdQuizzes = await Promise.all(quizzes.map(async (questionData, index) => {
                durationSet = (index + 1) * defaultTime;
                console.log(index + 1)
                const { question, status, answers, answer_type } = questionData;

                const newQuiz = await QuizzModel.create({
                    question,
                    answer_type,
                    lesson_id: LessonQuizzDoc.lesson_id,
                    status,
                }, { transaction: t });
                // return newQuiz
                console.log("run Question", newQuiz);
                if (!(answers && answers.length > 0)) { throw new AppError(400, "fail", "Bạn vui lòng nhập thêm các câu trả lời cho câu hỏi!") }
                const newAnswer = await AnswerModel.bulkCreate(
                    answers.map((answer) => ({
                        answer: answer.answer,
                        is_correct: answer.isCorrect,
                        quizz_id: newQuiz.id,
                        explain: answer.explain,
                    })), { transaction: t }
                );
                console.log(newAnswer)

                console.log("run complete");

                return {
                    question: newQuiz.question,
                    status: newQuiz.status,
                    answer_type: newQuiz.answer_type,
                    answers: newAnswer,
                };
            }));
            await LessonQuizzDoc.update({ ordinal_number: LessonQuizzDoc.lesson_id, duration: durationSet }, { fields: ['ordinal_number', 'duration'], transaction: t });

            return { LessonQuizzDoc, createdQuizzes };
        });
        res.json(result);
    } catch (error) {
        next(error);
    }
}

// Tạo một bài kiểm tra mới liên quan đến bài học vừa tạo
// Tạo một bài kiểm tra mới liên quan đến bài học vừa tạo
// const newQuizz = await QuizzModel.create({
//     question,
//     lesson_id: LessonQuizzDoc.lesson_id, // Liên kết bài kiểm tra với bài học vừa tạo
//     status: 0, // Hoặc giá trị khác tùy theo yêu cầu
// }, { transaction: t });

// if (answers && answers.length > 0) {
//     // Tạo các câu trả lời cho bài kiểm tra
//     const answerRecords = await AnswerModel.bulkCreate(
//         answers.map((answer) => ({
//             answer: answer.answer,
//             isCorrect: answer.isCorrect,
//             quizz_id: newQuizz.id, // Liên kết câu trả lời với bài kiểm tra mới tạo
//             explain: answer.explain,
//         })), { transaction: t }
//     );
// }

// If everything was successful, commit the transaction
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
