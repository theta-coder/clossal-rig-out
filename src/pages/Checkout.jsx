import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Lock, ShieldCheck, CreditCard } from 'lucide-react';

export default function Checkout() {
    const { cartItems, cartTotal } = useCart();
    const [step, setStep] = useState(1);
    const shippingCost = 250;
    const finalTotal = cartTotal + (cartTotal > 5000 ? 0 : shippingCost);

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-24 text-center mt-[80px]">
                <h1 className="text-3xl font-heading font-bold mb-4">Checkout</h1>
                <p className="text-gray-500 mb-8">Your cart is empty. Nothing to checkout.</p>
                <Link to="/shop" className="btn-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider">Return to Shop</Link>
            </div>
        );
    }

    return (
        <>
            <div className="bg-gray-50 py-4 border-b border-gray-200 mt-[80px]">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 font-bold uppercase tracking-widest">
                        <span className={step >= 1 ? "text-black" : ""}>1. Address</span>
                        <span className="text-gray-300">-----</span>
                        <span className={step >= 2 ? "text-black" : ""}>2. Payment</span>
                        <span className="text-gray-300">-----</span>
                        <span className={step >= 3 ? "text-black" : ""}>3. Success</span>
                    </div>
                </div>
            </div>

            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12">

                    {/* Form Area */}
                    <div className="w-full md:w-2/3">
                        {step === 1 && (
                            <div className="animate-fade-in border border-gray-100 p-8 shadow-sm">
                                <h2 className="text-xl font-heading font-bold text-black mb-6 uppercase tracking-wider border-b border-gray-100 pb-4">Shipping Destination</h2>
                                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">First Name</label>
                                            <input required type="text" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 transition" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Last Name</label>
                                            <input required type="text" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 transition" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                                        <input required type="email" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 transition" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Street Address</label>
                                        <input required type="text" placeholder="House/Apt No., Street" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 transition mb-3" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">City</label>
                                            <input required type="text" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 transition" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Postal Code</label>
                                            <input required type="text" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 transition" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                                        <input required type="tel" className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 transition" />
                                    </div>

                                    <button type="submit" className="w-full bg-black text-white font-bold text-sm py-4 hover:bg-gray-800 transition uppercase tracking-widest mt-8">Continue to Payment</button>
                                </form>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-fade-in border border-gray-100 p-8 shadow-sm">
                                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                    <h2 className="text-xl font-heading font-bold text-black uppercase tracking-wider">Payment Method</h2>
                                    <button onClick={() => setStep(1)} className="text-xs text-black underline uppercase tracking-widest hover:text-gray-500">Edit Address</button>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <label className="flex items-center p-4 border border-black bg-gray-50 cursor-pointer">
                                        <input type="radio" name="payment" className="w-4 h-4 text-black focus:ring-black accent-black" defaultChecked />
                                        <span className="ml-3 font-bold text-sm uppercase tracking-widest">Cash on Delivery (COD)</span>
                                    </label>

                                    <label className="flex items-center justify-between p-4 border border-gray-200 hover:border-black cursor-pointer bg-white transition">
                                        <div className="flex items-center">
                                            <input type="radio" name="payment" className="w-4 h-4 text-black focus:ring-black accent-black" />
                                            <span className="ml-3 font-semibold text-sm uppercase tracking-widest text-gray-600">Credit / Debit Card</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <CreditCard className="w-6 h-6 text-gray-400" />
                                        </div>
                                    </label>
                                </div>

                                <div className="flex items-center gap-2 mb-8 text-xs text-gray-500 uppercase tracking-widest font-semibold justify-center">
                                    <Lock className="w-4 h-4 text-black" /> Secure 256-bit SSL Encryption
                                </div>

                                <button onClick={() => setStep(3)} className="w-full bg-black text-white font-bold text-sm py-4 hover:bg-gray-800 transition uppercase tracking-widest flex items-center justify-center gap-2">
                                    Place Order
                                </button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-fade-in border border-gray-100 p-12 text-center shadow-sm flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-6">
                                    <ShieldCheck className="w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-heading font-bold text-black uppercase tracking-wider mb-4">Order Confirmed!</h2>
                                <p className="text-gray-500 mb-2">Thank you for your purchase. Your order number is <strong>#UT-{Math.floor(1000 + Math.random() * 9000)}</strong>.</p>
                                <p className="text-gray-500 mb-8">We will send an order confirmation email shortly.</p>
                                <Link onClick={() => window.location.reload()} to="/" className="btn-outline px-8 py-3 text-sm font-bold uppercase tracking-widest bg-gray-50 border-gray-200">Continue Shopping</Link>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="w-full md:w-1/3">
                        <div className="bg-gray-50 p-6 border border-gray-100 sticky top-28">
                            <h3 className="font-heading font-bold text-lg text-black uppercase tracking-widest mb-6 border-b border-gray-200 pb-4">Order Summary</h3>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.size}`} className="flex gap-3">
                                        <div className="relative">
                                            <img src={item.image} alt={item.name} className="w-16 h-20 object-cover bg-white border border-gray-100" />
                                            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white">{item.quantity}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-xs text-black leading-tight mb-1">{item.name}</h4>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{item.size} / {item.color}</p>
                                            <p className="font-bold text-xs">PKR {(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-bold">PKR {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="font-bold">{cartTotal > 5000 ? 'Free' : `PKR ${shippingCost.toLocaleString()}`}</span>
                                </div>
                            </div>

                            <div className="border-t border-black pt-4 flex justify-between items-center text-lg mt-4">
                                <span className="font-heading font-bold uppercase tracking-widest text-black">Total</span>
                                <span className="font-black text-black">PKR {finalTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}
