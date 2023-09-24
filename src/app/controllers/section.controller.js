import SectionModel from "../models/section.model";

export const createSection = async (req, res) => {
    try {
        if (!req.body.course_id) {
            return res.status(400).json({ error: 'course_id is required and cannot be null.' });
        }
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

export const getCourseById = async (req, res) => {
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
export const updateCourse = async (req, res) => {
  try {
      const record = await SectionModel.findByPk(req.params.id);
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
      const record = await SectionModel.findByPk(req.params.id);
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