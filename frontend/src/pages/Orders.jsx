// src/pages/Orders.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
// If you prefer importing a local placeholder asset:
// import placeholder from '../assets/placeholder.png';

export default function Orders() {
  const { backendUrl, token, currency = "₹", products = [] } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (!token) return;
    axios
      .post(
        `${backendUrl}/api/order/userorders`,
        { userId: null }, // server middleware should populate userId from token
        { headers: { token } }
      )
      .then(({ data }) => {
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders.reverse());
        }
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
      });
  }, [token, backendUrl]);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderId);
    try {
      const res = await axios.patch(
        `${backendUrl}/api/order/cancel/${orderId}`,
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) => (order._id === orderId ? { ...order, status: "Cancelled" } : order))
        );
      } else {
        alert(res.data.message || "Could not cancel the order.");
      }
    } catch (err) {
      console.error(err);
      alert("Error cancelling order.");
    } finally {
      setCancellingId(null);
    }
  };

  if (!orders.length) {
    return (
      <div className="px-4 border-t pt-16">
        <Title text1="MY" text2="ORDERS" />
        <p className="text-center text-gray-500 mt-5">No orders found.</p>
      </div>
    );
  }

  // helper to extract best product info for an item
  const resolveItemProduct = (item) => {
    // if the item already contains product fields, prefer them
    if (item && (item.name || item.thumbnail || item.image || item.price)) {
      return {
        id: item._id || item.product || item.productId || null,
        name: item.name,
        imageArr: item.image || (item.images ? item.images : null),
        thumbnail: item.thumbnail,
        price: item.price ?? item.originalPrice ?? item.amount ?? null,
        qty: item.quantity ?? item.qty ?? item.count ?? 1,
      };
    }

    // otherwise try find in products list by common ids
    const prodIdCandidates = [item.product, item.productId, item._id].filter(Boolean);
    let prod;
    for (const id of prodIdCandidates) {
      prod = products.find((p) => p._id === id || String(p._id) === String(id));
      if (prod) break;
    }

    if (prod) {
      return {
        id: prod._id,
        name: prod.name,
        imageArr: prod.image,
        thumbnail: prod.thumbnail,
        price: prod.price ?? prod.originalPrice ?? null,
        qty: item.quantity ?? item.qty ?? 1,
      };
    }

    // fallback: totally unknown item
    return {
      id: item._id || item.product || null,
      name: null,
      imageArr: null,
      thumbnail: null,
      price: item.price ?? item.amount ?? null,
      qty: item.quantity ?? item.qty ?? 1,
    };
  };

  return (
    <div className="px-4 border-t pt-16 space-y-6">
      <Title text1="MY" text2="ORDERS" />

      {orders.map((order) => (
        <div key={order._id} className="border p-4 sm:p-6 rounded-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 flex-wrap gap-y-2">
            <div>
              <p className="text-sm font-semibold break-all">Order #{order._id}</p>
              <p className="text-xs text-gray-500">{new Date(order.date).toDateString()}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">{order.status}</span>
          </div>

          {/* Items */}
          <div className="space-y-4">
            {Array.isArray(order.items) && order.items.length ? (
              order.items.map((item, idx) => {
                const info = resolveItemProduct(item);
                const imageSrc =
                  info.thumbnail ||
                  (Array.isArray(info.imageArr) && info.imageArr.length ? info.imageArr[0] : null) ||
                  "/placeholder.png"; // or `placeholder` if imported
                const name = info.name || "Unknown Product";
                const price = info.price != null ? info.price : item.price ?? 0;
                const qty = info.qty ?? 1;

                // make a safer key
                const key = `${order._id}-${idx}-${info.id ?? "unknown"}`;

                return (
                  <div key={key} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="w-20">
                      <img
                        src={imageSrc}
                        alt={name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder.png";
                        }}
                        className="w-full h-auto object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm sm:text-base">{name}</p>
                      <p className="text-gray-600 text-sm">
                        {currency}
                        {price} × {qty}{" "}
                        {item.size ? <span className="text-xs">({item.size})</span> : null}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500">No items found for this order.</div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t gap-4 flex-wrap">
            <p className="font-semibold text-sm sm:text-base">Total: {currency}{Number(order.amount || 0).toFixed(2)}</p>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Link
                to={`/track/${order._id}`}
                className="px-4 py-2 border rounded text-sm hover:bg-gray-100 text-center"
              >
                Track Order
              </Link>

              {["Order Placed", "Processing"].includes(order.status) && (
                <button
                  onClick={() => cancelOrder(order._id)}
                  className="px-4 py-2 border rounded text-sm text-red-600 hover:bg-red-50"
                  disabled={cancellingId === order._id}
                >
                  {cancellingId === order._id ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
