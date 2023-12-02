// import SectionModel from "./section.model.js";
import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const SectionProgressModel = sequelize.define("section_progress", {
    // Định nghĩa các trường trong bảng Lesson
    section_progress_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true, // Đặt để tự động tăng
    },
    course_progress_id: {
        type: DataTypes.INTEGER,
    },
    section_id: {
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
    }
}, {
    createdAt: "created_at",
    updatedAt: "updated_at",

});
SectionProgressModel.sync().then(() => {
    console.log('Lesson_progress table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export default SectionProgressModel;