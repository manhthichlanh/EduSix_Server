import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const UserModel = sequelize.define("users", {
  // Định nghĩa các trường trong bảng Users
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sub_id: {
    type: DataTypes.STRING,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  nickname: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    comment: "True là hiện, false là ẩn",
    allowNull: false,
    defaultValue: true,
  },
}, {
  createdAt: "created_at",
  updatedAt: "updated_at"
});

UserModel.sync().then(() => {
  console.log('User table created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});
export default UserModel;
