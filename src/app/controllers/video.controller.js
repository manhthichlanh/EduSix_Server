import videoModel from "../models/video.model";

export const createVideo = async (req, res) => {
    try {
        const newRecord = await videoModel.create(req.body);
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const getAllVideo = async (req, res) => {
    try {
        const records = await videoModel.findAll();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getVideoById = async (req, res) => {
    try {
        const record = await videoModel.findByPk(req.params.id);
        if (!record) {
            res.status(404).json({ error: 'Record not found' });
        } else {
            res.status(200).json(record);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateVideo = async (req, res) => {
  try {
      const record = await videoModel.findByPk(req.params.id);
      if (!record) {
          res.status(404).json({ error: 'Record not found' });
      } else {
          await record.update(req.body);
          res.status(200).json({ message: "Video updated successfully", data: record });  // Added success message
      }
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
      const record = await videoModel.findByPk(req.params.id);
      if (!record) {
          res.status(404).json({ error: 'Record not found' });
      } else {
          await record.destroy();
          res.status(200).json({ message: 'Video deleted successfully!' }); 
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};