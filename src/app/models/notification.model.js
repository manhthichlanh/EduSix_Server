// import SectionModel from "./section.model.js";
import sequelize from "./db.js";
import { DataTypes } from 'sequelize';
// import { sequelize, DataTypes }from 'sequelize';
const NotificationModel = sequelize.define("notifications", {
    notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    link: {
        type: DataTypes.STRING,
    },
    receiver: {
        type: DataTypes.STRING,
    },
    message: {
        type: DataTypes.STRING,
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },  
    type: {
        type: DataTypes.INTEGER,
    },

}, {
    createdAt: "created_at",
    updatedAt: false
});
NotificationModel.sync().then(() => {
    console.log('Notifications table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

export default NotificationModel;