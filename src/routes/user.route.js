import { Router } from "express";
let router = Router();

import * as initUser from "../app/controllers/user.controller"
import { protect } from "../app/controllers/auth.controller";
export default function initUserRoute(app) {
    // router.use( protect);   // đây là để bảo về tuyến đường 
    router.get("/", initUser.getAllUser)
    router.get("/:id", initUser.getCourseById)
    router.delete("/:id", initUser.deleteUser)
    router.put("/:id", initUser.updateUser)
    app.use("/user", router);
}
