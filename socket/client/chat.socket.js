const uploadToCloudinary = require("../../helpers/uploadToCloudinary");

module.exports = (res) => {
  // SocketIO
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  
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
}