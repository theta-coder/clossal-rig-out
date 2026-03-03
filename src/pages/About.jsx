import React from 'react';

export default function About() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8 uppercase tracking-tight text-center">About Us</h1>
            <div className="prose prose-lg mx-auto text-gray-600">
                <p className="mb-6">
                    Welcome to <strong>Urban Threads</strong>, where modern design meets everyday comfort. We believe that clothing should be both stylish and sustainable, crafted to last beyond single seasons.
                </p>
                <p className="mb-6">
                    Founded in 2026, Urban Threads aims to redefine the standard apparel experience by providing premium, minimalist clothing that forms the foundation of a versatile wardrobe.
                </p>
                <h2 className="text-2xl font-bold text-black uppercase font-heading mt-10 mb-4">Our Mission</h2>
                <p className="mb-6">
                    To deliver high-quality, ethically-made essentials that empower you to express your individual style with confidence. We focus on premium fabrics, precise fits, and timeless silhouettes.
                </p>
            </div>
        </div>
    );
}
