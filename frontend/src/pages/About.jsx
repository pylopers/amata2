import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div className='ml-4 mr-4'>

      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img
          className='w-full md:max-w-[450px]'
          src={assets.pm4}
          alt="AMATA sofas"
        />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>
            AMATA was founded with a singular focus: to craft the finest sofas that blend timeless design,
            exceptional comfort, and unbeatable quality. From our humble beginnings, we've been dedicated
            to elevating living spaces with furniture that stands the test of time.
          </p>
          <p>
            Every piece in our collection is thoughtfully designed and handcrafted by skilled artisans
            who share our passion for excellence. We source premium materials—from sustainably harvested
            hardwood frames to lush, high-density foams and top-grain leathers—ensuring that each sofa
            offers both lasting durability and unparalleled comfort.
          </p>
          <b className='text-gray-800'>Our Mission</b>
          <p>
            At AMATA, our mission is to bring your dream living room to life. We strive to create sofas
            that not only look stunning but also provide a haven of relaxation for your home. By combining
            innovative design with meticulous craftsmanship, we aim to exceed expectations and build lasting
            relationships with customers who value quality as much as we do.
          </p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20 gap-6'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Expert Craftsmanship:</b>
          <p className='text-gray-600'>
            Each AMATA sofa is built by experienced artisans who pay attention to every detail—from frame construction
            to stitch work—so you receive a piece that’s as durable as it is beautiful.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Comfort & Durability:</b>
          <p className='text-gray-600'>
            We use only premium, high-density foams and top-grade upholstery fabrics or leathers to ensure your sofa
            feels luxuriously comfortable while standing up to everyday use for years to come.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Custom Design Options:</b>
          <p className='text-gray-600'>
            Choose from a wide range of fabrics, finishes, and configurations—or work with our design team
            to create a one-of-a-kind sofa that perfectly complements your style and space.
          </p>
        </div>
      </div>

      <NewsletterBox />

    </div>
  )
}

export default About
