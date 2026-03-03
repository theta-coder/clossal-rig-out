import React from 'react';
import { Link } from 'react-router-dom';

export default function Favorites() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-center uppercase tracking-tight">Your Favorites</h1>
            <div className="max-w-4xl mx-auto text-center">
                <p className="text-gray-500 mb-8 text-lg">You haven't saved any items yet.</p>
                <Link to="/shop" className="btn-primary inline-flex items-center justify-center px-8 py-4 bg-black text-white hover:bg-gray-800 transition tracking-widest uppercase text-sm font-bold">
                    Start Shopping
                </Link>
            </div>
        </div>
    );
}
