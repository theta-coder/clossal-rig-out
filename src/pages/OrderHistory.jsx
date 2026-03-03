import React from 'react';
import { Link } from 'react-router-dom';
import { User, Package, MapPin, Settings, LogOut, ArrowRight } from 'lucide-react';

export default function OrderHistory() {
    // Dummy user and order data
    const user = {
        name: 'John Doe',
        joined: 'March 2026'
    };

    const orders = [
        {
            id: '#UT-10042',
            date: 'March 2, 2026',
            status: 'Processing',
            total: 7898,
            items: 2,
            trackingLabel: 'Track Package'
        },
        {
            id: '#UT-09921',
            date: 'February 15, 2026',
            status: 'Delivered',
            total: 12499,
            items: 3,
            trackingLabel: 'View Details'
        },
        {
            id: '#UT-08544',
            date: 'January 10, 2026',
            status: 'Delivered',
            total: 3999,
            items: 1,
            trackingLabel: 'View Details'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Shipped': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen">
            <h1 className="text-3xl md:text-5xl font-heading font-bold mb-8 uppercase tracking-tight text-black">My Account</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-1/4">
                    <div className="bg-gray-50 border border-gray-100 p-6">
                        <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-6">
                            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold font-heading">
                                {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-black">{user.name}</h2>
                                <p className="text-xs text-gray-500 uppercase tracking-widest">Member since {user.joined}</p>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            <Link to="/profile" className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 hover:text-black font-semibold uppercase tracking-widest text-sm transition">
                                <User className="w-5 h-5" /> Profile Details
                            </Link>
                            <Link to="/orders" className="flex items-center gap-3 w-full p-3 bg-black text-white font-bold uppercase tracking-widest text-sm transition">
                                <Package className="w-5 h-5" /> Order History
                            </Link>
                            <Link to="/addresses" className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 hover:text-black font-semibold uppercase tracking-widest text-sm transition">
                                <MapPin className="w-5 h-5" /> Addresses
                            </Link>
                            <Link to="/settings" className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 hover:text-black font-semibold uppercase tracking-widest text-sm transition">
                                <Settings className="w-5 h-5" /> Account Settings
                            </Link>
                            <Link to="/login" className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 hover:text-red-700 font-semibold uppercase tracking-widest text-sm transition mt-8">
                                <LogOut className="w-5 h-5" /> Sign Out
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full md:w-3/4">
                    <div className="bg-white border border-gray-200 p-8 shadow-sm">
                        <h2 className="text-2xl font-heading font-bold mb-6 uppercase border-b pb-4">Order History</h2>

                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-bold text-black mb-2 uppercase">No Orders Yet</h3>
                                <p className="text-gray-500 mb-6">Looks like you haven't made any purchases with us.</p>
                                <Link to="/shop" className="btn-primary inline-block px-8 py-3 uppercase tracking-widest text-sm font-bold">Start Shopping</Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div key={order.id} className="border border-gray-200 rounded-sm p-6 hover:shadow-md transition">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-bold text-lg">{order.id}</h3>
                                                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 border ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500">Placed on {order.date}</p>
                                            </div>
                                            <div className="text-left md:text-right">
                                                <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Total Amount</p>
                                                <p className="font-bold text-lg">PKR {order.total.toLocaleString()}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                            <p className="text-sm text-gray-600 font-medium">
                                                {order.items} {order.items === 1 ? 'Item' : 'Items'} in this order
                                            </p>
                                            <div className="flex gap-3 w-full sm:w-auto">
                                                <Link to={`/track-order?order=${order.id}`} className="flex-1 sm:flex-none text-center bg-gray-100 text-black hover:bg-gray-200 px-6 py-2 uppercase tracking-widest text-xs font-bold transition">
                                                    {order.trackingLabel}
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
