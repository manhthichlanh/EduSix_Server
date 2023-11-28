import sequelize from "./db.js";
import { DataTypes } from 'sequelize';

const AdminModel = sequelize.define("admins", {
  admin_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
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
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  createdAt: "created_at",
  updatedAt: "updated_at",
});

AdminModel.sync().then(() => {
  console.log('Admin table created successfully!');
}).catch((error) => {
  console.error('Unable to create table: ', error);
});
export default AdminModel;
