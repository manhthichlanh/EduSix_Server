import initCourseRoute from "./course.route";
import initSectionRoute from "./section.route";
import initUserRoute from "./user.route";
import initSectionRoute from "./section.router";
export default function initApiV1(app) {
    initCourseRoute(app)
    initSectionRoute(app)
    initUserRoute(app)
    initSectionRoute(app)
}
