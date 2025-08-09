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
    const { orderId, status, trackingUrl } = req.body;
    const updateData = { status };
    if (status === "Shipped" && typeof trackingUrl === "string" && trackingUrl.trim() !== "") {
      updateData.trackingUrl = trackingUrl.trim();
    }

    await orderModel.findByIdAndUpdate(orderId, updateData);
    const updatedOrder = await orderModel.findById(orderId);

    // send status‐update SMS
    sendOrderSMS(updatedOrder.address.phone, updatedOrder)
      .catch(err => console.error("SMS error:", err));

    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


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
// Replace your existing placeOrderRazorpay and verifyRazorpay with these:

// --- placeOrderRazorpay (creates DB order first, applies coupon server-side, then creates Razorpay order) ---
const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address, couponCode } = req.body;

    // 1) Apply coupon server-side (this may throw if coupon invalid)
    let amountAfter = amount;
    let discountAmount = 0;
    let coupon = null;
    let finalItems = items;

    try {
      const applied = await _applyCouponServerSide(couponCode, items, amount);
      amountAfter = applied.amountAfter;
      discountAmount = applied.discountAmount || 0;
      coupon = applied.coupon || null;
      finalItems = applied.items || items;
    } catch (couponErr) {
      // If coupon invalid or fails, return error so client can fix (do NOT proceed to create DB order)
      console.error("Coupon apply failed:", couponErr);
      return res.status(400).json({ success: false, message: couponErr.message || "Coupon validation failed" });
    }

    // 2) Create DB order upfront (payment: false)
    const orderData = {
      userId,
      items: finalItems,
      amount: amountAfter,            // amount to be charged (after discount)
      originalAmount: amount,         // amount before discount
      discountAmount,
      coupon: coupon ? { code: coupon.code, couponId: coupon._id, type: coupon.type } : null,
      address,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // optional: send initial SMS notifying order received (pending payment)
    sendOrderSMS(newOrder.address.phone, newOrder).catch(err => console.error("SMS error:", err));

    // 3) Create Razorpay order for the computed amountAfter
    const options = {
      amount: Math.round(amountAfter * 100), // paise
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.error("Razorpay order create error:", error);
        // If razorpay creation fails, you may want to delete the DB order to avoid orphan pending orders.
        // Optionally delete:
        try { orderModel.findByIdAndDelete(newOrder._id).catch(e=>console.warn("cleanup failed", e)); } catch(e){}

        return res.json({ success: false, message: error });
      }
      // return razorpay order to client to open checkout
      return res.json({ success: true, order, newOrderId: newOrder._id, amountAfter, discountAmount, couponPreview: orderData.coupon });
    });

  } catch (error) {
    console.error("placeOrderRazorpay error:", error);
    return res.json({ success: false, message: error.message });
  }
};


// --- verifyRazorpay (keeps your working logic: check orderInfo.status === 'paid', fetch payments list, update DB order, notify) ---
const verifyRazorpay = async (req, res) => {
  try {
    // Expect client to send at least: { razorpay_order_id, razorpay_payment_id } or the whole response object
    const { razorpay_order_id, razorpay_payment_id } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({ success: false, message: "razorpay_order_id required" });
    }

    // fetch razorpay order info
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (!orderInfo) {
      return res.json({ success: false, message: "Razorpay order not found" });
    }

    // If order is marked paid by Razorpay, proceed
    if (orderInfo.status === 'paid') {
      // mark DB order payment true and store razorpayOrderId
      await orderModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
        razorpayOrderId: razorpay_order_id,
      });

      // clear user's cart — we need to know the user: either client sent userId or DB order has userId
      // Prefer to read userId from DB order we just updated
      const createdOrder = await orderModel.findById(orderInfo.receipt);
      if (createdOrder && createdOrder.userId) {
        try {
          await userModel.findByIdAndUpdate(createdOrder.userId, { cartData: {} });
        } catch (e) {
          console.warn("Failed to clear cart:", e);
        }
      }

      // Try to fetch payment id(s) for this razorpay order and store first payment id
      try {
        const paymentsList = await razorpayInstance.payments.all({ order_id: razorpay_order_id });
        const paymentId = paymentsList?.items?.[0]?.id;
        if (paymentId) {
          await orderModel.findByIdAndUpdate(orderInfo.receipt, { razorpayPaymentId: paymentId });
        }
      } catch (e) {
        console.warn("Failed to fetch/store payments list:", e);
      }

      // Re-fetch the order to use in notifications
      const updatedOrder = await orderModel.findById(orderInfo.receipt);

      // send notifications (non-blocking)
      try {
        sendOrderEmail(updatedOrder.address.email, updatedOrder).catch(err => console.error("Email error:", err));
        sendOrderSMS(updatedOrder.address.phone, updatedOrder).catch(err => console.error("SMS error:", err));
      } catch (e) {
        console.warn("Notification error (non-fatal):", e);
      }

      return res.json({ success: true, message: "Payment Successful", order: updatedOrder });
    }

    // if not paid
    return res.json({ success: false, message: "Payment not captured/paid yet" });
  } catch (error) {
    console.error("verifyRazorpay error:", error);
    return res.json({ success: false, message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.body.userId;

    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const forbidden = ['Shipped', 'Delivered', 'Cancelled'];
    if (forbidden.includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled' });
    }

    if (order.paymentMethod === 'Razorpay' && order.payment === true && order.razorpayPaymentId && !order.refunded) {
      await razorpayInstance.payments.refund(order.razorpayPaymentId, { amount: order.amount * 100 });
      order.refunded = true;
      order.refundDate = new Date();
    }

    order.status = 'Cancelled';
    await order.save();

    // send cancellation SMS
    sendOrderSMS(order.address.phone, order)
      .catch(err => console.error("SMS error:", err));

    return res.json({ success: true, message: 'Order cancelled and refund initiated' });
  } catch (error) {
    console.error('cancelOrder error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const adminCancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const force = req.query.force === "true";

    if (!orderId) return res.status(400).json({ success: false, message: "orderId required" });

    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // If already cancelled -> ok
    if (order.status === "Cancelled") {
      return res.json({ success: true, message: "Order already cancelled" });
    }

    // If not force and status is shipped/delivered -> block
    if (!force && ["Shipped", "Delivered"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel an order that is already shipped/delivered (use ?force=true to override)"
      });
    }

    // Attempt refund if payment captured and not refunded already
    let refundResult = null;
    if (order.payment === true && !order.refunded) {
      try {
        if (order.paymentMethod === "Razorpay" && order.razorpayPaymentId) {
          const amountPaise = Math.round((order.amount || 0) * 100);
          refundResult = await razorpayInstance.payments.refund(order.razorpayPaymentId, { amount: amountPaise });
        } else if (order.paymentMethod === "Stripe" && order.stripePaymentIntentId) {
          refundResult = await stripeClient.refunds.create({ payment_intent: order.stripePaymentIntentId });
        } else {
          // unsupported gateway or missing ids: skip automatic refund
          refundResult = { message: "No automatic refund performed: unsupported gateway or missing payment id" };
        }

        // mark refunded in DB if refundResult looks OK
        order.refunded = true;
        order.refundInfo = { gateway: order.paymentMethod, raw: refundResult, refundedAt: new Date() };
      } catch (refundErr) {
        console.error("Refund error:", refundErr);
        // decide behavior: fail -> return error (safer), or continue but record refund failure.
        return res.status(500).json({ success: false, message: "Refund failed: " + (refundErr.message || refundErr) });
      }
    }

    // Update status
    order.status = "Cancelled";
    order.cancelledAt = new Date();
    await order.save();

    // Optional: restock items (if you have inventory counters) — implement as needed

    // Optionally clear cart of the user (usually not needed for cancel)
    try {
      if (order.userId) {
        await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      }
    } catch (e) {
      console.warn("Clearing cart failed", e);
    }

    // Notify user (non-blocking)
    try {
      const updatedOrder = order; // saved
      if (updatedOrder.address?.email) sendOrderEmail(updatedOrder.address.email, updatedOrder).catch(e => console.error("Email error:", e));
      if (updatedOrder.address?.phone) sendOrderSMS(updatedOrder.address.phone, updatedOrder).catch(e => console.error("SMS error:", e));
    } catch (notifyErr) {
      console.warn("Notification error:", notifyErr);
    }

    return res.json({ success: true, message: "Order cancelled", refund: refundResult || null });
  } catch (err) {
    console.error("adminCancelOrder error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export {verifyRazorpay,
   verifyStripe 
   ,placeOrder, 
   placeOrderStripe, 
   placeOrderRazorpay, 
   allOrders, 
   userOrders,
    updateStatus, 
    getOrderById, 
    deletePendingOrder, 
    _applyCouponServerSide
  , cancelOrder, adminCancelOrder}
