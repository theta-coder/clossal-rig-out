import React from 'react';
import { Link } from 'react-router-dom';
import { User, Package, MapPin, Settings, LogOut } from 'lucide-react';

export default function Profile() {
    // Dummy user data
    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+92 300 1234567',
        joined: 'March 2026'
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
                            <Link to="/profile" className="flex items-center gap-3 w-full p-3 bg-black text-white font-bold uppercase tracking-widest text-sm transition">
                                <User className="w-5 h-5" /> Profile Details
                            </Link>
                            <Link to="/orders" className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 hover:text-black font-semibold uppercase tracking-widest text-sm transition">
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
                        <h2 className="text-2xl font-heading font-bold mb-6 uppercase border-b pb-4">Personal Information</h2>

                        <form className="space-y-6 max-w-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Full Name</label>
                                    <input type="text" defaultValue={user.name} className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Email Address</label>
                                    <input type="email" defaultValue={user.email} className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition bg-gray-50" disabled />
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed directly.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Phone Number</label>
                                    <input type="tel" defaultValue={user.phone} className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition" />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <button type="submit" className="bg-black text-white uppercase tracking-widest font-bold py-3 px-8 hover:bg-gray-800 transition">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
