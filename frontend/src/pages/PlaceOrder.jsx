import React, { useContext, useState, useEffect, useMemo } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Country, State, City } from 'country-state-city';

const PlaceOrder = () => {
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    allProducts
  } = useContext(ShopContext);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveAddressChecked, setSaveAddressChecked] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'India',
    phoneCode: '+91',
    phone: ''
  });

  const indianStates = useMemo(() => {
    return State.getStatesOfCountry('IN');
  }, []);

  
  useEffect(() => {
    const fetchSavedAddresses = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/user/saved-addresses`,
          { headers: { token } }
        );
        if (data.success) setSavedAddresses(data.savedAddresses);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load saved addresses.");
      }
    };
    fetchSavedAddresses();
  }, [backendUrl, token]);


  
  const onChangeHandler = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  

  
  const selectSavedAddress = index => {
    const addr = savedAddresses[index];
    setFormData({
      ...addr,
      country: 'India',
      phoneCode: '+91'
    });
    setUseSavedAddress(true);
  };
  

  
  const useNewAddress = () => {
    setUseSavedAddress(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: 'India',
      phoneCode: '+91',
      phone: ''
    });
    setSaveAddressChecked(false);
  };
  

  
  const handleStateChange = e => {
    setFormData(prev => ({
      ...prev,
      state: e.target.value,
      city: ''
    }));
  };

  const handleCityChange = e => {
    setFormData(prev => ({ ...prev, city: e.target.value }));
  };
  

  
  const handlePlaceOrder = async () => {
    if (!token) return toast.error("Please login to place an order.");

    const orderItems = Object.entries(cartItems)
      .filter(([_, qty]) => qty > 0)
      .map(([id, qty]) => {
        const p = allProducts.find(x => x._id === id);
        return p ? { ...p, quantity: qty } : null;
      })
      .filter(Boolean);

    if (!orderItems.length) return toast.error("Your cart is empty!");
    setLoading(true);

    if (!useSavedAddress && saveAddressChecked) {
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/user/save-address`,
          { address: formData },
          { headers: { token } }
        );
        if (data.success) {
          setSavedAddresses(data.savedAddresses);
          toast.success("Address saved!");
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to save address.");
      }
    }

    try {
      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      };
      const { data } = await axios.post(
        `${backendUrl}/api/order/razorpay`,
        orderData,
        { headers: { token } }
      );
      if (data.success) initPay(data.order);
      else toast.error(data.message);
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };
  

  
  const initPay = order => {
    if (!window.Razorpay) return toast.error("Razorpay SDK failed to load.");
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "AMATA",
      description: "Order Payment",
      order_id: order.id,
      handler: async response => {
        try {
          const verifyRes = await axios.post(
            `${backendUrl}/api/order/verifyRazorpay`,
            response,
            { headers: { token } }
          );
          if (verifyRes.data.success) {
            toast.success("Payment successful!");
            setCartItems({});
            localStorage.removeItem("cartItems");
            setTimeout(() => navigate('/orders'), 500);
          } else {
            toast.error("Payment verification failed!");
          }
        } catch {
          toast.error("Payment verification error!");
        }
      },
      modal: {
        ondismiss: async () => {
          try {
            await axios.post(
              `${backendUrl}/api/order/delete-pending`,
              { orderId: order.receipt },
              { headers: { token } }
            );
          } catch (err) {
            console.error("Failed to delete pending order", err);
          }
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        contact: formData.phone
      },
      theme: { color: "#000000" }
    };
    new window.Razorpay(options).open();
  };
  

  
  /*const citiesForState = formData.state
    ? City.getCitiesOfState('IN', indianStates.find(s => s.name === formData.state)?.isoCode)
    : [];*/
  

  return (
    <div className="p-10">
      <h2 className="text-xl font-semibold">Place Order Page (Functions Disabled)</h2>
    </div>
  );
};

export default PlaceOrder;
