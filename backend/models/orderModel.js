import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },     // final amount after discount
    originalAmount: { type: Number, required: false }, // optional: before discount
    discountAmount: { type: Number, required: false, default: 0 }, // amount reduced by coupon
    coupon: { // optional coupon info
      code: String,
      couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
      type: { type: String }
    },
    address: { type: Object, required: true },
    status: { type: String, required: true, default:'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true , default: false },
    date: {type: Number, required:true},
    trackingUrl: { type: String, default: '' }  
});

const orderModel = mongoose.models.order || mongoose.model('order',orderSchema)
export default orderModel;