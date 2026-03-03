import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { CartProvider } from './context/CartContext';
import { FavoritesProvider } from './context/FavoritesContext';

// Lazy loading could be added here, but importing directly for simplicity
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';

import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import Addresses from './pages/Addresses';
import AccountSettings from './pages/AccountSettings';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import SizeGuide from './pages/SizeGuide';
import About from './pages/About';
import Contact from './pages/Contact';
import ShippingReturns from './pages/ShippingReturns';
import TrackOrder from './pages/TrackOrder';

function App() {
    return (
        <FavoritesProvider>
            <CartProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="shop" element={<Shop />} />
                            <Route path="product/:id" element={<ProductDetail />} />
                            <Route path="checkout" element={<Checkout />} />
                            <Route path="wishlist" element={<Favorites />} />
                            <Route path="login" element={<Login />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="orders" element={<OrderHistory />} />
                            <Route path="addresses" element={<Addresses />} />
                            <Route path="settings" element={<AccountSettings />} />
                            <Route path="signup" element={<Signup />} />
                            <Route path="forgot-password" element={<ForgotPassword />} />
                            <Route path="size-guide" element={<SizeGuide />} />
                            <Route path="about" element={<About />} />
                            <Route path="contact" element={<Contact />} />
                            <Route path="shipping" element={<ShippingReturns />} />
                            <Route path="track-order" element={<TrackOrder />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </FavoritesProvider>
    );
}

export default App;
