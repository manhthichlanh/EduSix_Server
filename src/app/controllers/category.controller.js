import CourseModel from "../models/course.model";
import CategoryModel from "../models/category.model";
import sequelize from "../models/db";
import fs from "fs/promises";
import path from "path";
import AppError from "../../utils/appError";
import { Op, Sequelize } from 'sequelize';
import { log } from "console";
/// đường dẫn thumbnail
// const uploadDir = "public/images/logo-category";
// const filePath = (fileName) => path.join(uploadDir, fileName);
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }
const Status = {
    SUCCESS: 'success',
    ERROR: 'error',
};

const uploadImage = async (imageFile) => {
    try {
        let fileName;

        if (imageFile && imageFile.filename) {
            fileName = imageFile.filename;
        } else if (imageFile && imageFile.buffer) {
            fileName = `${Date.now()}_${imageFile.originalname}`;
            const uploadPath = path.join('public/images/logo-category', fileName);

            await fs.writeFile(uploadPath, imageFile.buffer).catch(error => console.error('Error writing file:', error));
        } else {
            throw new Error('Invalid imageFile object.');
        }

        return fileName;
    } catch (error) {
        throw error;
    }
};

export const createCategory = async (req, res) => {
    try {
        if (!req.file || (!req.file.filename && !req.file.buffer)) {
            return res.status(400).json({ status: Status.ERROR, error: 'Thumbnail image is required.' });
        }

        const thumnailFile = req.file;

        // Tạo category mới
        const { cate_name, status } = req.body;

        // Find the last ordinal number used
        const lastCategory = await CategoryModel.findOne({
            order: [['ordinal_number', 'DESC']]
        });

        let ordinal_number; // Default ordinal number if no categories exist yet

        if (lastCategory) {
            ordinal_number = lastCategory.ordinal_number + 1;
        } else {
            ordinal_number = 1;
        }


        const newThumnailFileName = await uploadImage(thumnailFile);


        const newRecord = await CategoryModel.create({
            logo_cate: newThumnailFileName,
            cate_name,
            status,
            ordinal_number,


        });

        console.log('Category added successfully:', newRecord);
        res.json({ status: Status.SUCCESS, data: newRecord });


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
export const categoryPage = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 5) || 1;
        const page_size = parseInt(req.query.page_size, 5) || 5;

        const offset = (page - 1) * page_size;

        const { count, rows } = await CategoryModel.findAndCountAll({
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
    const categoryId = req.params.id;
    const { cate_name, status, ordinal_number } = req.body;

    try {
        const categoryToUpdate = await CategoryModel.findByPk(categoryId, { raw: true });

        if (!categoryToUpdate) {
            return res.status(404).json({ status: Status.ERROR, error: 'Category not found' });
        }

        console.log('Existing Category:', categoryToUpdate);

        const thumbnailFile = req.file;
        let newThumbnailFileName = categoryToUpdate.logo_cate;

        if (!newThumbnailFileName) {
            // Nếu không có logo_cate, tạo mới từ file mới (nếu có)
            if (thumbnailFile) {
                newThumbnailFileName = await uploadImage(thumbnailFile);
            }
        } else {
            if (thumbnailFile) {
                // Kiểm tra xem tệp có tồn tại không
                const thumbnailFilePath = path.join(`public/images/logo-category/${newThumbnailFileName}`);
                try {
                    await fs.access(thumbnailFilePath);
                    await fs.unlink(thumbnailFilePath);
                } catch (error) {
                    console.error('Error accessing or deleting file:', error);
                }
                // Tạo mới từ file mới
                newThumbnailFileName = await uploadImage(thumbnailFile);
            } else {
                // Nếu không có file mới, giữ nguyên logo_cate cũ
                newThumbnailFileName = categoryToUpdate.logo_cate;
            }
        }

        const oldOrdinalNumber = categoryToUpdate.ordinal_number;
        const newOrdinalNumber = ordinal_number !== undefined ? parseInt(ordinal_number) : oldOrdinalNumber;

        const categoriesToUpdate = await CategoryModel.findAll({
            where: {
                ordinal_number: {
                    [Op.between]: [Math.min(oldOrdinalNumber, newOrdinalNumber), Math.max(oldOrdinalNumber, newOrdinalNumber)],
                },
            },
        });

        await Promise.all(
            categoriesToUpdate.map(async (category) => {
                let updatedOrdinalNumber;

                if (oldOrdinalNumber < newOrdinalNumber) {
                    updatedOrdinalNumber = category.ordinal_number === oldOrdinalNumber ? newOrdinalNumber : category.ordinal_number - 1;
                } else if (oldOrdinalNumber > newOrdinalNumber) {
                    updatedOrdinalNumber = category.ordinal_number === oldOrdinalNumber ? newOrdinalNumber : category.ordinal_number + 1;
                } else {
                    updatedOrdinalNumber = category.ordinal_number;
                }

                await CategoryModel.update(
                    {
                        ordinal_number: updatedOrdinalNumber,
                    },
                    { where: { category_id: category.category_id } }
                );
            })
        );

        const updateFields = {};
        if (cate_name !== undefined) updateFields.cate_name = cate_name;
        if (status !== undefined) updateFields.status = status;

        await CategoryModel.update(
            {
                logo_cate: newThumbnailFileName,
                ordinal_number: newOrdinalNumber,
                ...updateFields,
            },
            { 
                where: { category_id: categoryId },
               
            }
        );

        const updatedCategory = await CategoryModel.findByPk(categoryId, { raw: true });

        console.log('Category updated successfully:', updatedCategory);
        res.json({ status: Status.SUCCESS, data: updatedCategory });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};


export const deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
    try {
        const categoryToDelete = await CategoryModel.findByPk(categoryId, { raw: true });
    
        if (!categoryToDelete) {
          res.status(404).json({ status: Status.ERROR, error: 'Category not found' });
        } else {
          const thumnailFilePath = path.join(`public/images/logo-category/${categoryToDelete.logo_cate}`);
    
          try {
            await fs.access(thumnailFilePath);
            await fs.unlink(thumnailFilePath);
            console.log('logo category deleted successfully.');
          } catch (error) {
            console.error('Error accessing or deleting file:', error);
          }
    
          // Get the ordinal_number of the banner to be deleted
          const deletedOrdinalNumber = categoryToDelete.ordinal_number;
    
          // Delete the current banner
          await CategoryModel.destroy({ where: { category_id: categoryId }, raw: true });
    
          // Find banners with higher ordinal_numbers and update them
          const bannersToUpdate = await CategoryModel.findAll({
            where: {
              ordinal_number: {
                [Op.gt]: deletedOrdinalNumber,
              },
            },
          });
    
          // Update the ordinal_number values of banners with higher ordinal_numbers
          await Promise.all(
            bannersToUpdate.map(async (category) => {
              await CategoryModel.update(
                {
                  ordinal_number: category.ordinal_number - 1,
                },
                { where: { category_id: category.category_id } }
              );
            })
          );
    
          console.log('Category deleted successfully');
          res.json({ status: Status.SUCCESS, message: 'Category deleted successfully' });
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
};
export const getImage = async (req, res) => {
    const { filename } = req.params;
    try {
      const imagePath = path.join(__dirname, '../../../public/images/logo-category', filename);
      console.log('Constructed Image Path:', imagePath);
  
      const category = await CategoryModel.findOne({
        where: { logo_cate: filename },
        raw: true,
      });
  
      console.log('Category:', category);
  
      if (!category) {
        res.status(404).json({ status: Status.ERROR, error: 'Image not found' });
      } else {
        // Directly set the content type and send the file
        res.sendFile(imagePath);
      }
    } catch (error) {
      console.error('Error getting image by filename:', error);
      res.status(500).json({ status: Status.ERROR, error: 'Internal Server Error' });
    }
}