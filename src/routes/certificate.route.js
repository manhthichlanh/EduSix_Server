import { Router } from "express";
let router = Router();
import * as initCertificate from "../app/controllers/certificate.controller"
export default function initCertificateRoute(app) {
    router.get("/byUser/:user_id", initCertificate.getAllCertificateByUser)
    router.get("/bySub/:sub_id", initCertificate.getCertificateBySubId)
    router.post("/", initCertificate.createCertificate)
    // router.get("/:id", initCategory.getCategoryById)
    // router.post("/", initCategory.createCategory)
    // router.delete("/:id", initCategory.deleteCategory)
    // router.put("/:id", initCategory.updateCategory)
    // router.get("/logo_cate/:fileName", initCategory.getImage);
    app.use("/certificate", router);
}
