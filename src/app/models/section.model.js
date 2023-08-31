const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define(
        'Section',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            course_id: {
                type: DataTypes.INTEGER,
                allowNull: false,

            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }, ordinal_number: {
                type: DataTypes.INTEGER,
                allowNull: false,

            }
        },
        {
            tableName: 'section'
        }
    );
//set mối quan hệ 
Model.associate = function (models) {
    Model.hasMany(models.Lesson, { foreignKey: 'section_id', as: 'sectionLesson' });   // quan hệ với section - lesson = 1 -n 
    Model.belongsTo(models.Course, { foreignKey: 'course_id', as: 'sectionCourse' });   // quan hệ với section - Course = 1 -n 
}
    // Thêm dòng tạo bảng
    sequelize.sync()
        .then(() => {
            console.log("Table 'Section' has been created.");
        })
        .catch((error) => {
            console.error("Error creating 'Section' table:", error);
        });
    return Model;
}