import path from 'path';
import fs from 'fs/promises';
import BlogCategoryModel from '../models/blogCategory.model';

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
        fileName = `blogcategory_${Date.now()}_${imageFile.originalname}`;
        const uploadPath = path.join('public/images/blog-category', fileName);
  
        await fs.writeFile(uploadPath, imageFile.buffer).catch(error => console.error('Error writing file:', error));
      } else {
        throw new Error('Invalid imageFile object.');
      }
  
      return fileName;
    } catch (error) {
      throw error;
    }
  };

const getAllBlogCategories = async (req, res) => {
  try {
    const allBlogCategories = await BlogCategoryModel.findAll({
      order: [['blog_category_id', 'ASC']],
    });
    res.json(allBlogCategories);
  } catch (error) {
    console.error('Error getting all blog categories:', error);
    res.status(500).json({ status: Status.ERROR, error: 'Internal Server Error' });
  }
};

const getBlogCategoryById = async (req, res) => {
  const id = req.params.id;
  try {
    const blogCategory = await BlogCategoryModel.findByPk(id, { raw: true });
    if (!blogCategory) {
      res.status(404).json({ status: Status.ERROR, error: 'Blog category not found' });
    } else {
      res.json(blogCategory);
    }
  } catch (error) {
    console.error('Error getting blog category by ID:', error);
    res.status(500).json({ status: Status.ERROR, error: 'Internal Server Error' });
  }
};

const addBlogCategory = async (req, res) => {
  try {
    const { name_blog_category, thumbnail, status } = req.body;


    const thumbnailFile = req.file;

    const newThumbnailFileName = await uploadImage(thumbnailFile);

    const newBlogCategory = await BlogCategoryModel.create({
        name_blog_category,
      thumbnail: newThumbnailFileName,
      status,
    });

    console.log('Blog category added successfully:', newBlogCategory);
    res.json({ status: Status.SUCCESS, data: newBlogCategory });
  } catch (error) {
    console.error('Error adding blog category:', error);
    res.status(500).json({ status: Status.ERROR, error: error.message || 'Internal Server Error' });
  }
};
const updateBlogCategory = async (req, res) => {
    const blogCategoryId = req.params.id;
    const { name_blog_category, status } = req.body;
  
    try {
      const blogCategoryToUpdate = await BlogCategoryModel.findByPk(blogCategoryId, { raw: true });
  
      if (!blogCategoryToUpdate) {
        console.error('Blog category not found for update:', blogCategoryId);
        res.status(404).json({ status: Status.ERROR, error: 'Blog category not found' });
      } else {
        console.log('Existing Blog Category:', blogCategoryToUpdate);
  
        const thumbnailFile = req.file;
        let newThumbnailFileName;
  
        // Nếu có gửi thumbnail mới, thì cập nhật
        if (thumbnailFile) {
          const existingThumbnailFilePath = path.join(`public/images/blog-category/${blogCategoryToUpdate.thumbnail || ''}`);
  
          try {
            await fs.access(existingThumbnailFilePath);
            await fs.unlink(existingThumbnailFilePath);
            console.log('Existing thumbnail deleted successfully.');
  
            newThumbnailFileName = await uploadImage(thumbnailFile);
          } catch (error) {
            console.error('Error accessing or deleting file:', error);
          }
        }
  
        // Cập nhật chỉ những trường có giá trị
        const updateFields = {};
        if (name_blog_category !== undefined) updateFields.name_blog_category = name_blog_category;
        if (newThumbnailFileName) updateFields.thumbnail = newThumbnailFileName;
        if (status !== undefined) updateFields.status = status;
  
        const [updatedRowsCount] = await BlogCategoryModel.update(
          updateFields,
          { where: { blog_category_id: blogCategoryId } }
        );
  
        if (updatedRowsCount === 0) {
          console.error('No rows were updated for blog category:', blogCategoryId);
          res.status(404).json({ status: Status.ERROR, error: 'Blog category not found' });
        } else {
          const updatedBlogCategory = await BlogCategoryModel.findByPk(blogCategoryId, { raw: true });
          console.log('Blog Category updated successfully:', updatedBlogCategory);
          res.json({ status: Status.SUCCESS, data: updatedBlogCategory });
        }
      }
    } catch (error) {
      console.error('Error updating blog category:', error);
      res.status(500).json({ status: Status.ERROR, error: error.message || 'Internal Server Error' });
    }
  };

  
  

const deleteBlogCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const blogCategoryToDelete = await BlogCategoryModel.findByPk(id, { raw: true });

    if (!blogCategoryToDelete) {
      res.status(404).json({ status: Status.ERROR, error: 'Blog category not found' });
    } else {
      const thumbnailFilePath = path.join(`public/images/blog-category/${blogCategoryToDelete.thumbnail}`);

      try {
        await fs.access(thumbnailFilePath);
        await fs.unlink(thumbnailFilePath);
        console.log('Thumbnail deleted successfully.');
      } catch (error) {
        console.error('Error accessing or deleting file:', error);
      }

      await BlogCategoryModel.destroy({ where: { blog_category_id: id }, raw: true });
      console.log('Blog category deleted successfully');
      res.json({ status: Status.SUCCESS, message: 'Blog category deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting blog category:', error);
    res.status(500).json({ status: Status.ERROR, error: error.message || 'Internal Server Error' });
  }
};



const getImageByFileName = async (req, res) => {
    const { filename } = req.params;
    try {
      const imagePath = path.join(__dirname, '../../../public/images/blog-category', filename);
      console.log('Constructed Image Path:', imagePath);
  
      const blogCategory = await BlogCategoryModel.findOne({
        where: { thumbnail: filename },
        raw: true,
      });
  
      console.log('BlogCategory:', blogCategory);
  
      if (!blogCategory) {
        res.status(404).json({ status: Status.ERROR, error: 'Image not found' });
      } else {
        res.sendFile(imagePath);
      }
    } catch (error) {
      console.error('Error getting image by filename:', error);
      res.status(500).json({ status: Status.ERROR, error: 'Internal Server Error' });
    }
  };

export {
  Status,
  getAllBlogCategories,
  getBlogCategoryById,
  addBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getImageByFileName,
};
