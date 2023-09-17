import { Router } from "express";
let router = Router();
import * as initUser from "../app/controllers/user.controller"
export default function initUserRoute(app) {
    router.get("/", initUser.getAllUser)
    router.get("/:id", initUser.getCourseById)
    router.post("/", initUser.createUser)
    router.delete("/:id", initUser.deleteCourse)
    router.put("/:id", initUser.updateUser)

    app.use("/user", router);
}
