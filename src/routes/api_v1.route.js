import initCourseRoute from "./course.route";
import initUserRoute from "./user.route";
import initSectionRoute from "./section.router";
export default function initApiV1(app) {
    initCourseRoute(app)
    initUserRoute(app)
    initSectionRoute(app)
}
