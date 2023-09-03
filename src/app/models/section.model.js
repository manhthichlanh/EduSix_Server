import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const SectionModel = sequelize.define("section", {
    // Định nghĩa các trường trong bảng Section
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }, ordinal_number: {
        type: DataTypes.INTEGER,
        allowNull: false,

    }
});
SectionModel.sync().then(() => {
    console.log('Lesson table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
export default SectionModel;
