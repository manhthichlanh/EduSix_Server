import { Router } from "express";
let router = Router();
import * as initCourse from "../app/controllers/course.controller"
export default function initCourseRoute(app) {
    router.get("/", initCourse.getAllCourse)
    router.post("/", initCourse.createCourse)
    app.use("/course", router);
}
