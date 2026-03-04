import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { User, Package, MapPin, Settings, LogOut, Plus, Edit2, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../api';

export default function Addresses() {
    const { user, logout, loading, token } = useAuth();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        type: 'Home',
        name: '',
        street: '',
        city: '',
        zip: '',
        phone: '',
        is_default: false
    });

    const fetchAddresses = () => {
        setFetching(true);
        fetch(`${API_URL}/user/addresses`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setAddresses(data.data || []);
                }
                setFetching(false);
            })
            .catch(() => setFetching(false));
    };

    useEffect(() => {
        if (token) {
            fetchAddresses();
        }
    }, [token]);

    const handleOpenModal = (address = null) => {
        if (address) {
            setEditingAddress(address);
            setFormData({
                type: address.type || 'Home',
                name: address.name || '',
                street: address.street || '',
                city: address.city || '',
                zip: address.zip || '',
                phone: address.phone || '',
                is_default: address.is_default || false
            });
        } else {
            setEditingAddress(null);
            setFormData({
                type: 'Home',
                name: user?.name || '',
                street: '',
                city: '',
                zip: '',
                phone: user?.phone || '',
                is_default: addresses.length === 0
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAddress(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const url = editingAddress
            ? `${API_URL}/user/addresses/${editingAddress.id}`
            : `${API_URL}/user/addresses`;

        const method = editingAddress ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                handleCloseModal();
                fetchAddresses();
            } else {
                alert(data.message || 'Error saving address');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const response = await fetch(`${API_URL}/user/addresses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();
            if (data.success) {
                fetchAddresses();
            } else {
                alert(data.message || 'Error deleting address');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin h-8 w-8 border-b-2 border-black"></div></div>;

    if (!user) {
        return <Navigate to="/login" state={{ from: { pathname: "/addresses" } }} replace />;
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
                            <Link to="/profile" className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 hover:text-black font-semibold uppercase tracking-widest text-sm rounded transition-all">
                                <User className="w-5 h-5" /> Profile Details
                            </Link>
                            <Link to="/orders" className="flex items-center gap-3 w-full p-3 text-gray-600 hover:bg-gray-100 hover:text-black font-semibold uppercase tracking-widest text-sm rounded transition-all">
                                <Package className="w-5 h-5" /> Order History
                            </Link>
                            <Link to="/addresses" className="flex items-center gap-3 w-full p-3 bg-black text-white font-bold uppercase tracking-widest text-sm rounded transition-all shadow-md">
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
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                            <h2 className="text-2xl font-heading font-bold uppercase tracking-tight">Saved Addresses</h2>
                            <button
                                onClick={() => handleOpenModal()}
                                className="bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm text-xs flex items-center gap-2 px-4 py-2 font-bold uppercase tracking-widest"
                            >
                                <Plus className="w-4 h-4" /> Add New
                            </button>
                        </div>

                        {fetching ? (
                            <div className="text-center py-12">
                                <div className="animate-spin h-8 w-8 border-b-2 border-black mx-auto"></div>
                            </div>
                        ) : addresses.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-bold text-black mb-2 uppercase tracking-wide">No Saved Addresses</h3>
                                <p className="text-gray-500 mb-6 font-medium text-sm">Add addresses to ensure a faster checkout experience.</p>
                                <button
                                    onClick={() => handleOpenModal()}
                                    className="bg-black text-white px-8 py-3 rounded uppercase font-bold text-xs tracking-widest hover:bg-gray-800 transition shadow-md"
                                >
                                    Add Your First Address
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {addresses.map((address) => (
                                    <div key={address.id} className="border border-gray-200 rounded-xl p-6 flex flex-col hover:shadow-md transition bg-gray-50/50">
                                        <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold uppercase tracking-wider text-black">{address.type || 'Address'}</h3>
                                                {address.is_default && (
                                                    <span className="bg-black text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded-full tracking-widest">Default</span>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(address)}
                                                    className="text-gray-400 hover:text-black transition"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(address.id)}
                                                    className="text-gray-400 hover:text-red-500 transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-1 text-sm text-gray-600 font-medium">
                                            <p className="font-bold text-black">{address.name}</p>
                                            <p>{address.street}</p>
                                            <p>{address.city}, {address.zip}</p>
                                            {address.phone && <p className="pt-2 text-gray-500">{address.phone}</p>}
                                        </div>

                                        {!address.is_default && (
                                            <button
                                                onClick={() => {
                                                    setEditingAddress(address);
                                                    setFormData({
                                                        ...address,
                                                        is_default: true
                                                    });
                                                    // Immediately update Default
                                                    fetch(`${API_URL}/user/addresses/${address.id}`, {
                                                        method: 'PUT',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'Authorization': `Bearer ${token}`,
                                                            'Accept': 'application/json'
                                                        },
                                                        body: JSON.stringify({ ...address, is_default: true })
                                                    }).then(() => fetchAddresses());
                                                }}
                                                className="mt-6 text-[10px] font-bold uppercase tracking-widest underline hover:text-gray-500 transition text-left text-gray-400"
                                            >
                                                Set as Default
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Address Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold uppercase tracking-tight">
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-black">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Address Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black outline-none transition"
                                    >
                                        <option value="Home">Home</option>
                                        <option value="Work">Work</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black outline-none transition"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Street Address</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black outline-none transition"
                                    placeholder="123 Fashion St"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black outline-none transition"
                                        placeholder="New York"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Zip / Postcode</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        value={formData.zip}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black outline-none transition"
                                        placeholder="10001"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black outline-none transition"
                                    placeholder="+1 234 567 890"
                                />
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="is_default"
                                    name="is_default"
                                    checked={formData.is_default}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 accent-black"
                                />
                                <label htmlFor="is_default" className="text-xs font-bold uppercase tracking-widest text-gray-700 cursor-pointer">
                                    Set as default address
                                </label>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 py-3 border border-gray-200 rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-3 bg-black text-white rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition shadow-lg disabled:opacity-50"
                                >
                                    {submitting ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
