import React from 'react';

export default function TrackOrder() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-heading font-bold mb-4 uppercase tracking-tight text-center">Track Your Order</h1>
            <p className="text-gray-500 mb-8 text-center max-w-md">Enter your order number and email address below to track the current status of your shipment.</p>

            <div className="w-full max-w-md bg-white p-8 border border-gray-200">
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Order Number</label>
                        <input type="text" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition" placeholder="e.g. #UT-12345" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Email Address</label>
                        <input type="email" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition" placeholder="Used during checkout" />
                    </div>
                    <button type="submit" className="w-full bg-black text-white uppercase tracking-widest font-bold py-4 hover:bg-gray-800 transition">
                        Track Order
                    </button>
                </form>
            </div>
        </div>
    );
}
