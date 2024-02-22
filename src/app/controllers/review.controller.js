import path from 'path';
import fs from 'fs/promises';
import ReviewModel from '../models/review.model';

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
      fileName = `review_${Date.now()}_${imageFile.originalname}`;
      const uploadPath = path.join('public/images/review', fileName);

      await fs.writeFile(uploadPath, imageFile.buffer).catch(error => console.error('Error writing file:', error));
    } else {
      throw new Error('Invalid imageFile object.');
    }

    return fileName;
  } catch (error) {
    throw error;
  }
};

const getAllReviews = async (req, res) => {
  try {
    const allReviews = await ReviewModel.findAll({
      order: [['review_id', 'DESC']],
    });

    res.json(allReviews);
  } catch (error) {
    console.error('Error getting all reviews:', error);
    res.status(500).json({ status: Status.ERROR, error: 'Internal Server Error' });
  }
};

const getReviewById = async (req, res) => {
  const id = req.params.id;
  try {
    const review = await ReviewModel.findByPk(id);

    if (!review) {
      res.status(404).json({ status: Status.ERROR, error: 'Review not found' });
    } else {
      res.json(review);
    }
  } catch (error) {
    console.error('Error getting review by ID:', error);
    res.status(500).json({ status: Status.ERROR, error: 'Internal Server Error' });
  }
};

const addReview = async (req, res) => {
  try {
    const { reviewer_name, avatar, work, content, status } = req.body;

    const avatarFile = req.file;
    const newAvatarFileName = await uploadImage(avatarFile);

    const newReview = await ReviewModel.create({
      reviewer_name,
      avatar: newAvatarFileName,
      work,
      content,
      status,
    });

    console.log('Review added successfully:', newReview);
    res.json({ status: Status.SUCCESS, data: newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ status: Status.ERROR, error: error.message || 'Internal Server Error' });
  }
};

const updateReview = async (req, res) => {
  const reviewId = req.params.id;
  const { reviewer_name, work, content, status } = req.body;

  try {
    const reviewToUpdate = await ReviewModel.findByPk(reviewId, { raw: true });

    if (!reviewToUpdate) {
      console.error('Review not found for update:', reviewId);
      res.status(404).json({ status: Status.ERROR, error: 'Review not found' });
    } else {
      console.log('Existing Review:', reviewToUpdate);

      const avatarFile = req.file;
      let newAvatarFileName;

      if (avatarFile) {
        const existingAvatarFilePath = path.join(`public/images/review/${reviewToUpdate.avatar || ''}`);

        try {
          await fs.access(existingAvatarFilePath);
          await fs.unlink(existingAvatarFilePath);
          console.log('Existing avatar deleted successfully.');

          newAvatarFileName = await uploadImage(avatarFile);
        } catch (error) {
          console.error('Error accessing or deleting file:', error);
        }
      }

      const updateFields = {};
      if (reviewer_name !== undefined) updateFields.reviewer_name = reviewer_name;
      if (newAvatarFileName) updateFields.avatar = newAvatarFileName;
      if (work !== undefined) updateFields.work = work;
      if (content !== undefined) updateFields.content = content;
      if (status !== undefined) updateFields.status = status;

      const [updatedRowsCount] = await ReviewModel.update(
        updateFields,
        { where: { review_id: reviewId } }
      );

      if (updatedRowsCount === 0) {
        console.error('No rows were updated for review:', reviewId);
        res.status(404).json({ status: Status.ERROR, error: 'Review not found' });
      } else {
        const updatedReview = await ReviewModel.findByPk(reviewId, { raw: true });
        console.log('Review updated successfully:', updatedReview);
        res.json({ status: Status.SUCCESS, data: updatedReview });
      }
    }
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ status: Status.ERROR, error: error.message || 'Internal Server Error' });
  }
};

const deleteReview = async (req, res) => {
  const id = req.params.id;
  try {
    const reviewToDelete = await ReviewModel.findByPk(id, { raw: true });

    if (!reviewToDelete) {
      res.status(404).json({ status: Status.ERROR, error: 'Review not found' });
    } else {
      const avatarFilePath = path.join(`public/images/review/${reviewToDelete.avatar}`);

      try {
        await fs.access(avatarFilePath);
        await fs.unlink(avatarFilePath);
        console.log('Avatar deleted successfully.');
      } catch (error) {
        console.error('Error accessing or deleting file:', error);
      }

      await ReviewModel.destroy({ where: { review_id: id }, raw: true });
      console.log('Review deleted successfully');
      res.json({ status: Status.SUCCESS, message: 'Review deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ status: Status.ERROR, error: error.message || 'Internal Server Error' });
  }
};

const getAvatarByFileName = async (req, res) => {
  const { filename } = req.params;
  try {
    const imagePath = path.join(__dirname, '../../../public/images/review', filename);
    console.log('Constructed Image Path:', imagePath);

    const reviewModel = await ReviewModel.findOne({
      where: { avatar: filename },
      raw: true,
    });

    console.log('ReviewModel:', reviewModel);

    if (!reviewModel) {
      res.status(404).json({ status: Status.ERROR, error: 'Avatar not found' });
    } else {
      res.sendFile(imagePath);
    }
  } catch (error) {
    console.error('Error getting avatar by filename:', error);
    res.status(500).json({ status: Status.ERROR, error: 'Internal Server Error' });
  }
};

export {
  Status,
  getAllReviews,
  getReviewById,
  addReview,
  updateReview,
  deleteReview,
  getAvatarByFileName,
};
