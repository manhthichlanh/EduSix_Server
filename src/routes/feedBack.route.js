import { Router } from "express";
import * as initFeedBack from "../app/controllers/feedBack.controller";

const router = Router();

export default function initFeedBackRoute(app) {
    router.post('/:user_id/:course_id',initFeedBack.createFeedback)
    router.get('/:course_id',initFeedBack.getFeedBackByCourse);
    router.get('/averageRate/:course_id',initFeedBack.AverageRate)
    // router.get("/", initLesson.getAllLesson);
    // router.get("/:id", initLesson.getLessonById);
    // router.post("/", initLesson.createLesson);
    // router.post("/", initLesson.getLessonBySectionId)
    // router.delete("/:id", initLesson.deleteLesson);
    // router.put("/:id", initLesson.updateLesson);
    app.use("/feedBack", router);
}
