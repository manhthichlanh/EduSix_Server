import CourseModel from './course.model';
import SectionModel from './section.model';
import LessonModel from './lesson.model';
// // Định nghĩa mối quan hệ giữa Course và Section

CourseModel.hasMany(SectionModel, { foreignKey: 'course_id' });
SectionModel.belongsTo(CourseModel, { foreignKey: 'course_id' });



SectionModel.hasMany(LessonModel, { foreignKey:'section_id'});
LessonModel.belongsTo(SectionModel, { foreignKey:'section_id'});