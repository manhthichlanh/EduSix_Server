import CourseModel from "../models/course.model";
import SectionModel from "../models/section.model";
import sequelize from "../models/db";
import fs, { fsyncSync } from "fs";
import path from "path";
import AppError from "../../utils/appError";
//Đường dẫn chứa ảnh thumbnail 
const uploadDir = "public/images/course-thumbnail";
const filePath = (fileName) => path.join(uploadDir, fileName);

//Nếu không tìm thấy thư mục thì tạo lại
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

export const createCourse = async (req, res) => {
    try {
        // Xác thực dữ liệu
        const uploadedFile = req.file;

        if (!uploadedFile) {
            return res.status(400).json({ message: "Vui lòng upload file thumbnail!" });
        }

        // Tạo khóa học
        const { category_id, user_id, name,course_price, slug, content, status, type } = req.body;
        const fileName = Date.now() + '-' + uploadedFile.originalname.toLowerCase().split(" ").map(item => item.trim()).join("");

        await sequelize.transaction(async (transaction) => {
            const newRecord = await CourseModel.create(
                {
                    category_id,
                    user_id,
                    name,
                    course_price:0,
                    // number_of_lessons: 0,
                    slug,
                    content,
                    status,
                    type,
                    thumbnail: fileName,
                    total_course_time: 0
                },
                { transaction }
            );
            // Lưu tệp thumbnail
            const filePath = path.join(uploadDir, fileName);

            await fs.promises.writeFile(filePath, uploadedFile?.buffer);
            // Trả về phản hồi thành công
            return res.status(201).json(newRecord);
        })
    } catch (error) {
        console.error("Error during course creation:", error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: error.toString() });
        }
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
    console.time("test")
    try {
        const record = await CourseModel.findByPk(req.params.id);

        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        // Xác thực dữ liệu
        const uploadedFile = req.file;
        const oldPatch = filePath(record.thumbnail);

        if (!uploadedFile) {
            return res.status(400).json({ message: "Vui lòng upload file thumbnail!" });
        }

        const { category_id, user_id, name,course_price, slug, content, status, type } = req.body;
        const fileName = Date.now() + '-' + uploadedFile.originalname.toLowerCase().split(" ").map(item => item.trim()).join("");

        await sequelize.transaction(async (t) => {

            await record.update(
                {
                    category_id,
                    user_id,
                    name,
                    // number_of_lessons: 0,
                    course_price,
                    slug,
                    content,
                    status,
                    type,
                    thumbnail: fileName,
                    total_course_time: 0
                },
                { transaction: t }
            )
            const newPath = filePath(fileName)
            await fs.promises.writeFile(oldPatch, uploadedFile?.buffer);
            await fs.promises.rename(oldPatch, newPath);

        })
        console.timeEnd("test")

        return res.status(200).json({ message: "Course updated successfully", data: record });  // Added success message
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }


};

export const deleteCourse = async (req, res) => {
    try {
        await sequelize.transaction(async (t) => {
            const record = await CourseModel.findByPk(req.params.id);

            if (!record) {
                throw new AppError(400, "", "Không tìm thấy khóa học!");
            }

            await record.destroy({ transaction: t });
            if (record.thumbnail) {
                const thumbnailImage = uploadDir + "/" + record.thumbnail;
                if (fs.existsSync(thumbnailImage)) {
                    fs.unlinkSync(thumbnailImage);
                    res.status(200).json({ message: 'Xóa thành công khóa học!' });
                } else {
                    throw new AppError(500, "", "File ảnh không tồn tại!");
                }
            } else {
                return res.status(200).json({ message: "Xóa thành công khóa học!" });
            }
        });

    } catch (error) {
        console.log(error)
        res.status(error.statusCode ? error.statusCode : 500).json({ message: error.message });
    }
};

export const getImage = async (req, res) => {
    const fileName = req.params.fileName;
    let file
    try {
        file = await fs.promises.readFile(filePath(fileName));
        return res.status(200).send(file)
    } catch (error) {
        return res.status(404).json({message: "Không tìm thấy file!"})
    }
}
