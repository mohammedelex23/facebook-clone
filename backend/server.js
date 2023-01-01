require("dotenv").config();

const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const userRouter = require("./routes/user.routes");
const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/post.routes");
const commentRouter = require("./routes/comment.routes");
const convRouter = require("./routes/conversation.routes");

const { app, express } = require("./socket");

const connectToMongoDB = require("./db/connectToDB");

connectToMongoDB();

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
app.use("/api/conversations", convRouter);

// ----------------- deployment --------------//

__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
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
