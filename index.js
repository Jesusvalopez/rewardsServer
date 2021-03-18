import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import couponsRoutes from "./routes/coupons.js";
import userRoutes from "./routes/user.js";
import pointsRoutes from "./routes/points.js";
import apiV1Routes from "./routes/API/V1/api.js";

const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/coupons", couponsRoutes);
app.use("/points", pointsRoutes);
app.use("/user", userRoutes);
app.use("/v1", apiV1Routes);

app.get("/", () => {
  res.send("Hola");
});

//connect mongodb
const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => console.log("server running on port: " + PORT))
  )
  .catch((error) => console.log(error.message));

mongoose.set("useFindAndModify", false);
