import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        const bestProduct = products.filter((item) => item.bestseller);
        setBestSeller(bestProduct.slice(0, 5));
    }, [products]);

    return (
        <div className='mt-4'>
            <div className='text-center text-3xl'>
                <Title text1={'BEST'} text2={'SELLERS'} />
                <p className='w-3/4 m-auto text-xs sm:text-lg md:text-lg lg:text-xl text-gray-600 font-bold'>
                    Jump into our exciting and fabulous AM<span className="text-red-500">A</span>TA Bestsellers – because dull homes are definitely not our style!
                </p>
            </div>

            {/* Scrollable on Mobile, Grid on Larger Screens */}
            <div className="md:grid md:grid-cols-4 lg:grid-cols-5 gap-4 flex space-x-4 overflow-x-auto scrollbar-hide px-4">
                {bestSeller.map((item, index) => (
                    <div 
                    key={index} 
                    className="w-[90vw] h-auto min-h-[400px] max-w-[250px] max-h-[450px] md:w-full md:h-auto flex-shrink-0"
                >
                        <ProductItem 
                            id={item._id} 
                            name={item.name} 
                            thumbnail={item.thumbnail} 
                            image={item.image} 
                            price={item.price} 
                            originalPrice={item.originalPrice}
                            averageRating={item.averageRating}
                            features={item.features} 
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BestSeller;
