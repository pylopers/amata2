import React from 'react';
import { Helmet } from 'react-helmet';
import Title from './Title';
import { useNavigate } from 'react-router-dom';

const NewsletterBox = () => {
  const navigate = useNavigate();

  // Helper to style “AMATA” with a red “A”
  const formatAmata = (text) =>
    text.replace(/AMATA/g, 'AM<span class="text-red-500">A</span>TA');

  // Single function to handle navigation & toggling via URL params
  const handleClick = ({ category, subCategory, capacity }) => {
    const params = new URLSearchParams();
    if (category)     params.append('category', category);
    if (subCategory)  params.append('subCategory', subCategory);
    if (capacity)     params.append('capacity', capacity);
    navigate(`/collection?${params.toString()}`);
  };

  const sections = [
    {
      title: 'Bedroom Furniture',
      args: { category: 'Furniture', subCategory: 'Bedroom' },
      text: `Transform your bedroom into a serene retreat with AMATA’s meticulously crafted bedroom furniture collection. Featuring robust solid wood bed frames, orthopedic memory foam mattresses, and elegant designer bedside tables, each piece is designed for maximum comfort and durability. Our range also includes upholstered headboards and storage benches, offering both style and functionality. Whether you prefer modern minimalism or classic elegance, AMATA’s bedroom furniture elevates your sleep sanctuary, ensuring restful nights and stylish mornings.`
    },
    {
      title: 'Living Room Furniture',
      args: { category: 'Furniture', subCategory: 'Livingroom' },
      text: `Redefine your living space with AMATA’s luxurious living room furniture range. From contemporary sofa sets with high-density foam cushions to sculptural lounge chairs and multifunctional center tables, our designs harmonize comfort and sophistication. Crafted with kiln-dried hardwood frames and upholstered in premium, stain-resistant fabrics, these pieces are built to withstand daily use while maintaining their refined aesthetic. Perfect for gatherings, relaxation, and entertainment, AMATA’s living room furniture creates an inviting atmosphere that reflects your personal style.`
    },
    {
      title: 'Sofa Beds',
      args: { category: 'Sofabeds' },
      text: `Optimize your living area with AMATA’s versatile sofa beds, ingeniously engineered for dual-purpose performance. Featuring smooth fold mechanisms, high-resilience foam cores, and sumptuous suede velvet upholstery, these convertible sofas transition seamlessly from elegant seating to a plush guest bed. Ideal for apartments and home offices doubling as guest rooms, AMATA sofa beds maximize space without compromising on comfort or design. Delight your visitors with a cozy night’s sleep and elevate your home’s versatility.`
    },
    {
      title: '3 Seater Sofa',
      args: { category: 'Sofa', capacity: '3' },
      text: `Experience spacious comfort with the AMATA 3-seater sofa, designed for modern living rooms and open-plan spaces. Its breathable fabric upholstery and plush cushioning provide a perfect balance of support and softness, while the solid wood frame ensures long-lasting stability. The sofa arrives preassembled except for the simple foot attachments, saving you time and effort. Available in a curated palette of contemporary hues, this sofa effortlessly complements any décor and becomes the centerpiece of your home’s social hub.`
    },
    {
      title: '4 Seater Sofa',
      args: { category: 'Sofa', capacity: '4' },
      text: `Indulge in family-sized luxury with the AMATA 4-seater sofa, crafted to accommodate larger gatherings and spacious interiors. With extra-deep seats, reinforced armrests, and premium-density foam, this sofa delivers unmatched comfort for movie nights, board games, or leisurely lounging. Preassembled for your convenience and offered in a selection of elegant fabrics, the 4-seater sofa is the epitome of style meeting practicality. Its generous proportions and refined craftsmanship make it an essential addition to expansive living rooms.`
    },
    {
      title: '2 Seater Ottoman',
      args: { category: 'Furniture', capacity: '2' },
      text: `Enhance your home with the multifunctional AMATA 2-seater ottoman, featuring a chic button-tufted design and a spacious, hidden storage compartment. Upholstered in durable, easy-to-clean fabric and supported by a sturdy wooden base, this ottoman serves as additional seating, a footrest, or a discreet repository for blankets, magazines, and more. Its compact yet generous footprint makes it perfect for entryways, bedrooms, or living rooms, adding a touch of sophistication while keeping clutter at bay.`
    }
  ];

  return (
    <div className="bg-white text-gray-800 px-6 py-8">
      {/* SEO meta tags */}
      <Helmet>
        <title>Shop Premium Sofas & Furniture Online | AMATA Living Space</title>
        <meta
          name="description"
          content="Discover AMATA’s premium handmade sofas and home furniture for modern Indian households. Luxury designs, factory-direct pricing, and fast nationwide delivery."
        />
      </Helmet>

      {/* Main Promotion */}
      <section aria-labelledby="shop-heading" className="mb-8">
        <h1 id="shop-heading" className="text-2xl font-bold mb-4">
          Shop{' '}
          <span
            dangerouslySetInnerHTML={{ __html: formatAmata('AMATA Living Space Online') }}
          />
        </h1>
        <p className="text-gray-600 mb-6">
          Discover AMATA’s premium handmade sofas and home furniture, crafted for modern living
          spaces. Our top-rated furniture collections—spanning luxury fabric sofas, wooden bed
          frames, and space-saving ottomans—combine comfort with contemporary style. Whether you’re
          furnishing a new home or upgrading your interiors, AMATA offers stylish, durable, and
          affordable pieces perfect for Indian households. Start your home makeover with
          factory-direct prices and nationwide delivery.
        </p>
      </section>

      {/* Newsletter Sections */}
      <nav aria-label="Product Categories" className="space-y-8">
        {sections.map((sec, i) => (
          <article
            key={i}
            className="border p-6 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleClick(sec.args)}
          >
            <h2 className="text-2xl font-semibold mb-4">
              <span
                dangerouslySetInnerHTML={{ __html: formatAmata(`AMATA ${sec.title}`) }}
              />
            </h2>
            <p className="text-gray-700 leading-relaxed">{sec.text}</p>
          </article>
        ))}
      </nav>
    </div>
  );
};

export default NewsletterBox;
