import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { SlidersHorizontal, ChevronDown, Check, ShoppingBag, Eye, X, Heart, Loader2 } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { API_URL, API_BASE_URL } from '../api';

export default function Shop() {
    const location = useLocation();
    const initialCategory = location.state?.category;
    const initialSort = location.state?.sortBy;

    const [filtersOpen, setFiltersOpen] = useState(false);
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();

    // Filter States
    const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [debouncedPrice, setDebouncedPrice] = useState({ min: '', max: '' });
    const [sortBy, setSortBy] = useState(initialSort || 'default');

    // Products from API
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [currentPage, setCurrentPage] = useState(1);

    // Dynamic categories and sizes from API
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Fetch categories and sizes
    useEffect(() => {
        fetch(`${API_URL}/categories`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    const cats = [];
                    data.data.forEach(cat => {
                        cats.push(cat.name);
                        if (cat.subcategories && cat.subcategories.length > 0) {
                            cat.subcategories.forEach(sub => cats.push(sub.name));
                        }
                    });
                    setAvailableCategories(cats);
                }
                setCategoriesLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch categories:', err);
                setCategoriesLoading(false);
            });

        // Fetch sizes from database
        fetch(`${API_URL}/sizes`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setAvailableSizes(data.data.map(s => s.name));
                }
            })
            .catch(err => console.error('Failed to fetch sizes:', err));
    }, []);

    // Fetch products from API
    const fetchProducts = useCallback(() => {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('per_page', '12');
        params.append('page', currentPage);

        // Category filter (send as comma-separated string)
        if (selectedCategories.length > 0) {
            params.append('category', selectedCategories.join(','));
        }

        // Size filter (send as comma-separated string)
        if (selectedSizes.length > 0) {
            params.append('size', selectedSizes.join(','));
        }

        // Price range (using debounced values for better performance)
        if (debouncedPrice.min) {
            params.append('min_price', debouncedPrice.min);
        }
        if (debouncedPrice.max) {
            params.append('max_price', debouncedPrice.max);
        }

        // Sort
        params.append('sort', sortBy);

        fetch(`${API_URL}/products?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    let items = data.data.map(p => ({
                        id: p.id,
                        name: p.name,
                        slug: p.slug,
                        price: p.price,
                        originalPrice: p.original_price,
                        category: p.category,
                        badge: p.badge,
                        is_featured: p.is_featured,
                        image: p.images.length > 0 ? p.images[0].url : 'https://via.placeholder.com/600x600?text=No+Image',
                        images: p.images,
                        sizes: p.sizes,
                        colors: p.colors,
                        details: p.details,
                    }));

                    setProducts(items);
                    if (data.pagination) {
                        setPagination(data.pagination);
                    }
                }
                setLoading(false);
            })
            .catch(() => {
                setProducts([]);
                setLoading(false);
            });
    }, [selectedCategories, sortBy, currentPage, debouncedPrice, selectedSizes]);

    // Debounce price range
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedPrice(priceRange);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [priceRange]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        if (location.state?.category) {
            setSelectedCategories([location.state.category]);
        }
        if (location.state?.sortBy) {
            setSortBy(location.state.sortBy);
        }
    }, [location.state]);



    const handleCategoryChange = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
        setCurrentPage(1);
    };

    const handleSizeChange = (size) => {
        setSelectedSizes(prev =>
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setSelectedCategories([]);
        setSelectedSizes([]);
        setPriceRange({ min: '', max: '' });
        setSortBy('default');
        setCurrentPage(1);
    };

    const handleAddToCart = (product) => {
        addToCart({
            ...product,
            size: product.sizes?.[0]?.size || 'M',
        });
    };

    // Pagination helpers
    const renderPagination = () => {
        if (pagination.last_page <= 1) return null;
        const pages = [];
        for (let i = 1; i <= pagination.last_page; i++) {
            pages.push(i);
        }
        return (
            <div className="mt-20 flex justify-center">
                <nav className="flex items-center space-x-2 md:space-x-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-black hover:border-black transition rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    {pages.map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border font-bold transition rounded-full ${currentPage === page ? 'border-black bg-black text-white shadow-md' : 'border-gray-200 text-gray-600 hover:border-black hover:bg-gray-50'}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        disabled={currentPage === pagination.last_page}
                        onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-gray-200 text-gray-800 hover:text-black hover:border-black transition rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </nav>
            </div>
        );
    };

    return (
        <>
            <section className="page-header-gradient text-white py-16 md:py-24 relative overflow-hidden mt-[70px]">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h1 className="text-3xl md:text-6xl font-heading font-bold uppercase tracking-widest mb-4">All Collection</h1>
                    <div className="flex items-center justify-center space-x-3 text-sm text-gray-400 tracking-wider">
                        <Link to="/" className="hover:text-white transition">Home</Link>
                        <span>/</span>
                        <span className="text-white font-semibold">Shop</span>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 flex flex-col md:flex-row gap-10">

                    <aside className="w-full md:w-1/4 flex-shrink-0">
                        <button
                            onClick={() => setFiltersOpen(true)}
                            className="md:hidden w-full flex justify-between items-center p-4 bg-gray-50 border border-gray-200 font-heading font-bold uppercase mb-6 tracking-widest hover:bg-black hover:text-white transition"
                        >
                            <span className="flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Filters</span>
                            <ChevronDown className="w-5 h-5" />
                        </button>

                        {/* Mobile Overlay Background */}
                        {filtersOpen && (
                            <div
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                                onClick={() => setFiltersOpen(false)}
                            ></div>
                        )}

                        <div className={`
                            fixed md:static inset-y-0 left-0 w-[280px] md:w-full bg-white z-50 md:z-auto p-6 md:p-0 
                            transform transition-transform duration-300 ease-in-out
                            ${filtersOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                            overflow-y-auto md:overflow-visible shadow-2xl md:shadow-none
                            flex flex-col
                        `}>
                            {/* Mobile Header for Sidebar */}
                            <div className="flex md:hidden justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                <span className="font-heading font-bold text-xl uppercase tracking-wider">Filters</span>
                                <button onClick={() => setFiltersOpen(false)} className="text-gray-400 hover:text-black">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-10 flex-1">
                                {(selectedCategories.length > 0 || selectedSizes.length > 0 || priceRange.min || priceRange.max) && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-black uppercase tracking-widest">Active Filters</span>
                                            <button onClick={handleClearFilters} className="text-[10px] text-gray-500 hover:text-black underline uppercase font-bold tracking-tighter">Clear All</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCategories.map(cat => (
                                                <span key={cat} className="inline-flex items-center px-3 py-1 bg-gray-100 text-[10px] font-bold uppercase tracking-wider text-black border border-gray-200">
                                                    {cat}
                                                    <button onClick={() => handleCategoryChange(cat)} className="ml-2 hover:text-red-500"><X className="w-3 h-3" /></button>
                                                </span>
                                            ))}
                                            {selectedSizes.map(size => (
                                                <span key={size} className="inline-flex items-center px-3 py-1 bg-gray-100 text-[10px] font-bold uppercase tracking-wider text-black border border-gray-200">
                                                    Size: {size}
                                                    <button onClick={() => handleSizeChange(size)} className="ml-2 hover:text-red-500"><X className="w-3 h-3" /></button>
                                                </span>
                                            ))}
                                            {(priceRange.min || priceRange.max) && (
                                                <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-[10px] font-bold uppercase tracking-wider text-black border border-gray-200">
                                                    PKR {priceRange.min || 0} - {priceRange.max || 'Any'}
                                                    <button onClick={() => setPriceRange({ min: '', max: '' })} className="ml-2 hover:text-red-500"><X className="w-3 h-3" /></button>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="font-heading font-bold text-lg uppercase mb-5 border-b border-black pb-2 tracking-wider">Categories</h3>
                                    <ul className="space-y-4 text-sm text-gray-600 font-medium">
                                        {availableCategories.map(cat => (
                                            <li key={cat}>
                                                <label className="flex items-center cursor-pointer group hover:text-black transition">
                                                    <input
                                                        type="checkbox"
                                                        className="hidden peer"
                                                        checked={selectedCategories.includes(cat)}
                                                        onChange={() => handleCategoryChange(cat)}
                                                    />
                                                    <div className="w-5 h-5 border border-gray-300 mr-3 flex items-center justify-center transition group-hover:border-black peer-checked:bg-black peer-checked:border-black relative">
                                                        <Check className="w-3 h-3 text-white absolute inset-auto opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                                                    </div>
                                                    {cat}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-heading font-bold text-lg uppercase mb-5 border-b border-black pb-2 tracking-wider">Price Range</h3>
                                    <div className="flex items-center justify-between gap-3">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 transition"
                                        />
                                        <span className="text-gray-400">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                            className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black bg-gray-50 transition"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-heading font-bold text-lg uppercase mb-5 border-b border-black pb-2 tracking-wider">Size</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {availableSizes.map(size => (
                                            <label key={size} className="cursor-pointer relative group">
                                                <input
                                                    type="checkbox"
                                                    className="peer hidden"
                                                    checked={selectedSizes.includes(size)}
                                                    onChange={() => handleSizeChange(size)}
                                                />
                                                <div className="w-12 h-12 border border-gray-300 flex items-center justify-center text-sm font-semibold peer-checked:bg-black peer-checked:text-white peer-checked:border-black group-hover:border-black transition uppercase bg-white shadow-sm hover:shadow-md">
                                                    {size}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {selectedSizes.length > 0 && (
                                        <button onClick={() => setSelectedSizes([])} className="text-xs text-gray-500 hover:text-black mt-3 block underline">Clear sizes</button>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => setFiltersOpen(false)}
                                className="md:hidden w-full mt-8 bg-black text-white font-bold text-sm py-4 uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
                            >
                                Show Results <span className="bg-white text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full leading-none">{products.length}</span>
                            </button>
                        </div>
                    </aside>

                    <div className="w-full md:w-3/4">

                        <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 border border-gray-100 mb-8">
                            <p className="text-sm text-gray-500 font-medium mb-4 sm:mb-0 tracking-wide">
                                Showing <span className="text-black font-bold">{products.length}</span> of <span className="text-black font-bold">{pagination.total}</span> results
                            </p>

                            <div className="flex items-center space-x-4">
                                <select
                                    value={sortBy}
                                    onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                                    className="border border-gray-300 px-5 py-2.5 text-sm focus:outline-none focus:border-black bg-white font-medium cursor-pointer transition w-full sm:w-auto"
                                >
                                    <option value="default">Default Sorting</option>
                                    <option value="new">Newest Arrivals</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-black animate-spin mb-4" />
                                <p className="text-gray-500 text-sm uppercase tracking-widest">Loading products...</p>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 border border-gray-100">
                                <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h2 className="text-2xl font-heading font-bold mb-2 uppercase tracking-widest">No products found</h2>
                                <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria.</p>
                                <button onClick={handleClearFilters} className="btn-primary py-3 px-8 text-sm uppercase tracking-widest font-bold">Clear All Filters</button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 min-h-[50vh]">
                                    {products.map(product => (
                                        <div key={product.id} className="product-card group relative bg-white pb-6 border border-gray-100 hover:shadow-2xl transition-all duration-500 animate-fade-in flex flex-col">
                                            <div className="product-image-container relative h-[250px] md:h-[380px] bg-gray-100 mb-5 overflow-hidden flex-shrink-0">
                                                <Link to={`/product/${product.id}`} className="block w-full h-full relative">
                                                    <img src={product.image} alt={product.name} className="product-image w-full h-full object-cover absolute inset-0 z-10" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none"></div>
                                                </Link>

                                                {product.badge && (
                                                    <div className="absolute top-4 left-4 z-20">
                                                        <span className="bg-black text-white text-[10px] uppercase font-bold px-3 py-1 tracking-widest shadow-md">{product.badge}</span>
                                                    </div>
                                                )}

                                                <div className="product-actions absolute bottom-4 left-0 w-full px-4 z-20 flex gap-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button onClick={() => handleAddToCart(product)} className="btn-primary w-full py-2 mb-0 md:py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-xl flex-1 border-none flex items-center justify-center gap-1 md:gap-2 bg-white text-black hover:bg-black hover:text-white transition-colors">
                                                        <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" /> Add
                                                    </button>
                                                    <button onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }} className="bg-white text-black hover:bg-black hover:text-white px-3 md:px-4 shadow-xl flex items-center justify-center transition-colors">
                                                        <Heart className="w-4 h-4 md:w-5 md:h-5" fill={isFavorite(product.id) ? "currentColor" : "none"} />
                                                    </button>
                                                    <Link to={`/product/${product.id}`} className="bg-white text-black hover:bg-black hover:text-white px-3 md:px-4 shadow-xl flex items-center justify-center transition-colors">
                                                        <Eye className="w-4 h-4 md:w-5 md:h-5" />
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="px-5 text-center flex-1 flex flex-col justify-end">
                                                <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-widest font-semibold">{product.category}</div>
                                                <h3 className="font-bold text-black mb-2 text-sm md:text-base line-clamp-2 min-h-[40px] flex items-center justify-center"><Link to={`/product/${product.id}`} className="hover:text-gray-500 transition">{product.name}</Link></h3>
                                                <div className="flex items-center justify-center gap-3">
                                                    <span className="font-bold text-black">PKR {product.price.toLocaleString()}</span>
                                                    {product.originalPrice && (
                                                        <span className="text-xs text-gray-400 line-through shrink-0">PKR {product.originalPrice.toLocaleString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {renderPagination()}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
