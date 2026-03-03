import React from 'react';
import { Link } from 'react-router-dom';
import { User, Package, MapPin, Settings, LogOut, Shield, Key, Bell } from 'lucide-react';

export default function AccountSettings() {
    // Dummy user data
    const user = {
        name: 'John Doe',
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
                            <Link to="/profile" className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 hover:text-black font-semibold uppercase tracking-widest text-sm transition">
                                <User className="w-5 h-5" /> Profile Details
                            </Link>
                            <Link to="/orders" className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 hover:text-black font-semibold uppercase tracking-widest text-sm transition">
                                <Package className="w-5 h-5" /> Order History
                            </Link>
                            <Link to="/addresses" className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 hover:text-black font-semibold uppercase tracking-widest text-sm transition">
                                <MapPin className="w-5 h-5" /> Addresses
                            </Link>
                            <Link to="/settings" className="flex items-center gap-3 w-full p-3 bg-black text-white font-bold uppercase tracking-widest text-sm transition">
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
                        <h2 className="text-2xl font-heading font-bold mb-6 uppercase border-b pb-4">Settings & Security</h2>

                        {/* Change Password */}
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <Key className="w-5 h-5 text-gray-500" />
                                <h3 className="font-bold uppercase tracking-wider text-black">Change Password</h3>
                            </div>
                            <form className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Current Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">New Password</label>
                                    <input type="password" placeholder="••••••••" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition" />
                                </div>
                                <button type="submit" className="bg-black text-white hover:bg-gray-900 transition text-xs font-bold tracking-widest uppercase px-6 py-3 mt-2">
                                    Update Password
                                </button>
                            </form>
                        </div>

                        {/* Email Notifications */}
                        <div className="mb-10 pb-10 border-b border-gray-100">
                            <div className="flex items-center gap-3 mb-4">
                                <Bell className="w-5 h-5 text-gray-500" />
                                <h3 className="font-bold uppercase tracking-wider text-black">Email Preferences</h3>
                            </div>
                            <div className="space-y-4 max-w-md">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 text-black border-gray-300 rounded-none focus:ring-black accent-black" />
                                    <div className="group-hover:text-black transition">
                                        <p className="font-bold text-sm text-black">Order Updates</p>
                                        <p className="text-xs text-gray-500">Receive emails about your order status</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" defaultChecked className="w-4 h-4 text-black border-gray-300 rounded-none focus:ring-black accent-black" />
                                    <div className="group-hover:text-black transition">
                                        <p className="font-bold text-sm text-black">Promotions & Offers</p>
                                        <p className="text-xs text-gray-500">Get notified about exclusive sales</p>
                                    </div>
                                </label>
                            </div>
                            <button className="bg-white border border-black text-black hover:bg-black hover:text-white transition text-xs font-bold tracking-widest uppercase px-6 py-3 mt-4">
                                Save Preferences
                            </button>
                        </div>

                        {/* Danger Zone */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-5 h-5 text-red-500" />
                                <h3 className="font-bold uppercase tracking-wider text-red-500">Danger Zone</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 max-w-lg">Once you delete your account, there is no going back. Please be certain.</p>
                            <button className="border border-red-500 text-red-500 hover:bg-red-50 transition text-xs font-bold tracking-widest uppercase px-6 py-3">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
