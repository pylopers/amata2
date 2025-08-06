import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { FaStar, FaCheckCircle } from "react-icons/fa";

const ProductItem = ({ id, thumbnail, name, price, originalPrice, averageRating, features }) => {
    
    const { currency } = useContext(ShopContext);

    const rating = averageRating ? Math.round(averageRating) : 0;
    let featureList = [];

    if (Array.isArray(features)) {
        featureList = features;
    } else if (typeof features === "string") {
        try {
            featureList = JSON.parse(features);
        } catch {
            featureList = features.split(",").map(f => f.trim());
        }
    }

    return (
        // 1) Add `group` here
        <Link
          onClick={() => scrollTo(0, 0)}
          className="group cursor-pointer block w-full text-gray-700"
          to={`/product/${id}`}
        >
            {/* Product Image with hover-zoom */}
            <div
              className="
                aspect-[1/1]
                rounded-[10px]
                overflow-hidden
                transform             /* enable transforms */
                transition-transform  /* animate transforms */
                duration-300          /* 300ms animation */
                group-hover:scale-105 /* scale up on group hover */
              "
            >
                <img
                  className="w-full h-full object-fill"
                  src={thumbnail}
                  alt={name}
                />
            </div>

            {/* Product Title */}
            <p className="mt-3 text-sm font-semibold">{name}</p>

            {/* Star Rating */}
            <div className="flex text-orange-500 mt-1">
                {rating > 0
                  ? Array.from({ length: rating }).map((_, i) => <FaStar key={i} />)
                  : <p className="text-gray-500 text-xs">No ratings yet</p>
                }
            </div>

            {/* Price Section */}
            <div className="flex items-center space-x-2 mt-1">
                <p className="text-md font-bold">{currency}{price}</p>
                {originalPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    {currency}{originalPrice}
                  </p>
                )}
            </div>

            {/* Features List */}
            {featureList.length > 0 && (
                <ul className="mt-2 text-sm text-gray-600">
                    {featureList.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                            <FaCheckCircle className="text-orange-500" />
                            {feature}
                        </li>
                    ))}
                </ul>
            )}
        </Link>
    );
};

export default ProductItem;
