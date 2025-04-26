import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  const [images, setImages] = useState(Array(10).fill(false)); // array for 10 images
  const [thumbnail, setThumbnail] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('Sofa');
  const [subCategory, setSubCategory] = useState('Hall');
  const [bestseller, setBestseller] = useState(false);
  const [mainProduct, setMainProduct] = useState(false);
  const [features, setFeatures] = useState(['']);
  const [benefits, setBenefits] = useState(['']);
  const [careInstructions, setCareInstructions] = useState(['']);
  const [date, setDate] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [material, setMaterial] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState('');
  const [color, setColor] = useState('');
  const [model, setModel] = useState('');
  const [assemblyRequired, setAssemblyRequired] = useState('');
  const [whatsInTheBox, setWhatsInTheBox] = useState(['']);

  const addFeatureField = () => setFeatures([...features, '']);
  const updateFeature = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const addBenefitField = () => setBenefits([...benefits, '']);
  const updateBenefit = (index, value) => {
    const updated = [...benefits];
    updated[index] = value;
    setBenefits(updated);
  };

  const addCareInstructionField = () => setCareInstructions([...careInstructions, '']);
  const updateCareInstruction = (index, value) => {
    const updated = [...careInstructions];
    updated[index] = value;
    setCareInstructions(updated);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      
      if (thumbnail) formData.append('thumbnail', thumbnail);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('originalPrice', originalPrice);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
      formData.append('mainProduct', mainProduct);
      formData.append('features', JSON.stringify(features));
      formData.append('benefits', JSON.stringify(benefits));
      formData.append('careInstructions', JSON.stringify(careInstructions));
      formData.append('date', date);
      formData.append('length', length);
      formData.append('width', width);
      formData.append('height', height);
      formData.append('material', material);
      formData.append('seatingCapacity', seatingCapacity);
      formData.append('color', color);
      formData.append('model', model);
      formData.append('assemblyRequired', assemblyRequired);
      formData.append('whatsInTheBox', JSON.stringify(whatsInTheBox));

      images.forEach((img, index) => {
        if (img) formData.append(`image${index + 1}`, img);
      });

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setThumbnail(false);
    setImages(Array(10).fill(false));
    setName('');
    setDescription('');
    setPrice('');
    setOriginalPrice('');
    setCategory('Sofa');
    setSubCategory('Hall');
    setBestseller(false);
    setMainProduct(false);
    setFeatures(['']);
    setBenefits(['']);
    setCareInstructions(['']);
    setDate('');
    setLength('');
    setWidth('');
    setHeight('');
    setMaterial('');
    setSeatingCapacity('');
    setColor('');
    setModel('');
    setAssemblyRequired('');
    setWhatsInTheBox(['']);
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      {/* Thumbnail Upload */}
      <div>
        <p className="mb-2">Upload Thumbnail</p>
        <label htmlFor="thumbnail">
          <img className="w-24 h-24 object-cover border cursor-pointer" 
               src={thumbnail ? URL.createObjectURL(thumbnail) : assets.upload_area} alt="" />
        </label>
        <input 
          onChange={(e) => setThumbnail(e.target.files[0])} 
          type="file" 
          id="thumbnail" 
          hidden 
          required 
        />
      </div>

      {/* Multiple Images Upload */}
      <div>
        <p className="mb-2">Upload Product Images</p>
        <div className="flex gap-2 flex-wrap">
          {images.map((image, index) => (
            <label key={index} htmlFor={`image${index}`}>
              <img 
                className="w-20 h-20 object-cover border cursor-pointer" 
                src={image ? URL.createObjectURL(image) : assets.upload_area} 
                alt="" 
              />
              <input 
                onChange={(e) => {
                  const updatedImages = [...images];
                  updatedImages[index] = e.target.files[0];
                  setImages(updatedImages);
                }} 
                type="file" 
                id={`image${index}`} 
                hidden 
              />
            </label>
          ))}
        </div>
      </div>

      {/* Product Details */}
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} 
               className="w-full max-w-[500px] px-3 py-2" type="text" placeholder="Type here" required />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} 
                  className="w-full max-w-[500px] px-3 py-2" placeholder="Write content here" required />
      </div>

      {/* Features */}
      <div className="w-full">
        <p className="mb-2">Product Features</p>
        {features.map((feature, index) => (
          <input
            key={index}
            type="text"
            value={feature}
            onChange={(e) => updateFeature(index, e.target.value)}
            className="w-full max-w-[500px] px-3 py-2 mb-2"
            placeholder="Enter Feature"
            required
          />
        ))}
        <button type="button" onClick={addFeatureField} className="text-blue-500">+ Add Another Feature</button>
      </div>

      {/* Benefits */}
      <div className="w-full">
        <p className="mb-2">Product Benefits</p>
        {benefits.map((benefit, index) => (
          <input
            key={index}
            type="text"
            value={benefit}
            onChange={(e) => updateBenefit(index, e.target.value)}
            className="w-full max-w-[500px] px-3 py-2 mb-2"
            placeholder="Enter Benefit"
            required
          />
        ))}
        <button type="button" onClick={addBenefitField} className="text-blue-500">+ Add Another Benefit</button>
      </div>

      {/* Care Instructions */}
      <div className="w-full">
        <p className="mb-2">Product Care Instructions</p>
        {careInstructions.map((instruction, index) => (
          <input
            key={index}
            type="text"
            value={instruction}
            onChange={(e) => updateCareInstruction(index, e.target.value)}
            className="w-full max-w-[500px] px-3 py-2 mb-2"
            placeholder="Enter Care Instruction"
            required
          />
        ))}
        <button type="button" onClick={addCareInstructionField} className="text-blue-500">+ Add Another</button>
      </div>

      {/* Other Details */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Category</p>
          <select onChange={(e) => setCategory(e.target.value)} value={category} className="w-full px-3 py-2 sm:w-[120px]">
            <option value="Sofa">Sofa</option>
            <option value="Sofabeds">Sofabeds</option>
            <option value="Recliner">Recliner</option>
            <option value="Furniture">Furniture</option>
            <option value="Furnishing">Furnishing</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Sub Category</p>
          <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className="w-full px-3 py-2 sm:w-[120px]">
            <option value="Hall">Hall</option>
            <option value="Bedroom">Bedroom</option>
            <option value="Living Room">Living Room</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className="w-full px-3 py-2 sm:w-[120px]" type="number" required />
        </div>

        <div>
          <p className="mb-2">Original Price</p>
          <input onChange={(e) => setOriginalPrice(e.target.value)} value={originalPrice} className="w-full px-3 py-2 sm:w-[120px]" type="number" required />
        </div>
      </div>

      {/* Sizes */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Length</p>
          <input onChange={(e) => setLength(e.target.value)} value={length} className="w-full px-3 py-2 sm:w-[140px]" type="number" required />
        </div>
        <div>
          <p className="mb-2">Width</p>
          <input onChange={(e) => setWidth(e.target.value)} value={width} className="w-full px-3 py-2 sm:w-[140px]" type="number" required />
        </div>
        <div>
          <p className="mb-2">Height</p>
          <input onChange={(e) => setHeight(e.target.value)} value={height} className="w-full px-3 py-2 sm:w-[140px]" type="number" required />
        </div>
      </div>

      {/* Material & other details */}
      <div className="w-full">
        <p className="mb-2">Material</p>
        <input onChange={(e) => setMaterial(e.target.value)} value={material} className="w-full max-w-[500px] px-3 py-2" type="text" required />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Seating Capacity</p>
          <input onChange={(e) => setSeatingCapacity(e.target.value)} value={seatingCapacity} className="w-full px-3 py-2 sm:w-[120px]" type="number" required />
        </div>
        <div>
          <p className="mb-2">Color</p>
          <input onChange={(e) => setColor(e.target.value)} value={color} className="w-full px-3 py-2 sm:w-[100px]" type="text" required />
        </div>
        <div>
          <p className="mb-2">Model</p>
          <input onChange={(e) => setModel(e.target.value)} value={model} className="w-full px-3 py-2 sm:w-[100px]" type="text" required />
        </div>
        <div>
          <p className="mb-2">Assembly Required</p>
          <input onChange={(e) => setAssemblyRequired(e.target.value)} value={assemblyRequired} className="w-full px-3 py-2 sm:w-[100px]" type="text" required />
        </div>
      </div>

      {/* Whats in the Box */}
      <div className="w-full">
        <p className="mb-2">What's in the Box</p>
        <input onChange={(e) => setWhatsInTheBox([e.target.value])} value={whatsInTheBox} 
               className="w-full max-w-[500px] px-3 py-2" type="text" required />
      </div>

      {/* Options */}
      <div className="flex gap-2 mt-2">
        <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id="bestseller" />
        <label htmlFor="bestseller" className="cursor-pointer">Add to Bestseller</label>
      </div>

      <div className="flex gap-2 mt-2">
        <input onChange={() => setMainProduct(prev => !prev)} checked={mainProduct} type="checkbox" id="mainProduct" />
        <label htmlFor="mainProduct" className="cursor-pointer">Add as Main Product</label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">ADD</button>
    </form>
  );
};

export default Add;
