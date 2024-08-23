const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: String,  // Sản phẩm 1
  product_category_id: {
    type: String,
    default: "",
  },
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
  createdBy: {
    account_id: String,
    createdAt: {
      type: Date,
      default: Date.now,
    }
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