import { Router } from "express";
import { uploadImageOnMemory } from "../app/configs/uploadImages.config";
import * as initBlog from "../app/controllers/blog.controller";
import { protect } from "../app/controllers/auth.controller";

export default function initBlogRoute(app) {
  let router = Router();

  router.get("/", initBlog.getAllBlogs);
  router.post("/addBlog", uploadImageOnMemory.single("thumbnail"), initBlog.addBlog);
  router.get("/:id", initBlog.getBlogById);
  router.delete("/:id", initBlog.deleteBlog);
  router.patch("/:id", uploadImageOnMemory.single("thumbnail"), initBlog.updateBlog);
  router.get("/thumbnail/:filename", initBlog.getImageByFileName);
  app.use("/blog", router);
}
