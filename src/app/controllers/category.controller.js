import CourseModel from "../models/course.model";
import CategoryModel from "../models/category.model";
import sequelize from "../models/db";
import fs, { fsyncSync } from "fs";
import path from "path";
import AppError from "../../utils/appError";
/// đường dẫn thumbnail
const uploadDir = "public/images/logo-category";
const filePath = (fileName) => path.join(uploadDir, fileName);
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
export const createCategory = async (req, res) => {
    try {
        const uploadedFile = req.file;
        if (!uploadedFile) {
            return res.status(404).json({ message: 'Vui lòng nhập logo category!' });

        }
        // tạo category mới
        const { cate_name, status, ordinal_number } = req.body;
        const fileName = Date.now() + '-' + uploadedFile.originalname.toLowerCase().split(" ").map(item => item.trim()).join("");

        await sequelize.transaction(async (transaction) => {
            const newRecord = await CategoryModel.create(
                {
                    cate_name,
                    status,
                    ordinal_number,
                    logo_cate: fileName
                },
                { transaction }
            );
            await newRecord.update({ ordinal_number: newRecord.category_id }, { fields: ['ordinal_number'], transaction });

            const filePath = path.join(uploadDir, fileName);
            await fs.promises.writeFile(filePath, uploadedFile?.buffer);
            return res.status(201).json(newRecord);
        })
    } catch (error) {
        console.error("Error during category creation:", error);
        if (error instanceof AppError) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal Server Error", error: error.toString() });
        }
    }
};
export const getAllCategory = async (req, res) => {
    try {
        const records = await CategoryModel.findAll();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getCategoryById = async (req, res) => {
    try {
        const record = await CategoryModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            res.status(200).json(record);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateCategory = async (req, res) => {
    try {
        const record = await CategoryModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            await record.update(req.body);
            res.status(200).json({ message: "Category updated successfully", data: record });  // Added success message
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const record = await CategoryModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            await record.destroy();
            res.status(200).json({ message: 'Category deleted successfully!' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; export const getImage = async (req, res) => {
    const fileName = req.params.fileName;
    let file
    try {
        file = await fs.promises.readFile(filePath(fileName));
        return res.status(200).send(file)
    } catch (error) {
        return res.status(404).json({ message: "Không tìm thấy file!" })
    }
}