import { Router } from "express";
let router = Router();
import { join } from "path"
import * as initAuth from "../app/controllers/auth.controller"
export default function initUserRoute(app) {
    router.post("/login", initAuth.loginUser);
    router.post("/", initAuth.createUser)
    router.post("/verify/user", initAuth.verifyUserToken)
    router.get("/oauth/google", initAuth.googleAuth2)
    router.get("/oauth/facebook", initAuth.facebookAuth2)
    router.post('/protected', initAuth.authenticateJWT, (req, res) => {
        res.status(200).json({ message: 'This is a protected route', user: req.user });
    });
    router.get("/popup", (req, res) => {
        res.sendFile(join(process.cwd(), "test.html"))
    })

    app.use("/auth/", router);
}
