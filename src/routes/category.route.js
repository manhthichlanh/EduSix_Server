import { Router } from "express";
let router = Router();
import { uploadImageOnMemory } from "../app/configs/uploadImages.config";
import * as initCategory from "../app/controllers/category.controller"
export default function initCategoryRoute(app) {
    router.get("/", initCategory.getAllCategory)
    router.get("/page", initCategory.categoryPage)
    router.get("/:id", initCategory.getCategoryById)
    // router.post("/", initCategory.createCategory)
    router.delete("/:id", initCategory.deleteCategory)
    router.patch("/:id", uploadImageOnMemory.single('logo_cate'), initCategory.updateCategory)
    router.post("/", uploadImageOnMemory.single('logo_cate'), initCategory.createCategory)
    router.get("/logo_cate/:filename", initCategory.getImage);
    app.use("/category", router);
}
