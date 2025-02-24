import React, { useState } from 'react'
import { assets } from '../assets/assets'
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const OurPolicy = () => {
    const [hasCounted, setHasCounted] = useState(false);
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });

    return (
        <div className='grid grid-cols-3 md:grid-cols-3 gap-26 text-center py-5 text-xs sm:text-sm md:text-base text-gray-700'>
            <div>
                <img src={assets.quality_icon} className='mt-2 w-12 m-auto mb-3' alt="" />
                <p className='font-semibold'>100% Assured Quality</p>
            </div>

            <div>
                <img src={assets.fshipping_icon} className='w-24 m-auto mb-4' alt="" />
                <p className='font-semibold'>Free Shipping</p>
            </div>

            <div>
                <img src={assets.return_icon} className='w-14 m-auto mb-2.5 md:mb-2' alt="" />
                <p className='font-semibold'>Easy Return policy</p>
            </div>
        </div>
    )
}

export default OurPolicy;
