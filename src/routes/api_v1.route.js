import initCourseRoute from "./course.route";
import initSectionRoute from "./section.route";
import initLessonRoute from "./lesson.route";
import initUserRoute from "./user.route";
import initVideoRoute from "./video.route";
export default function initApiV1(app) {
    initCourseRoute(app)
    initSectionRoute(app)
    initLessonRoute(app)
    initUserRoute(app)
    initVideoRoute(app)
}
