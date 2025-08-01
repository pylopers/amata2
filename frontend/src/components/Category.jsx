import React from "react";
import p_img1 from "../assets/Cream3s.jpg";
import p_img4 from "../assets/red3.jpg";
import ottoman from '../assets/ottoman.jpg'
import p_img7 from "../assets/ob3.jpg";
import p_img8 from "../assets/G3.jpg";
import lshape from "../assets/Lshape.jpg"
import Title from "./Title";
import { useNavigate } from "react-router-dom";

const categories = [
  { name: "Sofa", image: p_img1 },
  { name: "Sofabeds", image: p_img4 },
  { name: "L Shaped sofa", image: lshape },
  { name: "Ottoman", image: ottoman },
  { name: "Coming soon", image: p_img8 }
];

const TopCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/collection?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="bg-white max-w-screen-lg mx-auto">
      <div className="text-center text-xl py-1">
        <Title text1={"TOP"} text2={"CATEGORIES"} />
      </div>

      {/* FIX: Set correct width and remove unwanted extra space */}
      <div className="overflow-x-auto scrollbar-hide relative">
        <div className="flex gap-3 md:gap-12 snap-x snap-mandatory ml-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-3 rounded w-40 md:w-50 cursor-pointer snap-start"
              onClick={() => handleCategoryClick(category.name)}
            >
              {/* Outer Circle */}
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-full shadow-lg overflow-hidden flex items-center justify-center hover:border-2 hover:border-red-700 transition">
                {/* Inner Image (Zooms on Hover) */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                />
              </div>
              <p className="text-xs md:text-sm font-medium">{category.name}</p>
              <div className="text-red-700">
                <span className="block w-6 h-1 mx-auto bg-red-700 rounded-full"></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCategories;
