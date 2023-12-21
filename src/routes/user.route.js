import { Router } from "express";
let router = Router();
import { uploadImageOnMemory } from "../app/configs/uploadImages.config";

import * as initUser from "../app/controllers/user.controller"
import { protect } from "../app/controllers/auth.controller";
export default function initUserRoute(app) {
    // router.use( protect);   // đây là để bảo về tuyến đường 
    router.get("/", initUser.getAllUser)
    router.get("/:id", initUser.getCourseById)
    router.delete("/:id", initUser.deleteUser)
    router.put("/:id", initUser.updateUser)
    router.patch("/update/:user_id", uploadImageOnMemory.single("avatar"),initUser.updateFieldsUser)
    router.get("/avatar/:fileName", initUser.getImage)
    app.use("/user", router);
}
