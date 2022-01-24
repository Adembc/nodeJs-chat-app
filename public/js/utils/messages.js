const moment = require("moment");
function formatMsg(userName, text) {
  return {
    userName,
    text: text.trim(),
    sendAt: moment().format("h:mm a"),
  };
}
module.exports = formatMsg;
