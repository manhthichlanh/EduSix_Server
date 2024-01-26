import sequelize from "./db.js";
import { DataTypes } from 'sequelize';

const AuthorModel = sequelize.define("author", {
  author_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_user: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnail: {
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

AuthorModel.sync().then(() => {
  console.log('author table created successfully!');
}).catch((error) => {
  console.error('Unable to create author table : ', error);
});

export default AuthorModel;
