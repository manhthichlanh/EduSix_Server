import { Router } from "express";
let router = Router();

import * as initUser from "../app/controllers/auth.controller"
export default function initUserRoute(app) {
    router.post("/login", initUser.loginUser);
    router.post("/", initUser.createUser)
    router.post('/protected', initUser.authenticateJWT, (req, res) => {
        res.status(200).json({ message: 'This is a protected route', user: req.user });
    });

    app.use("/auth/", router);
}
