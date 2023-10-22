import express from "express";
import { config } from "dotenv"
import sequelize from "./app/models/db";
import cors from "cors";
import bodyParser from "body-parser";
import AppError from "./utils/appError";
import './app/models/associations'
import './app/models/associations'
import initApiV1 from "./routes/api_v1.route";
const app = express();

//Config .env file
config();

// Enable CORS for all routes
app.use(cors());

//body parser 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

initApiV1(app)

const port = process.env.PORT || 8080;
app.use(express.json());

// error handler
// error handler
// handle undefined Routes
// app.use('*', (req, res, next) => {
//     const notPageMatchError = new AppError(404, 'fail', 'undefined route');
//     throw notPageMatchError
// });

//connect db
sequelize
    .authenticate()
    .then(() => {
        console.log('Connected to SQL database:');
    })
    .catch((err) => {
        console.error('Unable to connect to SQL database:');
        console.log(err)
        console.log(err)
    });

(async () => {
    await sequelize.sync();
    console.log('----server start', new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    console.log('----server process');
})();
  
app.listen(port, async () => {
    console.log("🚀Server started Successfully! Running in port " + port);
});
