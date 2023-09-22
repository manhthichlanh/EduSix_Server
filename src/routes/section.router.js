import { Router } from "express";
let router = Router();
import * as initSection from "../app/controllers/section.controller"
export default function initCourseRoute(app) {
    router.get("/", initSection.getAllsection);
    router.get("/:section_id", initSection.getSectionById);

    router.post("/createSection", initSection.createSection);
    router.put("/updateSection/:section_id", initSection.updateSection);
    router.delete("/deleteSection/:section_id", initSection.deleteSection)
    app.use("/section", router);
}
