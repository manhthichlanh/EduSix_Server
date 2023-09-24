import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
import LessonModel from "./lesson.model.js";
const CourseModel = sequelize.define("course", {
    // Định nghĩa các trường trong bảng Users
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    category_id: {
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    number_of_lessons: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    slug: {
        type: DataTypes.STRING,

    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    thumbnail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total_course_time: {
        type: DataTypes.DATE
    }

}, {
    createdAt: "created_at",
    updatedAt: "updated_at"
});
CourseModel.sync({force: true}).then(() => {
    console.log('Course table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
export default CourseModel;
