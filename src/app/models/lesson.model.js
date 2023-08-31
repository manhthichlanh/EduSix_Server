const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'Lesson',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            section_id: {
                type: DataTypes.INTEGER,
            },
            title: {
                type: DataTypes.STRING,

            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            type: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            },
            duration: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            active: {
                type: DataTypes.INTEGER
            },
            ordinal_number: {
                type: DataTypes.INTEGER
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            tableName: 'lesson'
        }
    );
    // set mối quan hệ 
    Model.associate = function (models) {
        Model.belongsTo(models.Section, { foreignKey: 'section_id', as: 'section' });
    }
    // Thêm thông báo dòng tạo bảng
    sequelize.sync()
        .then(() => {
            console.log("Table 'Lesson' has been created.");
        })
        .catch((error) => {
            console.error("Error creating 'Lesson' table:", error);
        });
    return Model;
}