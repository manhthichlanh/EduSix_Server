import { Router } from "express";
import {uploadVideoOnMemory} from "../app/configs/uploadVideo.config";

let router = Router();
import * as initVideo from "../app/controllers/video.controller";


export default function (app) {
    router.get("/", initVideo.getAllVideo)
    router.get("/:id", initVideo.getVideoById)
    router.delete("/:id", initVideo.deleteVideo)
    router.put("/:id",
        // upload.none(),
        // uploadVideo.single("file_videos"), 
        uploadVideoOnMemory.single("file_videos"),
        initVideo.updateVideo)

    router.get("/stream/:videoName", initVideo.getVideoStream)

    router.post("/",
        // uploadVideo.single("file_videos"),
        uploadVideoOnMemory.single("file_videos"),
        initVideo.createVideo)

    app.use("/video", router);
}
