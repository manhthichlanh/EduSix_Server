import { Router } from "express";
let router = Router();
import * as initSection from "../app/controllers/section.controller"
export default function initSectionRoute(app) {
    router.get("/", initSection.getAllSection)
    // router.get("/:id", initSection.getCourseById)
    router.post("/", initSection.createSection)
    // router.delete("/:id", initSection.deleteCourse)
    // router.put("/:id", initSection.updateCourse)
    app.use("/section", router);
}
