import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 0;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // 🛒 Add to Cart (Optimized)
  const addToCart = async (itemId, quantity = 1) => {
    let updatedCart = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + quantity };
    setCartItems(updatedCart);
  
    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/add`, { itemId, quantity }, { headers: { token } });
      } catch (error) {
        console.error(error);
        toast.error("Failed to update cart.");
        setCartItems(cartItems); // Rollback on failure
      }
    }
  };
  

  // 🔄 Update Item Quantity in Cart (Optimized)
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 0) return; // Allow zero but prevent negative

    let updatedCart = { ...cartItems };
    if (quantity === 0) {
        delete updatedCart[itemId]; // Remove item from cart
    } else {
        updatedCart[itemId] = quantity;
    }
    setCartItems(updatedCart);

    if (token) {
        try {
            await axios.post(`${backendUrl}/api/cart/update`, { itemId, quantity }, { headers: { token } });
        } catch (error) {
            console.error(error);
            toast.error("Failed to update quantity.");
            setCartItems(cartItems); // Rollback on failure
        }
    }
};

  // 📊 Get Total Items in Cart
  const getCartCount = () => {
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
  };

  // 💰 Get Total Cart Amount (Fixed)
  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
      const product = allProducts.find((p) => String(p._id) === String(itemId));
      return product ? total + product.price * quantity : total;
    }, 0);
  };

  // 📦 Fetch Product List
  const getProductsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/all`);
      if (response.data.success) {
        const all = response.data.products.reverse();
        setAllProducts(all);
        setProducts(all.filter((p) => p.mainProduct));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load products.");
    }
  };

  // 🛍️ Fetch User's Cart
  const getUserCart = async (storedToken) => {
    try {
      const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token: storedToken } });
      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load cart.");
    }
  };

  // ⏳ Load Products on Mount
  useEffect(() => {
    getProductsData();
  }, []);

  // 🔑 Load User Cart if Token Exists
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      getUserCart(storedToken);
    }
  }, []);

  // 📌 Context Values
  const value = {
    products,
    allProducts,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
