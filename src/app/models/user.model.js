const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            hoten: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            ngaysinh: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                defaultValue: false,
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            tableName: 'User'
        }
    );
   // Thêm dòng tạo bảng
   sequelize.sync()
   .then(() => {
       console.log("Table 'User' has been created.");
   })
   .catch((error) => {
       console.error("Error creating 'User' table:", error);
   });
    return Model;
}