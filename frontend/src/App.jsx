import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
//import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
//import TrackOrder from './pages/TrackOrder'
//import DeliveryReturns from './pages/Delivery'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
//import Verify from './pages/Verify'
//import PrivacyPolicy from './pages/PrivacyPolicy'

const App = () => {
  return (
    <>
      <ToastContainer />
      <div className="bg-white">
        <div className="relative h-10 bg-red-500 text-white">
          <p className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-medium">
            18% Off on all Orders!!
          </p>
          <Link
            to="/orders"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-semibold hover:underline"
          >
            Track Order
          </Link>
        </div>
        <Navbar />
        <SearchBar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          {/*<Route path="/orders" element={<Orders />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/track/:orderId" element={<TrackOrder />} />
          <Route path="/Delivery" element={<DeliveryReturns/>}/>
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy/>}/>*/}
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
