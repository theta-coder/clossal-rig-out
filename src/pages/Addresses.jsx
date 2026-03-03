import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, MapPin, Settings, LogOut, Plus, Edit2, Trash2 } from 'lucide-react';

export default function Addresses() {
    // Dummy user data
    const user = {
        name: 'John Doe',
        joined: 'March 2026'
    };

    const [addresses, setAddresses] = useState([
        {
            id: 1,
            type: 'Home',
            name: 'John Doe',
            street: 'House 142, Street 7, Phase 5',
            city: 'DHA, Lahore',
            zip: '54792',
            phone: '+92 300 1234567',
            isDefault: true
        },
        {
            id: 2,
            type: 'Office',
            name: 'John Doe',
            street: 'Office 402, 4th Floor, Arfa Tech Park',
            city: 'Ferozepur Road, Lahore',
            zip: '54000',
            phone: '+92 300 1234567',
            isDefault: false
        }
    ]);

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
                            <Link to="/addresses" className="flex items-center gap-3 w-full p-3 bg-black text-white font-bold uppercase tracking-widest text-sm transition">
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
                        <div className="flex justify-between items-center border-b pb-4 mb-6">
                            <h2 className="text-2xl font-heading font-bold uppercase">Saved Addresses</h2>
                            <button className="btn-primary text-xs flex items-center gap-2 px-4 py-2">
                                <Plus className="w-4 h-4" /> Add New Header
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {addresses.map((address) => (
                                <div key={address.id} className="border border-gray-200 p-6 flex flex-col hover:shadow-md transition">
                                    <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold uppercase tracking-wider">{address.type}</h3>
                                            {address.isDefault && (
                                                <span className="bg-black text-white text-[10px] uppercase font-bold px-2 py-0.5 tracking-widest">Default</span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="text-gray-400 hover:text-black transition"><Edit2 className="w-4 h-4" /></button>
                                            <button className="text-gray-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-1 text-sm text-gray-600">
                                        <p className="font-bold text-black">{address.name}</p>
                                        <p>{address.street}</p>
                                        <p>{address.city} {address.zip}</p>
                                        <p className="pt-2">{address.phone}</p>
                                    </div>

                                    {!address.isDefault && (
                                        <button className="mt-6 text-xs font-bold uppercase tracking-widest underline hover:text-gray-500 transition text-left">
                                            Set as Default
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
