import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, MapPin, Calendar, Search, AlertCircle, ChevronRight } from 'lucide-react';
import { API_BASE_URL, API_URL } from '../api';

export default function TrackOrder() {
    const [searchParams] = useSearchParams();
    const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
    const [email, setEmail] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const resolveOrderItemImage = (imagePath) => {
        if (!imagePath) return '/placeholder.png';

        const value = String(imagePath).trim();
        if (!value) return '/placeholder.png';
        if (/^https?:\/\//i.test(value)) return value;

        const normalized = value.replace(/^\/+/, '');

        if (normalized.startsWith('storage/') || normalized.startsWith('assets/')) {
            return `${API_BASE_URL}/${normalized}`;
        }

        return `${API_BASE_URL}/storage/${normalized}`;
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return <Clock className="w-6 h-6" />;
            case 'confirmed': return <Package className="w-6 h-6" />;
            case 'ready_to_ship': return <Package className="w-6 h-6" />;
            case 'shipped': return <Truck className="w-6 h-6" />;
            case 'delivered': return <CheckCircle className="w-6 h-6" />;
            case 'cancelled': return <AlertCircle className="w-6 h-6" />;
            default: return <Clock className="w-6 h-6" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-600';
            case 'confirmed': return 'bg-blue-100 text-blue-600';
            case 'ready_to_ship': return 'bg-indigo-100 text-indigo-600';
            case 'shipped': return 'bg-purple-100 text-purple-600';
            case 'delivered': return 'bg-green-100 text-green-600';
            case 'cancelled': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const handleTrack = async (e) => {
        if (e) e.preventDefault();
        if (!orderNumber || !email) {
            setError('Please provide both Order Number and Email Address.');
            return;
        }

        setLoading(true);
        setError(null);
        setOrder(null);

        try {
            const response = await fetch(`${API_URL}/orders/track?order_number=${orderNumber}&email=${email}`, {
                headers: { 'Accept': 'application/json' }
            });
            const data = await response.json();

            if (data.success) {
                setOrder(data.data);
            } else {
                setError(data.message || 'Unable to track order. Please check your details.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Auto-track if params are present
    useEffect(() => {
        const urlOrder = searchParams.get('order');
        if (urlOrder && email) {
            handleTrack();
        }
    }, [searchParams]);

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-heading font-black mb-4 uppercase tracking-tighter">Track Your Journey</h1>
                    <p className="text-gray-500 font-medium max-w-lg mx-auto uppercase tracking-widest text-xs">Enter your details to follow your package in real-time</p>
                </div>

                {/* Tracking Form */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
                    <form onSubmit={handleTrack} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="md:col-span-1">
                            <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-2 px-1">Order ID</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 text-sm focus:ring-2 focus:ring-black transition-all font-bold placeholder:text-gray-300"
                                    placeholder="UT-XXXXXX"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-[10px] font-black text-black uppercase tracking-[0.2em] mb-2 px-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-black transition-all font-bold placeholder:text-gray-300"
                                placeholder="name@example.com"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white rounded-2xl p-4 uppercase tracking-widest font-black text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full"></div> : 'Track Now'}
                            {!loading && <ChevronRight className="w-4 h-4" />}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Results Area */}
                {order && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                        {/* Order Header Summary */}
                        <div className="bg-black text-white p-8 rounded-3xl flex flex-wrap justify-between items-center gap-6 shadow-xl">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1">Current Status</p>
                                <h2 className="text-3xl font-heading font-black uppercase">{order.status.replace(/_/g, ' ')}</h2>
                            </div>
                            <div className="flex gap-8">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1">Expected Delivery</p>
                                    <p className="font-bold text-lg">3-5 Business Days</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1">Tracking ID</p>
                                    <p className="font-bold text-lg">#{order.order_number}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Timeline - Left 2 Columns */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                                    <h3 className="text-lg font-black uppercase tracking-widest mb-10 pb-4 border-b border-gray-50 flex items-center gap-2">
                                        <Clock className="w-5 h-5" /> Status Updates
                                    </h3>

                                    <div className="relative pl-12 space-y-12">
                                        {/* Vertical line connecting status points */}
                                        <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-black via-gray-100 to-gray-50"></div>

                                        {order.status_histories?.map((history, idx) => (
                                            <div key={history.id} className="relative">
                                                {/* Point shadow effect */}
                                                <div className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center z-10">
                                                    <div className={`w-3 h-3 rounded-full ${idx === 0 ? 'bg-black animate-pulse' : 'bg-gray-200'}`}></div>
                                                </div>

                                                <div className="flex flex-col md:flex-row md:justify-between items-start gap-1">
                                                    <div>
                                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 ${getStatusColor(history.status)}`}>
                                                            {history.status.replace(/_/g, ' ')}
                                                        </span>
                                                        <p className="text-sm font-bold text-black mb-1">{history.notes}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                                            {new Date(history.created_at).toLocaleDateString(undefined, {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })} at {new Date(history.created_at).toLocaleTimeString(undefined, {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Initial state placeholder if history missing */}
                                        {(!order.status_histories || order.status_histories.length === 0) && (
                                            <div className="relative">
                                                <div className="absolute -left-[35px] top-0 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center z-10">
                                                    <div className="w-3 h-3 rounded-full bg-black"></div>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-black">Order Received</p>
                                                    <p className="text-xs text-gray-500">We've received your order and it's being processed.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Items Summary */}
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <Package className="w-5 h-5" /> Order Content
                                    </h3>
                                    <div className="space-y-4">
                                        {order.items?.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                                                <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                                    <img
                                                        src={resolveOrderItemImage(item.product_image)}
                                                        alt={item.product_name}
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = '/placeholder.png';
                                                        }}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-sm text-black">{item.product_name}</h4>
                                                    <p className="text-xs text-gray-500 uppercase tracking-widest">Qty: {item.quantity} | Size: {item.size} | Color: {item.color}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-sm">PKR {Number(item.price).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar - Right 1 Column */}
                            <div className="space-y-8">
                                {/* Shipping Destination */}
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-gray-400">Shipping To</h3>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-black flex-shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-black text-sm uppercase mb-1">{order.address?.name}</p>
                                            <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                                {order.address?.street}<br />
                                                {order.address?.city}, {order.address?.zip}<br />
                                                {order.address?.phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Value summary */}
                                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-gray-400">Order Summary</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-xs font-bold uppercase">
                                            <span className="text-gray-400">Subtotal</span>
                                            <span>PKR {Number(order.subtotal).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold uppercase">
                                            <span className="text-gray-400">Shipping</span>
                                            <span>PKR {Number(order.shipping_cost).toLocaleString()}</span>
                                        </div>
                                        <div className="pt-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Total Amount</span>
                                            <span className="text-xl font-black">PKR {Number(order.total).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center">
                                    <p className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-4">Need help?</p>
                                    <a href="/contact" className="text-xs font-black uppercase underline hover:text-blue-800 transition-all">Contact Support</a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
