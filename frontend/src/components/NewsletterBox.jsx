import React from 'react';
import Title from './Title';

const NewsletterBox = () => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
  };

  // Helper function to style "AMATA" with a red middle A
  const formatAmata = (text) =>
    text.replace(
      /AMATA/g,
      'AM<span class="text-red-500">A</span>TA'
    );

  return (
    <div className='bg-white text-center p-6'>
      {/* Company Info Section */}
      <div className='text-left font-bold space-y-8'>
        {[
          {
            title1: "Shop",
            title2: "AMATA LIVING SPACE ONLINE",
            text: "AMATA’s stylish furniture is trendy, fun, and fabulous, all at a great price. Below, we’ve highlighted our top-rated pieces (four stars and above!) that are perfect for giving your space a fresh new look. Whether you’re after a new sofa, bed, bedside table, an upgraded work-from-bed setup, or anything in between, you’ll find it right here. Happy shopping!"
          },
          {
            title1: "Shop",
            title2: "AMATA Bedroom Furniture Online",
            text: "Our complete bedroom furniture collection has everything you need to create your dream sleep sanctuary, from sleek bed frames and mattresses to comforters and decorative pieces like bedside tables. Moving to a new home or looking to upgrade your living space? You’ve come to the right place. We’ve simplified the process by offering bedroom essentials such as beds, bedside tables, and upholstery, so you can skip the hassle of finding coordinating sets. Select a bed frame that fits seamlessly into your room, then pick a mattress and pillow that match your comfort needs and lifestyle. We provide high-quality bedroom furniture, from solid wood beds to luxury orthopedic memory foam mattresses. In addition to bedroom furniture, we offer designs that cater to every style and requirement. And if you're looking for something exceptional, our sofas are truly top-notch!"
          },
          {
            title1: "Shop",
            title2: "AMATA living room furniture",
            text: "Your living room furniture sets the vibe for the entire home. If you’re into modern style and comfort, this is a page you’ll want to keep handy. Our sofas come in a range of colors to suit your personal taste. Built with solid wood, they’re designed for strength and long-lasting durability.<br/> The living room is where you relax, cuddle, socialize, play, and enjoy your favorite shows and movies. Our sofas are crafted to fit your space, offer maximum comfort, and highlight your unique style."
          },
          {
            title1: "Buy",
            title2: "AMATA sofa beds",
            text: "The smart combination of suede velvet fabric and foldable sections offers a variety of configurations. This folding foam mattress functions as both a sleeper and a sofa, providing comfortable seating while also serving as a convenient guest mattress. Impress your guests with pride!"
          },
          {
            title1: "Shop",
            title2: "AMATA 3 seater sofa",
            text: "Cozy Soft Side – Crafted to offer the soft support you need and the plush comfort you love. No assembly required as the product arrives preassembled (only the feet need to be attached by the customer)."
          },
          {
            title1: "Shop",
            title2: "AMATA 4 seater sofa",
            text: "Cozy Soft Side – Crafted to offer the perfect balance of soft support and plush comfort for ultimate relaxation. No assembly required as the product arrives preassembled."
          },
          {
            title1: "Shop",
            title2: "AMATA 2 seater ottoman",
            text: "The button-tufted design adds a sophisticated touch to this space-saving and modern ottoman. LARGE STORAGE SPACE: The spacious interior offers plenty of storage options to hide clutter."
          }
        ].map((item, index) => (
          <div key={index}>
            <Title
              text1={item.title1}
              text2={
                <span
                  dangerouslySetInnerHTML={{
                    __html: formatAmata(item.title2)
                  }}
                />
              }
            />
            <p
              className='text-gray-600 mt-2 text-sm'
              dangerouslySetInnerHTML={{
                __html: formatAmata(item.text)
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsletterBox;
