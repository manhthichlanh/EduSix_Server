import { Router } from "express";
let router = Router();
import * as initUser from "../app/controllers/user.controller"
export default function initUserRoute(app) {
    router.post("/login", initUser.loginUser);
    router.get("/", initUser.getAllUser)
    router.get("/:id", initUser.getCourseById)
    router.post("/", initUser.createUser)
    router.delete("/:id", initUser.deleteCourse)
    router.put("/:id", initUser.updateUser)
    router.get('/protected', initUser.authenticateJWT, (req, res) => {
        res.json({ message: 'This is a protected route', user: req.user });
    });

    app.use("/user", router);
}
