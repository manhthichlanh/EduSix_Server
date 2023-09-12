import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
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
    title: {
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
    thumbnail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total_course_time: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
});
CourseModel.sync().then(() => {
    console.log('Course table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
export default CourseModel;
