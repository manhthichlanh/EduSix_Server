import sequelize from "./db.js";
import { DataTypes } from 'sequelize';

const BannerModel = sequelize.define("banner", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  thumnail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name_banner: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    comment: "True là hiện, false là ẩn",
    allowNull: false,
    defaultValue: true,
  },
  ordinal_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: "Sắp xếp thứ tự hiển thị",
  },
}, {
  createdAt: "created_at",
  updatedAt: "updated_at"
});

BannerModel.sync().then(() => {
  console.log('Banner table created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});

export default BannerModel;
