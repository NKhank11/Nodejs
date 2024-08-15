const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

// [GET] /admin/products
module.exports.index = async (req, res) => {

  const filterStatus = filterStatusHelper(req.query);

  // console.log(filterStatus);

  let find = {
    deleted: false
  }

  if (req.query.status) {
    find.status = req.query.status;
  }

  const objectSearch = searchHelper(req.query);

  // console.log(objectSearch);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //Pagination
  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4
    },
    req.query,
    countProducts
  )

  //End pagination


  let sort = {};
  
  if(req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  else {
    sort.position = "desc";
  }

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);


  // console.log(products);

  res.render("admin/pages/products/index", {
    pageTitle: "Trang sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  // console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status }); // _id là trong database, id là trong params
  // Các truy vấn thuộc mongoose, còn lại đa số expressjs

  req.flash("success", "Cập nhật trạng thái thành công !");

  //Vào expressjs, phần api reference 5x đọc response 

  res.redirect("back");
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", "); // ids là string, cần chuyển thành mảng
  
  switch(type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);
      break;
    case "delete-all":
      await Product.updateMany({ _id: { $in: ids } }, {
        deleted: true,
        deletedAt: new Date()
      });
      req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm`);
      break;
    case "change-position":
      for(const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { position: position });
      }
      req.flash("success", `Đã đổi vị trí thành công ${ids.length} sản phẩm`);
      break;
    default:
      break;
  }
  res.redirect("back");
}

// // Xóa vĩnh viễn
// // [DELETE] /admin/products//elete/:id
// module.exports.deleteItem = async (req, res) => {
//   const id = req.params.id;
//   await Product.deleteOne({ _id: id });
//   res.redirect("back");
// }

// Xóa mềm
// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne({ _id: id }, {
    deleted: true,
    deletedAt: new Date()
    });
  req.flash("success", `Xóa sản phẩm thành công`);
  res.redirect("back");
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
  });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if(req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  }
  else {
    req.body.position = parseInt(req.body.position);
  }

  const product = new Product(req.body);  // req.body là dữ liệu từ form
  await product.save();   // Lưu vào database
  req.flash("success", "Thêm sản phẩm thành công !");
  res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => { 
  try{
    const find = {
      deleted: false,
      _id: req.params.id
    };
    
    const product = await Product.findOne(find);
  
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
    });
  }
  catch(error) {
    req.flash("error", "Không tìm thấy sản phẩm !");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}


// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  req.body.position = parseInt(req.body.position);


  try{
    await Product.updateOne({ _id: req.params.id}, req.body );
  }
  catch(error) {
    req.flash("error", "Không tìm thấy sản phẩm !");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }

  req.flash("success", "Cập nhật sản phẩm thành công !");
  res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try{
    const find = {
      deleted: false,
      _id: req.params.id
    };
    
    const product = await Product.findOne(find);

  
    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  }
  catch(error) {
    req.flash("error", "Không tìm thấy sản phẩm !");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
}