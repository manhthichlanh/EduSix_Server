import CourseModel from "../models/course.model";
import SectionModel from "../models/section.model";
import sequelize from "../models/db";
import fs from "fs";
import path from "path";
const uploadDir = "public/images";
//Nếu không tìm thấy thư mục thì tạo lại
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

export const createCourse = async (req, res) => {
    try {
        const t = await sequelize.transaction();
        const { category_id, name, slug, content, status, type, } = req.body
        const uploadedFile = req.file;
        const fileName = !uploadedFile ? null : Date.now() + '-' + uploadedFile.originalname.toLowerCase().split(" ").map(item => item.trim()).join("");

        const newRecord = await CourseModel.create(
            {
                category_id,
                name,
                number_of_lessons: 0,
                slug,
                content,
                status,
                type,
                thumbnail: fileName,
                total_course_time: 0
            },
            { transaction: t }
        );
        if (uploadedFile && newRecord) {
            const filePath = path.join(uploadDir, fileName);
            fs.writeFileSync(filePath, uploadedFile?.buffer, async (err) => {

                //Xóa nó khỏi bộ nhớ ram
                uploadedFile.buffer = null;

                if (err) {
                    await t.rollback();
                    return res.status(500).json({ error: 'Lỗi khi lưu tệp.' });
                }

            });
        }
        await t.commit();
        return res.status(201).json(newRecord);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const getAllCourse = async (req, res) => {
    try {
        const records = await CourseModel.findAll();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getCourseById = async (req, res) => {
    try {
        const record = await CourseModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            res.status(200).json(record);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getSectionCountByCourseId = async (req, res) => {
    try {
        const courseId = req.params.id;

        // Sử dụng phương thức `count` để đếm số lượng sections của course có courseId tương ứng
        const sectionCount = await SectionModel.count({
            where: { course_id: courseId }
        });

        res.status(200).json({ sectionCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateCourse = async (req, res) => {
    try {
        const record = await CourseModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            await record.update(req.body);
            res.status(200).json({ message: "Course updated successfully", data: record });  // Added success message
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const deleteCourse = async (req, res) => {
    try {
        const record = await CourseModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            await record.destroy();
            res.status(200).json({ message: 'Course deleted successfully!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};