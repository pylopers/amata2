import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({ category, subCategory }) => {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice()
                .filter((item) => category === item.category)
                .filter((item) => subCategory === item.subCategory);

            setRelated(productsCopy.slice(0, 5));
        }
    }, [products]);

    return (
        <div className="my-2">
            <div className="text-center text-xl py-2">
                <Title text1={'RELATED'} text2={'PRODUCTS'} />
            </div>

            {/* Conditional Layout: Square if one product, Grid otherwise */}
            <div 
                className={`ml-8 gap-4 gap-y-6 ${
                    related.length === 1 
                        ? "flex justify-center items-center h-[250px]" 
                        : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                }`}
            >
                {related.map((item, index) => (
                    <div 
                        key={index} 
                        className={`${related.length === 1 ? "w-[250px] h-[250px]" : ""}`}
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
