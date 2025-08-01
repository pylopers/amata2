import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import mongoose from "mongoose";
import userModel from "../models/userModel.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });  // Optional: Only for testing
  

// function for add product
const addProduct = async (req, res) => {
    try {

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ success: false, message: "No images uploaded" });
        }

        const { name, description, price, category, subCategory, bestseller, features,careInstructions,benefits, originalPrice, length, width, height, material, seatingCapacity, color, model, assemblyRequired, whatsInTheBox, warranty, inStock, mainProduct } = req.body;
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const image5 = req.files.image5 && req.files.image5[0];
        const image6 = req.files.image6 && req.files.image6[0];
        const image7 = req.files.image7 && req.files.image7[0];
        const image8 = req.files.image8 && req.files.image8[0];
        const image9 = req.files.image9 && req.files.image9[0];
        const image10 = req.files.image10 && req.files.image10[0];

        const images = [];
        for (let i = 1; i <= 10; i++) {
            if (req.files[`image${i}`]) {
                images.push(req.files[`image${i}`][0]);
            }
        }
        
        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                try {
                  if (item && item.path) {
                    // Upload thumbnail (first image) with transformations
                    if (item === images[0]) { 
                      const thumbnailResult = await cloudinary.uploader.upload(item.path);
                      return thumbnailResult.secure_url;
                    }
                    // Upload other images normally
                    const result = await cloudinary.uploader.upload(item.path);
                    return result.secure_url;
                  }
                } catch (error) {
                    console.error("Cloudinary Upload Error:", error);
                }
            })
        );
        
        imagesUrl = imagesUrl.filter((url) => url !== undefined); // Remove failed uploads
        const thumbnail = imagesUrl[0];
        const productImages = imagesUrl.slice(1);
        

        let featureList = [];
        if (Array.isArray(features)) {
            featureList = features;
        } else if (typeof features === "string") {
            try {
                featureList = JSON.parse(features);
                if (!Array.isArray(featureList)) {
                    featureList = [];
                }
            } catch {
                featureList = [];
            }
        }

        let benefitList = [];
        if (Array.isArray(benefits)) {
            benefitList = benefits;
        } else if (typeof benefits === "string") {
            try {
                benefitList = JSON.parse(benefits);
                if (!Array.isArray(benefitList)) {
                    benefitList = [];
                }
            } catch {
                benefitList = [];
            }
        }
        
        let careInstructionList = [];
        if (Array.isArray(careInstructions)) {
            careInstructionList = careInstructions;
        } else if (typeof careInstructions === "string") {
            try {
                careInstructionList = JSON.parse(careInstructions);
                if (!Array.isArray(careInstructionList)) {
                    careInstructionList = [];
                }
            } catch {
                careInstructionList = [];
            }
        }

        const productData = {
            thumbnail,
            name,
            description,
            category,
            price: Number(price),
            originalPrice: Number(originalPrice),
            subCategory,
            features: featureList,
            benefits: benefitList,
            careInstructions: careInstructionList,
            bestseller: bestseller === "true" ? true : false,
            image: productImages,
            length,
            width,
            height,
            material,
            seatingCapacity,
            color,
            model,
            assemblyRequired,
            whatsInTheBox,
            warranty,
            date: Date.now(),
            inStock: inStock === "true" ? true : false,
            mainProduct: mainProduct === "true" ? true : false
        };

        console.log(productData);

        const product = new productModel(productData);
        await product.save();

        res.json({ success: true, message: "Product Added" });
    } catch (error) {
        console.error("Error inside addProduct:", error);
        res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
    
};

// function for list product
const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({mainProduct: true});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const listAllProducts = async (req, res) => {
    try {
        const products = await productModel.find(); // Fetch all products
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// function for removing product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({ success: true, product });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const addProductReview = async (req, res) => {
    try {
        const { productId, comment, rating, userId, userName } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid productId or userId" });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const user = await userModel.findById(userId).select("name");

        const newReview = {
            user: new mongoose.Types.ObjectId(userId),
            name: user.name,
            rating: rating,
            comment: comment,
        };

        product.reviews.push(newReview);

        const totalRatings = product.reviews.reduce((acc, review) => acc + review.rating, 0);
        product.averageRating = totalRatings / product.reviews.length;

        await product.save();

        res.status(201).json({ success: true, message: "Review added successfully", product });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await productModel.findById(productId).select('reviews');

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, reviews: product.reviews });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }


};

// server/controllers/productController.js
const updateProduct = async (req, res) => {
  try {
    const {
      id, name, category, price,
      mainProduct, inStock, bestseller,
      image: imageUrls
    } = req.body;

    const product = await productModel.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Not found" });

    // Update fields
    product.name         = name ?? product.name;
    product.category     = category ?? product.category;
    product.price        = price ?? product.price;
    product.mainProduct  = mainProduct ?? product.mainProduct;
    product.inStock      = inStock ?? product.inStock;
    product.bestseller   = bestseller ?? product.bestseller;

    // **Directly replace** the images array
    if (Array.isArray(imageUrls) && imageUrls.length) {
      product.thumbnail = imageUrls[0];
      product.image     = imageUrls.slice(1);
    }

    await product.save();
    return res.json({ success: true, message: "Product updated", product });
  } catch (err) {
    console.error("Error in updateProduct:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




export { listProducts, addProduct, removeProduct, singleProduct, addProductReview, getProductReviews, updateProduct, listAllProducts };
