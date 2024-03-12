import path from 'path';
import fs from 'fs/promises';
import BlogModel from '../models/blog.model';
import BlogCategoryModel from '../models/blogCategory.model';
import AuthorModel from '../models/author.model'; 
import AdminModel from '../models/admin.model'; 
import UserModel from '../models/user.model'; 
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
      fileName = `blog_${Date.now()}_${imageFile.originalname}`;
      const uploadPath = path.join('public/images/blog', fileName);

      await fs.writeFile(uploadPath, imageFile.buffer).catch(error => console.error('Error writing file:', error));
    } else {
      throw new Error('Invalid imageFile object.');
    }

    return fileName;
  } catch (error) {
    throw error;
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const allBlogs = await BlogModel.findAll({
      order: [['blog_id', 'ASC']],
      include: [
        { model: BlogCategoryModel },
        { model: AuthorModel }, // Changed from AdminModel
        {model: AdminModel},
        {model: UserModel}
      ],
    });

    const blogsWithData = await Promise.all(
      allBlogs.map(async (blog) => {
        const blogCategoryId = blog.blog_category_id;
        const authorPostedId = blog.author_id; // Changed from admin_posted_id
        const authorAdminId = blog.admin_id;
        const userId = blog.user_id;
        // Fetch additional data related to blog_category_id
        const blogCategoryData = await BlogCategoryModel.findByPk(blogCategoryId);

        // Fetch additional data related to author_posted_id
        const authorData = await AuthorModel.findByPk(authorPostedId); // Changed from AdminModel
        const adminData = await AdminModel.findByPk(authorAdminId);
        const userData = await UserModel.findByPk(userId);
        return {
          blog,
          blogCategoryData,
          authorData,
          adminData,
          userData
        };
      })
    );

    res.json(blogsWithData);
  } catch (error) {
    console.error('Error getting all blogs:', error);
    res.status(500).json({ status: Status.ERROR, error: 'Internal Server Error' });
  }
};

const getBlogById = async (req, res) => {
  const id = req.params.id;
  try {
    const blog = await BlogModel.findByPk(id, {
      include: [
        { model: BlogCategoryModel },
        { model: AuthorModel }, // Changed from AdminModel
        {model: AdminModel},
        {model: UserModel}
      ],
    });

    if (!blog) {
      res.status(404).json({ status: Status.ERROR, error: 'Blog not found' });
    } else {
      const blogCategoryId = blog.blog_category_id;
      const authorPostedId = blog.author_id; // Changed from admin_posted_id
      const authorAdminId = blog.admin_id;
      const userId = blog.user_id;
      const blogCategoryData = await BlogCategoryModel.findByPk(blogCategoryId);

      const authorData = await AuthorModel.findByPk(authorPostedId); // Changed from AdminModel
      const adminData = await AdminModel.findByPk(authorAdminId);
      const userData = await UserModel.findByPk(userId);
      res.json({
        blog,
        blogCategoryData,
        authorData,
        adminData,
        userData
      });
    }
  } catch (error) {
    console.error('Error getting blog by ID:', error);
    res.status(500).json({ status: Status.ERROR, error: 'Internal Server Error' });
  }
};

const addBlog = async (req, res) => {
  try {
    const { name, thumbnail, status, blog_category_id, content, author_id, admin_id, user_id } = req.body;

    const thumbnailFile = req.file;
    const newThumbnailFileName = await uploadImage(thumbnailFile);

    const newBlog = await BlogModel.create({
      name,
      thumbnail: newThumbnailFileName,
      content,
      status,
      blog_category_id: blog_category_id || null,
      author_id: author_id || null, 
      admin_id: admin_id || null,   
      user_id: user_id || null,   
    });

    console.log('Blog added successfully:', newBlog);
    res.json({ status: Status.SUCCESS, data: newBlog });
  } catch (error) {
    console.error('Error adding blog:', error);
    res.status(500).json({ status: Status.ERROR, error: error.message || 'Internal Server Error' });
  }
};


const updateBlog = async (req, res) => {
  const blogId = req.params.id;
  const { name, status, content, blog_category_id, author_id, admin_id, user_id } = req.body;

  try {
    const blogToUpdate = await BlogModel.findByPk(blogId, { raw: true });

    if (!blogToUpdate) {
      console.error('Blog not found for update:', blogId);
      res.status(404).json({ status: Status.ERROR, error: 'Blog not found' });
    } else {
      console.log('Existing Blog:', blogToUpdate);

      const thumbnailFile = req.file;
      let newThumbnailFileName;

      if (thumbnailFile) {
        const existingThumbnailFilePath = path.join(`public/images/blog/${blogToUpdate.thumbnail || ''}`);

        try {
          await fs.access(existingThumbnailFilePath);
          await fs.unlink(existingThumbnailFilePath);
          console.log('Existing thumbnail deleted successfully.');

          newThumbnailFileName = await uploadImage(thumbnailFile);
        } catch (error) {
          console.error('Error accessing or deleting file:', error);
        }
      }

      const updateFields = {};
      if (name !== undefined) updateFields.name = name;
      if (newThumbnailFileName) updateFields.thumbnail = newThumbnailFileName;
      if (content !== undefined) updateFields.content = content;
      if (status !== undefined) updateFields.status = status;
      if (blog_category_id !== undefined) {
        updateFields.blog_category_id = blog_category_id !== '' ? blog_category_id : null;
      }
      if (author_id !== undefined) {
        updateFields.author_id = author_id !== '' ? author_id : null;
      }
      if (admin_id !== undefined) updateFields.admin_id = admin_id;
      if (user_id !== undefined) updateFields.user_id = user_id;

      const [updatedRowsCount] = await BlogModel.update(
        updateFields,
        { where: { blog_id: blogId } }
      );

      if (updatedRowsCount === 0) {
        console.error('No rows were updated for blog:', blogId);
        res.status(404).json({ status: Status.ERROR, error: 'Blog not found' });
      } else {
        const updatedBlog = await BlogModel.findByPk(blogId, { raw: true });
        console.log('Blog updated successfully:', updatedBlog);
        res.json({ status: Status.SUCCESS, data: updatedBlog });
      }
    }
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ status: Status.ERROR, error: error.message || 'Internal Server Error' });
  }
};


const deleteBlog = async (req, res) => {
  const id = req.params.id;
  try {
    const blogToDelete = await BlogModel.findByPk(id, { raw: true });

    if (!blogToDelete) {
      res.status(404).json({ status: Status.ERROR, error: 'Blog not found' });
    } else {
      const thumbnailFilePath = path.join(`public/images/blog/${blogToDelete.thumbnail}`);

      try {
        await fs.access(thumbnailFilePath);
        await fs.unlink(thumbnailFilePath);
        console.log('Thumbnail deleted successfully.');
      } catch (error) {
        console.error('Error accessing or deleting file:', error);
      }

      await BlogModel.destroy({ where: { blog_id: id }, raw: true });
      console.log('Blog deleted successfully');
      res.json({ status: Status.SUCCESS, message: 'Blog deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ status: Status.ERROR, error: error.message || 'Internal Server Error' });
  }
};

const getImageByFileName = async (req, res) => {
  const { filename } = req.params;
  try {
    const imagePath = path.join(__dirname, '../../../public/images/blog', filename);
    console.log('Constructed Image Path:', imagePath);

    const blogModel = await BlogModel.findOne({
      where: { thumbnail: filename },
      raw: true,
    });

    console.log('BlogModel:', blogModel);

    if (!blogModel) {
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
  getAllBlogs,
  getBlogById,
  addBlog,
  updateBlog,
  deleteBlog,
  getImageByFileName,
};
