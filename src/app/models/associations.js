import CourseModel from './course.model';
import CourseEnrollmentsModel from './courseEnrollment.model';
import CourseProgressModel from './courseProgress.model';
import SectionProgressModel from './sectionProgress.model';
import LessonProgressModel from './lessonProgress.model';
import SectionModel from './section.model';
import LessonModel from './lesson.model';
import CategoryModel from './category.model';
import UserModel from './user.model';
import AdminModel from './admin.model';
import QuizzModel from './quizz.models';
import AnswerModel from './answer.model';
import VideoModel from './video.model';
import CertificateModel from './certificate.model';
import OrderModel from './order.model';
import BlogCategory from './blogCategory.model';
import Author from './author.model';
import Blog from './blog.model';


import NotificationModel from './notification.model';
// Định nghĩa mối quan hệ giữa User và Course
AdminModel.hasMany(CourseModel, { foreignKey: 'admin_id' });
CourseModel.belongsTo(AdminModel, { foreignKey: 'admin_id' });

AdminModel.hasMany(CourseModel, { foreignKey: 'admin_id' });
CourseModel.belongsTo(AdminModel, { foreignKey: 'admin_id' });

UserModel.hasMany(CourseEnrollmentsModel, { foreignKey: 'user_id' });
CourseEnrollmentsModel.belongsTo(UserModel, { foreignKey: 'user_id' });


CourseEnrollmentsModel.hasMany(CourseProgressModel, { foreignKey: 'enrollment_id' });
CourseProgressModel.belongsTo(CourseEnrollmentsModel, { foreignKey: 'enrollment_id' });

CourseEnrollmentsModel.hasMany(CourseProgressModel, { foreignKey: 'enrollment_id' });
CourseProgressModel.belongsTo(CourseEnrollmentsModel, { foreignKey: 'enrollment_id' });

CourseProgressModel.hasOne(CertificateModel, {foreignKey: 'course_progress_id'});
CertificateModel.belongsTo(CourseProgressModel, {foreignKey: 'course_progress_id'})

CourseProgressModel.hasMany(SectionProgressModel, { foreignKey: 'course_progress_id' });
SectionProgressModel.belongsTo(CourseProgressModel, { foreignKey: 'course_progress_id' });

SectionProgressModel.hasMany(LessonProgressModel, { foreignKey: 'section_progress_id' });
LessonProgressModel.belongsTo(SectionProgressModel, { foreignKey: 'section_progress_id' });

CourseModel.hasMany(OrderModel, { foreignKey: 'course_id' });
OrderModel.belongsTo(CourseModel, { foreignKey: 'course_id' });

UserModel.hasMany(OrderModel, { foreignKey: 'user_id' });
OrderModel.belongsTo(UserModel, { foreignKey: 'user_id' });


CourseModel.hasMany(CourseEnrollmentsModel, { foreignKey: 'course_id' });
CourseEnrollmentsModel.belongsTo(CourseModel, { foreignKey: 'course_id' });

// Định nghĩa mối quan hệ giữa Category và Course
CategoryModel.hasMany(CourseModel, { foreignKey: 'category_id'});
CourseModel.belongsTo(CategoryModel, { foreignKey: 'category_id'});
// //Quan hệ giữa Author và Course
Author.hasMany(CourseModel, { foreignKey: "author_id"});
CourseModel.belongsTo(Author, { foreignKey: "author_id"});
//Quan hệ giữa User và Course
// UserModel.hasMany(CourseModel, { foreignKey: "user_id"});
// CourseModel.belongsTo(UserModel, { foreignKey: "user_id"});
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
//Quan hệ giữa Author và Blog
Author.hasMany(Blog, { foreignKey: "author_id"});
Blog.belongsTo(Author, { foreignKey: "author_id"});
//Quan hệ giữa BlogCategory và Blog
BlogCategory.hasMany(Blog, { foreignKey: "blog_category_id"});
Blog.belongsTo(BlogCategory, { foreignKey: "blog_category_id"});

//Quan hệ giữa Admin và Blog
AdminModel.hasMany(Blog, { foreignKey: "admin_id"});
Blog.belongsTo(AdminModel, { foreignKey: "admin_id"});
//Quan hệ giữa User và Blog
UserModel.hasMany(Blog, { foreignKey: "user_id"});
Blog.belongsTo(UserModel, { foreignKey: "user_id"});
