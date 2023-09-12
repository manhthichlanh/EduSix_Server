import { Router } from "express";
let router = Router();
import * as initUser from "../app/controllers/user.controller"
export default function initUserRoute(app) {
    router.get("/hello", initUser.getAllUser)

    app.use("/user", router);
}
