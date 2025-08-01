import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { useLocation } from 'react-router-dom';

const Collection = () => {
  const location = useLocation();
  const { products, search, showSearch } = useContext(ShopContext);

  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [capacity, setCapacity] = useState([]);
  const [sortType, setSortType] = useState('relevant');

  // Sync filters with URL query params on location change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam    = params.get('category');
    const subCategoryParam = params.get('subCategory');
    const capacityParams   = params.getAll('capacity');

    setCategory(categoryParam ? [categoryParam] : []);
    setSubCategory(subCategoryParam ? [subCategoryParam] : []);
    setCapacity(capacityParams);
  }, [location.search]);

  // Toggle handlers
  const toggleCategory = e => {
    const val = e.target.value;
    setCategory(prev =>
      prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]
    );
  };

  const toggleSubCategory = e => {
    const val = e.target.value;
    setSubCategory(prev =>
      prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]
    );
  };

  const toggleCapacity = e => {
    const val = e.target.value;
    setCapacity(prev =>
      prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]
    );
  };

  // Filter logic
  const applyFilter = () => {
    let result = [...products];

    if (showSearch && search) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category.length) {
      result = result.filter(item => category.includes(item.category));
    }
    if (subCategory.length) {
      result = result.filter(item => subCategory.includes(item.subCategory));
    }
    if (category.includes('Sofa') && capacity.length) {
      result = result.filter(item => capacity.includes(String(item.seatingCapacity)));
    }

    setFilterProducts(result);
  };

  // Sort logic
  const sortProducts = () => {
    let sorted = [...filterProducts];
    if (sortType === 'low-high') sorted.sort((a, b) => a.price - b.price);
    else if (sortType === 'high-low') sorted.sort((a, b) => b.price - a.price);
    setFilterProducts(sorted);
  };

  // Effects to re-run filter/sort
  useEffect(applyFilter, [category, subCategory, search, showSearch, products, capacity]);
  useEffect(sortProducts, [sortType]);

  return (
    <div className="px-6 flex flex-col sm:flex-row gap-6 pt-10 border-t">

      {/* Filters Sidebar */}
      <aside className="min-w-[240px]">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="w-full text-left text-xl font-medium mb-4 flex items-center justify-between"
        >
          FILTERS
          <img
            src={assets.dropdown_icon}
            alt="Toggle filters"
            className={`h-4 transition-transform ${showFilter ? 'rotate-90' : ''}`}
          />
        </button>

        <div className={`${showFilter ? '' : 'hidden'} sm:block space-y-6`}>

          {/* Category */}
          <div className="border p-4 rounded">
            <p className="text-sm font-semibold mb-2">CATEGORIES</p>
            {['Sofa','Sofabeds','L Shaped sofa','Ottoman'].map(cat => ( 
              <label key={cat} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={cat}
                  checked={category.includes(cat)}
                  onChange={toggleCategory}
                  className="w-4 h-4"
                />
                {cat}
              </label>
            ))}
          </div>

          {/* Sub-Category */}
          <div className="border p-4 rounded">
            <p className="text-sm font-semibold mb-2">TYPE</p>
            {['Living room','Bedroom'].map(sub => (
              <label key={sub} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={sub}
                  checked={subCategory.includes(sub)}
                  onChange={toggleSubCategory}
                  className="w-4 h-4"
                />
                {sub === 'Living room' ? 'Living Room' : 'Bedroom'}
              </label>
            ))}
          </div>

          {/* Seating Capacity (only when Sofa selected) */}
          {category.includes('Sofa') && (
            <div className="border p-4 rounded">
              <p className="text-sm font-semibold mb-2">SEATING CAPACITY</p>
              {['2','3','3+2','4','5+'].map(cap => (
                <label key={cap} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    value={cap}
                    checked={capacity.includes(cap)}
                    onChange={toggleCapacity}
                    className="w-4 h-4"
                  />
                  {cap === '5+' ? '5 or more seats' : `${cap} Seater`}
                </label>
              ))}
            </div>
          )}

        </div>
      </aside>

      {/* Products Area */}
      <main className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <Title text1="ALL" text2="COLLECTIONS" />
          <select
            value={sortType}
            onChange={e => setSortType(e.target.value)}
            className="border px-3 py-1 text-sm"
          >
            <option value="relevant">Sort: Relevant</option>
            <option value="low-high">Sort: Price Low–High</option>
            <option value="high-low">Sort: Price High–Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filterProducts.map((item, idx) => (
            <ProductItem
              key={item._id || idx}
              id={item._id}
              name={item.name}
              price={item.price}
              thumbnail={item.thumbnail}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Collection;
