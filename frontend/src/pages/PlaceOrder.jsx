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
  

  const [citiesForState, setCitiesForState] = useState([]);
  useEffect(() => {
    if (!formData.state) {
      setCitiesForState([]);
      return;
    }
    const stateObj = indianStates.find(s => s.name === formData.state);
    if (stateObj) {
      const cities = City.getCitiesOfState('IN', stateObj.isoCode);
      setCitiesForState(cities);
    } else {
      setCitiesForState([]);
    }
  }, [formData.state, indianStates]);

  
  /*const citiesForState = useMemo(() => {
    if (!formData.state) return [];
    const stateObj = indianStates.find(s => s.name === formData.state);
    return stateObj
      ? City.getCitiesOfState('IN', stateObj.isoCode)
      : [];
  }, [formData.state, indianStates]);*/
  

  return (
        <form
      onSubmit={e => e.preventDefault()}
      className="ml-4 pr-4 sm:ml-10 flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      <div className="flex flex-col gap-4 w-full sm:max-w-[720px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1="DELIVERY" text2="INFORMATION" />
        </div>

        {/* Saved Addresses */}
        <div>
          <h3 className="text-lg font-semibold">Saved Addresses</h3>
          {savedAddresses.length === 0 ? (
            <p className="italic text-gray-500">No saved addresses</p>
          ) : (
            savedAddresses.map((addr, i) => (
              <div key={i} className="border p-2 mb-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="savedAddress"
                    className="mr-2"
                    checked={
                      useSavedAddress &&
                      formData.street === addr.street &&
                      formData.zipcode === addr.zipcode
                    }
                    onChange={() => selectSavedAddress(i)}
                  />
                  <span className="font-bold">
                    {addr.firstName} {addr.lastName}
                  </span>
                </label>
                <p>
                  {addr.street}, {addr.city}, {addr.state}, {addr.zipcode}
                </p>
              </div>
            ))
          )}
          {useSavedAddress && savedAddresses.length > 0 && (
            <button
              type="button"
              onClick={useNewAddress}
              className="text-blue-500"
            >
              Use a new address
            </button>
          )}
        </div>

        {/* New / Edited Address */}
        {!useSavedAddress && (
          <>
            <div className="flex gap-3">
              <input
                required
                name="firstName"
                onChange={onChangeHandler}
                value={formData.firstName}
                className="border rounded py-1.5 px-4 w-full"
                type="text"
                placeholder="First name"
              />
              <input
                required
                name="lastName"
                onChange={onChangeHandler}
                value={formData.lastName}
                className="border rounded py-1.5 px-4 w-full"
                type="text"
                placeholder="Last name"
              />
            </div>

            <input
              required
              name="email"
              onChange={onChangeHandler}
              value={formData.email}
              className="border rounded py-1.5 px-4 w-full"
              type="email"
              placeholder="Email address"
            />

            <input
              required
                name="street"
                onChange={onChangeHandler}
                value={formData.street}
                className="border rounded py-1.5 px-4 w-full"
                type="text"
                placeholder="Street"
            />

            {/* Country (fixed to India) */}
            <select
              value="India"
              disabled
              className="border rounded py-1.5 px-4 w-full bg-gray-100"
            >
              <option>India</option>
            </select>

            {/* State */}
            <select
              required
              name="state"
              value={formData.state}
              onChange={handleStateChange}
              className="border rounded py-1.5 px-4 w-full"
            >
              <option value="">Select State</option>
              {indianStates.map(s => (
                <option key={s.isoCode} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* City */}
            {formData.state && (
  <select
    required
    name="city"
    value={formData.city}
    onChange={handleCityChange}
    className="border rounded py-1.5 px-4 w-full"
  >
    <option value="">Select City</option>
    {citiesForState.map(c => (
      <option key={c.isoCode} value={c.name}>
        {c.name}
      </option>
    ))}
  </select>
)}


            <input
              required
              name="zipcode"
              onChange={onChangeHandler}
              value={formData.zipcode}
              className="border rounded py-1.5 px-4 w-full"
              type="text"
              placeholder="Zip Code"
            />

            {/* Phone with prefix */}
            <div className="flex">
              <input
                readOnly
                value={formData.phoneCode}
                className="border rounded-l py-1.5 px-4 w-20 bg-gray-100"
              />
              <input
                required
                name="phone"
                onChange={onChangeHandler}
                value={formData.phone}
                className="border-t border-b border-r rounded-r py-1.5 px-4 flex-1"
                type="tel"
                placeholder="Phone Number"
              />
            </div>

            {/* NEW: Save this address */}
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                id="saveAddress"
                checked={saveAddressChecked}
                onChange={() => setSaveAddressChecked(prev => !prev)}
                className="mr-2"
              />
              <label htmlFor="saveAddress" className="text-sm">
                Save this address
              </label>
            </div>
          </>
        )}
      </div>

      <div className="ml-4 pr-4 mt-8 sm:mr-10">
        <CartTotal />
        <div className="w-full text-end mt-8">
          <button
            type="button"
            onClick={handlePlaceOrder}
            className="bg-black text-white px-16 py-3 text-sm"
            disabled={loading}
          >
            {loading ? "Processing..." : "PLACE ORDER"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
