import { Router } from "express";
let router = Router();
import { uploadImageOnMemory } from "../app/configs/uploadImages.config";

import * as initBanner from "../app/controllers/banner.controller"
import { protect } from "../app/controllers/auth.controller";

export default function initBannerRoute(app) {
   
    router.get("/", initBanner.getAllBanners);
    router.post("/addBanner", uploadImageOnMemory.single("thumnail"), initBanner.addBanner);
    router.get("/:id", initBanner.getBannerById);
    router.delete("/:id", initBanner.deleteBanner);
    router.put("/:id", uploadImageOnMemory.single("thumnail"), initBanner.updateBanner);

    app.use("/banner", router);
}
