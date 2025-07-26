import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  }, { timestamps: true });

  
  const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    bestseller: { type: Boolean },
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    features: { type: [String], required: true },
    benefits: { type: [String], required: true },
    careInstructions: { type: [String], required: true },
    date: { type: Number, required: true },
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    material: { type: String, required: true },
    seatingCapacity: { type: String, required: true },
    color: { type: String, required: true },
    model: { type: String, required: true },
    assemblyRequired: { type: String, required: true },
    whatsInTheBox: { type: [String], required: true },
    inStock: { type: Boolean },
    thumbnail: { type: String, required: true },
    mainProduct: { type: Boolean, default: false }
});

const productModel  = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel