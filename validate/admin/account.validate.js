module.exports.createPost = (req, res, next) => {
  if(!req.body.fullName) {
    req.flash("error", "Vui lòng nhập họ tên!");
    return res.redirect("back");
  }
  if(!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    return res.redirect("back");
  }
  if(!req.body.password) {
    req.flash("error", "Vui lòng nhập password!");
    return res.redirect("back");
  }
  next();
}

module.exports.editPatch = (req, res, next) => {
  if(!req.body.fullName) {
    req.flash("error", "Vui lòng nhập họ tên!");
    return res.redirect("back");
  }
  if(!req.body.email) {
    req.flash("error", "Vui lòng nhập email!");
    return res.redirect("back");
  }

  next();
}