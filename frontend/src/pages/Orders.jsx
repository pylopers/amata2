import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import axios from 'axios';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;
  
      console.log('Fetching orders...');
      const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, { headers: { token } });
      console.log('API Response:', response.data);
  
      if (response.data.success && response.data.orders.length > 0) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          if (order.items.length === 0) {
            console.warn(`Order ${order._id} has no items!`);
          }
  
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });
  
        console.log('Processed Orders:', allOrdersItem);
        setOrderData(allOrdersItem.reverse());
      } else {
        console.log('No orders found.');
        setOrderData([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  
  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
      {orderData.length === 0 ? (
    <p className="text-center text-gray-500 mt-5">No orders found.</p>
) : (
    orderData.map((item, index) => (
        <div key={item._id || index} className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-6 text-sm">
                <img className="w-16 sm:w-20" src={item.image?.[0] || '/placeholder.png'} alt="Product" />
                <div>
                    <p className="sm:text-base font-medium">{item.name || 'Unknown Product'}</p>
                    <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                        <p>{currency}{item.price || 0}</p>
                        <p>Quantity: {item.quantity || 0}</p>
                    </div>
                    <p className="mt-1">Date: <span className="text-gray-400">{item.date ? new Date(item.date).toDateString() : 'Unknown Date'}</span></p>
                    <p className="mt-1">Payment: <span className="text-gray-400">{item.paymentMethod || 'N/A'}</span></p>
                </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                    <p className={`min-w-2 h-2 rounded-full ${item.status === 'Delivered' ? 'bg-green-500' : 'bg-yellow-500'}`}></p>
                    <p className="text-sm md:text-base">{item.status || 'Pending'}</p>
                </div>
                <button onClick={loadOrderData} className="border px-4 py-2 text-sm font-medium rounded-sm">Track Order</button>
            </div>
        </div>
    ))
)}

      </div>
    </div>
  );
};

export default Orders;
