import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(`${backendUrl}/api/product/remove`, { id }, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const updateProduct = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/product/update`, 
        { 
          id: editData._id, 
          name: editData.name, 
          category: editData.category, 
          price: editData.price, 
          inStock: editData.inStock 
        }, 
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setEditData(null);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        {/* ------- List Table Title ---------- */}
        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Stock</b>
          <b className='text-center'>Action</b>
        </div>

        {/* ------ Product List ------ */}
        {
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img className='w-12' src={item.image[0]} alt="" />
              
              {editData?._id === item._id ? (
                <input type="text" className="border p-1" value={editData.name} 
                  onChange={(e) => setEditData({...editData, name: e.target.value})} 
                />
              ) : (
                <p>{item.name}</p>
              )}

              {editData?._id === item._id ? (
                <input type="text" className="border p-1" value={editData.category} 
                  onChange={(e) => setEditData({...editData, category: e.target.value})} 
                />
              ) : (
                <p>{item.category}</p>
              )}

              {editData?._id === item._id ? (
                <input type="number" className="border p-1" value={editData.price} 
                  onChange={(e) => setEditData({...editData, price: e.target.value})} 
                />
              ) : (
                <p>{currency}{item.price}</p>
              )}

              {editData?._id === item._id ? (
                <select className="border p-1" value={editData.inStock} 
                  onChange={(e) => setEditData({...editData, inStock: e.target.value === "true"})} 
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              ) : (
                <p>{item.inStock ? "✅ In Stock" : "❌ Out of Stock"}</p>
              )}

              <div className="flex gap-2">
                {editData?._id === item._id ? (
                  <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={updateProduct}>Save</button>
                ) : (
                  <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => setEditData(item)}>Edit</button>
                )}
                
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => removeProduct(item._id)}>X</button>
              </div>
            </div>
          ))
        }
      </div>
    </>
  );
};

export default List;
