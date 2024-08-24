const Product = require("../../models/product.model")

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false
  }).sort({ position: "desc" });

  // // Mảng cũ
  // products.forEach((item) => {
  //   item.priceNew = (item.price - item.price * item.discountPercentage / 100).toFixed(0);
  // })

  // Mảng mới
  const newProducts = products.map((item) => {
    item.priceNew = (item.price - item.price * item.discountPercentage / 100).toFixed(0);
    return item;
  })
  res.render("client/pages/products/index", {
    pageTitle: "Trang Sản phẩm",
    products: newProducts
  });
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try{
    const find = {
      deleted: false,
      slug: req.params.slug,
      status: "active"
    };
    
    const product = await Product.findOne(find);

    console.log(product);

  
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  }
  catch(error) {
    res.redirect(`/products`);
  }
}