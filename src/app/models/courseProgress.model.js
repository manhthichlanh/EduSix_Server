import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const CourseProgressModel = sequelize.define("course_enrollments", {
    // Định nghĩa các trường trong bảng Users
    course_progress_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    enrollment_id: {
        type: DataTypes.INTEGER,
        unique: true
    },
    course_id: {
        type: DataTypes.INTEGER,
    },
    course_process: {
        type: DataTypes.FLOAT
    },
    is_finish: {
        type: DataTypes.BOOLEAN
    }
});

CourseProgressModel.sync().then(() => {
    console.log('Course Progress table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
export default CourseProgressModel;
