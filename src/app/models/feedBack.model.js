// import SectionModel from "./section.model.js";
import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const FeedBackModel = sequelize.define("feedBack", {
    // Định nghĩa các trường trong bảng Lesson
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rate: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: true,

    }
}, {
    createdAt: "created_at",
    updatedAt: "updated_at"});
    FeedBackModel.sync().then(() => {
    console.log('FeedBack table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export default FeedBackModel;
