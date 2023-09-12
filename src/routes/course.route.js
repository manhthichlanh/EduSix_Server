import { Router } from "express";
let router = Router();
import * as initCourse from "../app/controllers/course.controller"
export default function initCourseRoute(app) {
    router.get("/", initCourse.getAllCourse)
    router.get("/:id", initCourse.getCourseById)
    router.post("/", initCourse.createCourse)
    router.delete("/:id", initCourse.deleteCourse)
    router.put("/:id", initCourse.updateCourse)
    app.use("/course", router);
}
