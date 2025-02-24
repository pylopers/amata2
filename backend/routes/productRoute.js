import express from 'express'
import { listProducts, addProduct, removeProduct, singleProduct,  addProductReview, getProductReviews, updateProduct  } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js'

const productRouter = express.Router();

productRouter.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1},{name:'image5',maxCount:1}]),addProduct);
productRouter.post('/remove',adminAuth,removeProduct);
productRouter.post('/single',singleProduct);
productRouter.get('/list',listProducts)

productRouter.post('/update', adminAuth, updateProduct);

// Product review routes
productRouter.post('/addReview', authUser, addProductReview);
productRouter.get('/:productId/reviews', getProductReviews);

export default productRouter