import { Router } from "express";
import * as initAdminQuery from "../app/controllers/admin-query.controller";
import { uploadVideoOnMemory } from "../app/configs/uploadVideo.config";
const router = Router();

export default function initAdminQueryRoute(app) {
    router.post("/lesson-with-video", initAdminQuery.createLessonWithVideo);
    router.post("/upload", uploadVideoOnMemory.single("file"), initAdminQuery.uploadFile)
    // router.post("/create", initQuizz.createQuizz);
    // router.post("/updateQuizz/:id", initQuizz.updateQuizz);
    // router.delete("/deleteQuizzById/:id", initQuizz.deleteQuizzById);
    // //router client
    // router.get("/getAllQuizz/:lesson_id",initQuizz.getAllQuizz);
    // router.get("/getDetailQuizz/:id",initQuizz.getDetailQuizz);
    //Tạo lại
    app.use("/admin-query", router);
}
