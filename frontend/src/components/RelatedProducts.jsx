import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';



const RelatedProducts = ({category,subCategory}) => {

    const { products } = useContext(ShopContext);
    const [related,setRelated] = useState([]);

    useEffect(()=>{

        if (products.length > 0) {
            
            let productsCopy = products.slice();
            
            productsCopy = productsCopy.filter((item) => category === item.category);
            productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);

            setRelated(productsCopy.slice(0,5));
        }
        
    },[products])

  return (
    <div className=''>
            <div className='text-center text-3xl'>
                <Title text1={'Related'} text2={'Products'} />
            </div>

            {/* Scrollable on Mobile, Grid on Larger Screens */}
            <div className="md:grid md:grid-cols-4 lg:grid-cols-5 gap-4 flex space-x-4 overflow-x-auto scrollbar-hide px-4">
                {related.map((item, index) => (
                    <div 
                    key={index} 
                    className="w-[90vw] h-auto min-h-[400px] max-w-[250px] max-h-[450px] md:w-full md:h-auto flex-shrink-0"
                >
                        <ProductItem 
                            id={item._id} 
                            name={item.name} 
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
}

export default RelatedProducts
