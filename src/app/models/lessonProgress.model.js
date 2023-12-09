// import SectionModel from "./section.model.js";
import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const LessonProgressModel = sequelize.define("lesson_progress", {
    // Định nghĩa các trường trong bảng Lesson
    lesson_progress_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true, // Đặt để tự động tăng
    },
    lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    section_progress_id: {
        type: DataTypes.INTEGER,
    },
    current: {
        type: DataTypes.INTEGER,
    },
    total: {
        type: DataTypes.INTEGER,
    },
    is_finish: {
        type: DataTypes.BOOLEAN,
    },
    is_lock: {
        type: DataTypes.BOOLEAN,
    }
}, {
    createdAt: "created_at",
});
LessonProgressModel.sync().then(() => {
    console.log('Lesson_progress table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export default LessonProgressModel;