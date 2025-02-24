import React, { useContext, useState, useEffect } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
    const [method, setMethod] = useState('cod');
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [saveAddress, setSaveAddress] = useState(false);
    const [useSavedAddress, setUseSavedAddress] = useState(false);

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
                const { data } = await axios.get(backendUrl + '/api/user/saved-addresses', { headers: { token } });
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

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            let orderItems = [];
            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find((product) => product._id === items));
                        if (itemInfo) {
                            itemInfo.quantity = cartItems[items][item];
                            orderItems.push(itemInfo);
                        }
                    }
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            };

            if (saveAddress) {
                await axios.post(backendUrl + '/api/user/save-address', { address: formData }, { headers: { token } });
            }

            const orderUrl = method === 'razorpay' ? '/api/order/razorpay' : '/api/order/place';
            const response = await axios.post(backendUrl + orderUrl, orderData, { headers: { token } });

            if (response.data.success) {
                if (method === 'razorpay') {
                    initPay(response.data.order);
                } else {
                    setCartItems({});
                    navigate('/orders');
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Order placement failed.");
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='ml-4 pr-4 sm:ml-10 flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            <div className='flex flex-col gap-4 w-full sm:max-w-[720px]'>

                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>

                {/* Show saved addresses */}
                <div>
    <h3 className="text-lg font-semibold">Saved Addresses</h3>
    {savedAddresses.map((addr, index) => (
        <div key={index} className="border p-2">
            {/* Radio Button */}
            {/* Display Name on Top */}
            <div className="font-bold">
                <input
                type="radio"
                name="savedAddress"
                value={index}
                checked={useSavedAddress && formData.firstName === addr.firstName && formData.lastName === addr.lastName}
                onChange={() => selectSavedAddress(index)}
                className="mr-2"
            />{addr.firstName} {addr.lastName}</div>
            {/* Address Below */}
            <p>{`${addr.street}, ${addr.city}, ${addr.state}, ${addr.country}`}</p>
        </div>
    ))}
    {useSavedAddress && (
        <button type="button" onClick={useNewAddress} className="text-blue-500 mt-2">
            Use a new address
        </button>
    )}
</div>


                {/* Address input fields (hidden when saved address is selected) */}
                {!useSavedAddress && (
                    <>
                        <div className='flex gap-3'>
                            <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-10 w-full' type="text" placeholder='First name' />
                            <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-10 w-full' type="text" placeholder='Last name' />
                        </div>

                        <input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-10 w-full' type="email" placeholder='Email address' />
                        <input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-10 w-full' type="text" placeholder='Street' />

                        <div className='flex gap-3'>
                            <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-10 w-full' type="text" placeholder='City' />
                            <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-10 w-full' type="text" placeholder='State' />
                        </div>

                        <div className='flex gap-3'>
                            <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-10 w-full' type="number" placeholder='Zipcode' />
                            <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-10 w-full' type="text" placeholder='Country' />
                        </div>

                        <input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-10 w-full' type="number" placeholder='Phone' />

                        {/* Checkbox to save address */}
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
                    <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;
