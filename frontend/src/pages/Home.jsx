import React from 'react'
import Hero from '../components/Hero'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
import TopCategories from '../components/Category'
import ShopByRoom from '../components/ShopbyRoom'
import ImageSection from '../components/Imagesection'
import { assets } from '../assets/assets'

const Home = () => {
  return (
    <div>
      <Hero />
      <OurPolicy/>
      <TopCategories/>
      <ImageSection 
        image1={assets.pm1} 
        image2={assets.pm2} 
      />
      <ShopByRoom/>
      <BestSeller/>
      <ImageSection 
        image1={assets.pm3} 
        image2={assets.pm4} 
      />
      <NewsletterBox/>
    </div>
  )
}

export default Home
