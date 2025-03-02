import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); 
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // 🛒 Add to Cart (Fixed)
  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);

    // ✅ Properly increment or initialize item quantity
    cartData[itemId] = (cartData[itemId] || 0) + 1;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // 📊 Get Total Items in Cart (Fixed)
  const getCartCount = () => {
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
  };

  // 🔄 Update Item Quantity in Cart
  const updateQuantity = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // 💰 Get Total Cart Amount (Fixed)
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      let itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo) {
        totalAmount += itemInfo.price * cartItems[itemId];
      }
    }
    return totalAmount;
  };

  // 📦 Fetch Product List
  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        const all = response.data.products.reverse();
        const main = all.filter((product) => product.mainProduct === true);

        setAllProducts(all); // ✅ Store all products
        setProducts(main); // ✅ Store only main products
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // 🛍️ Fetch User's Cart from Backend
  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ⏳ Load Products on Mount
  useEffect(() => {
    getProductsData();
  }, []);

  // 🔑 Load User Cart if Token Exists
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!token && storedToken) {
      setToken(storedToken);
      getUserCart(storedToken);
    }
    if (token) {
      getUserCart(token);
    }
  }, [token]);

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

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
