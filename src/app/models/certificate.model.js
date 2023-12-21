import sequelize from "./db.js";
import { DataTypes } from 'sequelize';

const CertificateModel = sequelize.define("certificates", {
  certificate_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sub_id: {
    type: DataTypes.STRING
  },
  course_progress_id: {
    type: DataTypes.INTEGER,
  },
  user_id: {
    type: DataTypes.INTEGER,
  },
  course_id: {
    type: DataTypes.INTEGER,
  },
  total_duration: {
    type: DataTypes.INTEGER,
  },
}, {
  createdAt: "created_at",
  updatedAt: "updated_at",
});

CertificateModel.sync().then(() => {
  console.log('Certificate table created successfully!');
}).catch((error) => {
  console.error('Unable to create table: ', error);
});
export default CertificateModel;
