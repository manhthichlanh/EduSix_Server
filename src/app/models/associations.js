import CourseModel from './course.model';
import SectionModel from './section.model';
import LessonModel from './lesson.model';
import CategoryModel from './category.model';
import videoModel from './video.model';
import UserModel from './user.model';
import QuizzModel from './quizz.models';
import AnswerModel from './answer.model';
import VideoModel from './video.model';
import CourseEnrollMentModel from './CourseEnrollment.model';
// Định nghĩa mối quan hệ giữa User và Course
UserModel.hasMany(CourseModel, { foreignKey: 'user_id' });
CourseModel.belongsTo(UserModel, { foreignKey: 'user_id' });
// Định nghĩa mối quan hệ giữa Category và Course
CategoryModel.hasMany(CourseModel, { foreignKey: 'category_id' });
CourseModel.hasMany(CategoryModel, { foreignKey: 'category_id' });

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
LessonModel.hasMany(videoModel, { foreignKey: "lesson_id" });
videoModel.belongsTo(LessonModel, { foreignKey: "lesson_id" });
//QUan he quizz và answer 
QuizzModel.hasMany(AnswerModel, { foreignKey: "quizz_id",as:"relaQuizz"});
AnswerModel.belongsTo(QuizzModel, { foreignKey: "quizz_id",as:"relaAnswer"});
//Quan hệ giữa Quizz và Lesson
LessonModel.hasMany(QuizzModel, { foreignKey: "lesson_id"});
QuizzModel.belongsTo(LessonModel, { foreignKey: "lesson_id"});
//Quan hệ giữa Quizz và Answer
QuizzModel.hasMany(AnswerModel, { foreignKey: "quizz_id"});
AnswerModel.belongsTo(QuizzModel, { foreignKey: "quizz_id"});
//Relations 
CourseEnrollMentModel.belongsTo(UserModel,{foreignKey:'user_id',as:'user'});
CourseEnrollMentModel.belongsTo(CourseModel,{foreignKey:'course_id',as:'course'});
