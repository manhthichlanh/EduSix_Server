import { Router } from "express";
let router = Router();
import { uploadImageOnMemory } from "../app/configs/uploadImages.config";
import * as initCourse from "../app/controllers/course.controller"
export default function initCourseRoute(app) {
    router.get("/", initCourse.getAllCourse)
    router.get("/page", initCourse.coursePage)
    router.get("/:id", initCourse.getCourseById)
    router.get("/:id/section/count", initCourse.getSectionCountByCourseId);
    router.post("/", 
    uploadImageOnMemory.single("thumbnail"),
    initCourse.createCourse)
    router.delete("/:id", initCourse.deleteCourse)
    router.put("/:id", 
    uploadImageOnMemory.single("thumbnail"),
    initCourse.updateCourse)
    router.get("/thumbnail/:fileName", initCourse.getImage)
    app.use("/course", router);
}
