import CourseModel from "./course.model.js";
import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const SectionModel = sequelize.define("section", {
    // Định nghĩa các trường trong bảng Section
    section_id: {
        type: DataTypes.INTEGER,
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
        comment: "True là hiện, false là ẩn",
        allowNull: false
    }, ordinal_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    createdAt: "created_at",
    updatedAt: "updated_at"
});
SectionModel.sync().then(() => {
    console.log('Seaction table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
export default SectionModel;
