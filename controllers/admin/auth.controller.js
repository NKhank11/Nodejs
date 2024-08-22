const Account = require("../../models/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
  if(req.cookies.token) {
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    return;
  }
  res.render("admin/pages/auth/login", {
    pageTitle: "Đăng nhập",
  });
}

// [GET] /admin/auth/loginPost
module.exports.loginPost = async (req, res) => {
 const email = req.body.email;
  const password = req.body.password;

  const user = await Account.findOne({
    email: email,
    deleted: false
  });

  if(!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect("back");
    return;
  }

  if(user.password !== md5(password)) {
    req.flash("error", "Mật khẩu không đúng");
    res.redirect("back");
    return;
  }

  if(user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa");
    res.redirect("back");
    return;
  }

  req.flash("success", "Đăng nhập thành công");
  res.cookie("token", user.token)
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}