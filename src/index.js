import express from "express";
import { config } from "dotenv"
import { connectDB, sequelize } from "./app/models/db";
import cors from "cors";
// import initUser from "./app/controllers/user.controller";

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

// initNhanVien(app);
// initUserRoute(app);
// initUser(app);

app.listen(port, async () => {
  console.log("🚀Server started Successfully! Running in port " + port);
  await connectDB();
  sequelize.sync({ force: false }).then(() => {
    console.log("✅Synced database successfully...");
  });
});