import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editData, setEditData] = useState(null);
  const [newImages, setNewImages] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
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
    formData.append("upload_preset", "update"); // 🔥 Replace with your Cloudinary preset
  
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dcdba3iic/image/upload", // 🔥 Replace with your Cloudinary URL
        formData
      );
      return response.data.secure_url; // 🔥 Returns the uploaded image URL
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };
  
  const updateProduct = async () => {
    
    console.log("Product ID being sent:", editData._id);
    if (!editData) return;

    try {
      let updatedImages = editData.image.filter((img) => !img.startsWith("blob:"));
      // Upload new images to Cloudinary
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
        image: updatedImages,
      };
      console.log("Full data being sent:", JSON.stringify(updatedProductData));
      const response = await axios.post(
        `${backendUrl}/api/product/update`,
        updatedProductData,
        {
          headers: {
            "Content-Type": "application/json",
            'token':token,
          },
        }
      );

      console.log("Update Response:", response.data);
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
    setNewImages((prev) => [...prev, ...files]); // Store actual files

    // Show previews
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

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        <div className='hidden md:grid grid-cols-[2fr_2fr_2fr_2fr_2fr_2fr] items-start py-1 px-2 border bg-gray-100 text-sm'>
          <b>Images</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Stock</b>
          <b className='text-start'>Action</b>
        </div>

        {
          list.map((item, index) => (
            <div className='grid grid-cols-[4fr_3fr_1fr] md:grid-cols-[2fr_2fr_2fr_2fr_2fr_2fr] items-start gap-2 py-1 px-2 border text-sm' key={index}>

              {/* Image Preview with Remove Option */}
              <div className="grid grid-cols-4">
  {editData?._id === item._id
    ? editData.image.map((img, i) => (
        <div key={i} className="relative w-12">
          <img className="w-full" src={img} alt="" />
          <button
            className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full"
            onClick={() => handleRemoveImage(i)}
          >
            X
          </button>
        </div>
      ))
    : item.image.map((img, i) => (
        <div key={i} className="w-12">
          <img className="w-full" src={img} alt="" />
        </div>
      ))}
                {/* Placeholder for Adding Images */}
                {editData?._id === item._id && (
                  <label className="w-12 h-12 flex items-center justify-center border cursor-pointer">
                    <input type="file" multiple accept="image/*" onChange={handleAddImage} className="hidden" />
                    +
                  </label>
                )}
              </div>

              {/* Name */}
              {editData?._id === item._id ? (
                <input type="text" className="border p-1" value={editData.name} 
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  onKeyDown={handleKeyDown}
                />
              ) : (
                <p>{item.name}</p>
              )}

              {/* Category */}
              {editData?._id === item._id ? (
                <input type="text" className="border p-1" value={editData.category} 
                  onChange={(e) => setEditData({...editData, category: e.target.value})}
                  onKeyDown={handleKeyDown}
                />
              ) : (
                <p>{item.category}</p>
              )}

              {/* Price */}
              {editData?._id === item._id ? (
                <input type="number" className="border p-1" value={editData.price} 
                  onChange={(e) => setEditData({...editData, price: e.target.value})}
                  onKeyDown={handleKeyDown}
                />
              ) : (
                <p>{currency}{item.price}</p>
              )}

              {/* Stock */}
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
              
              {/* Bestseller */}
{editData?._id === item._id ? (
  <select className="border p-1" value={editData.bestseller}
    onChange={(e) => setEditData({ ...editData, bestseller: e.target.value === "true" })}
  >
    <option value="true">Yes</option>
    <option value="false">No</option>
  </select>
) : (
  <p>{item.bestseller ? "🔥 Bestseller" : "❌ Not a Bestseller"}</p>
)}

              {/* Action Buttons */}
              <div className="flex gap-2">
                {editData?._id === item._id ? (
                  <button className="bg-blue-500 text-white px-2 py-1 rounded" onClick={updateProduct}>Save</button>
                ) : (
                  <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => setEditData({...item, image: [...item.image]})}>Edit</button>
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
