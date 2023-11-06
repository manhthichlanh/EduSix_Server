import SectionModel from "../models/section.model";
import CourseModel from "../models/course.model";
import sequelize from "../models/db";
export const createSection = async (req, res) => {
    try {
        await sequelize.transaction(async (t) => {
            const { course_id, name, status } = req.body;
            const newRecord = await SectionModel.create({ course_id, name, status, ordinal_number: 0 }, { transaction: t });
            await newRecord.update({ ordinal_number: newRecord.section_id }, { fields: ['ordinal_number'], transaction: t });
            return res.status(201).json(newRecord);
        })

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const getAllSection = async (req, res) => {
    try {
        const records = await SectionModel.findAll();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getAllSectionWithCourse = async (req, res) => {
    try {
        const records = await SectionModel.findAll({
            include: [
                CourseModel
            ]
        });

        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const SectionPage = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 5) || 1;
        const page_size = parseInt(req.query.page_size, 5) || 5;

        const offset = (page - 1) * page_size;
        
        const { count, rows } = await SectionModel.findAndCountAll({
            
            limit: page_size,
            offset: offset
        });

        res.status(200).json({
            status: 'success',
            data: {
                totalItems: count,
                totalPages: Math.ceil(count / page_size),
                currentPage: page,
                pageSize: page_size,
                courses: rows
            }
        });
    } catch (error) {
        next(error);
    }
};
export const getSectionById = async (req, res) => {
    try {
        const record = await SectionModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            res.status(200).json(record);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getSectionCourse = async (req, res) => {
    try {
        const section = await SectionModel.findByPk(req.params.id);
        if (!section) {
            res.status(404).json({ error: 'Section not found' });
            return;
        }

        // Sử dụng phương thức `getCourse` để lấy thông tin course tương ứng của section
        const course = await section.getCourse();

        if (!course) {
            res.status(404).json({ error: 'Course not found for this section' });
        } else {
            res.status(200).json(course);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateSection = async (req, res) => {
    try {
        const record = await SectionModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            await record.update(req.body);
            res.status(200).json({ message: "Section updated successfully", data: record });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const deleteSection = async (req, res) => {
    try {
        const record = await SectionModel.findByPk(req.params.id);
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
