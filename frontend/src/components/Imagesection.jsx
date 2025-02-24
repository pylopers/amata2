import React from 'react';

const ImageSection = ({ image1, image2, link1, link2 }) => {
  return (
    <div className="mt-10 overflow-x-auto flex gap-4 px-4 scrollbar-hide sm:flex-nowrap sm:justify-center sm:items-center">
      {/* First Image Block */}
      <a href={link1} className="relative group flex-shrink-0 w-[80vw] sm:w-1/2">
        <img src={image1} alt="First Image" className="w-full rounded-lg" />
      </a>

      {/* Second Image Block */}
      <a href={link2} className="relative group flex-shrink-0 w-[80vw] sm:w-1/2">
        <img src={image2} alt="Second Image" className="w-full rounded-lg" />
      </a>
    </div>
  );
};

export default ImageSection;
