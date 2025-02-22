import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import dbConnection from "./db/conn.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import cors from "cors";

dbConnection();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5175",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.options(
  "*",
  cors({
    origin: "http://localhost:5175",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("hello from server");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`server is running on port http://localhost:${PORT}`);
});
