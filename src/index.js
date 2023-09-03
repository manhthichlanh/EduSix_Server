import express from "express";
import { config } from "dotenv"
import sequelize from "./app/models/db";
import cors from "cors";
// import initUser from "./app/controllers/user.controller";
import globalErrHandler from './app/controllers/errorController.js';
import initUserRoute from "./routes/user.route";
const app = express();
//Config .env file
config();
//Config .env file
initUserRoute(app)
const port = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
//api 

// initNhanVien(app);
// initUserRoute(app);
// initUser(app);
//error handler
// handle undefined Routes
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined route');
    next(err, req, res, next);
});
app.use(globalErrHandler);
//connect db
sequelize
.authenticate()
.then(() => {
    console.log('Connected to SQL database:');
})
.catch((err) => {
    console.error('Unable to connect to SQL database:');
});
(async () => {
await sequelize.sync();
console.log('----server start', new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
console.log('----server process');
})();

app.listen(port, async () => {
    console.log("🚀Server started Successfully! Running in port " + port);
});