import { Router } from "express";
import { uploadImageOnMemory } from "../app/configs/uploadImages.config";
import * as initAuthor from "../app/controllers/author.controller";
import { protect } from "../app/controllers/auth.controller";

export default function initAuthorRoute(app) {
  let router = Router();

  router.get("/", initAuthor.getAllAuthorPosted);
  router.post("/addAuthor", uploadImageOnMemory.single("thumbnail"), initAuthor.addAuthorPosted);
  router.get("/:id", initAuthor.getAuthorPostedById);
  router.delete("/:id", initAuthor.deleteAuthorPosted);
  router.patch("/:id", uploadImageOnMemory.single("thumbnail"), initAuthor.updateAuthorPosted);
  router.get("/thumbnail/:filename", initAuthor.getImageByFileName);
  app.use("/author", router);
}
