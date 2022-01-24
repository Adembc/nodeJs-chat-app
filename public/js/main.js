const chatForm = document.getElementById("chat-form");
const chat = document.querySelector(".chat-messages");
const roomInfo = document.querySelector(".chat-sidebar");
// get username and room from query string
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const socket = io();
// join chat room
socket.emit("joinRoom", { userName: username, room });
socket.on("roomUsers", (info) => {
  renderRoomInfo(info, roomInfo);
  roomInfo.scrollTop = roomInfo.scrollHeight;
});
socket.on("message", (msg) => {
  renderHtml(msg, chat);
  chat.scrollTop = chat.scrollHeight;
});
// socket.on("invalid", () => {
//   location.assign("/index.html");
//   setTimeout(() => {
//     return alert("This User Name Is Already Taken ! Try Another One");
//   }, 2000);
// });
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg;
  socket.emit("chat-message", msg.value);
  msg.value = "";
  msg.focus();
});
function renderHtml(msg, parentEle) {
  const output = ` <div class="message">
  <p class="meta">${msg.userName} <span>${msg.sendAt}</span></p>
  <p class="text">
    ${msg.text}
  </p>
</div>`;
  parentEle.insertAdjacentHTML("beforeend", output);
}
function renderRoomInfo(info, parentEle) {
  parentEle.innerHTML = "";
  const output = ` <h3><i class="fas fa-comments"></i> Room Name:</h3>
  <h2 id="room-name">${info.room}</h2>
  <h3><i class="fas fa-users"></i> Users</h3>
  <ul id="users">
    ${info.users.map((user) => "<li>" + user.userName + "</li>").join("")}
  </ul>`;
  parentEle.insertAdjacentHTML("beforeend", output);
}
