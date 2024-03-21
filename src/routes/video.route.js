import { Router } from "express";

let router = Router();
import * as initVideo from "../app/controllers/video.controller";
import { uploadVideoOnMemory } from "../app/configs/uploadVideo.config";
import { checkRequestVideo, convertToHLS, encodeAlreadyVideoToHLS, encodeVideoToHLS, handleChunks, initVideoUpload } from "../../middleware/video.middleware";

export default function (app) {
    console.log("cóa")
    router.get("/", initVideo.getAllVideo)
    // router.post("/stream/create", 
    // uploadVideoOnMemory.single("file_videos"),
    // checkRequestVideo,
    // encodeVideoToHLS,
    // initVideo.createVideo
    // )
    router.post("/stream/create", 
    uploadVideoOnMemory.single("file_videos"),
    checkRequestVideo,
    encodeAlreadyVideoToHLS,
    initVideo.createVideo
    )
    router.post("/upload/chunks/:chunkNumber", uploadVideoOnMemory.single("chunk"), handleChunks)
    router.get("/:id", initVideo.getVideoById)
    router.delete("/:id", initVideo.deleteVideo)
    // router.put("/:id",
    //     uploadVideoOnMemory.single("file_videos"),
    //     checkRequestVideo,
    //     initVideo.updateVideo)

    router.get("/stream/:videoName", initVideo.getVideoStream)
    router.get("/getVideoStream/:objectId/:fileName", initVideo.getVideoStreamV2)

    router.get("/get-videos/json", initVideo.getAllVideosJson)
    router.delete("/delete-file/:type", initVideo.deleteVideosTempFile)
    
    // router.post("/",
    //     uploadVideoOnMemory.single("file_videos"),
    //     checkRequestVideo,
    //     initVideo.createVideo
    // )
    app.use("/video", router);
}
