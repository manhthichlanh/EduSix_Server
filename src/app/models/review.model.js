import sequelize from "./db.js";
import { DataTypes } from 'sequelize';

const ReviewModel = sequelize.define("reviews", {
    review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    reviewer_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    work: {
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
}, {
    createdAt: "created_at",
    updatedAt: "updated_at"
});

ReviewModel.sync().then(() => {
    console.log('Review table created successfully!');
}).catch((error) => {
    console.error('Unable to create review table: ', error);
});

export default ReviewModel;
