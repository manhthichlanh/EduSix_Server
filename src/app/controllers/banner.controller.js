import path from 'path';
import fs from 'fs/promises';
import multer from 'multer';
import sequelize from '../models/db';
import BannerModel from '../models/banner.model';
import { Op, Sequelize } from 'sequelize';




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
      fileName = `banner_${Date.now()}_${imageFile.originalname}`;
      const uploadPath = path.join( 'public/images/banner', fileName);

      await fs.writeFile(uploadPath, imageFile.buffer).catch(error => console.error('Error writing file:', error));
    } else {
      throw new Error('Invalid imageFile object.');
    }

    return fileName;
  } catch (error) {
    throw error;
  }
};


const getAllBanners = async (req, res) => {
  try {
    const allBanners = await BannerModel.findAll({
      order: [['ordinal_number', 'ASC']],
    });
    res.json(allBanners);
  } catch (error) {
    console.error('Error getting all banners:', error);
    res.status(500).json({ status: Status.ERROR, error: 'Internal Server Error' });
  }
};

const getBannerById = async (req, res) => {
  const id = req.params.id;
  try {
    const banner = await BannerModel.findByPk(id, { raw: true });
    if (!banner) {
      res.status(404).json({ status: Status.ERROR, error: 'Banner not found' });
    } else {
      res.json({ status: Status.SUCCESS, data: banner });
    }
  } catch (error) {
    console.error('Error getting banner by ID:', error);
    res.status(500).json({ status: Status.ERROR, error: 'Internal Server Error' });
  }
};




const getImageByFileName = async (req, res) => {
  const { filename } = req.params;
  try {
    const imagePath = path.join(__dirname, '../../../public/images/banner', filename);
    console.log('Constructed Image Path:', imagePath);

    const banner = await BannerModel.findOne({
      where: { thumnail: filename },
      raw: true,
    });

    console.log('Banner:', banner);

    if (!banner) {
      res.status(404).json({ status: Status.ERROR, error: 'Image not found' });
    } else {
      // Directly set the content type and send the file
      res.sendFile(imagePath);
    }
  } catch (error) {
    console.error('Error getting image by filename:', error);
    res.status(500).json({ status: Status.ERROR, error: 'Internal Server Error' });
  }
};















const addBanner = async (req, res) => {
  try {
    const { link, status, name_banner } = req.body;

    if (!req.file || (!req.file.filename && !req.file.buffer)) {
      return res.status(400).json({ status: Status.ERROR, error: 'Thumbnail image is required.' });
    }

    const thumnailFile = req.file;

    let ordinal_number;
    const lastBanner = await BannerModel.findOne({
      order: [['ordinal_number', 'DESC']],
    });

    if (lastBanner) {
      ordinal_number = lastBanner.ordinal_number + 1;
    } else {
      ordinal_number = 1;
    }

    const newThumnailFileName = await uploadImage(thumnailFile);

    const newBanner = await BannerModel.create({
      thumnail: newThumnailFileName,
      link,
      status,
      ordinal_number,
      name_banner, // Add the name_banner field
    });

    console.log('Banner added successfully:', newBanner);
    res.json({ status: Status.SUCCESS, data: newBanner });
  } catch (error) {
    console.error('Error adding banner:', error);
    res.status(500).json({ status: Status.ERROR, error: error.message || 'Internal Server Error' });
  }
};

const updateBanner = async (req, res) => {
  const id = req.params.id;
  const { link, status, ordinal_number, name_banner } = req.body;

  try {
    const bannerToUpdate = await BannerModel.findByPk(id, { raw: true });

    if (!bannerToUpdate) {
      res.status(404).json({ status: Status.ERROR, error: 'Banner not found' });
    } else {
      console.log('Existing Banner:', bannerToUpdate);

      const thumnailFile = req.file;
      let newThumnailFileName;

      // Nếu có gửi thumnail mới, thì cập nhật
      if (thumnailFile) {
        const existingThumnailFilePath = path.join(`public/images/banner/${bannerToUpdate.thumnail || ''}`);

        try {
          await fs.access(existingThumnailFilePath);
          await fs.unlink(existingThumnailFilePath);
          console.log('Existing thumbnail deleted successfully.');

          newThumnailFileName = await uploadImage(thumnailFile);
        } catch (error) {
          console.error('Error accessing or deleting file:', error);
        }
      } else {
        // Nếu không có thumnail mới, giữ nguyên thumnail cũ
        newThumnailFileName = bannerToUpdate.thumnail;
      }

      // Get the old and new ordinal_number values
      const oldOrdinalNumber = bannerToUpdate.ordinal_number;
      const newOrdinalNumber = ordinal_number !== undefined ? parseInt(ordinal_number) : oldOrdinalNumber;

      // Find other banners affected by the change
      const bannersToUpdate = await BannerModel.findAll({
        where: {
          ordinal_number: {
            [Op.between]: [Math.min(oldOrdinalNumber, newOrdinalNumber), Math.max(oldOrdinalNumber, newOrdinalNumber)],
          },
        },
      });

      // Update the ordinal_number values
      await Promise.all(
        bannersToUpdate.map(async (banner) => {
          let updatedOrdinalNumber;

          if (oldOrdinalNumber < newOrdinalNumber) {
            // Moving the ordinal_number up
            updatedOrdinalNumber = banner.ordinal_number === oldOrdinalNumber ? newOrdinalNumber : banner.ordinal_number - 1;
          } else if (oldOrdinalNumber > newOrdinalNumber) {
            // Moving the ordinal_number down
            updatedOrdinalNumber = banner.ordinal_number === oldOrdinalNumber ? newOrdinalNumber : banner.ordinal_number + 1;
          } else {
            // No change in ordinal_number
            updatedOrdinalNumber = banner.ordinal_number;
          }

          await BannerModel.update(
            {
              ordinal_number: updatedOrdinalNumber,
            },
            { where: { id: banner.id } }
          );
        })
      );

      // Update only the fields with values
      const updateFields = {};
      if (link !== undefined) updateFields.link = link;
      if (status !== undefined) updateFields.status = status;
      if (name_banner !== undefined) updateFields.name_banner = name_banner;

      // Update the current banner
      const [updatedBanner] = await BannerModel.update(
        {
          thumnail: newThumnailFileName,
          ordinal_number: newOrdinalNumber,
          ...updateFields,
        },
        { where: { id }}
      );

      console.log('Banners updated successfully:', bannersToUpdate);
      console.log('Banner updated successfully:', updatedBanner);
      res.json({ status: Status.SUCCESS, data: bannersToUpdate });
    }
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ status: Status.ERROR, error: error.message || 'Internal Server Error' });
  }
};






const deleteBanner = async (req, res) => {
  const id = req.params.id;
  try {
    const bannerToDelete = await BannerModel.findByPk(id, { raw: true });

    if (!bannerToDelete) {
      res.status(404).json({ status: Status.ERROR, error: 'Banner not found' });
    } else {
      const thumnailFilePath = path.join(`public/images/banner/${bannerToDelete.thumnail}`);

      try {
        await fs.access(thumnailFilePath);
        await fs.unlink(thumnailFilePath);
        console.log('Thumbnail deleted successfully.');
      } catch (error) {
        console.error('Error accessing or deleting file:', error);
      }

      // Get the ordinal_number of the banner to be deleted
      const deletedOrdinalNumber = bannerToDelete.ordinal_number;

      // Delete the current banner
      await BannerModel.destroy({ where: { id }, raw: true });

      // Find banners with higher ordinal_numbers and update them
      const bannersToUpdate = await BannerModel.findAll({
        where: {
          ordinal_number: {
            [Op.gt]: deletedOrdinalNumber,
          },
        },
      });

      // Update the ordinal_number values of banners with higher ordinal_numbers
      await Promise.all(
        bannersToUpdate.map(async (banner) => {
          await BannerModel.update(
            {
              ordinal_number: banner.ordinal_number - 1,
            },
            { where: { id: banner.id } }
          );
        })
      );

      console.log('Banner deleted successfully');
      res.json({ status: Status.SUCCESS, message: 'Banner deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ status: Status.ERROR, error: error.message || 'Internal Server Error' });
  }
};


export {
  Status,
  getAllBanners,
  getBannerById,
  addBanner,
  updateBanner,
  deleteBanner,
  getImageByFileName
};
