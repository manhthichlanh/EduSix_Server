import  sequelize  from "./db.js";
import {DataTypes} from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const userModel = sequelize.define("users", {
  // Định nghĩa các trường trong bảng Users
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  hoten: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  ngaysinh: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    defaultValue: false,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});
userModel.sync().then(() => {
    console.log('User table created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });
export default userModel;
