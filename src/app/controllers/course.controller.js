import CourseModel from "../models/course.model";

export const createCourse = async (req, res) => {
    try {
        const newRecord = await CourseModel.create(req.body);
        res.status(201).json(newRecord);
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
export const updateCourse = async (req, res) => {
    try {
        const record = await CourseModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            await record.update(req.body);
            res.status(200).json(record);
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
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};