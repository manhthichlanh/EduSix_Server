// import SectionModel from "./section.model.js";
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
        comment: "True là hiện, false là ẩn",
        defaultValue: 1,
        allowNull: false
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Đây là dạng bài học: 0 là video youtube, 1 là video server, 2 là quizz"
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ordinal_number: {
        type: DataTypes.INTEGER,
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
