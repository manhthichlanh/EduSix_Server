import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
// import LessonModel from "./lesson.model.js";
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
    user_id: {
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    course_price: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    slug: {
        type: DataTypes.STRING,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        comment: "True là hiện, false là ẩn",
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

}, {
    createdAt: "created_at",
    updatedAt: "updated_at"
});

CourseModel.sync().then(() => {
    console.log('Course table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
export default CourseModel;
