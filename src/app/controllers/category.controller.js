import CourseModel from "../models/course.model";
import CategoryModel from "../models/category.model";

export const createCategory = async (req, res) => {
    try {
        const newRecord = await CategoryModel.create(req.body);
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(400).json({ error: error.message });
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
};