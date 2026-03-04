import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowRight, ShoppingBag, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { API_URL } from '../api';

export default function Home() {
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [apiCategories, setApiCategories] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);

    // Fetch categories from API
    useEffect(() => {
        fetch(`${API_URL}/categories`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setApiCategories(data.data);
                }
            })
            .catch(() => { });
    }, []);

    // Fetch new arrivals from products API
    useEffect(() => {
        fetch(`${API_URL}/products?per_page=4&sort=latest`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setNewArrivals(data.data.map(p => ({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        originalPrice: p.original_price,
                        category: p.category,
                        badge: p.badge,
                        image: p.images.length > 0 ? p.images[0].url : 'https://via.placeholder.com/600x600?text=No+Image',
                        hoverImage: p.images.length > 1 ? p.images[1].url : null,
                    })));
                }
            })
            .catch(() => { });
    }, []);

    // Quick Sale Countdown Logic
    const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, mins: 45, secs: 12 });
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, mins, secs } = prev;
                if (secs > 0) secs--;
                else {
                    secs = 59;
                    if (mins > 0) mins--;
                    else {
                        mins = 59;
                        if (hours > 0) hours--;
                        else {
                            hours = 23;
                            if (days > 0) days--;
                        }
                    }
                }
                return { days, hours, mins, secs };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            {/* Hero Section */}
            <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-black">
                    <img src="https://images.unsplash.com/photo-1558769132-cb1fac0840c2?auto=format&fit=crop&q=80&w=2000" alt="New Collection" className="w-full h-full object-cover object-center animate-fade-in grayscale-[50%] opacity-80" />
                </div>
                <div className="absolute inset-0 hero-gradient z-10"></div>

                <div className="container mx-auto px-4 z-20 relative text-white">
                    <div className="max-w-2xl animate-slide-up">
                        <h4 className="text-gray-300 uppercase tracking-[0.2em] font-medium mb-4">New Season 2026</h4>
                        <h1 className="text-4xl md:text-7xl font-heading font-bold mb-6 leading-tight">Elevate Your <br />Everyday Style</h1>
                        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg font-light leading-relaxed">
                            Discover our latest collection blending premium comfort with modern minimalist aesthetics. Designed for the modern man.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/shop" state={{ category: 'Men' }} className="btn-primary bg-white text-black hover:bg-black hover:text-white border-white px-8 py-4 uppercase tracking-wider font-semibold text-sm inline-flex items-center justify-center">
                                Shop Men <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                            <Link to="/shop" state={{ category: 'Kids' }} className="btn-outline px-8 py-4 uppercase tracking-wider font-semibold text-sm inline-flex items-center justify-center bg-transparent text-white border-white hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                                Shop Kids
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-heading font-bold text-black mb-3">Shop by Category</h2>
                            <p className="text-gray-500 text-lg">Curated essentials for every occasion</p>
                        </div>
                        <Link to="/shop" className="hidden md:inline-flex items-center text-black font-semibold hover:text-gray-500 transition border-b border-black pb-1">
                            View All Categories <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {apiCategories.length > 0 && apiCategories.slice(0, 3).map(cat => (
                            <Link key={cat.id} to="/shop" state={{ category: cat.name }} className="relative h-[400px] md:h-[500px] group overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-100">
                                {cat.image ? (
                                    <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%]" />
                                ) : (
                                    <div className="absolute inset-0 w-full h-full bg-gray-300"></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300"></div>
                                <div className="relative z-10 w-full px-8 text-center mt-auto mb-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="font-heading font-bold text-3xl text-white uppercase tracking-wider mb-2">{cat.name}</h3>
                                    <span className="text-gray-300 text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">Shop Now</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-10 text-center md:hidden">
                        <Link to="/shop" className="btn-outline px-6 py-3 uppercase text-sm font-semibold inline-block border-2 border-black">View All Categories</Link>
                    </div>
                </div>
            </section>

            {/* Sale Section */}
            <section className="py-24 bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-gray-800 via-black to-black opacity-60"></div>
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10 gap-12">
                    <div className="w-full md:w-1/2 text-white">
                        <h4 className="text-gray-400 uppercase tracking-[0.3em] font-bold mb-4 text-sm border-l-4 border-white pl-4">Limited Time Offer</h4>
                        <h2 className="text-5xl md:text-7xl font-heading font-bold mb-6 tracking-tight">End of Season<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">Sale Is Live</span></h2>
                        <p className="text-gray-300 mb-10 max-w-md text-lg leading-relaxed font-light">Get up to 50% off on selected premium items. Upgrade your wardrobe while stock lasts.</p>

                        {/* Countdown */}
                        <div className="flex gap-4 mb-10">
                            <div className="bg-white/5 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px] text-center border border-white/10">
                                <div className="text-4xl font-heading font-light text-white mb-1">{String(timeLeft.days).padStart(2, '0')}</div>
                                <div className="text-[10px] uppercase tracking-widest text-gray-400">Days</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px] text-center border border-white/10">
                                <div className="text-4xl font-heading font-light text-white mb-1">{String(timeLeft.hours).padStart(2, '0')}</div>
                                <div className="text-[10px] uppercase tracking-widest text-gray-400">Hours</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px] text-center border border-white/10">
                                <div className="text-4xl font-heading font-light text-white mb-1">{String(timeLeft.mins).padStart(2, '0')}</div>
                                <div className="text-[10px] uppercase tracking-widest text-gray-400">Mins</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px] text-center border border-white/10">
                                <div className="text-4xl font-heading font-light text-white mb-1">{String(timeLeft.secs).padStart(2, '0')}</div>
                                <div className="text-[10px] uppercase tracking-widest text-gray-400">Secs</div>
                            </div>
                        </div>

                        <Link to="/shop" state={{ category: 'Sale' }} className="bg-white text-black px-10 py-4 uppercase tracking-widest font-bold text-sm inline-block hover:bg-gray-200 transition">Shop the Sale</Link>
                    </div>
                    <div className="w-full md:w-1/2 relative group">
                        <img src="https://images.unsplash.com/photo-1549495115-4ba1e3a24147?auto=format&fit=crop&q=80&w=800" alt="Sale Image" className="w-full h-[350px] md:h-[600px] object-cover relative z-10 grayscale-[20%] group-hover:grayscale-0 transition duration-700" />
                        <div className="absolute inset-0 border border-white/30 translate-x-6 translate-y-6 z-0 transition-transform duration-500 group-hover:translate-x-4 group-hover:translate-y-4"></div>
                    </div>
                </div>
            </section>

            {/* Curated Collections */}
            <section className="py-24 bg-black text-white px-4 md:px-0">
                <div className="container mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 tracking-tight">Curated Collections</h2>
                        <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">Explore our handpicked selections designed for specific seasons and styles.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        {apiCategories.length > 3 && apiCategories.slice(3, 5).map((cat, index) => (
                            <div key={cat.id} className="relative h-[500px] md:h-[600px] group overflow-hidden bg-gray-900 border border-gray-800">
                                <img src={cat.image || `https://images.unsplash.com/photo-${index === 0 ? '1523398002811-999aa8e9f5b9' : '1551028719-00167b16eac5'}?auto=format&fit=crop&q=80&w=1000`} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-500"></div>

                                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-10">
                                    <span className="inline-block px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest mb-4">
                                        {index === 0 ? 'New' : 'Trending'}
                                    </span>
                                    <h3 className="text-4xl md:text-5xl font-heading font-bold mb-4">{cat.name} Collection</h3>
                                    <p className="text-gray-300 mb-8 max-w-md font-light leading-relaxed">
                                        {cat.description || `Explore our latest ${cat.name} collection featuring premium fabrics and modern designs.`}
                                    </p>
                                    <Link to="/shop" state={{ category: cat.name }} className="btn-outline border-white text-white hover:bg-white hover:text-black px-8 py-3 uppercase tracking-wider font-bold text-sm inline-flex items-center transition-all">
                                        Explore Collection <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* New Arrivals */}
            <section className="py-24 bg-gray-50 border-y border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-black mb-6">New Arrivals</h2>
                        <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">Refresh your wardrobe with our latest high-quality pieces, meticulously crafted for modern living.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {newArrivals.map(product => (
                            <div key={product.id} className="product-card group relative bg-white pb-6 border border-gray-100 hover:shadow-2xl transition-all duration-500">
                                <div className="product-image-container relative h-[280px] md:h-[400px] bg-gray-100 mb-5 overflow-hidden">
                                    <Link to={`/product/${product.id}`} className="block w-full h-full relative group/img">
                                        <img src={product.image} alt={product.name} className={`product-image w-full h-full object-cover absolute inset-0 z-10 opacity-100 ${product.hoverImage ? 'group-hover/img:opacity-0' : ''} transition-opacity duration-500`} />
                                        {product.hoverImage && (
                                            <img src={product.hoverImage} alt={`${product.name} alternate`} className="product-image w-full h-full object-cover absolute inset-0 z-0 scale-110 group-hover/img:scale-100 transition-transform duration-700 delay-100" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
                                    </Link>

                                    {product.badge && (
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="bg-black text-white text-[10px] uppercase font-bold px-3 py-1 tracking-widest shadow-md">{product.badge}</span>
                                        </div>
                                    )}

                                    <div className="product-actions absolute bottom-4 left-0 w-full px-4 z-20 flex gap-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <button
                                            onClick={() => addToCart({ ...product, size: 'M' })}
                                            className="btn-primary w-full py-3 justify-center gap-1 md:gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-xl flex-1 border-none flex items-center bg-white text-black hover:bg-black hover:text-white transition-colors px-1 md:px-4"
                                        >
                                            <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" /> <span className="hidden sm:inline">Add to Cart</span><span className="sm:hidden">Add</span>
                                        </button>
                                        <button
                                            onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                                            className="w-12 py-3 bg-white text-black hover:bg-black hover:text-white flex items-center justify-center transition shadow-xl"
                                        >
                                            <Heart className="w-4 h-4 md:w-5 md:h-5" fill={isFavorite(product.id) ? "currentColor" : "none"} />
                                        </button>
                                    </div>
                                </div>
                                <div className="px-5 text-center">
                                    <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-semibold">{product.category}</div>
                                    <h3 className="font-bold text-black mb-2 text-sm md:text-base"><Link to={`/product/${product.id}`} className="hover:text-gray-500 transition">{product.name}</Link></h3>
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="font-bold text-black text-lg">PKR {product.price.toLocaleString()}</span>
                                        {product.originalPrice && (
                                            <span className="text-xs text-gray-400 line-through">PKR {product.originalPrice.toLocaleString()}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-16">
                        <Link to="/shop" className="btn-outline px-10 py-4 uppercase tracking-wider font-bold text-sm inline-block border-2 border-black hover:bg-black hover:text-white">View All Products</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
