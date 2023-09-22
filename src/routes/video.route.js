import { Router } from "express";
import uploadVideo from "../app/configs/uploadVideo.config";
let router = Router();
import multer from "multer";
const upload = multer();
import * as initVideo from "../app/controllers/video.controller"
export default function initVideoRoute(app) {
    router.get("/", initVideo.getAllVideo)
    router.get("/:id", initVideo.getVideoById)
    router.post("/", uploadVideo.single("file_videos"), initVideo.createVideo)
    router.delete("/:id", initVideo.deleteVideo)
    router.put("/:id", 
    // upload.none(),
    // uploadVideo.single("file_videos"), 
    initVideo.updateVideo )

    router.get("/stream/:videoName", initVideo.getVideoStream)

    app.use("/video", router);
}
