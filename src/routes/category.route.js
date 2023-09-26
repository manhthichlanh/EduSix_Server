import { Router } from "express";
let router = Router();
import * as initCategory from "../app/controllers/category.controller"
export default function initCategoryRoute(app) {
    router.get("/", initCategory.getAllCategory)
    router.get("/:id", initCategory.getCategoryById)
    router.post("/", initCategory.createCategory)
    router.delete("/:id", initCategory.deleteCategory)
    router.put("/:id", initCategory.updateCategory)
    app.use("/category", router);
}
