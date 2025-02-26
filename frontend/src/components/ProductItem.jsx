import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { FaStar, FaCheckCircle } from "react-icons/fa";

const ProductItem = ({ id, image, name, price, originalPrice, averageRating, features }) => {
    
    const { currency } = useContext(ShopContext);

    // ⭐ Ensure averageRating is a valid number
    const rating = averageRating ? Math.round(averageRating) : 0;

    // ✅ Fix Features: Ensure it is a valid array
    let featureList = [];
    if (Array.isArray(features)) {
        featureList = features;
        console.log("Product Features for:", name, features); // Already an array, use it directly
    } else if (typeof features === "string") {
        try {
            featureList = JSON.parse(features);
            
        console.log(featureList) // If stored as JSON string, parse it
        } catch {
            featureList = features.split(",").map((f) => f.trim()); // If comma-separated, split it
        }
    }

    return (
        <Link onClick={() => scrollTo(0, 0)} className="text-gray-700 cursor-pointer block w-full" to={`/product/${id}`}>
            {/* Product Image */}
            <div className="rounded-lg shadow-md">
                <img className="hover:scale-105 transition-transform ease-in-out duration-300 w-full h-[250px] object-cover" src={image[0]} alt={name} />
            </div>

            {/* Product Title */}
            <p className="mt-3 text-sm font-semibold">{name}</p>

            {/* Star Rating */}
            <div className="flex text-orange-500 mt-1">
                {rating > 0 ? (
                    Array.from({ length: rating }).map((_, index) => (
                        <FaStar key={index} />
                    ))
                ) : (
                    <p className="text-gray-500 text-xs">No ratings yet</p>
                )}
            </div>

            {/* Price Section */}
            <div className="flex items-center space-x-2 mt-1">
                <p className="text-md font-bold">{currency}{price}</p>
                {originalPrice && <p className="text-sm text-gray-500 line-through">{currency}{originalPrice}</p>}
            </div>

            {/* Features List (✅ Fixed) */}
            {featureList.length > 0 && (
                <ul className="mt-2 text-sm text-gray-600">
                    {featureList.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
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
