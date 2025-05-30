const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product.js");

// [GET] /
module.exports.index = async (req, res) => {
  // Lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  })
  // Hết lấy ra sản phẩm nổi bật

  const newProducts = productHelper.priceNewProducts(productsFeatured);

  // Hiển thị danh sách sản phẩm mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  }).sort({position: "desc"} ).limit(6)
  // Hết Hiển thị danh sách sản phẩm mới nhất

  const newProductsNew = productHelper.priceNewProducts(productsNew);

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProducts,
    productsNew: newProductsNew,
  });
}