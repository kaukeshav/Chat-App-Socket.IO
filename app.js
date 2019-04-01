var express = require("express");
var path = require("path");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);

var port = 8000;

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function(socket) {
  console.log("new connection has been made");

  socket.emit("message-from-server", {
    greeting: "Hello from Server"
  });

  socket.on("message-from-client", function(msg) {
    console.log(msg);
  });
});

server.listen(port, function() {
  console.log("listening to Port no." + port);
});
