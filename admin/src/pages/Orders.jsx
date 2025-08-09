
// src/pages/Orders.jsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [showTrackingInput, setShowTrackingInput] = useState(null)
  const [trackingLinks, setTrackingLinks] = useState({})
  const [cancellingId, setCancellingId] = useState(null)
  const [exchangeMode, setExchangeMode] = useState(null)

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      )
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    const selectedStatus = event.target.value
    // exit exchange mode once user picks new status
    if (exchangeMode === orderId) setExchangeMode(null)

    if (selectedStatus === 'Shipped') {
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: 'Shipped' } : order
        )
      )
      setShowTrackingInput(orderId)
    } else {
      try {
        const response = await axios.post(
          `${backendUrl}/api/order/status`,
          { orderId, status: selectedStatus },
          { headers: { token } }
        )
        if (response.data.success) await fetchAllOrders()
        else toast.error(response.data.message)
      } catch (error) {
        toast.error('Error updating status')
      }
    }
  }

  const submitTrackingUrl = async (orderId) => {
    const url = trackingLinks[orderId]
    if (!url || !url.startsWith('http')) {
      toast.error('Please enter a valid tracking URL')
      return
    }
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: 'Shipped', trackingUrl: url },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Tracking URL added')
        setShowTrackingInput(null)
        await fetchAllOrders()
      } else {
        toast.error(response.data.message)
      }
    } catch {
      toast.error('Failed to submit tracking URL')
    }
  }

  const cancelOrderHandler = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancellingId(orderId)
    try {
      const res = await axios.patch(
        `${backendUrl}/api/order/cancel/${orderId}/admin`,
        {},
        { headers: { token } }
      )
      if (res.data.success) {
        toast.success('Order cancelled successfully')
        await fetchAllOrders()
      } else {
        toast.error(res.data.message || 'Could not cancel the order')
      }
    } catch {
      toast.error('Error cancelling order')
    } finally {
      setCancellingId(null)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {orders.map((order) => {
          const isFinal = ['Cancelled', 'Delivered'].includes(order.status)
          return (
            <div
              key={order._id}
              className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'
            >
              <img className='w-12' src={assets.parcel_icon} alt='' />
              <div>
                {order.items.map((item, i) => (
                  <p className='py-0.5' key={i}>
                    {item.name} x {item.quantity}({item.size})
                  </p>
                ))}
                <p className='mt-3 mb-2 font-medium'>
                  {order.address.firstName} {order.address.lastName}
                </p>
                <div>
                  <p>{order.address.street},</p>
                  <p>
                    {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                  </p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
                <p className='mt-3'>Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
              <div className='flex flex-col gap-2'>
                <select
                  onChange={(e) => statusHandler(e, order._id)}
                  value={order.status}
                  className='p-2 font-semibold'
                  disabled={isFinal && exchangeMode !== order._id}
                >
                  <option value='Order Placed'>Order Placed</option>
                  <option value='Packing'>Packing</option>
                  <option value='Shipped'>Shipped</option>
                  <option value='Out for delivery'>Out for delivery</option>
                  <option value='Delivered'>Delivered</option>
                  <option value='Cancelled'>Cancelled</option>
                </select>

                {showTrackingInput === order._id && (
                  <div className='mt-2'>
                    <input
                      type='url'
                      placeholder='Enter tracking URL'
                      className='border p-1 w-full text-xs'
                      value={trackingLinks[order._id] || ''}
                      onChange={(e) => setTrackingLinks({ ...trackingLinks, [order._id]: e.target.value })}
                    />
                    <button
                      onClick={() => submitTrackingUrl(order._id)}
                      className='bg-blue-500 text-white px-2 py-1 text-xs mt-1 rounded'
                    >
                      Submit URL
                    </button>
                  </div>
                )}

                {['Order Placed', 'Packing'].includes(order.status) && (
                  <button
                    onClick={() => cancelOrderHandler(order._id)}
                    className='px-2 py-1 text-xs border rounded text-red-600 hover:bg-red-50'
                    disabled={cancellingId === order._id}
                  >
                    {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}

                {order.status === 'Delivered' && exchangeMode !== order._id && (
                  <button
                    onClick={() => setExchangeMode(order._id)}
                    className='px-2 py-1 text-xs border rounded text-blue-600 hover:bg-blue-50'
                  >
                    Exchange
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Orders

