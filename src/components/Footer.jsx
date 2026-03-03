import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <>
            <section className="py-16 text-center footer-gradient">
                <div className="container mx-auto px-4 text-white">
                    <h2 className="text-3xl font-heading font-bold uppercase mb-4 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">Subscribe to our newsletter</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">Get 10% off your first purchase when you sign up.</p>
                    <form className="max-w-md mx-auto relative flex border-b border-gray-500 pb-2">
                        <input type="email" placeholder="YOUR EMAIL ADDRESS" className="w-full bg-transparent border-none text-white focus:outline-none placeholder-gray-500 text-sm tracking-widest pl-2" />
                        <button type="submit" className="text-white hover:text-gray-300 font-bold uppercase tracking-widest text-sm px-4">Subscribe</button>
                    </form>
                </div>
            </section>

            <footer className="bg-white pt-16 pb-8 border-t border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

                        <div className="col-span-1 md:col-span-1">
                            <Link to="/" className="text-2xl font-heading font-bold tracking-tighter uppercase text-black mb-6 block">
                                Urban<span className="text-gray-500">Threads</span>
                            </Link>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                Redefining modern apparel. Premium, sustainable, and minimalist clothing designed to stand the test of time.
                            </p>
                            <div className="flex space-x-4">
                                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-black hover:text-white transition border border-gray-200">
                                    <Facebook className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-black hover:text-white transition border border-gray-200">
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black hover:bg-black hover:text-white transition border border-gray-200">
                                    <Twitter className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-heading font-bold text-black mb-6 text-lg">Shop</h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><Link to="/shop" state={{ category: 'Men' }} className="hover:text-black transition inline-block">Men's Collection</Link></li>
                                <li><Link to="/shop" state={{ category: 'Kids' }} className="hover:text-black transition inline-block">Kids' Collection</Link></li>
                                <li><Link to="/shop" state={{ sortBy: 'new' }} className="hover:text-black transition inline-block">New Arrivals</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-heading font-bold text-black mb-6 text-lg">Help & Info</h4>
                            <ul className="space-y-3 text-sm text-gray-500">
                                <li><Link to="/about" className="hover:text-black transition inline-block">About Us</Link></li>
                                <li><Link to="/contact" className="hover:text-black transition inline-block">Contact Us</Link></li>
                                <li><Link to="/size-guide" className="hover:text-black transition inline-block">Size Guide</Link></li>
                                <li><Link to="/shipping" className="hover:text-black transition inline-block">Shipping & Returns</Link></li>
                                <li><Link to="/track-order" className="hover:text-black transition inline-block">Track Order</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-heading font-bold text-black mb-6 text-lg">Contact</h4>
                            <p className="text-sm text-gray-500 mb-2">Email: support@urbanthreads.com</p>
                            <p className="text-sm text-gray-500 mb-2">Phone: +92 300 1234567</p>
                            <p className="text-sm text-gray-500">Hours: Mon-Fri 9am-6pm</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                        <p>&copy; 2026 URBAN THREADS. ALL RIGHTS RESERVED.</p>
                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <span>PKR</span>
                            <span>|</span>
                            <span>COD Available</span>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}
