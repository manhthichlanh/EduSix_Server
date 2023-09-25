import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
const CategoryModel = sequelize.define("category", {
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement: true
    },
    cate_name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    ordinal_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});
CategoryModel.sync().then(() => {
    console.log('Category table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
export default CategoryModel;