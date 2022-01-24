const http = require("http");
const socketio = require("socket.io");
const express = require("express");
const formatMsg = require(`${__dirname}/public/js/utils/messages`);
const {
  userJoin,
  getOneUser,
  userLeave,
  getRoomUsers,
} = require(`${__dirname}/public/js/utils/users`);

const app = express();
const server = http.createServer(app);

const io = socketio(server);
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ userName, room }) => {
    // socket.emit("isValid", getRoomUsers);
    const user = userJoin(socket.id, userName, room);
    socket.join(user.room);
    socket.emit(
      "message",
      formatMsg(
        "admin",
        `Welcome to the chat room (${user.room}) ${user.userName}`
      )
    );
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMsg(
          "admin",
          `${user.userName} has joined the chat room (${user.room})`
        )
      );
    //send user and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //Listten for chat-msg
  socket.on("chat-message", (msg) => {
    const user = getOneUser(socket.id);
    io.to(user.room).emit("message", formatMsg(user.userName, msg));
  });
  //dis
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMsg(
          "admin",
          `${user.userName} has left the chat room(${user.room})`
        )
      );
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
app.use(express.static(`${__dirname}/public`));
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`app running on port : ${port}`);
});
