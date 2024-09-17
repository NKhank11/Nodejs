const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

const chatSocket = require("../../socket/client/chat.socket");

// [GET] /chat
module.exports.index = async (req, res) => {
  // Socket IO
  chatSocket(res);
  // End Socket IO

  // Lấy data từ db
  const chats = await Chat.find({
    deleted: false
  });

  // Nếu không có chat nào
  if(!chats) {
    res.render("client/pages/chat/index", {
      pageTitle: "Chat",
      chats: []
    });
    return;
  }

  for(const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id
    }).select("fullName");

    chat.infoUser = infoUser;
  }
  // End data từ db

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats
  });
};