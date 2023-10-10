import QuizzModel from "../models/quizz.models";
import AnswerModel from "../models/answer.model";
import AppError from '../../utils/appError';
import { errorCode } from '../../utils/util.helper';


export const getAllQuizz = async (req, res, next) => {
    const lesson_id = req.params.lesson_id;
    try {
        const QuizzDocs = await QuizzModel.findAll({
            where: { lesson_id },
            include: [
                {
                    model: AnswerModel,
                    as: "relaQuizz",
                },
            ],
        });
        res.json(QuizzDocs); // Trả về kết quả cho client
    } catch (error) {
        next(error);
    }
};
export const getDetailQuizz = async (req, res, next) => {
    const id = req.params.id;
    try {
        const QuizzDoc = await QuizzModel.findByPk(id, {
            include: [
                {
                    model: AnswerModel,
                    as: "relaQuizz",
                },
            ],
        });
        res.json(QuizzDoc); // Trả về kết quả cho client
    } catch (error) {
        next(error);
    }
};

export const createQuizz = async (req, res, next) => {
    try {
        const { question, progress, lesson_id, status, answers } = req.body;
        const newQuizz = await QuizzModel.create({
            question,
            progress,
            lesson_id,
            status,
        });
        if (answers && answers.length > 0) {
            const answerRecords = await AnswerModel.bulkCreate(
                answers.map((answer) => ({
                    answer: answer.answer,
                    isCorrect: answer.isCorrect,
                    quizz_id: newQuizz.id, // Liên kết câu trả lời với câu hỏi mới tạo
                    explain: answer.explain,
                }))
            );
        }
        // Trả về kết quả
        return res.status(201).json(newQuizz);
    } catch (error) {
        next(error);
    }
};

export const updateQuizz = async (req, res, next) => {
    try {
        const quizz_id = req.params.id;
        const { question, progress, lesson_id, status, answers } = req.body;

        // Kiểm tra xem câu hỏi tồn tại dựa trên quizz_id
        const existingQuizz = await QuizzModel.findByPk(quizz_id);

        if (!existingQuizz) {
            return res.status(404).json({ message: "Câu hỏi không tồn tại." });
        }

        // Cập nhật thông tin câu hỏi
        existingQuizz.question = question;
        existingQuizz.progress = progress;
        existingQuizz.lesson_id = lesson_id;
        existingQuizz.status = status;

        // Lưu câu hỏi đã cập nhật
        await existingQuizz.save();

        // Lặp qua danh sách câu trả lời mới được gửi trong yêu cầu
        if (answers && answers.length > 0) {
            for (const answerData of answers) {
                let existingAnswer;

                // Kiểm tra xem câu trả lời đã tồn tại dựa trên answer_id (nếu có)
                if (answerData.id) {
                    existingAnswer = await AnswerModel.findByPk(answerData.id);
                }

                // Nếu câu trả lời tồn tại, cập nhật nó
                if (existingAnswer) {
                    existingAnswer.answer = answerData.answer;
                    existingAnswer.isCorrect = answerData.isCorrect;
                    existingAnswer.explain = answerData.explain;
                    await existingAnswer.save();
                }
            }
        }

        return res.status(200).json({ message: "Câu hỏi và câu trả lời đã được cập nhật thành công." });
    } catch (error) {
        next(error);
    }
};
export const deleteQuizzById = async (req, res, next) => {
    try {
        const quizz_id = req.params.id;

        // Kiểm tra xem câu hỏi tồn tại dựa trên quizz_id
        const existingQuizz = await QuizzModel.findByPk(quizz_id);

        if (!existingQuizz) {
            return res.status(404).json({ message: "Câu hỏi không tồn tại." });
        }

        // Xóa câu hỏi
        await existingQuizz.destroy();

        // Xóa tất cả câu trả lời liên quan đến câu hỏi
        await AnswerModel.destroy({
            where: {
                quizz_id: quizz_id,
            },
        });

        return res.status(200).json({ message: "Câu hỏi đã được xóa thành công." });
    } catch (error) {
        next(error);
    }
};
