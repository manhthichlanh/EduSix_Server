import { Router } from "express";
import * as initNotification from "../app/controllers/notfications.controller";

const router = Router();

export default function initNotificationRoute(app) {
    router.get("/getNotification", initNotification.getNotifications);
    router.post("/updateIsReadNotification", initNotification.updateReadNotification);
    router.post("/createNotification", initNotification.createNotification);
    app.use("/notification", router);
}
