import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
    const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setIsCartOpen(false)}
            ></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right z-50">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="font-heading font-bold text-xl uppercase tracking-wider text-black flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" /> Your Cart
                    </h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-gray-400 hover:text-black transition p-2 rounded-full hover:bg-gray-100"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                            <ShoppingBag className="w-16 h-16 text-gray-200" />
                            <p className="text-lg">Your cart is empty.</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="btn-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider mt-4"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 p-4 border border-gray-100 rounded-sm hover:border-gray-200 transition bg-gray-50/50">
                                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-sm bg-white" />
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-sm text-black line-clamp-2">{item.name}</h3>
                                            <button
                                                onClick={() => removeFromCart(item.id, item.size, item.color)}
                                                className="text-gray-400 hover:text-red-500 transition ml-2"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Size: {item.size} {item.color ? `| Color: ${item.color}` : ''}</p>
                                        <p className="font-semibold text-black mt-1">PKR {item.price.toLocaleString()}</p>
                                    </div>

                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="flex items-center border border-gray-300 rounded-sm bg-white">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.size, item.color, -1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition text-gray-600"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.size, item.color, 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition text-gray-600"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-600 uppercase tracking-widest text-sm font-semibold">Subtotal</span>
                            <span className="font-bold text-xl text-black">PKR {cartTotal.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-6 text-center">Shipping & taxes calculated at checkout</p>

                        <Link
                            to="/checkout"
                            onClick={() => setIsCartOpen(false)}
                            className="btn-accent w-full py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                        >
                            Secure Checkout
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
