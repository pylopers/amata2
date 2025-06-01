import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className="bg-white text-black w-full">
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-0 text-sm p-10'>

        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="" />
            <p className='w-full md:w-2/3 text-black'>
            Elevate your living space with AMATA’s factory‑direct modern sofa designs, luxury sectional sofas, and bespoke couches—built on sturdy hardwood frames and upholstered in premium leather, velvet, or performance fabrics. Enjoy fully customizable options from ergonomic recliners and convertible sofa beds to modular sectional sets, all backed by flexible warranties, free design consultations, and fast nationwide delivery. Discover competitive pricing on handcrafted loveseats and custom upholstery services that blend functionality, comfort, and timeless elegance.</p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-black'>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/about'>About us</Link></li>
                <li><Link to='/delivery'>Delivery</Link></li>
                <li><Link to="/privacypolicy">Privacy policy</Link></li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-black'>
                <li>+91 89289 37345</li>
                <li>contact@sahilbhaizindabaad.com</li>
            </ul>
        </div>

      </div>

      <div>
        <hr className="border-gray-600" />
        <p className='py-5 text-sm text-center text-black'>Copyright 2025 @amata.com - All Right Reserved.</p>
      </div>

    </div>
  )
}

export default Footer
