import { Router } from "express";
import * as initOrder from "../app/controllers/order.controller";
const router = Router();

export default function initOrderRoute(app) {
    router.post("/create_payment_url", initOrder.createPaymentUrl)
    router.get("/vnpay_return/:user_id/:course_id/", initOrder.vnpayReturn)
    app.use("/order", router);
}