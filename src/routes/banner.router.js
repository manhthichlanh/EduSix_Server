import { Router } from "express";
import { uploadImageOnMemory } from "../app/configs/uploadImages.config";
import * as initBanner from "../app/controllers/banner.controller";
import { protect } from "../app/controllers/auth.controller";

export default function initBannerRoute(app) {
  let router = Router();

  router.get("/", initBanner.getAllBanners);
  router.post("/addBanner", uploadImageOnMemory.single("thumnail"), initBanner.addBanner);
  router.get("/:id", initBanner.getBannerById);
  router.delete("/:id", initBanner.deleteBanner);
  router.patch("/:id", uploadImageOnMemory.single("thumnail"), initBanner.updateBanner);
  router.get("/thumnail/:filename", initBanner.getImageByFileName);

  app.use("/banner", router);
}
