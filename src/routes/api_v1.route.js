import initCourseRoute from "./course.route";
import initUserRoute from "./user.route";
import initVideoRoute from "./video.route";
export default function initApiV1(app) {
    initCourseRoute(app)
    initUserRoute(app)
    initVideoRoute(app)
}
