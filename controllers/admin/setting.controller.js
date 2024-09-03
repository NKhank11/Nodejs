const SettingGeneral = require("../../models/settings-general.model");

// [GET] /admin/settings/general
module.exports.general = (req, res) => {
  const settingGeneral = SettingGeneral.findOne({});  // Get the first document in the collection
  res.render("admin/pages/settings/general", {
    pageTitle: "Cài đặt chung",
    settingGeneral: settingGeneral
  });
}

// [PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});

  if(settingGeneral) {
    await SettingGeneral.updateOne({
      _id: settingGeneral._id
    }, req.body);
  } else {
    const record = new SettingGeneral(req.body);
    await record.save();
  }

  res.redirect("back");
}