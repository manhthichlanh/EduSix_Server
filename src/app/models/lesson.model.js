import SectionModel from "./section.model.js";
import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const LessonModel = sequelize.define("lesson", {
    // Định nghĩa các trường trong bảng Lesson
    lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    section_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SectionModel,
            key: 'section_id'
        }
    },
    name: {
        type: DataTypes.STRING,

    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    type: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    active: {
        type: DataTypes.INTEGER
    },
    ordinal_number: {
        type: DataTypes.INTEGER
    },
}, {
    createdAt: "created_at",
    updatedAt: "updated_at"});
LessonModel.sync().then(() => {
    console.log('Lesson table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export default LessonModel;
