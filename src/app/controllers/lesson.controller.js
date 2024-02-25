import { generateRandomNumberWithRandomDigits } from "../../utils/util.helper";
import CourseModel from "../models/course.model";
import sequelize from "../models/db";
import LessonModel from "../models/lesson.model";
import SectionModel from "../models/section.model";
export const createLesson = async (req, res) => {
    try {
        const { section_id, name, content, lesson_type, duration } = req.body;
        const ramdomNumber = generateRandomNumberWithRandomDigits(1, 3);
        const durationTime = duration ?? ramdomNumber;
        const ordinal_number = ramdomNumber;

        const result = await sequelize.transaction(async (t) => {
            const section_current = await SectionModel.findOne({
                where: { section_id }
            })
            //Tìm tất cả các phần học chứa bài học trong inner join 3 bảng Courses, Sections, Lessons
            const { sections } = await CourseModel.findOne({
                where: {
                    course_id: section_current.course_id
                },
                include: [
                    {
                        model: SectionModel,
                        include: {
                            model: LessonModel
                        }
                    }
                ]
            })
            // let tính tổng sổ bài học
            const count_current_lesson = sections?.reduce((total, value) => {
                if (value) {
                    const { lessons } = value;
                    if (lessons.length == 0) return total;
                    const totalLessons = lessons.reduce((lessonTotal, currentLesson) => {
                        return lessonTotal + 1;
                    }, 0)
                    return total + totalLessons
                } else {
                    return total
                }
            }, 0
            )
            const LessonQuizzDoc = await LessonModel.create({
                section_id,
                name,
                content,
                status: true,
                type: lesson_type,
                duration: durationTime,
                ordinal_number,
                is_lock: count_current_lesson > 0 ? true : false
            }, { transaction: t });
            return LessonQuizzDoc
        });
        return res.status(200).json({lesson: result});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllLesson = async (req, res) => {
    try {
        const records = await LessonModel.findAll();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getLessonById = async (req, res) => {
    try {
        const record = await LessonModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            res.status(200).json(record);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getLessonBySectionId = async (req, res) => {
    const sectionId = req.params.sectionId;
    try {
        const record = await LessonModel.findOne({ where: { sectionId: sectionId } });
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            res.status(200).json(record);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const getLessonBySectionId1 = async (req, res) => {
    const sectionId = req.params.sectionId;
    try {
        const record = await LessonModel.findOne({ where: { section_id: sectionId } });
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            res.status(200).json(record);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateLesson = async (req, res) => {
    try {
        const record = await LessonModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            await record.update(req.body);
            res.status(200).json({ message: "Lesson updated successfully", data: record });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteLesson = async (req, res) => {
    try {
        const record = await LessonModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            await record.destroy();
            res.status(200).json({ message: 'Section deleted successfully!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

