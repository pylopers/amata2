import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import axios from 'axios';
import { FaCheckCircle } from 'react-icons/fa';

const Product = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { backendUrl, products, currency ,addToCart, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        return null;
      }
    })

  }

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(backendUrl+`/api/product/${productId}/reviews`);
      if (data.success) setReviews(data.reviews);
      console.log(data.reviews)
    } catch (error) {
      console.error('Error fetching reviews:', error);
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
  
  const handleBuyNow = async (productId) => {
    try {
      // Step 1: Add the product to the cart
      await addToCart(productId);
  
      // Step 2: Redirect directly to the place-order page
      navigate(`/place-order`);
    } catch (error) {
      console.error('Error during Buy Now process:', error);
      alert('Something went wrong. Please try again.');
    }
  };
  


  useEffect(() => {
    fetchProductData();
    fetchReviews();
  }, [productId,products])

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*----------- Product Data-------------- */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/*---------- Product Images------------- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
              {
                productData.image.map((item,index)=>(
                  <img onClick={()=>setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
                ))
              }
          </div>
          <div className='w-full sm:w-[80%]'>
              <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* -------- Product Info ---------- */}
        <div className='ml-4 flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className=' flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />
              <p className='pl-2'>({reviews.length} reviews)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
          <button onClick={()=>addToCart(productData._id)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 hover:bg-red-700'>ADD TO CART</button>
          <button onClick={() => handleBuyNow(productData._id)} className='ml-4 bg-red-700 text-white px-8 py-3 mt-3 text-sm active:bg-red-800 hover:bg-red-600'>BUY NOW</button>
          
          {/* Expandable Sections */}
      <div className='mt-10 border-t mr-4'>
        {[
          { title: 'Features', content: productData.features },
          { title: 'Benefits', content: productData.benefits },
          { title: 'Warranty Period', content: '1 Year Manufacturer Warranty' },
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

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
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
          <div className='grid grid-cols-2 gap-8'>
            {/* Product Information */}
            <div>
              <h2 className='text-lg font-medium mb-4'>Product <span className='text-red-700'>Information</span></h2>
              <ul className='space-y-2'>
                <li><strong>Length:</strong> {productData.length}</li>
                <li><strong>Width:</strong> {productData.width}</li>
                <li><strong>Height:</strong> {productData.height}</li>
                <li><strong>Material:</strong> {productData.material}</li>
                <li><strong>Seating Capacity:</strong> {productData.seatingCapacity}</li>
                <li><strong>Model:</strong> {productData.model}</li>
                <li><strong>Assembly Required:</strong> {productData.assemblyRequired ? 'Yes' : 'No'}</li>
                <li><strong>What's in the box:</strong> {productData.whatsInTheBox}</li>
                <li><strong>Color:</strong> {productData.color}</li>
              </ul>
            </div>

            {/* Product Description */}
            <div>
              <h2 className='text-lg font-medium mb-4'>Product Description</h2>
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
