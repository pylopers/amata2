import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({ category, subCategory }) => {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            let filteredProducts = products.filter(
                (item) => category === item.category && subCategory === item.subCategory
            );

            setRelated(filteredProducts.slice(0, 5));
        }
    }, [products]);

    return (
        <div className="my-2">
            <div className="text-center text-xl py-2">
                <Title text1={'RELATED'} text2={'PRODUCTS'} />
            </div>

            {/* Conditional Layout: Single Product Centered, Multiple in Grid */}
            <div 
                className={`ml-8 gap-4 gap-y-6 ${
                    related.length === 1 
                        ? "flex justify-center items-center" 
                        : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                }`}
            >
                {related.map((item, index) => (
                    <div 
                        key={index} 
                        className="w-[250px] h-[250px] flex justify-center items-center"
                    >
                        <ProductItem 
                            id={item._id} 
                            name={item.name} 
                            price={item.price} 
                            image={item.image} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
