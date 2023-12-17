// import SectionModel from "./section.model.js";
import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const OrderModel = sequelize.define("orders", {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    order_info: {
        type: DataTypes.STRING(250),
    },
    bank_code: {
        type: DataTypes.STRING,
    },
    transaction_code: {
        type: DataTypes.STRING,
    },
    payment_method: {
        type: DataTypes.STRING,
    },
    transaction_status: {
        type: DataTypes.STRING,
    },
    order_date: {
        type: DataTypes.STRING,
    },
}, {
    createdAt: "created_at",
});
OrderModel.sync().then(() => {
    console.log('Lesson_progress table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export default OrderModel;