import { Router } from "express";
import * as initAdminQuery from "../app/controllers/admin-query.controller";
import { uploadVideoOnMemory } from "../app/configs/uploadVideo.config";
import { checkRequestVideo, convertToHLS } from "../../middleware/video.middleware";
const router = Router();

export default function initAdminQueryRoute(app) {
    router.post("/lesson-with-video", uploadVideoOnMemory.single("file_videos"), checkRequestVideo, initAdminQuery.createLessonWithVideo, convertToHLS);
    router.post("/upload", uploadVideoOnMemory.single("file"), initAdminQuery.uploadFile)
    // router.post("/create", initQuizz.createQuizz);
    router.get('/getAllLessonQuizz/:lesson_id', initAdminQuery.getAllLessonQuizz)
    router.post('/createLessonQuizz', initAdminQuery.createLessonQuizz);
    router.delete('/deleteLessonQuizz/:lesson_id', initAdminQuery.deleteLessonQuizz);
    router.get('/getAllLessonQuizzVideo/:course_id', initAdminQuery.getAllSectionLessonQuizzVideo)
    router.delete('/deleteLessonQuizzVideo/:lesson_id', initAdminQuery.deleteLessonQuizzVideo);
    router.get('/getLessonVideoQuizz/', initAdminQuery.getAllLessonVideoQuizz);
    router.get('/getLessonVideoQuizzBySectionId', initAdminQuery.getAllLessonVideoQuizzBySectionId)
    router.post('/enrollmentCourse', initAdminQuery.userEnrollCourse)
    router.post('/updateProgress', initAdminQuery.updateProgress)
    router.get('/getAllProgress', initAdminQuery.getAllProgressById)
    router.get('/getAllCourseProgressByUser', initAdminQuery.getAllCourseProgressByUser);
    router.get('/isUserEnrollCourse', initAdminQuery.isUserEnrollCourse)
    // router.post("/updateQuizz/:id", initQuizz.updateQuizz);
    // router.delete("/deleteQuizzById/:id", initQuizz.deleteQuizzById);
    // //router client
    // router.get("/getAllQuizz/:lesson_id",initQuizz.getAllQuizz);
    // router.get("/getDetailQuizz/:id",initQuizz.getDetailQuizz);
    //Tạo lại
    app.use("/admin-query", router);
}
