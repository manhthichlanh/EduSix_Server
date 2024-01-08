import initCourseRoute from "./course.route";
import initSectionRoute from "./section.route";
import initLessonRoute from "./lesson.route";
import initCategoryRoute from "./category.route";
import initUserRoute from "./user.route";
import initAuthRoute from "./auth.route";
import initQuizzRoute from "./quizz.route";
import initVideoRoute from "./video.route";
import initAdminQueryRoute from "./admin-query-router";
import initCertificateRoute from "./certificate.route";
import initOrderRoute from "./order-router";
import initNotificationRoute from "./notificattion.router";
import initBannerRoute from "./banner.router";
export default function adminRouter(app) {
    initCourseRoute(app)
    initSectionRoute(app)
    initLessonRoute(app)
    initCategoryRoute(app)
    initUserRoute(app)
    initVideoRoute(app)
    initAuthRoute(app)
    initQuizzRoute(app)
    initAdminQueryRoute(app)
    initCertificateRoute(app)
    initOrderRoute(app)
    initNotificationRoute(app)
    initBannerRoute(app)
}