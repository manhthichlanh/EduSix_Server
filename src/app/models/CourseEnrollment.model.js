import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
const CourseEnrollMentModel = sequelize.define("courseEnrollment", {
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
    rate:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    content:{
        type:DataTypes.STRING,
        allowNull:false
    }
}, {
    createdAt: "created_at",
    updatedAt: "updated_at"
});
CourseEnrollMentModel.sync().then(() => {
    console.log('CourseEnrollMentModel table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});
export default CourseEnrollMentModel;