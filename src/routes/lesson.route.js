import { Router } from "express";
import * as initLesson from "../app/controllers/lesson.controller";

const router = Router();

export default function initLessonRoute(app) {
    router.get("/", initLesson.getAllLesson);
    router.get("/:id", initLesson.getLessonById);
    router.post("/", initLesson.createLesson);
    router.delete("/:id", initLesson.deleteLesson);
    router.put("/:id", initLesson.updateLesson);
    app.use("/lesson", router);
}
