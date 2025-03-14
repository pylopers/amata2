import React, { useContext, useState, useEffect } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, allProducts } = useContext(ShopContext);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [useSavedAddress, setUseSavedAddress] = useState(false);
    const [saveAddress, setSaveAddress] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    });

    // Fetch saved addresses
    useEffect(() => {
        const fetchSavedAddresses = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/user/saved-addresses`, { headers: { token } });
                if (data.success) setSavedAddresses(data.savedAddresses);
            } catch (error) {
                toast.error("Failed to load saved addresses.");
            }
        };
        fetchSavedAddresses();
    }, [backendUrl, token]);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setFormData((data) => ({ ...data, [name]: value }));
    };

    const selectSavedAddress = (index) => {
        setFormData(savedAddresses[index]);
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
            country: '',
            phone: ''
        });
    };

    const handlePlaceOrder = async () => {
        if (!token) {
            toast.error("Please login to place an order.");
            return;
        }

        let orderItems = [];
Object.keys(cartItems).forEach(productId => {
    if (cartItems[productId] > 0) {
        const product = allProducts.find(p => p._id === productId);
        if (product) {
            orderItems.push({ ...product, quantity: cartItems[productId] });
        }
    }
});

        console.log("Cart Items:", cartItems);

        if (orderItems.length === 0) {
            toast.error("Your cart is empty!");
            return;
        }

        setLoading(true);

        try {
            const orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            };

            const { data } = await axios.post(`${backendUrl}/api/order/razorpay`, orderData, { headers: { token } });

            if (data.success) {
                initPay(data.order);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to place order.");
        } finally {
            setLoading(false);
        }
    };

    const initPay = (order) => {
        const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY,
            amount: order.amount,
            currency: "INR",
            name: "Your Shop Name",
            description: "Order Payment",
            order_id: order.id,
            handler: async function (response) {
                try {
                    console.log("Verifying payment...");
                    const verifyRes = await axios.post(`${backendUrl}/api/order/verify`, response, { headers: { token } });
    
                    if (verifyRes.data.success) {
                        toast.success("Payment successful!");
                        
                        // Clear cart & navigate
                        console.log("Clearing cart...");
                        setCartItems({});
                        localStorage.removeItem("cartItems"); 
    
                        console.log("Navigating to orders...");
                        setTimeout(() => navigate('/orders'), 500);
                    } else {
                        toast.error("Payment verification failed!");
                    }
                } catch (error) {
                    toast.error("Payment verification error!");
                }
            },
            prefill: {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                contact: formData.phone
            },
            theme: {
                color: "#000000"
            }
        };
    
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    };
    

    return (
        <form onSubmit={(e) => e.preventDefault()} className='ml-4 pr-4 sm:ml-10 flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            <div className='flex flex-col gap-4 w-full sm:max-w-[720px]'>

                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>

                {/* Show saved addresses */}
                <div>
                    <h3 className="text-lg font-semibold">Saved Addresses</h3>
                    {savedAddresses.map((addr, index) => (
                        <div key={index} className="border p-2">
                            <div className="font-bold">
                                <input
                                    type="radio"
                                    name="savedAddress"
                                    value={index}
                                    checked={useSavedAddress && formData.firstName === addr.firstName && formData.lastName === addr.lastName}
                                    onChange={() => selectSavedAddress(index)}
                                    className="mr-2"
                                />
                                {addr.firstName} {addr.lastName}
                            </div>
                            <p>{`${addr.street}, ${addr.city}, ${addr.state}, ${addr.country}`}</p>
                        </div>
                    ))}
                    {useSavedAddress && (
                        <button type="button" onClick={useNewAddress} className="text-blue-500 mt-2">
                            Use a new address
                        </button>
                    )}
                </div>

                {!useSavedAddress && (
                    <>
                        <div className='flex gap-3'>
                            <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-10 w-full' type="text" placeholder='First name' />
                            <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-10 w-full' type="text" placeholder='Last name' />
                        </div>

                        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-10 w-full' type="email" placeholder='Email address' />
                        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-10 w-full' type="text" placeholder='Street' />
                        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-10 w-full' type="number" placeholder='Phone' />
                        <div className="flex gap-2 items-center mt-4">
                            <input type="checkbox" checked={saveAddress} onChange={() => setSaveAddress(!saveAddress)} />
                            <label>Save this address for future purchases</label>
                        </div>
                    
                    </>
                )}

            </div>

            <div className='ml-4 pr-4 mt-8 sm:mr-10'>
                <CartTotal />
                <div className='w-full text-end mt-8'>
                    <button type='button' onClick={handlePlaceOrder} className='bg-black text-white px-16 py-3 text-sm'>
                        {loading ? "Processing..." : "PLACE ORDER"}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;