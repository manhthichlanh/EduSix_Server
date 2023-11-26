import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const SectionProgressModel = sequelize.define("course_enrollments", {
    // Định nghĩa các trường trong bảng Users
    section_process_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    course_proccess_id: {
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
        type: DataTypes.BOOLEAN
    }
});

SectionProgressModel.sync().then(() => {
    console.log('Course Progress table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
export default SectionProgressModel;
