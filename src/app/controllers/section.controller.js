import SectionModel from "../models/section.model";

export const getAllsection = async (req, res, next) => {
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
export const getSectionById = async (req,res,next) => {
    const section_id = req.params.section_id;
    const sectionDoc = await SectionModel.findByPk(section_id);
    return ReS(res, { sectionDoc  }, 404);

}
export const createSection = async (req,res,next) => {
    const {name,status,ordinal_number}  =req.body;
    const SeactionDoc = await SectionModel.create({name,status,ordinal_number,course_id:1});
      return ReS(res, { SeactionDoc  }, 404);

}
export const updateSection = async (req, res, next) => {
    const section_id = req.params.section_id; // Correct the way to get 'section_id' from the request parameters
    const { name, status, ordinal_number } = req.body;

    try {
        // Find the section by 'section_id'
        const section = await SectionModel.findByPk(section_id);

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        // Update section attributes
        section.name = name;
        section.status = status;
        section.ordinal_number = ordinal_number;

        // Save the updated section
      const sectionSave =   await section.save();

   
        return ReS(res, { sectionSave   }, 404);
   
    } catch (error) {
        next(error);
    }
};
export const deleteSection = async (req, res, next) => {
    const section_id = req.params.section_id; // Correct the way to get 'section_id' from the request parameters

    try {
        // Find the section by 'section_id'
        const section = await SectionModel.findByPk(section_id);

        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }

        // Delete the section
        await section.destroy();

       
        return ReS(res,{ message: 'Section deleted successfully' }, 404);

    } catch (error) {
        next(error);
    }
};