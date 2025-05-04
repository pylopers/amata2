import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [sofaExpanded, setSofaExpanded] = useState(false);
  const { setShowSearch, getCartCount, token, setToken, setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
    setVisible(false);
    navigate('/login');
  };

  // Disable body scroll when sidebar is open
  useEffect(() => {
    document.body.classList.toggle('no-scroll', visible);
  }, [visible]);

  // Universal click handler for sidebar items
  const handleClick = ({ category, subCategory, capacity }) => {
    const params = new URLSearchParams();
    if (category)    params.append('category', category);
    if (subCategory) params.append('subCategory', subCategory);
    if (capacity)    params.append('capacity', capacity);
    setVisible(false);
    navigate(`/collection?${params.toString()}`);
  };

  return (
    <nav className='bg-white flex items-center justify-between py-5 px-10 sm:px-16 lg:px-24 font-medium'>
      {/* Logo */}
      <Link to='/'><img src={assets.logo} className='w-36' alt='Logo' /></Link>

      {/* Desktop nav links */}
      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
          <p>COLLECTION</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>ABOUT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
      </ul>

      {/* Icons & Mobile menu button */}
      <div className='flex items-center gap-6'>
        <img
          onClick={() => { setShowSearch(true); navigate('/collection'); }}
          src={assets.search_icon}
          className='w-5 cursor-pointer'
          alt='Search'
        />

        <div className='relative group'>
          <img
            onClick={() => token ? null : navigate('/login')}
            src={assets.profile_icon}
            className='w-5 cursor-pointer'
            alt='Profile'
          />
          {token && (
            <div className='group-hover:block hidden absolute right-0 pt-4 z-50'>
              <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                <p className='cursor-pointer hover:text-black'>My Profile</p>
                <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
              </div>
            </div>
          )}
        </div>

        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5' alt='Cart' />
          <span className='absolute -right-1 -bottom-1 w-4 h-4 text-[8px] text-center leading-4 bg-black text-white rounded-full'>
            {getCartCount()}
          </span>
        </Link>

        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className='w-5 cursor-pointer sm:hidden'
          alt='Menu'
        />
      </div>

      {/* Sidebar for small screens */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white z-50 transform transition-transform 
          ${visible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Back Button */}
        <div
          onClick={() => setVisible(false)}
          className='flex items-center gap-3 p-4 border-b cursor-pointer'
        >
          <img src={assets.dropdown_icon} alt='Back' className='h-4 rotate-180' />
          <span>Back</span>
        </div>

        <div className='flex flex-col'>
          {/* Sofa Cum Bed */}
          <div
            onClick={() => handleClick({ category: 'Sofabeds' })}
            className='flex justify-between items-center px-6 py-4 border-b cursor-pointer text-gray-700 hover:bg-gray-100'
          >
            <span>SOFA CUM BED</span>
            <img src={assets.scb} alt='Sofa Cum Bed' className='w-16 h-12 rounded object-cover' />
          </div>

          {/* Sofa Main Toggle */}
          <div
            onClick={() => setSofaExpanded(!sofaExpanded)}
            className='flex justify-between items-center px-6 py-4 border-b cursor-pointer text-gray-700 hover:bg-gray-100'
          >
            <span>SOFA</span>
            <img src={assets.hero_img} alt='Sofa' className='w-16 h-12 rounded object-cover' />
          </div>

          {/* Nested Sofa Subcategories */}
          {sofaExpanded && (
            <>
              <div
                onClick={() => handleClick({ category: 'Sofa', capacity: '3' })}
                className='flex justify-between items-center px-8 py-3 border-b cursor-pointer text-gray-700 hover:bg-gray-100'
              >
                <span>3 SEATER SOFA</span>
                <img src={assets.tseater} alt='3 Seater' className='w-16 h-12 rounded object-cover' />
              </div>

              <div
                onClick={() => handleClick({ category: 'Sofa', capacity: '5+' })}
                className='flex justify-between items-center px-8 py-3 border-b cursor-pointer text-gray-700 hover:bg-gray-100'
              >
                <span>3+2 SEATER SOFA</span>
                <img src={assets.tptwo} alt='3+2 Seater' className='w-16 h-12 rounded object-cover' />
              </div>

              <div
                onClick={() => handleClick({ category: 'Sofa', capacity: '4' })}
                className='flex justify-between items-center px-8 py-3 border-b cursor-pointer text-gray-700 hover:bg-gray-100'
              >
                <span>4 SEATER SOFA</span>
                <img src={assets.s4s} alt='4 Seater' className='w-16 h-12 rounded object-cover' />
              </div>
            </>
          )}

          {/* Ottoman */}
          <div
            onClick={() => handleClick({ category: 'Furniture', subCategory: 'Ottoman', capacity: '2' })}
            className='flex justify-between items-center px-6 py-4 border-b cursor-pointer text-gray-700 hover:bg-gray-100'
          >
            <span>OTTOMAN</span>
            <img src={assets.ottoman} alt='Ottoman' className='w-16 h-12 rounded object-cover' />
          </div>
        </div>
      </div>

      {/* Overlay to close sidebar */}
      {visible && (
        <div
          className='fixed inset-0 bg-black opacity-50 z-40'
          onClick={() => setVisible(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
