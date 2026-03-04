import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldCheck, CreditCard, MapPin, User, Phone, Mail, Home, Globe, Tag, X } from 'lucide-react';
import { API_URL } from '../api';

export default function Checkout() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user, token } = useAuth();
    const [step, setStep] = useState(1); // 1: Checkout, 2: Success
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [error, setError] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [applyingCoupon, setApplyingCoupon] = useState(false);

    const [guestAddress, setGuestAddress] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        zip: '',
        phone: '',
        type: 'shipping'
    });

    const shippingCost = 250;
    const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
    const finalTotal = cartTotal - discountAmount + (cartTotal > 5000 ? 0 : shippingCost);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setApplyingCoupon(true);
        setCouponError('');
        try {
            const res = await fetch(`${API_URL}/coupons/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ code: couponCode.trim(), subtotal: cartTotal }),
            });
            const data = await res.json();
            if (data.success) {
                setAppliedCoupon(data.data);
            } else {
                setCouponError(data.message);
            }
        } catch {
            setCouponError('Could not apply coupon. Try again.');
        } finally {
            setApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError('');
    };

    useEffect(() => {
        if (token && user) {
            setLoadingAddresses(true);
            fetch(`${API_URL}/user/addresses`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setAddresses(data.data || []);
                        const defaultAddr = data.data?.find(a => a.is_default);
                        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
                    }
                    setLoadingAddresses(false);
                })
                .catch(() => setLoadingAddresses(false));

            // Pre-fill guest address with user info
            setGuestAddress(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
            }));
        }
    }, [token, user]);

    if (cartItems.length === 0 && step !== 2) {
        return (
            <div className="container mx-auto px-4 py-24 text-center mt-[80px]">
                <h1 className="text-3xl font-heading font-bold mb-4">Checkout</h1>
                <p className="text-gray-500 mb-8">Your cart is empty. Nothing to checkout.</p>
                <Link to="/shop" className="btn-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider">Return to Shop</Link>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGuestAddress(prev => ({ ...prev, [name]: value }));
        // If user starts typing in manual form, deselect saved address
        if (selectedAddressId) setSelectedAddressId(null);
    };

    const handlePlaceOrder = async (e) => {
        if (e) e.preventDefault();

        setSubmitting(true);
        setError('');

        const orderData = {
            subtotal: cartTotal,
            shipping_cost: cartTotal > 5000 ? 0 : shippingCost,
            discount_amount: discountAmount,
            coupon_id: appliedCoupon ? appliedCoupon.id : null,
            total: finalTotal,
            payment_method: 'cod',
            items: cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price,
                size: item.size,
                color: item.color
            }))
        };

        if (selectedAddressId) {
            orderData.address_id = selectedAddressId;
        } else {
            // Validate manual address
            const requiredFields = ['name', 'street', 'city', 'zip', 'phone'];
            if (!token) requiredFields.push('email'); // Email is required for guest checkout
            const missing = requiredFields.filter(f => !guestAddress[f]);
            if (missing.length > 0) {
                setError(`Please fill in all address fields: ${missing.join(', ')}`);
                setSubmitting(false);
                return;
            }
            orderData.address = guestAddress;
        }

        try {
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (data.success) {
                setOrderNumber(data.data.order_number);
                setStep(2);
                clearCart();
            } else {
                setError(data.message || 'Failed to place order');
            }
        } catch (err) {
            setError('Something went wrong. Please check your connection.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-[80px] bg-gray-50 min-h-screen">
            <div className="bg-white py-4 border-b border-gray-200 sticky top-[80px] z-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                        <span className={step === 1 ? "text-black font-black underline decoration-2 underline-offset-4" : "text-gray-300"}>1. Checkout Details</span>
                        <span className="text-gray-200 mx-4">---</span>
                        <span className={step === 2 ? "text-black font-black underline decoration-2 underline-offset-4" : "text-gray-300"}>2. Success</span>
                    </div>
                </div>
            </div>

            <section className="py-12">
                <div className="container mx-auto px-4">
                    {step === 1 ? (
                        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8">
                            {/* Main Content */}
                            <div className="w-full lg:w-2/3 space-y-8">
                                {error && (
                                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold uppercase tracking-wider border border-red-100 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                                        {error}
                                    </div>
                                )}

                                {/* Address Section */}
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                        <h2 className="text-xl font-heading font-black text-black uppercase tracking-tight flex items-center gap-2">
                                            <MapPin className="w-6 h-6" /> Shipping Details
                                        </h2>
                                        {!token && (
                                            <Link to="/login" className="text-xs font-bold text-gray-400 hover:text-black transition uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">Sign In for faster checkout</Link>
                                        )}
                                    </div>

                                    {/* Saved Addresses for Logged In Users */}
                                    {token && addresses.length > 0 && (
                                        <div className="mb-8">
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4">Select a saved address</p>
                                            {loadingAddresses ? (
                                                <div className="flex justify-center py-4">
                                                    <div className="animate-spin h-6 w-6 border-b-2 border-black rounded-full"></div>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {addresses.map((address) => (
                                                        <div
                                                            key={address.id}
                                                            onClick={() => {
                                                                setSelectedAddressId(address.id);
                                                                // Clear guest address form when a saved address is selected
                                                                setGuestAddress({
                                                                    name: user.name || '',
                                                                    email: user.email || '',
                                                                    street: '',
                                                                    city: '',
                                                                    zip: '',
                                                                    phone: '',
                                                                    type: 'shipping'
                                                                });
                                                            }}
                                                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedAddressId === address.id ? 'border-black bg-gray-50 shadow-md scale-[1.02]' : 'border-gray-100 hover:border-gray-200 opacity-60 hover:opacity-100'}`}
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <span className="text-[9px] font-black uppercase tracking-tighter bg-black text-white px-2 py-0.5 rounded-full">{address.type}</span>
                                                                {selectedAddressId === address.id && <div className="w-3 h-3 bg-black rounded-full border-2 border-white ring-1 ring-black"></div>}
                                                            </div>
                                                            <p className="font-bold text-sm text-black mb-1">{address.name}</p>
                                                            <p className="text-[11px] text-gray-500 leading-tight mb-2">{address.street}, {address.city}</p>
                                                            <p className="text-[11px] text-black font-black">{address.phone}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="mt-4 flex items-center gap-2">
                                                <div className="h-px bg-gray-100 flex-1"></div>
                                                <span className="text-[9px] font-black text-gray-300 uppercase italic">Or enter details manually</span>
                                                <div className="h-px bg-gray-100 flex-1"></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Guest Form */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="col-span-full md:col-span-1">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input name="name" value={guestAddress.name} onChange={handleInputChange} type="text" placeholder="John Doe" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-12 py-3.5 text-sm focus:outline-none focus:border-black focus:ring-0 transition shadow-inner" />
                                            </div>
                                        </div>
                                        {!token && (
                                            <div className="col-span-full md:col-span-1">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input name="email" value={guestAddress.email} onChange={handleInputChange} type="email" placeholder="john@example.com" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-12 py-3.5 text-sm focus:outline-none focus:border-black transition" />
                                                </div>
                                            </div>
                                        )}
                                        <div className="col-span-full">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Street Address</label>
                                            <div className="relative">
                                                <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input name="street" value={guestAddress.street} onChange={handleInputChange} type="text" placeholder="House #, Street name, Area" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-12 py-3.5 text-sm focus:outline-none focus:border-black transition" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">City</label>
                                            <div className="relative">
                                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input name="city" value={guestAddress.city} onChange={handleInputChange} type="text" placeholder="Lahore" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-12 py-3.5 text-sm focus:outline-none focus:border-black transition" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Postal Zip</label>
                                                <input name="zip" value={guestAddress.zip} onChange={handleInputChange} type="text" placeholder="54000" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-black transition" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Phone</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                                                    <input name="phone" value={guestAddress.phone} onChange={handleInputChange} type="tel" placeholder="0321..." className="w-full bg-gray-50 border border-gray-100 rounded-xl px-10 py-3.5 text-sm focus:outline-none focus:border-black transition" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Section */}
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <h2 className="text-xl font-heading font-black text-black uppercase tracking-tight mb-8 border-b border-gray-100 pb-4 flex items-center gap-2">
                                        <CreditCard className="w-6 h-6" /> Payment Method
                                    </h2>
                                    <div className="space-y-4">
                                        <label className="flex items-center justify-between p-5 border-2 border-black bg-gray-50 cursor-pointer rounded-2xl shadow-md transition-transform hover:scale-[1.01]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-6 h-6 rounded-full border-4 border-black bg-white flex items-center justify-center p-0.5">
                                                    <div className="w-full h-full bg-black rounded-full"></div>
                                                </div>
                                                <div>
                                                    <span className="block font-black text-sm uppercase tracking-widest">Cash on Delivery (COD)</span>
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter italic">Pay when you receive your package</span>
                                                </div>
                                            </div>
                                            <ShieldCheck className="w-6 h-6 text-black" />
                                        </label>

                                        <div className="p-5 border-2 border-gray-50 rounded-2xl opacity-40 bg-gray-50 flex items-center justify-between cursor-not-allowed grayscale">
                                            <div className="flex items-center gap-4">
                                                <div className="w-6 h-6 rounded-full border-2 border-gray-200"></div>
                                                <div>
                                                    <span className="block font-bold text-sm uppercase tracking-widest text-gray-400">Online Payment</span>
                                                    <span className="text-[10px] text-gray-400 uppercase font-black">Coming Soon</span>
                                                </div>
                                            </div>
                                            <CreditCard className="w-6 h-6 text-gray-300" />
                                        </div>
                                    </div>
                                    <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 py-3 rounded-xl border border-dashed border-gray-200">
                                        <Lock className="w-3 h-3 text-black" /> Secured by 256-bit SSL Transaction Security
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Summary */}
                            <div className="w-full lg:w-1/3">
                                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-[150px]">
                                    <h3 className="font-heading font-black text-xl text-black uppercase tracking-tight mb-8 border-b-2 border-black pb-4">Invoice Summary</h3>

                                    <div className="space-y-6 mb-8 max-h-[30vh] overflow-y-auto pr-4 custom-scrollbar">
                                        {cartItems.map((item) => (
                                            <div key={`${item.id}-${item.size}`} className="flex gap-4 group">
                                                <div className="relative flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-gray-50 rounded-lg shadow-sm border border-transparent transition-all group-hover:border-black group-hover:shadow-md" />
                                                    <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-md">{item.quantity}</span>
                                                </div>
                                                <div className="flex-1 py-1">
                                                    <h4 className="font-black text-xs text-black leading-tight mb-1 uppercase tracking-tight">{item.name}</h4>
                                                    <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-2 font-bold">{item.size} / {item.color}</p>
                                                    <p className="font-black text-sm">PKR {(item.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Coupon Input */}
                                    <div className="mb-6">
                                        {appliedCoupon ? (
                                            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="w-4 h-4 text-green-600" />
                                                    <span className="text-xs font-black text-green-700 uppercase tracking-widest">{appliedCoupon.code}</span>
                                                    <span className="text-xs text-green-600 font-bold">- PKR {discountAmount.toLocaleString()}</span>
                                                </div>
                                                <button type="button" onClick={handleRemoveCoupon} className="text-green-500 hover:text-red-500 transition">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleApplyCoupon())}
                                                    placeholder="COUPON CODE"
                                                    className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-black transition"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleApplyCoupon}
                                                    disabled={applyingCoupon || !couponCode.trim()}
                                                    className="bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl disabled:opacity-50 transition hover:bg-gray-800"
                                                >
                                                    {applyingCoupon ? '...' : 'Apply'}
                                                </button>
                                            </div>
                                        )}
                                        {couponError && <p className="text-[10px] text-red-500 font-bold mt-2 uppercase tracking-wider">{couponError}</p>}
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 pb-2">
                                            <span>Subtotal</span>
                                            <span className="text-black">PKR {cartTotal.toLocaleString()}</span>
                                        </div>
                                        {discountAmount > 0 && (
                                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-green-600 pb-2">
                                                <span>Discount</span>
                                                <span>- PKR {discountAmount.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400 pb-4 border-b border-gray-100">
                                            <span>Shipping</span>
                                            <span className="text-black">{cartTotal > 5000 ? 'FREE' : `PKR ${shippingCost.toLocaleString()}`}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="font-heading font-black uppercase text-lg">Total</span>
                                            <span className="font-black text-2xl text-black">PKR {finalTotal.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-black text-white font-black text-sm py-5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:translate-y-0"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div>
                                                Confirming Order...
                                            </>
                                        ) : (
                                            <>COMPLETE PURCHASE</>
                                        )}
                                    </button>
                                    <p className="text-[9px] text-gray-400 mt-6 text-center uppercase font-black tracking-widest italic leading-relaxed">
                                        By clicking "Complete Purchase", you agree to our <br />
                                        <span className="underline cursor-pointer">Terms & Conditions</span>
                                    </p>
                                </div>
                            </div>
                        </form>
                    ) : (
                        /* Step 2: Success */
                        <div className="animate-fade-in border border-gray-100 p-16 text-center shadow-2xl rounded-[3rem] flex flex-col items-center bg-white max-w-4xl mx-auto py-24">
                            <div className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center text-white mb-10 shadow-[0_20px_50px_rgba(34,197,94,0.3)] animate-bounce-slow">
                                <ShieldCheck className="w-16 h-16" />
                            </div>
                            <h2 className="text-5xl font-heading font-black text-black uppercase tracking-tighter mb-6 leading-none">Order <br /> Confirmed!</h2>
                            <p className="text-gray-500 mb-2 font-bold uppercase tracking-widest text-sm">Welcome to the Urban Threads Tribe.</p>
                            <div className="bg-gray-50 px-8 py-4 rounded-2xl border-2 border-dashed border-gray-200 mb-12">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Your Tracking ID</p>
                                <p className="text-3xl font-black text-black tracking-tight">{orderNumber}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-6 w-full justify-center px-8">
                                <Link to="/orders" className="bg-black text-white px-12 py-5 text-sm font-black uppercase tracking-widest rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-1 shadow-xl">My Order History</Link>
                                <Link to="/shop" className="bg-white border-2 border-black text-black px-12 py-5 text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-black hover:text-white transition-all hover:shadow-2xl hover:-translate-y-1">Return to Shop</Link>
                            </div>
                            <p className="mt-12 text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                <Mail className="w-4 h-4" /> A confirmation email is on its way
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
