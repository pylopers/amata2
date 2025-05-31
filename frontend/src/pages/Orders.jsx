// src/pages/Orders.jsx  (user’s order‐listing page)
import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ShopContext } from "../context/ShopContext"
import Title from "../components/Title"
import axios from "axios"

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext)
  const [orderData, setOrderData] = useState([])

  const loadOrderData = async () => {
    try {
      if (!token) return

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      )

      if (response.data.success && response.data.orders.length > 0) {
        const allOrdersItem = []
        response.data.orders.forEach((order) => {
          if (order.items.length === 0) {
            console.warn(`Order ${order._id} has no items!`)
          }
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              orderId: order._id,           // ← store the parent order’s _id
              trackingUrl: order.trackingUrl // ← we’ll pass this along too (if needed)
            })
          })
        })
        setOrderData(allOrdersItem.reverse())
      } else {
        setOrderData([])
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  return (
    <div className="ml-4 border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {orderData.length === 0 ? (
          <p className="text-center text-gray-500 mt-5">No orders found.</p>
        ) : (
          orderData.map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img
                  className="w-16 sm:w-20"
                  src={item.image?.[0] || "/placeholder.png"}
                  alt="Product"
                />
                <div>
                  <p className="sm:text-base font-medium">
                    {item.name || "Unknown Product"}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                    <p>
                      {currency}
                      {item.price || 0}
                    </p>
                    <p>Quantity: {item.quantity || 0}</p>
                  </div>
                  <p className="mt-1">
                    Date:{" "}
                    <span className="text-gray-400">
                      {item.date
                        ? new Date(item.date).toDateString()
                        : "Unknown Date"}
                    </span>
                  </p>
                  <p className="mt-1">
                    Payment:{" "}
                    <span className="text-gray-400">
                      {item.paymentMethod || "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="md:w-1/2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p
                    className={`min-w-2 h-2 rounded-full ${
                      item.status === "Delivered"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  ></p>
                  <p className="text-sm md:text-base">
                    {item.status || "Pending"}
                  </p>
                </div>
                {/* ← CHANGE: make this a Link to /track/:orderId */}
                <Link
                  to={`/track/${item.orderId}`}
                  className="border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-100"
                >
                  Track Order
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders
