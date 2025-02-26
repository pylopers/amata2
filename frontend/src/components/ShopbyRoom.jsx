import React from 'react';
import { useNavigate } from 'react-router-dom';
import Title from './Title';
import { assets } from '../assets/assets';

const ShopByRoom = () => {
  const navigate = useNavigate(); // 🔥 Hook for navigation

  const rooms = [
    { id: 1, name: 'Living Room', value: 'Livingroom', image: assets.livingroom },
    { id: 2, name: 'Bedroom', value: 'Bedroom', image: assets.bedroom }
  ];

  const handleClick = (room) => {
    navigate(`/collection?subCategory=${room.value}`); // ✅ Pass sub-category in URL
  };

  return (
    <div className=''>
      <div className='text-center text-3xl py-8'>
        <Title text1={'SHOP BY'} text2={'ROOM'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Explore our fun finds for your living room and bedroom. Check out our trendy designs, which can liven up any space.
        </p>
      </div>

      {/* 🔥 Horizontal Scroll on Mobile, Grid on Larger Screens */}
      <div className="flex space-x-4 overflow-x-auto overflow-y-hidden scrollbar-hide px-4 sm:grid sm:grid-cols-2 sm:mr-4">
        {rooms.map((room) => (
          <div 
            key={room.id} 
            className='relative group cursor-pointer w-[80vw] sm:w-full flex-shrink-0' 
            onClick={() => handleClick(room)} // ✅ Navigate on click
          >
            <img 
              src={room.image} 
              alt={room.name} 
              className='w-full h-auto rounded-lg transition-transform transform group-hover:scale-105' 
            />
            <div className='absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity'>
              {room.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopByRoom;
