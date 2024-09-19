const User = require("../../models/user.model");

module.exports = (res) => {
  _io.once("connection", (socket) => {
    // Chức năng gửi yêu cầu
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id; 

      // console.log(myUserId); // Id của A
      // console.log(userId); // Id của B

      // Thêm id của A vào acceptFriends của B
      const existsIdAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId
      });

      if(!existsIdAinB) {
        await User.updateOne({
          _id: userId
        }, {
          $push: { acceptFriends: myUserId}
        })
      }

      // Thêm id của B vào requestFriend của A  
      const existsIdBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId
      });

      if(!existsIdBinA) {
        await User.updateOne({
          _id: myUserId
        }, {
          $push: { requestFriends: userId}
        });
      }

    });
    // Hết Chức năng gửi yêu cầu


    // Chức năng hủy gửi yêu cầu
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id; 

      // console.log(myUserId); // Id của A
      // console.log(userId); // Id của B

      // Xóa Id của A trong acceptFriends của B
      const existsIdAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId
      });

      if(existsIdAinB) {
        await User.updateOne({
          _id: userId
        }, {
          $pull: { acceptFriends: myUserId}
        })
      }

      // Xóa Id của B trong requestFriends của A  
      const existsIdBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId
      });

      if(existsIdBinA) {
        await User.updateOne({
          _id: myUserId
        }, {
          $pull: { requestFriends: userId}
        });
      }
    });
    // Hết Chức năng hủy gửi yêu cầu
  });
}