import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
const BlogModel = sequelize.define("blog", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        comment: "True là hiện, false là ẩn",
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thumnail: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    createdAt: "created_at",
    updatedAt: "updated_at"
});
BlogModel.sync().then(() => {
    console.log('Blog table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export default BlogModel;