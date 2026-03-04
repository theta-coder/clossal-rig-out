import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Settings, LogOut, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../api';

export default function OrderHistory() {
    const { user, logout, loading, token } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        if (token) {
            fetch(`${API_URL}/user/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) setOrders(data.data);
                    setFetching(false);
                })
                .catch(() => setFetching(false));
        }
    }, [token]);

    if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin h-8 w-8 border-b-2 border-black"></div></div>;

    if (!user) {
        return <Navigate to="/login" state={{ from: { pathname: "/orders" } }} replace />;
    }

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
        navigate('/');
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'ready_to_ship': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
            case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen bg-white">
            <h1 className="text-3xl md:text-5xl font-heading font-black mb-8 uppercase tracking-tight text-black">My Account</h1>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-1/4">
                    <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl shadow-sm">
                        <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-6">
                            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold font-heading shadow-md">
                                {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-black">{user.name}</h2>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Hello, Member</p>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            <Link to="/profile" className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 hover:text-black font-semibold uppercase tracking-widest text-sm rounded transition-all">
                                <User className="w-5 h-5" /> Profile Details
                            </Link>
                            <Link to="/orders" className="flex items-center gap-3 w-full p-3 bg-black text-white font-bold uppercase tracking-widest text-sm rounded transition-all shadow-md">
                                <Package className="w-5 h-5" /> Order History
                            </Link>
                            <Link to="/addresses" className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 hover:text-black font-semibold uppercase tracking-widest text-sm rounded transition-all">
                                <MapPin className="w-5 h-5" /> Addresses
                            </Link>
                            <Link to="/settings" className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 hover:text-black font-semibold uppercase tracking-widest text-sm rounded transition-all">
                                <Settings className="w-5 h-5" /> Account Settings
                            </Link>
                            <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 hover:text-red-700 font-semibold uppercase tracking-widest text-sm rounded transition-all mt-8 text-left">
                                <LogOut className="w-5 h-5" /> Sign Out
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full md:w-3/4">
                    <div className="bg-white border border-gray-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-xl">
                        <h2 className="text-2xl font-heading font-bold mb-6 uppercase border-b border-gray-100 pb-4 tracking-tight">Order History</h2>

                        {fetching ? (
                            <div className="text-center py-12">
                                <div className="animate-spin h-8 w-8 border-b-2 border-black mx-auto"></div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-bold text-black mb-2 uppercase tracking-wide">No Orders Yet</h3>
                                <p className="text-gray-500 mb-6 font-medium text-sm">Looks like you haven't made any purchases with us.</p>
                                <Link to="/shop" className="bg-black text-white inline-block px-8 py-3 uppercase tracking-widest text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg">
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all bg-gray-50/50">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-bold text-lg text-black">#{order.order_number}</h3>
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 font-medium">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-left md:text-right">
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Total Amount</p>
                                                <p className="font-bold text-lg text-black">PKR {Number(order.total).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                            <p className="text-sm text-gray-600 font-medium tracking-wide">
                                                <span className="font-bold text-black border border-gray-200 bg-white rounded-md px-2 py-1 mr-2 shadow-sm">{order.items_count || order.items?.length || 0}</span>
                                                Items in this order
                                            </p>
                                            <div className="flex gap-3 w-full sm:w-auto">
                                                <Link to={`/orders/${order.id}`} className="flex-1 sm:flex-none text-center bg-black text-white px-6 py-2.5 rounded-lg uppercase tracking-widest text-xs font-bold transition-all shadow-md hover:bg-gray-800">
                                                    View Details & Track
                                                </Link>
                                                <Link to="/contact" className="hidden sm:inline-block text-gray-500 hover:text-black hover:underline px-4 py-2 uppercase tracking-widest text-xs font-bold transition">
                                                    Help
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
