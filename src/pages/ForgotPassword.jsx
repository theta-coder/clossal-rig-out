import React from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 border border-gray-200 shadow-xl">
                <h1 className="text-3xl font-heading font-bold mb-4 text-center uppercase tracking-tight">Reset Password</h1>
                <p className="text-gray-500 mb-6 text-center text-sm">Enter the email address associated with your account, and we'll send you a link to reset your password.</p>
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Email Address</label>
                        <input type="email" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition" placeholder="Enter your email" required />
                    </div>
                    <button type="submit" className="w-full bg-black text-white uppercase tracking-widest font-bold py-4 hover:bg-gray-800 transition">
                        Send Reset Link
                    </button>
                </form>
                <div className="mt-8 text-center text-sm text-gray-500">
                    Remember your password? <Link to="/login" className="text-black font-bold uppercase tracking-widest hover:underline">Log In</Link>
                </div>
            </div>
        </div>
    );
}
