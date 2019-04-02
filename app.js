var express = require("express");
var path = require("path");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var users = [];
var connections = [];
var port = 8000;

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket) {
  console.log("new connection has been made");

  connections.push(socket);
  console.log("connected %s:", connections.length);

  //disconnect
  socket.on("disconnect", function(data) {
    if (!socket.username) return;
    users.splice(users.indexOf(socket.username), 1);
    updateUserNames();
    connections.splice(connections.indexOf(socket), 1);
    console.log("Disconnect %s:", connections.length);
  });

  //new users
  socket.on("new-user", function(data, callback) {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUserNames();
  });

  function updateUserNames() {
    io.sockets.emit("get-users", users);
  }

  socket.on("message-from-client", function(msg) {
    io.sockets.emit("new-message", {
      message: msg.message,
      user: socket.username
    });
  });
});

server.listen(port || 8000, function() {
  console.log("listening to Port no." + port);
});
