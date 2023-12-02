import sequelize from "./db.js";
import { DataTypes } from 'sequelize';

const CourseEnrollmentsModel = sequelize.define("course_enrollments", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  course_id: {
    type: DataTypes.INTEGER,
  },
  user_id: {
    type: DataTypes.INTEGER,
  }
}, {
  createdAt: "created_at",
  updatedAt: "updated_at"
});

CourseEnrollmentsModel.sync().then(() => {
  console.log('User table created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});
export default CourseEnrollmentsModel;