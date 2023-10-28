import LessonModel from "../../models/lesson.model";
import QuizzModel from "../../models/quizz.models";
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
        const { section_id, name, content, type, duration, ordinal_number, question, progress, answers } = req.body;

        // Tạo một bài học mới
        const LessonQuizzDoc = await LessonModel.create({
            section_id,
            name,
            content,
            status: true, // Hoặc giá trị khác tùy theo yêu cầu
            type,
            duration,
            ordinal_number,
        });

        // Tạo một bài kiểm tra mới liên quan đến bài học vừa tạo
        const newQuizz = await QuizzModel.create({
            question,
            progress,
            lesson_id: LessonQuizzDoc.id, // Liên kết bài kiểm tra với bài học vừa tạo
            status: 0, // Hoặc giá trị khác tùy theo yêu cầu
        });

        if (answers && answers.length > 0) {
            // Tạo các câu trả lời cho bài kiểm tra
            const answerRecords = await AnswerModel.bulkCreate(
                answers.map((answer) => ({
                    answer: answer.answer,
                    isCorrect: answer.isCorrect,
                    quizz_id: newQuizz.id, // Liên kết câu trả lời với bài kiểm tra mới tạo
                    explain: answer.explain,
                }))
            );
        }

        res.json({ LessonQuizzDoc, newQuizz });
    } catch (error) {
        next(error);
    }
}

