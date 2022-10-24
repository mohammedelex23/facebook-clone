require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const userRouter = require("./routes/user.routes");
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const commentRouter = require("./routes/comment.routes");

const connectToMongoDB = require("./db/connectToDB");

connectToMongoDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(morgan("dev"));
app.use(express.json());

////////////////////////////////
app.use("/api/users", userRouter);
app.use("/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

// ----------------- deployment --------------//

__dirname = path.resolve();
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

// ----------------- deployment --------------//

// not found error
app.use(function (req, res) {
  res.status(404).json({
    message: `the route ${req.method} is not found`,
  });
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.statusCode || 500).json({
    message: err.message,
  });
});

app.listen(process.env.PORT, function () {
  console.log("Server is running on port", process.env.PORT);
});
