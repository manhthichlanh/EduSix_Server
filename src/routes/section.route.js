import { Router } from "express";
import * as initSection from "../app/controllers/section.controller";

const router = Router();

export default function initSectionRoute(app) {
    router.get("/", initSection.getAllSection);
    router.get("/:id/course", initSection.getSectionCourse);
    router.get("/:id", initSection.getSectionById);
    router.post("/", initSection.createSection);
    router.delete("/:id", initSection.deleteSection);
    router.put("/:id", initSection.updateSection);
    app.use("/section", router);
}
