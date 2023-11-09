import LessonModel from "../models/lesson.model";
import VideoModel from "../models/video.model";
import QuizzModel from "./../models/quizz.models";
import SectionModel from "./../models/section.model"
import AnswerModel from "../models/answer.model";
import AppError from "../../utils/appError";
import sequelize from "../models/db";
import { Op } from "sequelize";
import path from "path";
import fs from "fs"
import { ReE, ReS } from '../../utils/util.service';
import { generateRandomNumberWithRandomDigits, getAndDeleteHLSFile } from "../../utils/util.helper";
import CourseModel from "../models/course.model";
export const createLessonWithVideo = async (req, res, next) => {
    const { section_id, name, content, lesson_type, file_videos, youtube_id, duration, video_type } = req.body;
    const uploadedFile = req.file;
    const fileName = uploadedFile.originalname;
    console.log(fileName)
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
            file_videos: fileName + ".m3u8",
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
                duration,
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

                if (answers && answers.length > 0) { }
                const answerRecords = await AnswerModel.bulkCreate(
                    answers.map((answer) => ({
                        answer: answer.answer,
                        isCorrect: answer.is_correct,
                        quizz_id: newQuiz.id,
                        explain: answer.explain,
                    })), { transaction: t }
                );


                return {
                    question: newQuiz.question,
                    status: newQuiz.status,
                    answer_type: newQuiz.answer_type,
                    answers: answerRecords,
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
export const deleteLessonQuizzVideo = async (req, res, next) => {
    const { lesson_id } = req.params; // Get lesson_id from req.params
    try {
        await sequelize.transaction(async (t) => {
            const lessonDoc = await LessonModel.findOne({
                where: { lesson_id },
                attributes: [`lesson_id`],
                include: [
                    {
                        model: VideoModel,
                        attributes: ['video_id', 'file_videos'],
                        required: false
                    },
                    {
                        model: QuizzModel,
                        attributes: ['id'], // Alias 'id' as 'quizz_id'
                        include: [
                            {
                                model: AnswerModel,
                                attributes: ['id'], // Alias 'id' as 'answer_id'
                            }
                        ],
                        required: false
                    }
                ]
            });

            if (!lessonDoc) {
                throw new Error('Không tìm thấy bài học với ID đã cho.');
            }
            // Xóa tất cả video
            if (lessonDoc.videos.length > 0) {
                for (const video of lessonDoc.videos) {
                    await VideoModel.destroy({
                        where: { video_id: video.video_id }
                    });
                    const hlsPath = "public/videos/hls/";
                    try {
                        await getAndDeleteHLSFile(hlsPath + video.file_videos, hlsPath)

                    } catch (error) {
                        console.log(error)
                    }
                }
            }
            if (lessonDoc.quizzs.length > 0) {
                // Xóa tất cả quiz và answers
                for (const quizz of lessonDoc.quizzs) {
                    // Xóa tất cả các câu trả lời
                    for (const answer of quizz.answers) {
                        await AnswerModel.destroy({
                            where: { id: answer.id } // Assuming 'id' is the correct attribute name in AnswerModel
                        });
                    }

                    // Xóa quiz sau khi xóa tất cả các câu trả lời
                    await QuizzModel.destroy({
                        where: { id: quizz.id } // Assuming 'id' is the correct attribute name in QuizzModel
                    });
                }
            }
            await LessonModel.destroy({ where: { lesson_id: lessonDoc.lesson_id } })

            return res.status(200).json({ message: "Xóa thành công bài học!" })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }

}
export const getAllLessonVideoQuizz = async (req, res) => {
    const lessonDoc = await LessonModel.findAll({
        include: [
            {
                model: VideoModel,
                attributes: ['video_id', 'lesson_id', 'file_videos', 'youtube_id', 'duration', 'status', 'type'],
                required: false
            },
            {
                model: QuizzModel,
                include: [
                    {
                        model: AnswerModel
                    }
                ],
                required: false
            }
        ],
        order: [[`ordinal_number`, 'DESC']]
    })
    return res.status(200).json({ lessonDoc })
}
export const getAllLessonVideoQuizzBySectionId = async (req, res) => {
    const { section_id  } = req.query;
    const page = parseInt(req.query.page, 5) || 1;
    const page_size = parseInt(req.query.page_size, 5) || 5;
    const offset = (page - 1) * page_size;
    const queryObject = {
        where: { section_id },
        include: [
            {
                model: VideoModel,
                attributes: ['video_id', 'lesson_id', 'file_videos', 'youtube_id', 'duration', 'status', 'type'],
                required: false
            },
            {
                model: QuizzModel,
                include: [
                    {
                        model: AnswerModel
                    }
                ],
                required: false
            }
        ],
        order: [[`ordinal_number`, 'DESC']],
        limit: page_size,
        offset: offset
    }
    const { count, rows } = await LessonModel.findAndCountAll(queryObject)
    return res.status(200).json({
        status: 'success',
        data: {
            totalItems: count,
            totalPages: Math.ceil(count / page_size),
            currentPage: page,
            pageSize: page_size,
            lessonDoc: rows
        }
    });
}

export async function getAllSectionLessonQuizzVideo(req, res, next) {
    try {
        const course_id = req.params.course_id;
        console.log(course_id)
        let sectionCount = 0;
        let LessonCount = 0;
        let TotalTime = 0;
        const CourseDoc = await CourseModel.findByPk(course_id);
        const SectionDoc = await SectionModel.findAll({
            where: { course_id },
            include: [
                {
                    model: LessonModel,

                    include: [
                        {
                            model: VideoModel,
                            attributes: ['video_id', 'lesson_id', 'file_videos', 'youtube_id', 'duration', 'status', 'type'],
                            required: false
                        },
                        {
                            model: QuizzModel,
                            include: [
                                {
                                    model: AnswerModel
                                }
                            ],
                            required: false
                        }
                    ]
                }
            ]
        });

        if (!SectionDoc) {
            console.log("loi ne");
        }
        sectionCount = SectionDoc.length;
        SectionDoc.map(section => {
            section.lessons.sort((a, b) => a.ordinal_number - b.ordinal_number); // Sắp xếp các bài học theo lesson_id tăng dần
            LessonCount += section.lessons.length;
            section.lessons.map(lesson => {
                TotalTime += lesson.duration;
            });
        });

        return ReS(res, { Course_Info: { sectionCount, LessonCount, TotalTime }, CourseDoc, SectionDoc }, 200);
    } catch (error) {
        next(error);
    }
}

// export async function getAllLessonQuizzVideo(req, res, next) {
//     try {
//         const section_id = req.params.section_id;

//         const SectionDoc = await LessonModel.findAll({
//             where: { section_id: section_id },
//             attributes: ['lesson_id', 'section_id', 'name', 'content', 'status', 'type', 'duration', 'ordinal_number'],
//             include: [{
//                 model: VideoModel,
//                 attributes: ['video_id', 'lesson_id', 'file_videos', 'youtube_id', 'duration', 'status', 'type']
//             },
//             {
//                 model: QuizzModel
//             }
//             ]
//         })
//         if(! SectionDoc) {
//             console.log("loi ne");
//         }
//         return ReS(
//             res,
//             {
//                 SectionDoc
//             },
//             200
//         );
//     } catch (error) {
//         next(error);
//     }
// }