import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editData, setEditData] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/adminlist`);
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
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
      console.error(error);
      toast.error(error.message);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "update");
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dcdba3iic/image/upload",
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  const updateProduct = async () => {
    if (!editData) return;
    try {
      let updatedImages = editData.image.filter((img) => !img.startsWith("blob:"));
      const uploadedImages = await Promise.all(
        newImages.map(async (file) => {
          const url = await uploadImageToCloudinary(file);
          return url ? url : null;
        })
      );
      updatedImages = [...updatedImages, ...uploadedImages.filter((url) => url !== null)];

      const updatedProductData = {
        id: editData._id,
        name: editData.name,
        category: editData.category,
        price: editData.price,
        inStock: editData.inStock,
        bestseller: editData.bestseller,
        mainProduct: editData.mainProduct,
        image: updatedImages,
      };

      const response = await axios.post(
        `${backendUrl}/api/product/update`,
        updatedProductData,
        {
          headers: {
            "Content-Type": "application/json",
            'token': token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Product updated successfully!");
        setEditData(null);
        setNewImages([]);
        fetchList();
      } else {
        toast.error("Failed to update product: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error.message);
      toast.error("Error updating product.");
    }
  };

  const handleRemoveImage = (index) => {
    setEditData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  };

  const handleAddImage = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    setEditData((prev) => ({
      ...prev,
      image: [...prev.image, ...files.map((file) => URL.createObjectURL(file))],
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      updateProduct();
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredList = list.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'main') return item.mainProduct === true;
    if (filter === 'non-main') return !item.mainProduct;
    return true;
  });

  return (
    <>
      {/* Filter Dropdown */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xl font-bold">All Products</p>
        <select
          className="border p-2 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Products</option>
          <option value="main">Main Products</option>
          <option value="non-main">Non-Main Products (Variants)</option>
        </select>
      </div>

      {/* Table Headers */}
      <div className='hidden md:grid grid-cols-[150px_2fr_1fr_1fr_1fr_1fr_1fr_150px] items-center py-2 px-2 border bg-gray-100 text-sm font-bold'>
        <div>Images</div>
        <div>Name</div>
        <div>Category</div>
        <div>Price</div>
        <div>Stock</div>
        <div>Main</div>
        <div>Bestseller</div>
        <div className='text-center'>Action</div>
      </div>

      {/* Product Rows */}
      <div className='flex flex-col gap-2'>
        {filteredList.map((item, index) => (
          <div
            className='grid grid-cols-[150px_2fr_1fr_1fr_1fr_1fr_1fr_150px] items-center gap-2 py-2 px-2 border text-sm'
            key={index}
          >
            {/* Images */}
            <div className="flex flex-wrap gap-1">
              {editData?._id === item._id ? (
                <>
                  {editData.image.map((img, i) => (
                    <div key={i} className="relative w-12 h-12">
                      <img src={img} alt="" className="w-full h-full object-cover rounded" />
                      <button
                        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full"
                        onClick={() => handleRemoveImage(i)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                  <label className="w-12 h-12 flex items-center justify-center border cursor-pointer">
                    <input type="file" multiple accept="image/*" onChange={handleAddImage} className="hidden" />
                    +
                  </label>
                </>
              ) : (
                <>
                  {item.image.slice(0, 3).map((img, i) => (
                    <img key={i} src={img} alt="" className="w-12 h-12 object-cover rounded" />
                  ))}
                  {item.image.length > 3 && (
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-200 text-xs rounded">
                      +{item.image.length - 3}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Name */}
            {editData?._id === item._id ? (
              <input type="text" className="border p-1" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} onKeyDown={handleKeyDown} />
            ) : (
              <p className="truncate">{item.name}</p>
            )}

            {/* Category */}
            {editData?._id === item._id ? (
              <input type="text" className="border p-1" value={editData.category} onChange={(e) => setEditData({...editData, category: e.target.value})} onKeyDown={handleKeyDown} />
            ) : (
              <p>{item.category}</p>
            )}

            {/* Price */}
            {editData?._id === item._id ? (
              <input type="number" className="border p-1" value={editData.price} onChange={(e) => setEditData({...editData, price: e.target.value})} onKeyDown={handleKeyDown} />
            ) : (
              <p>{currency}{item.price}</p>
            )}

            {/* Stock */}
            {editData?._id === item._id ? (
              <select className="border p-1" value={editData.inStock} onChange={(e) => setEditData({...editData, inStock: e.target.value === "true"})}>
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
            ) : (
              <p>{item.inStock ? "✅ In Stock" : "❌ Out of Stock"}</p>
            )}

            {/* Main Product */}
            {editData?._id === item._id ? (
              <select className="border p-1" value={editData.mainProduct} onChange={(e) => setEditData({...editData, mainProduct: e.target.value === "true"})}>
                <option value="true">Main</option>
                <option value="false">Variant</option>
              </select>
            ) : (
              <p>{item.mainProduct ? "🌟 Main" : "🎨 Variant"}</p>
            )}

            {/* Bestseller */}
            {editData?._id === item._id ? (
              <select className="border p-1" value={editData.bestseller} onChange={(e) => setEditData({...editData, bestseller: e.target.value === "true"})}>
                <option value="true">Bestseller</option>
                <option value="false">Normal</option>
              </select>
            ) : (
              <p>{item.bestseller ? "🔥 Bestseller" : "💤 Normal"}</p>
            )}

            {/* Actions */}
            <div className="flex gap-2 justify-center">
              {editData?._id === item._id ? (
                <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={updateProduct}>Save</button>
              ) : (
                <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => setEditData({...item, image: [...item.image]})}>Edit</button>
              )}
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => removeProduct(item._id)}>X</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
