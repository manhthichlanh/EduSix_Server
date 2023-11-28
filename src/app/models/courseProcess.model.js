// import SectionModel from "./section.model.js";
import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const CourseProcessModel = sequelize.define("courseprocess", {
    // Định nghĩa các trường trong bảng Lesson
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    course_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    process: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    finish: {
        type: DataTypes.BOOLEAN,
        comment: "True là hiện, false là ẩn",
        defaultValue: 1,
        allowNull: false
    }
}, {
    createdAt: "created_at",
    updatedAt: "updated_at"
});
CourseProcessModel.sync().then(() => {
    console.log('CourseProcessModel table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export default CourseProcessModel;
