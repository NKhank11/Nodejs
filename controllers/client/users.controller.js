const User = require("../../models/user.model");

const usersSocket = require("../../socket/client/users.socket");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  // Socket
  usersSocket(res);
  // End Socket

  const userId = res.locals.user.id;

  const myUserId = await User.findOne({
    _id: userId
  });

  const requestFriends = myUserId.requestFriends;
  const acceptFriends = myUserId.acceptFriends;

  const users = await User.find({
    $and: [
      { _id: { $ne: userId } },
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } }
    ],
    status: "active",
    deleted: false,
  }).select("id avatar fullName");

  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users
  })
}

// [GET] /users/request
module.exports.request = async (req, res) => {
  // Socket
  usersSocket(res);
  // End Socket

  const userId = res.locals.user.id;

  const myUserId = await User.findOne({
    _id: userId
  });

  const requestFriends = myUserId.requestFriends;

  const users = await User.find({
    _id: { $in: requestFriends },
    status: "active",
    deleted: false,
  }).select("id avatar fullName");
  
  res.render("client/pages/users/request", {
    pageTitle: "Lời mời đã gửi",
    users: users
  })
}