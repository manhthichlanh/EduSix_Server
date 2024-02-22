import { Router } from "express";
import { uploadImageOnMemory } from "../app/configs/uploadImages.config";
import * as initBlogCategory from "../app/controllers/blogCategory.controller";
import { protect } from "../app/controllers/auth.controller";

export default function initBlogCategoryRoute(app) {
  let router = Router();

  router.get("/", initBlogCategory.getAllBlogCategories);
  router.post("/addBlogCategory", uploadImageOnMemory.single("thumbnail"), initBlogCategory.addBlogCategory);
  router.get("/:id", initBlogCategory.getBlogCategoryById);
  router.delete("/:id", initBlogCategory.deleteBlogCategory);
  router.patch("/:id", uploadImageOnMemory.single("thumbnail"), initBlogCategory.updateBlogCategory);
  router.get("/thumbnail/:filename", initBlogCategory.getImageByFileName);
  app.use("/blogCategory", router);
}
