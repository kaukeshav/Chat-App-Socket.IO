var socket = io.connect();
var messageArea = document.querySelector("#messageArea");
var messageForm = document.querySelector("#messageForm");
var messageBox = document.querySelector("#messageBox");
var userFormArea = document.querySelector("#userFormArea");
var userForm = document.querySelector("#userForm");
var userName = document.querySelector("#userName");
var chatBox = document.querySelector("#chatBox");
var users = document.querySelector("#users");
var fragment = document.createDocumentFragment();

messageForm.addEventListener("submit", function(event) {
  event.preventDefault();
  socket.emit("message-from-client", {
    message: messageBox.value
  });
  messageBox.value = "";
});

userFormArea.addEventListener("submit", function(event) {
  event.preventDefault();
  socket.emit("new-user", userName.value, function(data) {
    if (data) {
      userFormArea.style.display = "none";
      messageArea.style.display = "flex";
    }
  });
  userName.value = "";
});
  
socket.on("get-users", function(data) {
  var userHtml = "";
  data.forEach(function(each, index) {
    userHtml += '<li class="list-group-item list-item">' + each + "</li>";
  });
  users.innerHTML = userHtml;
});

socket.on("new-message", function(event) {
  var divTag = document.createElement("div");
  divTag.innerHTML =
    '<div class="chat-row"><strong>' +
    event.user +
    ":</strong>" +
    "<span>" +
    event.message +
    "</span></div>";
  fragment.appendChild(divTag);
  chatBox.appendChild(fragment);
});