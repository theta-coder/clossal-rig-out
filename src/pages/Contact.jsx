import React from 'react';

export default function Contact() {
    return (
        <div className="container mx-auto px-4 py-24 min-h-screen">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8 uppercase tracking-tight text-center">Contact Us</h1>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-bold font-heading uppercase mb-6 border-b pb-2">Get in Touch</h2>
                    <p className="text-gray-600 mb-6">Have a question about our products, an order, or anything else? Our support team is here to help.</p>
                    <div className="space-y-4 text-sm text-gray-600">
                        <p><strong>Email:</strong> support@urbanthreads.com</p>
                        <p><strong>Phone:</strong> +92 300 1234567</p>
                        <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM (PKT)</p>
                        <p><strong>Address:</strong> 123 Fashion Avenue, Style District, Lahore, Pakistan</p>
                    </div>
                </div>
                <div>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Name</label>
                            <input type="text" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition" placeholder="Your Name" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Email</label>
                            <input type="email" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition" placeholder="Your Email address" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Message</label>
                            <textarea rows="5" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition" placeholder="How can we help you?"></textarea>
                        </div>
                        <button type="submit" className="bg-black text-white uppercase tracking-widest font-bold py-4 px-8 hover:bg-gray-800 transition">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
