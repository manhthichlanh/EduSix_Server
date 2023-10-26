// import SectionModel from "./section.model.js";
import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const QuizzModel = sequelize.define("quizz", {
    // Định nghĩa các trường trong bảng Lesson
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true, // Đặt để tự động tăng
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    process: {
        type: DataTypes.FLOAT,
    },
    status: {
        type: DataTypes.BOOLEAN,
        comment: "True là hiện, false là ẩn",
        allowNull: false
    },
    lesson_id: {
        type: DataTypes.INTEGER,
    }
}, {
    createdAt: "created_at",
    updatedAt: "updated_at"
});
QuizzModel.sync().then(() => {
    console.log('Quizz table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export default QuizzModel;
