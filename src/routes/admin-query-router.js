import { Router } from "express";
import * as initAdminQuery from "../app/controllers/admin-query.controller";
import { uploadVideoOnMemory } from "../app/configs/uploadVideo.config";
import { checkRequestVideo, convertToHLS } from "../../middleware/video.middleware";
import { createCourse, getAllCourse } from "../app/controllers/course.controller";
import { getSectionById, createSection } from "../app/controllers/section.controller";
const router = Router();

export default function initAdminQueryRoute(app) {
    router.post("/lesson-with-video", uploadVideoOnMemory.single("file_videos"), checkRequestVideo, convertToHLS, initAdminQuery.createLessonWithVideo);
    router.post("/upload", uploadVideoOnMemory.single("file"), initAdminQuery.uploadFile)
    // router.post("/create", initQuizz.createQuizz);
    router.get('/getAllLessonQuizz/:lesson_id',initAdminQuery.getAllLessonQuizz)
    router.post('/createLessonQuizz',initAdminQuery.createLessonQuizz);
    router.delete('/deleteLessonQuizz/:lesson_id',initAdminQuery.deleteLessonQuizz);
    router.get('/get-all-course',getAllCourse);
    router.post("/create-course", createCourse);
    router.get('get-all-section/:section_id', getSectionById);
    router.post('/createSection', createSection);
    // router.post("/updateQuizz/:id", initQuizz.updateQuizz);
    // router.delete("/deleteQuizzById/:id", initQuizz.deleteQuizzById);
    // //router client
    // router.get("/getAllQuizz/:lesson_id",initQuizz.getAllQuizz);
    // router.get("/getDetailQuizz/:id",initQuizz.getDetailQuizz);
    //Tạo lại
    app.use("/admin-query", router);
}
