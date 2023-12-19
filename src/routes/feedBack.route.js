import { Router } from "express";
import * as initFeedBack from "../app/controllers/feedBack.controller";

const router = Router();

export default function initFeedBackRoute(app) {
    router.post('/:user_id/:course_id', initFeedBack.createFeedbackRateAndComment);
    router.get('/averageRate/:course_id', initFeedBack.AverageRate)
    app.use("/feedBack", router);
}
