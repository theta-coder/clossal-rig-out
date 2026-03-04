import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Package, MapPin, Calendar, Clock, ArrowLeft, CheckCircle, Truck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../api';

export default function OrderDetail() {
    const { id } = useParams();
    const { user, token, loading } = useAuth();
    const [order, setOrder] = useState(null);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token && id) {
            fetch(`${API_URL}/user/orders/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setOrder(data.data);
                    } else {
                        setError(data.message || 'Order not found');
                    }
                    setFetching(false);
                })
                .catch(() => {
                    setError('Connection error');
                    setFetching(false);
                });
        }
    }, [token, id]);

    if (loading || fetching) return (
        <div className="min-h-screen flex justify-center items-center bg-white">
            <div className="animate-spin h-12 w-12 border-b-2 border-black rounded-full"></div>
        </div>
    );

    if (!user) return <Navigate to="/login" replace />;

    if (error || !order) return (
        <div className="container mx-auto px-4 py-24 min-h-screen flex flex-col items-center justify-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2 uppercase tracking-widest text-black">{error || 'Order Not Found'}</h1>
            <Link to="/orders" className="text-black underline font-bold uppercase tracking-widest text-sm">Back to Orders</Link>
        </div>
    );

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

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen bg-white">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <Link to="/orders" className="flex items-center gap-2 text-gray-400 hover:text-black transition-all mb-4 uppercase tracking-widest text-[10px] font-black">
                            <ArrowLeft className="w-3 h-3" /> Back to History
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter text-black">Order #{order.order_number}</h1>
                        <p className="text-gray-500 font-medium uppercase tracking-widest text-[10px] mt-2">
                            Placed on {new Date(order.created_at).toLocaleDateString(undefined, {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm ${getStatusColor(order.status)}`}>
                            {order.status.replace(/_/g, ' ')}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content: Timeline and Items */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Status Timeline */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-50">
                                <Clock className="w-5 h-5 text-black" />
                                <h2 className="text-xl font-black uppercase tracking-widest">Order Timeline</h2>
                            </div>

                            <div className="relative pl-8 space-y-12">
                                {/* Vertical Line */}
                                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                                {order.status_histories?.map((history, idx) => (
                                    <div key={history.id} className="relative">
                                        {/* Point */}
                                        <div className={`absolute -left-[25px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 ${idx === 0 ? 'bg-black animate-pulse' : 'bg-gray-200'}`}></div>

                                        <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2">
                                            <div>
                                                <p className="text-sm font-black text-black uppercase tracking-widest">{history.status.replace(/_/g, ' ')}</p>
                                                <p className="text-xs text-gray-500 mt-1 font-medium">{history.notes}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                                    {new Date(history.created_at).toLocaleString(undefined, {
                                                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <div className="flex items-center gap-3 mb-6">
                                <Package className="w-5 h-5 text-black" />
                                <h2 className="text-xl font-black uppercase tracking-widest text-black">Order Contents</h2>
                            </div>
                            <div className="space-y-4">
                                {order.items?.map((item) => (
                                    <div key={item.id} className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                                        <div className="w-20 h-24 bg-white rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                                            <img
                                                src={item.product_image ? `${API_URL}/storage/${item.product_image}` : '/placeholder.png'}
                                                alt={item.product_name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-base text-black">{item.product_name}</h4>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">
                                                Size: {item.size} | Color: {item.color}
                                            </p>
                                            <p className="text-sm font-black mt-2">PKR {Number(item.price).toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-black uppercase text-gray-400 block mb-1">Quantity</span>
                                            <span className="bg-white border border-gray-200 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-sm">{item.quantity}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Order Summary & Info */}
                    <div className="space-y-8">
                        {/* Delivery Info */}
                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 font-heading">Shipping Address</h3>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-black flex-shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-black text-sm uppercase mb-2">{order.address?.name}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                                        {order.address?.street}<br />
                                        {order.address?.city}, {order.address?.zip}<br />
                                        {order.address?.phone}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-black text-white p-8 rounded-3xl shadow-xl">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-8 font-heading">Order Summary</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span>PKR {Number(order.subtotal).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span className="text-gray-500">Shipping</span>
                                    <span>PKR {Number(order.shipping_cost).toLocaleString()}</span>
                                </div>
                                <div className="w-full h-px bg-white/10 my-4"></div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Total Charged</span>
                                    <span className="text-2xl font-black">PKR {Number(order.total).toLocaleString()}</span>
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/5">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 text-center">Payment Method</p>
                                    <p className="text-sm font-black text-center uppercase tracking-widest">{order.payment_method === 'cod' ? 'Cash On Delivery' : order.payment_method}</p>
                                </div>
                            </div>
                        </div>

                        {/* Need Help? */}
                        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 text-center">
                            <h4 className="font-heading font-black uppercase text-sm mb-4">Need Assistance?</h4>
                            <p className="text-xs text-gray-500 mb-6">Our support team is available 24/7 for any questions regarding your order.</p>
                            <Link to="/contact" className="inline-block w-full py-4 border border-black text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-black hover:text-white transition-all">
                                Open Support Ticket
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
