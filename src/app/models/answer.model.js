// import SectionModel from "./section.model.js";
import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const AnswerModel = sequelize.define("answer", {
    // Định nghĩa các trường trong bảng Lesson
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    answer: {
        type: DataTypes.STRING,
    },
    isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    explain: {
        type: DataTypes.TEXT,
    },
    quizz_id: {
        type: DataTypes.INTEGER,
    }
}, {
    createdAt: "created_at",
    updatedAt: "updated_at"
});
AnswerModel.sync().then(() => {
    console.log('Answer table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export default AnswerModel;
