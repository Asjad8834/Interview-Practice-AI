const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const morgan = require("morgan")

const cors = require("cors");

const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));


//ROutes
app.use("/api/auth", authRouter);

app.use("/api/interview", interviewRouter);




module.exports = app;