import SectionModel from "../models/section.model";

export const createSection = async (req, res) => {
    try {
        const newRecord = await SectionModel.create(req.body);
        res.status(201).json(newRecord);
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
