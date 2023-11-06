import LessonModel from "../models/lesson.model";
export const createLesson = async (req, res) => {
    try {
        const newRecord = await LessonModel.create(req.body);
        res.status(201).json(newRecord);
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
