import  SectionModel   from '../models/section.model';
export const getAllSection = async () => {
    try {
        const data = await  SectionModel.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            order: [['ordinal_number', 'ASC']]
        });
        return data;
    } catch (error) {
        throw new Error(`${error}, traceback at getAllBussines function at bussines.dao.js file`);
    }
};
