import React, { useContext, useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import './swiperStyles.css'


const Product = () => {
  const [availableColors, setAvailableColors] = useState([]);
  const navigate = useNavigate();
  const { productId } = useParams();
  const { backendUrl, products, currency ,addToCart, token, allProducts } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [availableCapacities, setAvailableCapacities] = useState([]);

const handleIncrease = () => setQuantity((prev) => prev + 1);
const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const colorOptions = ["Brown", "Yellow", "Orange", "Ocean Blue", "Red", "Green", "Cream", "Camel", "Royal Blue", "Sky Blue", "Grey"];

  const fetchProductData = async () => {
    const item = allProducts.find((item) => item._id === productId);
    if (item) {
      setProductData(item);
      setImage(item.image[0]);
      
      // NEW: Precompute available colors for this model
      const variants = allProducts.filter(
        product => product.model === item.model
      );
      const colorSet = new Set();
      variants.forEach(v => {
        if (v.color) colorSet.add(v.color.toLowerCase().trim());
      });
      setAvailableColors(Array.from(colorSet));

      // In fetchProductData
const capacitySet = new Set();
variants.forEach(v => {
  if (v.seatingCapacity) capacitySet.add(v.seatingCapacity.toLowerCase().trim());
});
setAvailableCapacities(Array.from(capacitySet));
    }
  };


  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(backendUrl+`/api/product/${productId}/reviews`);
      if (data.success) setReviews(data.reviews);
      console.log(data.reviews)
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

const handleColorChange = (color) => {
  if (!productData?.model) return;
  const targetColor = color.toLowerCase().trim();
  const currentCap = productData.seatingCapacity;

  const newProduct = allProducts.find(item =>
    item.model === productData.model &&
    item.seatingCapacity === currentCap &&
    item.color?.toLowerCase().trim() === targetColor
  );

  if (newProduct) navigate(`/product/${newProduct._id}`);
  else alert("This color is currently unavailable for that capacity");
};

   const handleCapacityChange = (capacity) => {
    if (!productData?.model) return;
    
    const newProduct = allProducts.find(
      item => item.model === productData.model && 
              item.seatingCapacity === capacity
    );

    if (newProduct) {
      navigate(`/product/${newProduct._id}`);
    } else {
      alert("This seating capacity is currently unavailable");
    }
  };
  
  

  const handleAddReview = async () => {
    if (!reviewText.trim()) {
      alert("Review text cannot be empty.");
      return;
    }
    try {
      const { data } = await axios.post(
        backendUrl+'/api/product/addReview',
        { productId, comment: reviewText, rating },  // Fix here
        { headers: {token}}
      );
      if (data.success) {
        setReviewText('');
        fetchReviews();
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };
  
  const handleBuyNow = async (productId, quantity) => {
    try {
      // Step 1: Add the product to the cart
      await addToCart(productId, quantity);
  
      // Step 2: Redirect directly to the place-order page
      navigate(`/place-order`);
    } catch (error) {
      console.error('Error during Buy Now process:', error);
      alert('Something went wrong. Please try again.');
    }
  };
  
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    fetchProductData();
    fetchReviews();
  }, [productId,allProducts])

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const colorMap = {
    Brown: "#8B4513",
    Yellow: "#FFD700",
    Orange: "#FFA500",
    "Ocean Blue": "#0077BE",
    Red: "#FF0000",
    Green: "#008000",
    Cream: "#FFFDD0",
    Camel: "#C19A6B",
    "Royal Blue": "#4169E1",
    "Sky Blue":"#7af4ffff",
    "Grey":"#404242ff"
  };

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*----------- Product Data-------------- */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
      <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
    <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
      {productData.image.map((item, index) => (
        <img 
          onClick={() => {
            setActiveIndex(index);
            if (swiperRef.current) swiperRef.current.swiper.slideTo(index);
          }}
          src={item} 
          key={index} 
          className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer" 
          alt=""
        />
      ))}
    </div>
    <div className="w-full sm:w-[80%]">
      <Swiper
        navigation
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        className="custom-swiper"
        ref={swiperRef}
        style={{ maxWidth: '600px', margin: 'auto' }}
        initialSlide={activeIndex}
      >
        {productData.image.map((item, index) => (
          <SwiperSlide key={index}>
            <img src={item} alt={`Product ${index}`} className="w-full h-auto" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </div>

        {/* -------- Product Info ---------- */}
        <div className='ml-4 flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
  {productData.averageRating === 0 ? (
    <p className='text-gray-500'>No reviews yet.</p>
  ) : (
    <>
      {[...Array(5)].map((_, index) => (
        <img 
          key={index} 
          src={index < productData.averageRating ? assets.star_icon : assets.star_dull_icon} 
          alt="star" 
          className="w-3.5" 
        />
      ))}
      <p className='pl-2'>({reviews.length} reviews)</p>
    </>
  )}
</div>
{availableCapacities.length > 0 && (
      <div className='mt-4 flex flex-wrap gap-2'>
        <p className='w-full text-sm font-medium'>Seating Capacity:</p>
        {availableCapacities.map((capacity) => {
          const isCurrent = productData.seatingCapacity === capacity;

          return (
            <button
              key={capacity}
              className={`px-4 py-1 border rounded-md ${
                isCurrent 
                  ? "border-red-700 bg-red-50 font-bold" 
                  : "border-gray-300 hover:border-gray-500 cursor-pointer"
              } transition-all duration-200`}
              onClick={() => handleCapacityChange(capacity)}
              title={`Switch to ${capacity} seating`}
            >
              {capacity}
            </button>
          );
        })}
      </div>
    )}
<div className='mt-4 flex flex-wrap gap-2'>
  {colorOptions.map((color) => {
    const normalizedColor = color.toLowerCase().trim();
    const isAvailable = allProducts.some(item =>
      item.model === productData.model &&
      item.seatingCapacity === productData.seatingCapacity &&
      item.color?.toLowerCase().trim() === normalizedColor
    );
    const isCurrent = productData.color?.toLowerCase().trim() === normalizedColor;

    return (
      <div key={color} className="relative">
        <button
          className={`w-8 h-8 rounded-full border-2 ${
            isCurrent 
              ? "border-black shadow-lg scale-110" 
              : isAvailable 
                ? "border-gray-300 hover:border-gray-500 cursor-pointer" 
                : "border-red-600 opacity-100 cursor-not-allowed"
          } transition-all duration-200`}
          style={{ backgroundColor: colorMap[color] }}
          onClick={() => isAvailable && handleColorChange(color)}
          disabled={!isAvailable}
          title={isAvailable ? `Switch to ${color}` : `${color} unavailable`}
        />
        {!isAvailable && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 w-[97%] h-[2px] bg-red-600 
                            rotate-[-45deg] origin-center translate-x-[-47%] 
                            translate-y-[-100%] rounded"></div>
          </div>
        )}
      </div>
    );
  })}
</div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          {productData.inStock ? (
  <>
    <button onClick={() => addToCart(productData._id, quantity)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 hover:bg-red-700'>ADD TO CART</button>
    <button onClick={() => handleBuyNow(productData._id, quantity)} className='ml-4 bg-red-700 text-white px-8 py-3 mt-3 text-sm active:bg-red-800 hover:bg-red-600'>BUY NOW</button>
            {/* Quantity Selector */}
    <div className="flex items-center mt-4 border w-fit px-2 py-1 rounded-md">
      <button 
        className="text-lg px-2" 
        onClick={handleDecrease} 
        disabled={quantity === 1}
      >
        -
      </button>
      <span className="px-4">{quantity}</span>
      <button 
        className="text-lg px-2" 
        onClick={handleIncrease}
      >
        +
      </button>
    </div>
  </>
) : (
  <p className="text-red-700 font-semibold text-lg mt-5">Out of Stock</p>
)}
          {/* Expandable Sections */}
      <div className='mt-10 border-t mr-4'>
        {[
          { title: 'Features', content: productData.features },
          { title: 'Benefits', content: productData.benefits },
          { title: 'Warranty Period', content: productData.warranty + ' Years of Manufacturer Warranty' },
          { title: 'Return & Replacement', content: 'Return within 7 days for an exchange or full refund.' },
          { title: 'Care Instructions', content: productData.careInstructions }
        ].map((section, index) => (
          <div key={index} className="border-b">
            <button 
              onClick={() => toggleSection(section.title)}
              className="w-full text-left px-5 py-3 text-sm font-medium flex justify-between items-center"
            >
              {section.title}
              <span>{expandedSection === section.title ? <big className='text-red-800'>-</big> : <big className='text-red-800'>＋</big>}</span>
            </button>
            {expandedSection === section.title && (
              <div className="px-5 py-2 text-sm text-gray-600">
                {Array.isArray(section.content) ? (
                  <ul className="ml-5">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-center gap-2"><FaCheckCircle className="text-red-800"/>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{section.content}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} currentProductId = {productData._id} />
      <div className='mt-20'>
      {/* Tabs: Description & Reviews */}
      <div className='flex border-b'>
        <button 
          className={`px-5 py-3 text-sm ${activeTab === 'description' ? 'border-b-2 border-red-700 font-bold' : ''}`} 
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        <button 
          className={`px-5 py-3 text-sm ${activeTab === 'reviews' ? 'border-b-2 border-red-700 font-bold' : ''}`} 
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
      </div>

      {/* Content Display Based on Active Tab */}
      <div className='border px-6 py-6 text-sm text-gray-800'>
        {activeTab === 'description' && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Product Information */}
            <div className="overflow-x-auto">
                <h2 className='text-lg font-medium mb-4'>Product <span className='text-red-700'>Information</span></h2>
                <table className="min-w-full border-collapse border border-gray-300">
                  <tbody>
                    {[
                      { label: 'Length', value: productData.length },
                      { label: 'Width', value: productData.width },
                      { label: 'Height', value: productData.height },
                      { label: 'Material', value: productData.material },
                      { label: 'Seating Capacity', value: productData.seatingCapacity },
                      { label: 'Model', value: productData.model },
                      { label: 'Assembly Required', value: productData.assemblyRequired ? 'Yes' : 'No' },
                      { label: "What's in the box", value: productData.whatsInTheBox },
                      { label: 'Color', value: productData.color },
                    ].map((item, index) => (
                      <tr key={index} className="border border-gray-300">
                        <td className="p-3 font-medium bg-gray-100">{item.label}</td>
                        <td className="p-3">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Product Description */}
              <div>
                <h2 className='text-lg font-medium mb-4'>Product <span className='text-red-700'>Description</span></h2>
                <p>{productData.description}</p>
              </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className='flex flex-col gap-4'>
            <h2 className='text-lg font-medium'>Customer Reviews</h2>
            {productData.reviews && productData.reviews.length > 0 ? (
              productData.reviews.map((review, index) => (
                <div key={index} className='border-b pb-3'>
                  <p className='font-semibold'>{review.name}</p>
                  <p>{review.comment}</p>
                  <p className='text-gray-400'>Rating: {review.rating} / 5</p>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        )}
      </div>

        {/* Add Review Section */}
<div className='mt-8 ml-4 pr-4'>
  <h3 className='text-lg font-semibold'>Add Your Review</h3>
  <textarea
    className='border w-full p-2 mt-3'
    placeholder='Write your review...'
    value={reviewText}
    onChange={(e) => setReviewText(e.target.value)}
  />
  <div
    className="flex gap-1 mt-2"
    value={rating}
    onChange={(e) => setRating(e.target.value)}
  >

  {[1, 2, 3, 4, 5].map((num) => (
    <img
      key={num}
      src={num <= rating ? assets.star_icon : assets.star_dull_icon}
      className="w-5 cursor-pointer"
      onClick={() => setRating(num)}
      alt={`${num} Star`}
    />
  ))}
  </div>
  <button
    onClick={handleAddReview}
    className='bg-black text-white px-8 py-2 mt-4 text-sm'
  >
    Submit Review
  </button>
</div>
      </div>


      {/* --------- display related products ---------- */}

      

    </div>
  ) : <div className=' opacity-0'></div>
}

export default Product
