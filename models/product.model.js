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
  featured: String,
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
      // default: new Date('1970-01-01 07:00:00')
      default: Date.now
    }
  },
  deleted: {
    type: Boolean,
    default: false, 
  },
  deletedBy: {
    account_id: String,
    deletedAt: Date
  },
  updatedBy: [
    {
      account_id: String,
      updatedAt: Date
    }
  ]
}, {
  timestamps: true,
});

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;