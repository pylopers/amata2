import React, { useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [image5, setImage5] = useState(false);

  // State to store product details
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('Sofa');
  const [subCategory, setSubCategory] = useState('Hall');
  const [bestseller, setBestseller] = useState(false);
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
 // Array for multiple features

  const addFeatureField = () => setFeatures([...features, '']); // Add more feature input fields
  const updateFeature = (index, value) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };

const addBenefitField = () => setBenefits([...benefits, '']); // Add more feature input fields
const updateBenefit = (index, value) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index] = value;
    setBenefits(updatedBenefits);
  };

  const addCareInstructionField = () => setCareInstructions([...careInstructions, '']); // Add more feature input fields
  const updateCareInstruction = (index, value) => {
    const updatedCareInstructions = [...careInstructions];
    updatedCareInstructions[index] = value;
    setCareInstructions(updatedCareInstructions);
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('originalPrice', originalPrice);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
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
      formData.append('whatsInTheBox', JSON.stringify(whatsInTheBox)); // Send features as JSON

      image1 && formData.append('image1', image1);
      image2 && formData.append('image2', image2);
      image3 && formData.append('image3', image3);
      image4 && formData.append('image4', image4);
      image5 && formData.append('image5', image5);

      const response = await axios.post(backendUrl + '/api/product/add', formData, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setPrice('');
        setOriginalPrice('');
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
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setImage5(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  console.log(careInstructions)
  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {[image1, image2, image3, image4, image5].map((image, index) => (
            <label key={index} htmlFor={`image${index + 1}`}>
              <img className="w-20" src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
              <input onChange={(e) => eval(`setImage${index + 1}`)(e.target.files[0])} type="file" id={`image${index + 1}`} hidden />
            </label>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className="w-full max-w-[500px] px-3 py-2" type="text" placeholder="Type here" required />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className="w-full max-w-[500px] px-3 py-2" placeholder="Write content here" required />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Features</p>
        {features.map((feature, index) => (
          <input
            key={index}
            type="text"
            value={feature}
            onChange={(e) => updateFeature(index, e.target.value)}
            className="w-full max-w-[500px] px-3 py-2 mb-2"
            placeholder="Enter feature (e.g., 'Memory Foam')"
            required
          />
        ))}
        <button type="button" onClick={addFeatureField} className="mt-1 text-blue-500">+ Add Another Feature</button>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Benefits</p>
        {benefits.map((benefit, index) => (
          <input
            key={index}
            type="text"
            value={benefit}
            onChange={(e) => updateBenefit(index, e.target.value)}
            className="w-full max-w-[500px] px-3 py-2 mb-2"
            placeholder="Enter Benefit (e.g., 'Memory Foam')"
            required
          />
        ))}
        <button type="button" onClick={addBenefitField} className="mt-1 text-blue-500">+ Add Another Benefit</button>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Care Instruction</p>
        {careInstructions.map((careInstruction, index) => (
          <input
            key={index}
            type="text"
            value={careInstruction}
            onChange={(e) => updateCareInstruction(index, e.target.value)}
            className="w-full max-w-[500px] px-3 py-2 mb-2"
            placeholder="Enter CareIntruction (e.g., 'Memory Foam')"
            required
          />
        ))}
        <button type="button" onClick={addCareInstructionField} className="mt-1 text-blue-500">+ Add Another Benefit</button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 sm:w-[120px]">
            <option value="Sofa">Sofa</option>
            <option value="Sofabeds">Sofabeds</option>
            <option value="Recliner">Recliner</option>
            <option value="Furniture">Furniture</option>
            <option value="Furnishing">Furnishing</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Sub Category</p>
          <select onChange={(e) => setSubCategory(e.target.value)} className="w-full px-3 py-2 sm:w-[120px]">
            <option value="Hall">Hall</option>
            <option value="Bedroom">Bedroom</option>
            <option value="Living room">Living Room</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className="w-full px-3 py-2 sm:w-[120px]" type="number" placeholder="25" required />
        </div>

        <div>
          <p className="mb-2">Original Price</p>
          <input onChange={(e) => setOriginalPrice(e.target.value)} value={originalPrice} className="w-full px-3 py-2 sm:w-[120px]" type="number" placeholder="30" required />
        </div>
      </div>

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

      {/* Outer Material, Frame Material in one row */}
      <div className="w-full">
        <div>
          <p className="mb-2">Material</p>
          <input onChange={(e) => setMaterial(e.target.value)} value={material} className="w-full px-3 py-2 sm:w-[500px]" type="text" required />
        </div>
      </div>

      {/* Remaining fields in one row */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-6">
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

      <div className="w-full">
          <p className="mb-2">Whats in the Box</p>
          <input onChange={(e) => setWhatsInTheBox(e.target.value)} value={whatsInTheBox} className="w-full max-w-[500px] px-3 py-2 mb-2" type="text" required />
        </div>
      

      <div className="flex gap-2 mt-2">
        <input onChange={() => setBestseller((prev) => !prev)} checked={bestseller} type="checkbox" id="bestseller" />
        <label className="cursor-pointer" htmlFor="bestseller">Add to Bestseller</label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">ADD</button>
    </form>
    
  );
};

export default Add;
