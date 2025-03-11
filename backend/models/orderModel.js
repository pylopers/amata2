import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Confirmed", "Shipped", "Delivered"], default: "Pending" },
    createdAt: { type: Date, default: Date.now },
  });
  

const orderModel = mongoose.models.order || mongoose.model('order',orderSchema)
export default orderModel;