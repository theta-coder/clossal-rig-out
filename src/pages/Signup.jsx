import React from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 border border-gray-200 shadow-xl">
                <h1 className="text-3xl font-heading font-bold mb-6 text-center uppercase tracking-tight">Create Account</h1>
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Full Name</label>
                        <input type="text" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition" placeholder="Enter your full name" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Email Address</label>
                        <input type="email" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition" placeholder="Enter your email" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Password</label>
                        <input type="password" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition" placeholder="Create a password" />
                    </div>
                    <button type="submit" className="w-full bg-black text-white uppercase tracking-widest font-bold py-4 hover:bg-gray-800 transition">
                        Sign Up
                    </button>
                </form>
                <div className="mt-8 text-center text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-black font-bold uppercase tracking-widest hover:underline">Log In</Link>
                </div>
            </div>
        </div>
    );
}
