import { Router } from "express";
let router = Router();
import * as initBlog from "../app/controllers/blogs.controller"
export default function initBlogRoute(app) {
    // router.use( protect);   // đây là để bảo về tuyến đường 
    router.get("/",initBlog.getAllBlog)
    router.get("/:id",initBlog.getBlogById)
    router.post("/:category_id",initBlog.createBlog);
    app.use("/blog", router);
}
