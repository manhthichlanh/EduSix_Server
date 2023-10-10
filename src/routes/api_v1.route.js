import initCourseRoute from "./course.route";
import initSectionRoute from "./section.route";
import initLessonRoute from "./lesson.route";
import initCategoryRoute from "./category.route";
import initUserRoute from "./user.route";
import initAuthRoute from "./auth.route";
import initQuizzRoute from "./quizz.route";
import initVideoRoute from "./video.route";
export default function initApiV1(app) {
    initCourseRoute(app)
    initSectionRoute(app)
    initLessonRoute(app)
    initCategoryRoute(app)
    initUserRoute(app)
    initVideoRoute(app)
    initAuthRoute(app)
    initQuizzRoute(app)

}
