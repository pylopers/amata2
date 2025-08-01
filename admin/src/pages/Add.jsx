// src/pages/Add.jsx
import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const Add = ({ token }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const initial = location.state || {};

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [image5, setImage5] = useState(false);
  const [image6, setImage6] = useState(false);
  const [image7, setImage7] = useState(false);
  const [image8, setImage8] = useState(false);
  const [image9, setImage9] = useState(false);
  const [image10, setImage10] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('Sofa');
  const [subCategory, setSubCategory] = useState('Living room');
  const [bestseller, setBestseller] = useState(false);
  const [mainProduct, setMainProduct] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [features, setFeatures] = useState(['']);
  const [benefits, setBenefits] = useState(['']);
  const [careInstructions, setCareInstructions] = useState(['']);
  const [whatsInTheBox, setWhatsInTheBox] = useState(['']);
  const [date, setDate] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [material, setMaterial] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState('');
  const [color, setColor] = useState('');
  const [model, setModel] = useState('');
  const [assemblyRequired, setAssemblyRequired] = useState('');
  const [warranty, setWarranty] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    setName(initial.name || '');
    setDescription(initial.description || '');
    setPrice(initial.price || '');
    setOriginalPrice(initial.originalPrice || '');
    setCategory(initial.category || 'Sofa');
    setSubCategory(initial.subCategory || 'Hall');
    setBestseller(!!initial.bestseller);
    setMainProduct(!!initial.mainProduct);
    setInStock(initial.inStock ?? true);
    setFeatures(initial.features?.length ? initial.features : ['']);
    setBenefits(initial.benefits?.length ? initial.benefits : ['']);
    setCareInstructions(initial.careInstructions?.length ? initial.careInstructions : ['']);
    setWhatsInTheBox(initial.whatsInTheBox?.length ? initial.whatsInTheBox : ['']);
    setDate(initial.date ? new Date(initial.date).toISOString().slice(0, 10) : '');
    setLength(initial.length || '');
    setWidth(initial.width || '');
    setHeight(initial.height || '');
    setMaterial(initial.material || '');
    setSeatingCapacity(initial.seatingCapacity || '');
    setColor(initial.color || '');
    setModel(initial.model || '');
    setAssemblyRequired(initial.assemblyRequired || '');
    setWarranty(initial.warranty || '')

    setImage1(initial.thumbnail || false);
    const imgs = initial.image || [];
    setImage2(imgs[0] || false);
    setImage3(imgs[1] || false);
    setImage4(imgs[2] || false);
    setImage5(imgs[3] || false);
    setImage6(imgs[4] || false);
    setImage7(imgs[5] || false);
    setImage8(imgs[6] || false);
    setImage9(imgs[7] || false);
    setImage10(imgs[8] || false);
  }, [isEdit, initial]);

  const addField = (arr, setter) => setter([...arr, '']);
  const updateField = (arr, i, val, setter) => {
    const c = [...arr];
    c[i] = val;
    setter(c);
  };

  const handleImg = (e, setter) => {
    if (e.target.files[0]) setter(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('originalPrice', originalPrice);
    formData.append('category', category);
    formData.append('subCategory', subCategory);
    formData.append('bestseller', bestseller);
    formData.append('mainProduct', mainProduct);
    formData.append('inStock', inStock);
    formData.append('features', JSON.stringify(features));
    formData.append('benefits', JSON.stringify(benefits));
    formData.append('careInstructions', JSON.stringify(careInstructions));
    formData.append('whatsInTheBox', JSON.stringify(whatsInTheBox));
    formData.append('date', date);
    formData.append('length', length);
    formData.append('width', width);
    formData.append('height', height);
    formData.append('material', material);
    formData.append('seatingCapacity', seatingCapacity);
    formData.append('color', color);
    formData.append('model', model);
    formData.append('assemblyRequired', assemblyRequired);
    formData.append('warranty', warranty);

    if (isEdit) formData.append('id', id);

    [image1, image2, image3, image4, image5, image6, image7, image8, image9, image10]
      .forEach((img, idx) => {
        if (img && img instanceof File) {
          formData.append(`image${idx + 1}`, img);
        }
      });

    try {
      const url = isEdit
        ? `${backendUrl}/api/product/update`
        : `${backendUrl}/api/product/add`;
      const res = await axios.post(url, formData, {
        headers: { token }
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/list');
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error saving product');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="mb-2">Thumbnail (First Image)</p>
        <label>
          <img
            className="w-20 h-20 object-cover rounded"
            src={
              image1
                ? image1 instanceof File
                  ? URL.createObjectURL(image1)
                  : image1
                : assets.upload_area
            }
            alt=""
          />
          <input type="file" hidden accept="image/*" onChange={(e) => handleImg(e, setImage1)} />
        </label>
      </div>

      <div className="flex gap-2">
        {[setImage2, setImage3, setImage4, setImage5, setImage6, setImage7, setImage8, setImage9, setImage10].map((setter, i) => {
          const img = [image2, image3, image4, image5, image6, image7, image8, image9, image10][i];
          return (
            <label key={i}>
              <img
                className="w-20 h-20 object-cover rounded"
                src={
                  img
                    ? img instanceof File
                      ? URL.createObjectURL(img)
                      : img
                    : assets.upload_area
                }
                alt=""
              />
              <input type="file" hidden accept="image/*" onChange={(e) => handleImg(e, setter)} />
            </label>
          );
        })}
      </div>

      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          className="w-full max-w-[500px] px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          className="w-full max-w-[500px] px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Features</p>
        {features.map((f, i) => (
          <input
            key={i}
            className="w-full max-w-[500px] px-3 py-2 mb-2"
            value={f}
            onChange={(e) => updateField(features, i, e.target.value, setFeatures)}
            required
          />
        ))}
        <button type="button" onClick={() => addField(features, setFeatures)} className="text-blue-500">
          + Add Another Feature
        </button>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Benefits</p>
        {benefits.map((b, i) => (
          <input
            key={i}
            className="w-full max-w-[500px] px-3 py-2 mb-2"
            value={b}
            onChange={(e) => updateField(benefits, i, e.target.value, setBenefits)}
            required
          />
        ))}
        <button type="button" onClick={() => addField(benefits, setBenefits)} className="text-blue-500">
          + Add Another Benefit
        </button>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Care Instruction</p>
        {careInstructions.map((c, i) => (
          <input
            key={i}
            className="w-full max-w-[500px] px-3 py-2 mb-2"
            value={c}
            onChange={(e) => updateField(careInstructions, i, e.target.value, setCareInstructions)}
            required
          />
        ))}
        <button type="button" onClick={() => addField(careInstructions, setCareInstructions)} className="text-blue-500">
          + Add Another Care Instruction
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Category</p>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2">
            <option>Sofa</option>
            <option>Sofabeds</option>
            <option>Ottoman</option>
            <option>L Shaped Sofa</option>
            <option>Furnishing</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Sub Category</p>
          <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="px-3 py-2">
            <option>Bedroom</option>
            <option>Living room</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Price</p>
          <input
            type="number"
            className="px-3 py-2 sm:w-[150px]"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="mb-2">Original Price</p>
          <input
            type="number"
            className="px-3 py-2 sm:w-[150px]"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Length</p>
          <input
            type="number"
            className="px-3 py-2 sm:w-[200px]"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            required
          />
        </div>
        <div>
          <p className="mb-2">Width</p>
          <input
            type="number"
            className="px-3 py-2 sm:w-[200px]"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            required
          />
        </div>
        <div>
          <p className="mb-2">Height</p>
          <input
            type="number"
            className="px-3 py-2 sm:w-[200px]"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Material</p>
        <input
          type="text"
          className="px-3 py-2 w-full"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-6">
        <div>
          <p className="mb-2">Seating Capacity</p>
          <input
            type="text"
            className="px-3 py-2 sm:w-[150px]"
            value={seatingCapacity}
            onChange={(e) => setSeatingCapacity(e.target.value)}
            required
          />
        </div>
        <div>
          <p className="mb-2">Color</p>
          <input
            type="text"
            className="px-3 py-2 sm:w-[150px]"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          />
        </div>
        <div>
          <p className="mb-2">Model</p>
          <input
            type="text"
            className="px-3 py-2 sm:w-[150px]"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
        </div>
        <div>
          <p className="mb-2">Assembly Required</p>
          <input
            type="text"
            className="px-3 py-2 sm:w-[150px]"
            value={assemblyRequired}
            onChange={(e) => setAssemblyRequired(e.target.value)}
            required
          />
        </div>
        <div>
          <p className="mb-2">Warranty</p>
          <input
            type="number"
            className="px-3 py-2 sm:w-[150px]"
            value={warranty}
            onChange={(e) => setWarranty(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Whats in the Box</p>
        {whatsInTheBox.map((w, i) => (
          <input
            key={i}
            className="w-full px-3 py-2 mb-2"
            value={w}
            onChange={(e) => updateField(whatsInTheBox, i, e.target.value, setWhatsInTheBox)}
            required
          />
        ))}
      </div>

      <div className="flex gap-4">
        <label>
          <input type="checkbox" checked={bestseller} onChange={() => setBestseller((p) => !p)} />{' '}
          Bestseller
        </label>
        <label>
          <input type="checkbox" checked={mainProduct} onChange={() => setMainProduct((p) => !p)} />{' '}
          Main Product
        </label>
        <label>
          <input type="checkbox" checked={inStock} onChange={() => setInStock((p) => !p)} /> In Stock
        </label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        {isEdit ? 'Save Changes' : 'ADD'}
      </button>
    </form>
  );
};

export default Add;
