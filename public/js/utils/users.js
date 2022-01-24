const users = [];
exports.userJoin = (id, userName, room) => {
  const user = { id, userName, room };
  users.push(user);
  return user;
};
exports.getOneUser = (id) => {
  return users.find((user) => user.id === id);
};
exports.userLeave = (id) => {
  const index = users.findIndex((user) => user.id == id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
exports.getRoomUsers = (room) => {
  return users.filter((user) => user.room == room);
};
