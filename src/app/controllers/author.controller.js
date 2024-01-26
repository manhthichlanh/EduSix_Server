import path from 'path';
import fs from 'fs/promises';
import AuthorModel from '../models/author.model';

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
      fileName = `authorPosted_${Date.now()}_${imageFile.originalname}`;
      const uploadPath = path.join('public/images/author-posted', fileName);

      await fs.writeFile(uploadPath, imageFile.buffer).catch(error => console.error('Error writing file:', error));
    } else {
      throw new Error('Invalid imageFile object.');
    }

    return fileName;
  } catch (error) {
    throw error;
  }
};

const getAllAuthorPosted = async (req, res) => {
  try {
    const allAuthorPosted = await AuthorModel.findAll({
      order: [['author_id', 'DESC']],
    });
    res.json(allAuthorPosted);
  } catch (error) {
    console.error('Error getting all authorPosted:', error);
    res.status(500).json({ status: Status.ERROR, error: 'Internal Server Error' });
  }
};

const getAuthorPostedById = async (req, res) => {
  const id = req.params.id;
  try {
    const authorPosted = await AuthorModel.findByPk(id, { raw: true });
    if (!authorPosted) {
      res.status(404).json({ status: Status.ERROR, error: 'Author posted not found' });
    } else {
      res.json(authorPosted);
    }
  } catch (error) {
    console.error('Error getting author posted by ID:', error);
    res.status(500).json({ status: Status.ERROR, error: 'Internal Server Error' });
  }
};

const addAuthorPosted = async (req, res) => {
  try {
    const { name_user, thumbnail, status } = req.body;

    const thumbnailFile = req.file;
    const newThumbnailFileName = await uploadImage(thumbnailFile);

    const newAuthorPosted = await AuthorModel.create({
      name_user,
      thumbnail: newThumbnailFileName,
      status,
    });

    console.log('Author added successfully:', newAuthorPosted);
    res.json({ status: Status.SUCCESS, data: newAuthorPosted });
  } catch (error) {
    console.error('Error adding Author:', error);
    res.status(500).json({ status: Status.ERROR, error: error.message || 'Internal Server Error' });
  }
};

const updateAuthorPosted = async (req, res) => {
  const authorPostedId = req.params.id;
  const { name_user, status } = req.body;

  try {
    const authorPostedToUpdate = await AuthorModel.findByPk(authorPostedId, { raw: true });

    if (!authorPostedToUpdate) {
      console.error('Author posted not found for update:', authorPostedId);
      res.status(404).json({ status: Status.ERROR, error: 'Author posted not found' });
    } else {
      console.log('Existing Author posted:', authorPostedToUpdate);

      const thumbnailFile = req.file;
      let newThumbnailFileName;

      if (thumbnailFile) {
        const existingThumbnailFilePath = path.join(`public/images/author-posted/${authorPostedToUpdate.thumbnail || ''}`);

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
      if (name_user !== undefined) updateFields.name_user = name_user;
      if (newThumbnailFileName) updateFields.thumbnail = newThumbnailFileName;
      if (status !== undefined) updateFields.status = status;

      const [updatedRowsCount] = await AuthorModel.update(
        updateFields,
        { where: { author_id: authorPostedId } }
      );

      if (updatedRowsCount === 0) {
        console.error('No rows were updated for author posted:', authorPostedId);
        res.status(404).json({ status: Status.ERROR, error: 'Author posted not found' });
      } else {
        const updatedAuthorPosted = await AuthorModel.findByPk(authorPostedId, { raw: true });
        console.log('Author posted updated successfully:', updatedAuthorPosted);
        res.json({ status: Status.SUCCESS, data: updatedAuthorPosted });
      }
    }
  } catch (error) {
    console.error('Error updating author posted:', error);
    res.status(500).json({ status: Status.ERROR, error: error.message || 'Internal Server Error' });
  }
};

const deleteAuthorPosted = async (req, res) => {
  const id = req.params.id;
  try {
    const authorPostedToDelete = await AuthorModel.findByPk(id, { raw: true });

    if (!authorPostedToDelete) {
      res.status(404).json({ status: Status.ERROR, error: 'Author posted not found' });
    } else {
      const thumbnailFilePath = path.join(`public/images/author-posted/${authorPostedToDelete.thumbnail}`);

      try {
        await fs.access(thumbnailFilePath);
        await fs.unlink(thumbnailFilePath);
        console.log('Thumbnail deleted successfully.');
      } catch (error) {
        console.error('Error accessing or deleting file:', error);
      }

      await AuthorModel.destroy({ where: { author_id: id }, raw: true });
      console.log('Author posted deleted successfully');
      res.json({ status: Status.SUCCESS, message: 'Author posted deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting author posted:', error);
    res.status(500).json({ status: Status.ERROR, error: error.message || 'Internal Server Error' });
  }
};

const getImageByFileName = async (req, res) => {
  const { filename } = req.params;
  try {
    const imagePath = path.join(__dirname, '../../../public/images/author-posted', filename);
    console.log('Constructed Image Path:', imagePath);

    const authorPostedModel = await AuthorModel.findOne({
      where: { thumbnail: filename },
      raw: true,
    });

    console.log('AuthorPostedModel:', authorPostedModel);

    if (!authorPostedModel) {
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
  getAllAuthorPosted,
  getAuthorPostedById,
  addAuthorPosted,
  updateAuthorPosted,
  deleteAuthorPosted,
  getImageByFileName,
};
