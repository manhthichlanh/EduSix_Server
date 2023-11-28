// import SectionModel from "./section.model.js";
import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const SectionProcessModel = sequelize.define("sectionprocess", {
    // Định nghĩa các trường trong bảng Lesson
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
   current: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    section_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    course_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    createdAt: "created_at",
    updatedAt: "updated_at"
});
SectionProcessModel .sync().then(() => {
    console.log('SectionProcessModel table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export default SectionProcessModel ;
