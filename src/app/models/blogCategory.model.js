import sequelize from "./db.js";
import { DataTypes } from 'sequelize';

const BlogCategoryModel = sequelize.define("blog_categories", {
  blog_category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name_blog_category: {
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

BlogCategoryModel.sync().then(() => {
  console.log('Blog category table created successfully!');
}).catch((error) => {
  console.error('Unable to create blog category table : ', error);
});

export default BlogCategoryModel;
