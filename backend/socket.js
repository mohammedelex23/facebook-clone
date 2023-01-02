const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const httpServer = http.createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   },
// });
httpServer.listen(process.env.PORT || 5000, function () {
  console.log("Server is running on port", process.env.PORT || 5000);
});

io.on("connection", (socket) => {
  socket.on("FRIENDSHIP_REQUESTS", (type, userId) => {
    console.log(type, userId);
    socket.broadcast.emit("FRIENDSHIP_REQUESTS", type, userId);
  });
  socket.on("CREATE_POST", () => {
    socket.broadcast.emit("CREATE_POST");
  });
  socket.on("UPDATE_POSTS_ON_FRIENDSHIP_UPDATE", () => {
    socket.broadcast.emit("UPDATE_POSTS_ON_FRIENDSHIP_UPDATE");
  });
  socket.on("sendMessage", (msgObj) => {
    socket.broadcast.emit("sendMessage", msgObj);
  });
  socket.on("user is typing", (userId) => {
    socket.broadcast.emit("user is typing", userId);
  });
  socket.on("user is not typing", (userId) => {
    socket.broadcast.emit("user is not typing", userId);
  });
});

module.exports = { app, express };
