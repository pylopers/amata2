import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { sendOrderEmail, sendOrderSMS } from "../utils/notifications.js";
import Stripe from 'stripe'
import razorpay from 'razorpay'

// global variables
const currency = 'inr'
const deliveryCharge = 0

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET,
})

// Get one order by its ID (for the logged‐in user)
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params   // we’ll use the route param
    const order = await orderModel.findById(orderId)

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    // Optionally, confirm that this order belongs to req.user (if needed)
    // e.g. if your authUser middleware sets req.userId = the logged‐in user’s ID:
    // if (order.userId !== req.userId) {
    //   return res.status(403).json({ success: false, message: "Not authorized" })
    // }

    res.json({ success: true, order })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: error.message })
  }
}

// Verify Stripe 
const verifyStripe = async (req,res) => {

    const { orderId, success, userId } = req.body

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true});
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// All Orders data for Admin Panel
const allOrders = async (req,res) => {

    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// User Order Data For Forntend
const userOrders = async (req,res) => {
    try {
        
        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status, trackingUrl } = req.body

    // Build an update object
    const updateData = { status }

    // Only set trackingUrl if status is "Shipped" and trackingUrl is provided
    if (status === "Shipped" && typeof trackingUrl === "string" && trackingUrl.trim() !== "") {
      updateData.trackingUrl = trackingUrl.trim()
    }

    await orderModel.findByIdAndUpdate(orderId, updateData)
    res.json({ success: true, message: "Status Updated" })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

const deletePendingOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


import Coupon from "../models/couponModel.js";

async function _applyCouponServerSide(code, items, amount) {
  if (!code) return { amountAfter: amount, discountAmount: 0, coupon: null, items: items };

  const codeNorm = code.trim().toUpperCase();
  const coupon = await Coupon.findOne({ code: codeNorm, isActive: true });
  if (!coupon) throw new Error("Invalid coupon");
  if (coupon.expiryDate < new Date()) throw new Error("Coupon expired");
  if (amount < (coupon.minPurchase || 0)) throw new Error(`Minimum purchase ₹${coupon.minPurchase} required`);

  let discountAmount = 0;
  let updatedItems = [...items];

  if (coupon.type === "discount") {
    if (coupon.discountType === "percent") {
      discountAmount = Math.round((amount * coupon.discountValue) / 100);
    } else {
      discountAmount = coupon.discountValue;
    }
    if (discountAmount > amount) discountAmount = amount;
  } else if (coupon.type === "freebie") {
    if (!coupon.freebieProductId) throw new Error("Freebie not configured");
    const freebie = await productModel.findById(coupon.freebieProductId);
    if (!freebie) throw new Error("Freebie not found");
    // push freebie with quantity 1 and price 0
    updatedItems.push({ ...freebie.toObject(), quantity: 1, price: 0 });
  }

  const newAmount = Math.max(0, amount - discountAmount);
  return {
    amountAfter: newAmount,
    discountAmount,
    coupon,
    items: updatedItems
  };
}

// --- COD ---
const placeOrder = async (req,res) => {
  try {
    const { userId, items, amount, address, couponCode } = req.body;

    const { amountAfter, discountAmount, coupon, items: finalItems } = await _applyCouponServerSide(couponCode, items, amount);

    const orderData = {
      userId,
      items: finalItems,
      amount: amountAfter,
      originalAmount: amount,
      discountAmount,
      coupon: coupon ? { code: coupon.code, couponId: coupon._id, type: coupon.type } : null,
      address,
      paymentMethod:"COD",
      payment:false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId,{cartData:{}});

    res.json({success:true,message:"Order Placed", orderId: newOrder._id});
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message});
  }
}

// --- Stripe ---
const placeOrderStripe = async (req,res) => {
  try {
    const { userId, items, amount, address, couponCode } = req.body;
    const { origin } = req.headers;

    // apply coupon server-side
    const { amountAfter, discountAmount, coupon, items: finalItems } = await _applyCouponServerSide(couponCode, items, amount);

    const orderData = {
      userId,
      items: finalItems,
      address,
      amount: amountAfter,
      originalAmount: amount,
      discountAmount,
      coupon: coupon ? { code: coupon.code, couponId: coupon._id, type: coupon.type } : null,
      paymentMethod:"Stripe",
      payment:false,
      date: Date.now()
    };

    const newOrder = new orderModel(orderData)
    await newOrder.save()

    const line_items = finalItems.map((item) => ({
      price_data: {
        currency:currency,
        product_data: {
          name:item.name
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity
    }));

    line_items.push({
      price_data: {
        currency:currency,
        product_data: {
          name:'Delivery Charges'
        },
        unit_amount: deliveryCharge * 100
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url:  `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
    });

    res.json({success:true,session_url:session.url});
  } catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}

// --- Razorpay ---
// --- Razorpay: create order (no DB write yet) ---
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address, couponCode } = req.body;

    // server-side coupon check / final amount calculation
    const { amountAfter, discountAmount, coupon, items: finalItems } =
      await _applyCouponServerSide(couponCode, items, amount);

    // create a receipt string (no DB order yet)
    const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const options = {
      amount: Math.round(amountAfter * 100),     // paise
      currency: currency.toUpperCase(),
      receipt
    };

    // create razorpay order
    const razorpayOrder = await razorpayInstance.orders.create(options);

    // Return razorpay order object and the necessary server info (but DO NOT create DB order)
    return res.json({
      success: true,
      order: razorpayOrder,      // contains id to be used on client: order.id
      receipt,
      amountAfter,
      // optionally return discount & freebie preview for client
      preview: {
        discountAmount,
        coupon: coupon ? { code: coupon.code, type: coupon.type } : null
      }
    });
  } catch (error) {
    console.log("placeOrderRazorpay error:", error);
    return res.json({ success: false, message: error.message });
  }
};

// --- Razorpay: verify payment and create DB order only on success ---
const verifyRazorpay = async (req, res) => {
  try {
    // expect: { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderData }
    // orderData must include items, amount (original), address, couponCode, etc.
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderData } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id) {
      return res.status(400).json({ success: false, message: "Missing Razorpay payment info" });
    }

    // Fetch payment details from Razorpay to confirm it's captured
    const payment = await razorpayInstance.payments.fetch(razorpay_payment_id);

    // If payment not captured, do NOT create order.
    if (!payment || payment.status !== "captured") {
      console.log("Payment not captured:", payment?.status);
      return res.json({ success: false, message: "Payment not captured" });
    }

    // (Optional) verify that payment.order_id === razorpay_order_id
    if (payment.order_id !== razorpay_order_id) {
      console.warn("Payment/order mismatch:", payment.order_id, razorpay_order_id);
      // Still safer to abort
      return res.json({ success: false, message: "Payment/order mismatch" });
    }

    // Server must re-apply coupon and compute final items & amount (secure)
    const { items, amount, address, couponCode, userId } = orderData;
    const { amountAfter, discountAmount, coupon, items: finalItems } =
      await _applyCouponServerSide(couponCode, items, amount);

    // Create the order in DB now (payment succeeded)
    const orderDataToSave = {
      userId,
      items: finalItems,
      amount: amountAfter,
      originalAmount: amount,
      discountAmount,
      coupon: coupon ? { code: coupon.code, couponId: coupon._id, type: coupon.type } : null,
      address,
      paymentMethod: "Razorpay",
      payment: true,
      date: Date.now()
    };

    const newOrder = new orderModel(orderDataToSave);
    await newOrder.save();

    // Clear user's cart
    if (userId) {
      try { await userModel.findByIdAndUpdate(userId, { cartData: {} }); } catch(e){ console.warn("cart clear failed", e); }
    }

    // Fire & forget notifications
    sendOrderEmail(newOrder.address.email, newOrder).catch(err => console.error("Email error:", err));
    sendOrderSMS(newOrder.address.phone, newOrder).catch(err => console.error("SMS error:", err));

    return res.json({ success: true, message: "Payment captured and order created", order: newOrder });
  } catch (error) {
    console.log("verifyRazorpay error:", error);
    return res.json({ success: false, message: error.message });
  }
};


export {verifyRazorpay, verifyStripe ,placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, getOrderById, deletePendingOrder, _applyCouponServerSide}