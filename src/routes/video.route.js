import { Router } from "express";
let router = Router();
import * as initVideo from "../app/controllers/video.controller"
export default function initVideoRoute(app) {
    router.get("/", initVideo.getAllVideo)
    router.get("/:id", initVideo.getVideoById)
    router.post("/", initVideo.createVideo)
    router.delete("/:id", initVideo.deleteVideo)
    router.put("/:id", initVideo.updateVideo)

    app.use("/video", router);
}
