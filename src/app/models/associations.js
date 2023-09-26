import CourseModel from './course.model';
import SectionModel from './section.model';
import LessonModel from './lesson.model';
import CategoryModel from './category.model';
// Định nghĩa mối quan hệ giữa Course và Section
CourseModel.hasMany(SectionModel, { foreignKey: 'course_id' });
SectionModel.belongsTo(CourseModel, { foreignKey: 'course_id' });
// Định nghĩa mối quan hệ giữa Section và Lesson
SectionModel.hasMany(LessonModel, { foreignKey: 'section_id' });
LessonModel.belongsTo(SectionModel, { foreignKey: 'section_id' });
// Định nghĩa mối quan hệ giữa Category và Course
CategoryModel.hasMany(CourseModel, { foreignKey: 'category_id'});
CourseModel.hasMany(CategoryModel, { foreignKey: 'category_id'});
