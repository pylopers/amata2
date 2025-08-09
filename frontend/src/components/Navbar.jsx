import React, { useContext, useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

    const logout = () => {
        navigate('/login');
        localStorage.removeItem('token');
        setToken('');
        setCartItems({});
    };

    const [sofaExpanded, setSofaExpanded] = useState(false);

    // Effect to handle scrolling when sidebar is open
    useEffect(() => {
        if (visible) {
            document.body.classList.add('no-scroll'); // Disable scrolling
        } else {
            document.body.classList.remove('no-scroll'); // Enable scrolling
        }
    }, [visible]);

    return (
        <div className='bg-white flex items-center justify-between py-5 font-medium px-10 sm:px-16 lg:px-24'>
            <Link to='/'><img src={assets.logo} className='w-36' alt="" /></Link>

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

            <div className='flex items-center gap-6'>
                <img onClick={() => { setShowSearch(true); navigate('/collection'); }} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />
                <div className='group relative'>
                    <img onClick={() => token ? null : navigate('/login')} className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />
                    {token &&
                        <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-50'>
                            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                                <p className='cursor-pointer hover:text-black'>My Profile</p>
                                <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                                <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
                            </div>
                        </div>
                    }
                </div>
                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className='w-5 min-w-5' alt="" />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                </Link>
                <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
            </div>
            {/* Sidebar menu for small screens */}
            

            <div
        className={`
          fixed top-0 right-0 bottom-0 w-full max-w-[300px]
          bg-white transition-transform transform
          ${visible ? 'translate-x-0' : 'translate-x-full'} z-50
        `}
      >
        <div className="flex flex-col h-full">
          {/* Close button */}
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-2 p-4 cursor-pointer border-b"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="Close" />
            <span>Back</span>
          </div>

          {/* Sofa Cum Bed */}
          <NavLink
            to="/collection?category=Sofabeds"
            className={({ isActive }) =>
              `flex items-center justify-between px-6 py-4 border-b cursor-pointer
               ${isActive ? 'bg-gray-100 text-black' : 'text-gray-700'}`
            }
            onClick={() => setVisible(false)}
          >
            <span>SOFA CUM BED</span>
            <img src={assets.scb} className="w-16 h-12 object-cover rounded" alt="Sofa Cum Bed" />
          </NavLink>

          {/* Sofa main toggle */}
          <div
            onClick={() => setSofaExpanded(!sofaExpanded)}
            className="flex items-center justify-between px-6 py-4 border-b cursor-pointer text-gray-700"
          >
            <span>SOFA</span>
            <img src={assets.hero_img} className="w-16 h-12 object-cover rounded" alt="Sofa" />
          </div>

          {/* Nested Sofa Subcategories */}
          {sofaExpanded && (
            <div className="flex flex-col">
              <NavLink
                to="/collection?category=Sofa&capacity=3"
                className={({ isActive }) =>
                  `flex items-center justify-between px-8 py-3 border-b cursor-pointer
                   ${isActive ? 'bg-gray-100 text-black' : 'text-gray-700'}`
                }
                onClick={() => setVisible(false)}
              >
                <span>3 SEATER SOFA</span>
                <img src={assets.tseater} className="w-16 h-12 object-cover rounded" alt="3 Seater" />
              </NavLink>
              <NavLink
                to={`/collection?category=Sofa&capacity=${encodeURIComponent('3+2')}`}
                className={({ isActive }) =>
                  `flex items-center justify-between px-8 py-3 border-b cursor-pointer
                   ${isActive ? 'bg-gray-100 text-black' : 'text-gray-700'}`
                }
                onClick={() => setVisible(false)}
              >
                <span>3+2 SEATER SOFA</span>
                <img src={assets.tptwo} className="w-16 h-12 object-cover rounded" alt="3+2 Seater" />
              </NavLink>
              <NavLink
                to="/collection?category=Sofa&capacity=4"
                className={({ isActive }) =>
                  `flex items-center justify-between px-8 py-3 border-b cursor-pointer
                   ${isActive ? 'bg-gray-100 text-black' : 'text-gray-700'}`
                }
                onClick={() => setVisible(false)}
              >
                <span>4 SEATER SOFA</span>
                <img src={assets.s4s} className="w-16 h-12 object-cover rounded" alt="4 Seater" />
              </NavLink>
            </div>
          )}

          {/* Ottoman */}
          <NavLink
            to="/collection?category=Ottoman"
            className={({ isActive }) =>
              `flex items-center justify-between px-6 py-4 border-b cursor-pointer
               ${isActive ? 'bg-gray-100 text-black' : 'text-gray-700'}`
            }
            onClick={() => setVisible(false)}
          >
            <span>OTTOMAN</span>
            <img src={assets.ottoman} className="w-16 h-12 object-cover rounded" alt="Ottoman" />
          </NavLink>

          {/* (add more NavLink sections here as needed) */}
          <NavLink to='/contact' className='flex flex-col px-6 py-4 items-left gap-1 border-b border-gray-300'>
                    <p>CONTACT</p>
          </NavLink>

          <NavLink to='/about' className='flex flex-col px-6 py-4 items-left gap-1 border-b border-gray-300'>
                    <p>ABOUT</p>
                </NavLink>
        </div>
      </div>

      {/* Overlay */}
      {visible && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setVisible(false)}
        />
      )}
    </div>
    );
};

export default Navbar;
