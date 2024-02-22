import { Router } from "express";
import { uploadImageOnMemory } from "../app/configs/uploadImages.config";
import * as reviewController from "../app/controllers/review.controller";

export default function initReviewRoute(app) {
  let router = Router();

  router.get("/", reviewController.getAllReviews);
  router.post("/addReview", uploadImageOnMemory.single("avatar"), reviewController.addReview);
  router.get("/:id", reviewController.getReviewById);
  router.delete("/:id", reviewController.deleteReview);
  router.patch("/:id", uploadImageOnMemory.single("avatar"), reviewController.updateReview);
  router.get("/avatar/:filename", reviewController.getAvatarByFileName);
  app.use("/review", router);
}
