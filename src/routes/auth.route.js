import { Router } from "express";
let router = Router();
import { join } from "path"
import * as initAuth from "../app/controllers/auth.controller"
import { uploadImageOnMemory } from "../app/configs/uploadImages.config";
export default function initUserRoute(app) {

    router.post("/login", initAuth.loginUser)
    router.get("/", initAuth.getAllUser)
    router.post("/login/admin", initAuth.loginAdmin)
    router.post("/register", initAuth.createUser)
    router.post("/user/create", initAuth.createUser)
    router.post("/admin/create", uploadImageOnMemory.single("avatar"), initAuth.createAdmin)
    router.post("/verify/user", initAuth.verifyUserToken)
    router.post("/verify/admin", initAuth.verifyAdminToken)
    router.get("/oauth/google", initAuth.googleAuth2)
    router.get("/oauth/facebook", initAuth.facebookAuth2)
    router.post("/protected", initAuth.authenticateJWT, (req, res) => {
        res.status(200).json({ message: 'This is a protected route', admin: req.admin });
    });
    router.get("/popup", (req, res) => {
        res.sendFile(join(process.cwd(), "test.html"))
    })

    router.get("/avatar/:filename", initAuth.getImageByFileName);
    app.use("/auth/", router);
}
