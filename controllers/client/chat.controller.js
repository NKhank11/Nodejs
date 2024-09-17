const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

// [GET] /chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  // SocketIO
  _io.once("connection", (socket) => {
    // CLIENT_SEND_MESSAGE
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      // Upload ảnh lên cloudinary
      let images = [];
    
      for(const imageBuffer of data.images) {
        const link = await uploadToCloudinary(imageBuffer);
        images.push(link);
      }

      // Lưu vào db
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images
      });
      await chat.save();

      // Trả data về client 
      _io.emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: data.content,
        images: images
      });
    });
    // END CLIENT_SEND_MESSAGE

    // CLIENT_SEND_TYPING
    socket.on("CLIENT_SEND_TYPING", (type) => {
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type,
      });
    })
    // END CLIENT_SEND_TYPING
  })
  // End SocketIO

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