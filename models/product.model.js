const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: String,  // Sản phẩm 1
  description: String,
  discountPercentage: Number,
  price: Number,
  stock: Number, 
  thumbnail: String,
  status: String,
  position: Number,
  slug: {
    type: String,
    slug: "title",  // Sản phẩm 1 => san-pham-1
    unique: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
}, {
  timestamps: true,
});

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;