import { Router } from "express";
import { uploadVideoOnMemory } from "../app/configs/uploadVideo.config";
import checkRequestVideo from "../../middleware/video.middleware";
let router = Router();
import * as initVideo from "../app/controllers/video.controller";


export default function (app) {
    router.get("/", initVideo.getAllVideo)
    router.get("/:id", initVideo.getVideoById)
    router.delete("/:id", initVideo.deleteVideo)
    router.put("/:id",
        uploadVideoOnMemory.single("file_videos"),
        checkRequestVideo,
        initVideo.updateVideo)

    router.get("/stream/:videoName", initVideo.getVideoStream)

    router.post("/",
        uploadVideoOnMemory.single("file_videos"),
        checkRequestVideo,
        initVideo.createVideo
    )
    app.use("/video", router);
}
