import { Router } from "express";

import * as initLessonQuizz from "../app/controllers/admin/lessonQuizzAdmin.controller"
const router = Router();

export default function initAdminQueryRoute(app) {

    // router.post("/create", initQuizz.createQuizz);
    // router.post("/updateQuizz/:id", initQuizz.updateQuizz);
    // router.delete("/deleteQuizzById/:id", initQuizz.deleteQuizzById);
    // //router client
    // router.get("/getAllQuizz/:lesson_id",initQuizz.getAllQuizz);
    // router.get("/getDetailQuizz/:id",initQuizz.getDetailQuizz);
    //Tạo lại
    // app.use("/quizz", router);
    router.get("/getAlllessonQuizz/:lesson_id",initLessonQuizz.getAllLessonQuizz);
    router.post("/createLessonQuizz",initLessonQuizz.createLessonQuizz);

    app.use('/admin',router);
}
