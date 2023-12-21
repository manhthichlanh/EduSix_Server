// import SectionModel from "./section.model.js";
import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const CourseProgressModel = sequelize.define("course_progress", {
    // Định nghĩa các trường trong bảng Lesson
    course_progress_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true, // Đặt để tự động tăng
    },
    course_id: {
        type: DataTypes.INTEGER,

    },
    enrollment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    progress: {
        type: DataTypes.FLOAT,
    },
    is_finish: {
        type: DataTypes.BOOLEAN,
    }
}, {
    createdAt: "created_at",
    updatedAt: "updated_at",

});
CourseProgressModel.sync().then(() => {
    console.log('Lesson_progress table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export default CourseProgressModel;