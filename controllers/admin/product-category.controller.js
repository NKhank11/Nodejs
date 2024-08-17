const ProductCategory =require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/product-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
  });
}

// [GET] /admin/product-category
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  }

  // Hàm tạo phân cấp danh mục dùng đệ quy
  
  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/product-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords,
  });
}

// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
  if(req.body.position == "") {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  }
  else {
    req.body.position = parseInt(req.body.position);
  }
  const record = new ProductCategory(req.body);  // req.body là dữ liệu từ form
  await record.save();   // Lưu vào database
  req.flash("success", "Thêm danh mục thành công !");
  res.redirect(`${systemConfig.prefixAdmin}/product-category`);
}

// [GET] /admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await ProductCategory.findOne({
      _id: id,
      deleted: false
    });
    const records = await ProductCategory.find({
      deleted: false
    });
    const newRecords = createTreeHelper.tree(records);
    res.render("admin/pages/product-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      category: category,
      records: newRecords
    });
  } catch (error) {
    req.flash("error", "Không tìm thấy danh mục !");
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }
}

// [PATCH] /admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);
  await ProductCategory.updateOne({
    _id: id
  }, req.body);
  req.flash("success", "Chỉnh sửa danh mục thành công !");
  res.redirect(`back`);
}