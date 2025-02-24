import React from 'react';
import Slider from 'react-slick';
import { assets } from '../assets/assets';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Hero = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-screen h-auto overflow-hidden"> {/* Full width & no scroll */}
      <Slider {...settings} className="w-full h-auto">
        <div className="w-screen h-auto">
          <img className="w-full h-auto object-cover" src={assets.hero_img_2} alt="Slide 2" />
        </div>
        <div className="w-screen h-auto">
          <img className="w-full h-auto object-cover" src={assets.hero_img_3} alt="Slide 3" />
        </div>
      </Slider>
    </div>
  );
};

export default Hero;
