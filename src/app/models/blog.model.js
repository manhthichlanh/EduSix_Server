import sequelize from "./db.js";
import { DataTypes } from 'sequelize';


const BlogModel = sequelize.define("blogs", {
  blog_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT, 
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    comment: "True là hiện, false là ẩn",
    allowNull: false,
    defaultValue: true,
  },
  blog_category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // references: {
    //   model: BlogCategoryModel,
    //   key: 'blog_category_id'
    // }
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
   
  },
  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
   
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
   
  }
}, {
  createdAt: "created_at",
  updatedAt: "updated_at"
});

// Define a relationship with BlogCategoryModel
// BlogModel.belongsTo(BlogCategoryModel, {
//   foreignKey: 'blog_category_id',
//   onDelete: 'CASCADE',
// });

BlogModel.sync().then(() => {
  console.log('Blog table created successfully!');
}).catch((error) => {
  console.error('Unable to create blog table: ', error);
});

export default BlogModel;
