import adminRouter from "./admin.router"
export default function initApiV1(app) {
    adminRouter(app);
}
