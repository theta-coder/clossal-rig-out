import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../api';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [apiCategories, setApiCategories] = useState([]);
    const [announcement, setAnnouncement] = useState(null);
    const [announcementLoading, setAnnouncementLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const searchInputRef = useRef(null);
    const searchTimerRef = useRef(null);
    const navigate = useNavigate();

    const { cartCount, setIsCartOpen } = useCart();
    const { user, token } = useAuth();
    const location = useLocation();

    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch categories from dashboard API
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

    // Fetch active announcement
    useEffect(() => {
        fetch(`${API_URL}/announcements/active`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success' && data.data) {
                    setAnnouncement(data.data);
                }
                setAnnouncementLoading(false);
            })
            .catch(() => {
                setAnnouncementLoading(false);
            });
    }, []);

    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current.focus();
            }, 100);
        }
        if (!searchOpen) {
            setSearchQuery('');
            setSearchResults([]);
        }
    }, [searchOpen]);

    // Debounced API search
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            setSearchLoading(false);
            return;
        }
        setSearchLoading(true);
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
        searchTimerRef.current = setTimeout(() => {
            fetch(`${API_URL}/products?search=${encodeURIComponent(searchQuery)}&per_page=6`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.data) {
                        setSearchResults(data.data.map(p => ({
                            id: p.id,
                            name: p.name,
                            category: p.category,
                            image: p.images.length > 0 ? p.images[0].url : 'https://via.placeholder.com/150x150?text=No+Image',
                            price: p.price,
                        })));
                        // Log search query (fire-and-forget)
                        fetch(`${API_URL}/activity/search`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                            },
                            body: JSON.stringify({ query: searchQuery, results_count: data.data.length })
                        }).catch(() => {});
                    }
                    setSearchLoading(false);
                })
                .catch(() => {
                    setSearchResults([]);
                    setSearchLoading(false);
                });
        }, 400);
        return () => { if (searchTimerRef.current) clearTimeout(searchTimerRef.current); };
    }, [searchQuery, token]);

    const transparentNav = isHome && !isScrolled;

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchOpen(false);
        navigate('/shop');
    };

    return (
        <>
            {/* Top Banner */}
            <AnimatePresence>
                {!announcementLoading && announcement && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="bg-black text-white text-center text-xs md:text-sm font-medium tracking-wide overflow-hidden"
                    >
                        <div className="py-2 flex items-center justify-center px-4 shadow-sm relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black">
                            {/* Framer Motion Shine effect */}
                            <motion.div
                                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                                initial={{ left: '-100%' }}
                                animate={{ left: '200%' }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 3,
                                    ease: "easeInOut",
                                    repeatDelay: 1
                                }}
                            />

                            <span className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 flex-wrap drop-shadow-md">
                                {announcement.message}
                                {announcement.link_text && announcement.link_url && (
                                    <>
                                        <span className="hidden sm:inline">|</span>
                                        {announcement.link_url.startsWith('http') ? (
                                            <a href={announcement.link_url} target="_blank" rel="noopener noreferrer" className="text-gray-300 underline cursor-pointer hover:text-white transition font-bold tracking-widest text-[10px] sm:text-xs">
                                                {announcement.link_text}
                                            </a>
                                        ) : (
                                            <Link to={announcement.link_url} className="text-gray-300 underline cursor-pointer hover:text-white transition font-bold tracking-widest text-[10px] sm:text-xs">
                                                {announcement.link_text}
                                            </Link>
                                        )}
                                    </>
                                )}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className={`fixed w-full top-auto z-40 transition-all duration-300 ${transparentNav ? 'py-4 bg-transparent text-white' : 'py-3 bg-white shadow-sm border-b border-gray-100 text-black'}`}>
                <div className="container mx-auto px-4 md:px-8 flex justify-between items-center relative">

                    <button onClick={() => setMobileMenuOpen(true)} className="md:hidden header-icon hover:text-gray-500 transition">
                        <Menu className="w-6 h-6" />
                    </button>

                    <Link to="/" className="text-2xl md:text-3xl font-heading font-bold tracking-tighter uppercase logo-text flex-shrink-0">
                        Urban<span className={transparentNav ? "text-gray-300" : "gradient-text"}>Threads</span>
                    </Link>

                    <nav className="hidden md:flex space-x-8 items-center h-full">
                        <Link to="/" className={`font-medium transition text-sm uppercase tracking-wider ${transparentNav ? 'hover:text-gray-300' : 'hover:text-gray-500'}`}>Home</Link>
                        <Link to="/shop" className={`font-medium transition text-sm uppercase tracking-wider ${transparentNav ? 'hover:text-gray-300' : 'hover:text-gray-500'}`}>Shop</Link>

                        {apiCategories.length > 0 && apiCategories.map(cat => (
                            <div key={cat.id} className="group relative h-full flex items-center py-6 cursor-pointer">
                                <Link to="/shop" state={{ category: cat.name }} className={`font-medium transition text-sm uppercase tracking-wider flex items-center ${transparentNav ? 'hover:text-gray-300' : 'hover:text-gray-500'}`}>
                                    {cat.name} {cat.subcategories.length > 0 && <ChevronDown className="w-4 h-4 ml-1" />}
                                </Link>
                                {cat.subcategories.length > 0 && (
                                    <div className="absolute top-[70px] left-1/2 transform -translate-x-1/2 w-[600px] bg-white text-black shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 rounded-b-lg border-t-2 border-black p-8 grid grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="font-heading font-bold text-lg mb-4 border-b pb-2">{cat.name}</h3>
                                            <ul className="space-y-2 text-sm text-gray-600">
                                                {cat.subcategories.map(sub => (
                                                    <li key={sub.id}><Link to="/shop" state={{ category: sub.name }} className="hover:text-black transition">{sub.name}</Link></li>
                                                ))}
                                            </ul>
                                        </div>
                                        {cat.image && (
                                            <div className="relative rounded-lg overflow-hidden group/img h-48">
                                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition duration-500 group-hover/img:scale-110" />
                                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                    <span className="text-white font-heading font-bold text-xl border-b-2 border-white pb-1">Shop {cat.name}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-4 md:space-x-6">
                        <button onClick={() => setSearchOpen(true)} className={`hover:text-gray-400 transition ${transparentNav ? 'text-white' : 'text-black'}`}>
                            <Search className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <Link to={user ? "/profile" : "/login"} className={`hover:text-gray-400 transition flex items-center ${transparentNav ? 'text-white' : 'text-black'}`}>
                            <User className="w-5 h-5 md:w-6 md:h-6" />
                        </Link>
                        <Link to="/wishlist" className={`hidden md:block hover:text-gray-400 transition ${transparentNav ? 'text-white' : 'text-black'}`}>
                            <Heart className="w-5 h-5 md:w-6 md:h-6" />
                        </Link>
                        <button onClick={() => setIsCartOpen(true)} className={`relative hover:text-gray-400 transition flex items-center ${transparentNav ? 'text-white' : 'text-black'}`}>
                            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] flex">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setMobileMenuOpen(false)}></div>
                    <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">

                        {/* Mobile Menu Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                            <span className="font-heading font-bold text-2xl tracking-tighter uppercase logo-text">
                                Urban<span className="gradient-text">Threads</span>
                            </span>
                            <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-100">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Mobile Menu Content */}
                        <div className="flex-1 overflow-y-auto w-full">
                            <nav className="flex flex-col py-6 px-4">
                                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="group flex items-center justify-between py-4 px-4 border-b border-gray-100/50 hover:bg-gray-50 transition-colors">
                                    <span className="text-xl font-heading font-semibold text-black uppercase tracking-wider group-hover:pl-2 transition-all duration-300">Home</span>
                                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
                                </Link>
                                <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="group flex items-center justify-between py-4 px-4 border-b border-gray-100/50 hover:bg-gray-50 transition-colors">
                                    <span className="text-xl font-heading font-semibold text-black uppercase tracking-wider group-hover:pl-2 transition-all duration-300">Shop All</span>
                                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
                                </Link>
                                {apiCategories.length > 0 && apiCategories.map(cat => (
                                    <Link key={cat.id} to="/shop" state={{ category: cat.name }} onClick={() => setMobileMenuOpen(false)} className="group flex items-center justify-between py-4 px-4 border-b border-gray-100/50 hover:bg-gray-50 transition-colors">
                                        <span className="text-xl font-heading font-semibold text-black uppercase tracking-wider group-hover:pl-2 transition-all duration-300">{cat.name}</span>
                                        <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
                                    </Link>
                                ))}
                                <Link to="/shop" state={{ category: 'Sale' }} onClick={() => setMobileMenuOpen(false)} className="group flex items-center justify-between py-4 px-4 border-b border-gray-100/50 hover:bg-gray-50 transition-colors">
                                    <span className="text-xl font-heading font-bold text-red-600 uppercase tracking-wider group-hover:pl-2 transition-all duration-300">Sale Extravaganza</span>
                                    <ArrowRight className="w-5 h-5 text-red-300 group-hover:text-red-600 transition-colors" />
                                </Link>
                            </nav>
                        </div>

                        {/* Mobile Menu Footer */}
                        <div className="p-6 bg-gray-50 border-t border-gray-100 mt-auto">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-sm font-bold uppercase tracking-widest text-black hover:border-black transition-colors shadow-sm">
                                    <User className="w-4 h-4" /> Account
                                </Link>
                                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-sm font-bold uppercase tracking-widest text-black hover:border-black transition-colors shadow-sm">
                                    <Heart className="w-4 h-4" /> Wishlist
                                </Link>
                            </div>
                            <div className="flex justify-center space-x-6">
                                <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500 uppercase tracking-widest hover:text-black transition-colors underline-offset-4 hover:underline">Help & Support</Link>
                                <Link to="/track-order" onClick={() => setMobileMenuOpen(false)} className="text-xs font-semibold text-gray-500 uppercase tracking-widest hover:text-black transition-colors underline-offset-4 hover:underline">Track Order</Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Overlay Modal */}
            {searchOpen && (
                <div className="fixed inset-0 z-[70] bg-white animate-fade-in flex flex-col">
                    <div className="container mx-auto px-4 py-8 flex-shrink-0 border-b border-gray-100 relative">
                        <button onClick={() => setSearchOpen(false)} className="absolute right-4 top-8 text-black hover:text-gray-500 transition">
                            <X className="w-8 h-8" />
                        </button>

                        <div className="max-w-3xl mx-auto mt-10">
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products, categories..."
                                    className="w-full text-2xl md:text-4xl font-heading font-light pl-12 pr-4 py-4 focus:outline-none placeholder-gray-300 text-black border-none"
                                />
                            </form>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-gray-50 py-12">
                        <div className="container mx-auto px-4 max-w-4xl">
                            {searchQuery.trim() === '' ? (
                                <div className="text-center text-gray-400 mt-10">
                                    <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p className="font-heading uppercase tracking-widest">Type to start searching</p>
                                </div>
                            ) : searchLoading ? (
                                <div className="text-center mt-10">
                                    <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-gray-400" />
                                    <p className="text-gray-400 font-heading uppercase tracking-widest">Searching...</p>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div>
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 border-b border-gray-200 pb-2">Results for "{searchQuery}"</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {searchResults.map(product => (
                                            <Link
                                                key={product.id}
                                                to={`/product/${product.id}`}
                                                onClick={() => setSearchOpen(false)}
                                                className="flex items-center gap-4 bg-white p-4 border border-gray-100 hover:border-black hover:shadow-lg transition group"
                                            >
                                                <img src={product.image} alt={product.name} className="w-16 h-20 object-cover bg-gray-100" />
                                                <div className="flex-1">
                                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold mb-1">{product.category}</div>
                                                    <h4 className="font-bold text-black group-hover:text-gray-600 transition">{product.name}</h4>
                                                    <span className="text-sm font-bold text-black mt-1 block">PKR {product.price.toLocaleString()}</span>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-black transition transform group-hover:translate-x-1" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 mt-10">
                                    <p className="text-xl font-heading mb-2">No results found for "{searchQuery}"</p>
                                    <p className="text-sm">Please check your spelling or try different keywords.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
