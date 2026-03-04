import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-32 min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: { pathname: "/profile" } }} replace />;
    }

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
        navigate('/');
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
                            <Link to="/profile" className="flex items-center gap-3 w-full p-3 bg-black text-white font-bold uppercase tracking-widest text-sm rounded transition-all shadow-md">
                                <User className="w-5 h-5" /> Profile Details
                            </Link>
                            <Link to="/orders" className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 hover:text-black font-semibold uppercase tracking-widest text-sm rounded transition-all">
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
                        <h2 className="text-2xl font-heading font-bold mb-6 uppercase border-b border-gray-100 pb-4 tracking-tight">Personal Information</h2>

                        <form className="space-y-6 max-w-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Full Name</label>
                                    <input type="text" defaultValue={user.name} className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Email Address</label>
                                    <input type="email" defaultValue={user.email} className="w-full border border-gray-200 bg-gray-100 p-3.5 rounded-lg focus:outline-none text-gray-500 cursor-not-allowed" disabled />
                                    <p className="text-[10px] text-gray-400 mt-1.5 uppercase font-medium tracking-wider">Email cannot be changed directly.</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Phone Number</label>
                                    <input type="tel" defaultValue={user.phone || ''} className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all" />
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-100 mt-8">
                                <button type="submit" className="bg-black text-white uppercase tracking-widest text-sm font-bold py-4 px-8 rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
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
