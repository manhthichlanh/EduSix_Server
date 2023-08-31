const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'Course',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            category_id: {
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            number_of_lessons: {
                type: DataTypes.INTEGER,
                allowNull: false,

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
            thumbnail: {
                type: DataTypes.STRING,
                allowNull: false
            },
            total_course_time: {
                type: DataTypes.DATE
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            tableName: 'course'
        }
    );
    //set mối quan hệ 
    Model.associate = function (models) {
        Model.hasMany(models.Section, { foreignKey: 'course_id', as: 'courseSection' });    
    }
    // Thêm dòng tạo bảng
    sequelize.sync()
        .then(() => {
            console.log("Table 'Course' has been created.");
        })
        .catch((error) => {
            console.error("Error creating 'Course' table:", error);
        });
    return Model;
}