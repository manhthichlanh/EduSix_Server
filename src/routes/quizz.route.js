import { Router } from "express";
import * as initQuizz from "../app/controllers/quizz.controller";

const router = Router();

export default function initQuizzRoute(app) {
    router.post("/create", initQuizz.createQuizz);
    router.post("/updateQuizz/:id", initQuizz.updateQuizz);
    router.delete("/deleteQuizzById/:id", initQuizz.deleteQuizzById);
    //router client
    router.get("/getAllQuizz/:lesson_id",initQuizz.getAllQuizz);
    router.get("/getDetailQuizz/:id",initQuizz.getDetailQuizz);

    app.use("/quizz", router);
}
