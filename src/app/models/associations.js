import CourseModel from './course.model';
import CourseEnrollmentsModel from './courseEnrollment.model';
import SectionModel from './section.model';
import LessonModel from './lesson.model';
import CategoryModel from './category.model';
import UserModel from './user.model';
import AdminModel from './admin.model';
import QuizzModel from './quizz.models';
import AnswerModel from './answer.model';
import VideoModel from './video.model';

// Định nghĩa mối quan hệ giữa User và Course
AdminModel.hasMany(CourseModel, { foreignKey: 'admin_id' });
CourseModel.belongsTo(AdminModel, { foreignKey: 'admin_id' });

AdminModel.hasMany(CourseModel, { foreignKey: 'admin_id' });
CourseModel.belongsTo(AdminModel, { foreignKey: 'admin_id' });

UserModel.hasMany(CourseEnrollmentsModel, { foreignKey: 'user_id' });
CourseEnrollmentsModel.belongsTo(UserModel, { foreignKey: 'user_id' });

CourseModel.hasMany(CourseEnrollmentsModel, { foreignKey: 'course_id' });
CourseEnrollmentsModel.belongsTo(CourseModel, { foreignKey: 'course_id' });

// Định nghĩa mối quan hệ giữa Category và Course
CategoryModel.hasMany(CourseModel, { foreignKey: 'category_id'});
CourseModel.hasMany(CategoryModel, { foreignKey: 'category_id'});

// Định nghĩa mối quan hệ giữa Course và Section
CourseModel.hasMany(SectionModel, { foreignKey: 'course_id' });
SectionModel.belongsTo(CourseModel, { foreignKey: 'course_id' });
// Định nghĩa mối quan hệ giữa Section và Lesson
SectionModel.hasMany(LessonModel, { foreignKey: 'section_id' });
LessonModel.belongsTo(SectionModel, { foreignKey: 'section_id' });
//Đình nghĩa mối quan hệ Lesson và videos
LessonModel.hasMany(QuizzModel, { foreignKey: "lesson_id" });
QuizzModel.belongsTo(LessonModel, { foreignKey: "lesson_id" });
//Đình nghĩa mối quan hệ Lesson và quizzs
LessonModel.hasMany(VideoModel, { foreignKey: "lesson_id" });
VideoModel.belongsTo(LessonModel, { foreignKey: "lesson_id" });
//QUan he quizz và answer 
QuizzModel.hasMany(AnswerModel, { foreignKey: "quizz_id",as:"relaQuizz"});
AnswerModel.belongsTo(QuizzModel, { foreignKey: "quizz_id",as:"relaAnswer"});
//Quan hệ giữa Quizz và Lesson
LessonModel.hasMany(QuizzModel, { foreignKey: "lesson_id"});
QuizzModel.belongsTo(LessonModel, { foreignKey: "lesson_id"});
//Quan hệ giữa Quizz và Answer
QuizzModel.hasMany(AnswerModel, { foreignKey: "quizz_id"});
AnswerModel.belongsTo(QuizzModel, { foreignKey: "quizz_id"});