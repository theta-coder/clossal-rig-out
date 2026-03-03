import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { SlidersHorizontal, ChevronDown, Check, ShoppingBag, Eye, X, Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

export default function Shop() {
    const location = useLocation();
    const initialCategory = location.state?.category;
    const initialSort = location.state?.sortBy;

    const [filtersOpen, setFiltersOpen] = useState(false);
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();

    // Filter States
    const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);
    const [selectedSize, setSelectedSize] = useState('');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [sortBy, setSortBy] = useState(initialSort || 'default');

    useEffect(() => {
        if (location.state?.category) {
            setSelectedCategories([location.state.category]);
        }
        if (location.state?.sortBy) {
            setSortBy(location.state.sortBy);
        }
    }, [location.state]);

    const allProducts = [
        {
            id: 'p1', name: 'Premium Cotton Blank Tee', price: 2499, category: 'T-Shirts', size: 'M',
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=600', badge: 'New', date: '2023-10-01'
        },
        {
            id: 'p2', name: 'Slim Fit Oxford Shirt', price: 4899, category: 'Shirts', size: 'L',
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600', date: '2023-09-15'
        },
        {
            id: 'p3', name: 'Essential Fleece Hoodie', price: 5499, category: 'Hoodies', size: 'L',
            image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600', date: '2023-08-20'
        },
        {
            id: 'p4', name: 'Slim Fit Stretch Chinos', price: 3999, originalPrice: 4999, category: 'Bottoms', size: '32',
            image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=600', badge: '-20%', date: '2023-10-10'
        },
        {
            id: 'p5', name: 'Classic Denim Jacket', price: 8999, category: 'Outerwear', size: 'M',
            image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=600', date: '2023-07-05'
        },
        {
            id: 'p6', name: 'Kids Graphic T-Shirt', price: 1899, category: 'Kids', size: '8Y',
            image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600', date: '2023-09-01'
        }
    ];

    const availableCategories = ['Men', 'Kids', 'Hoodies', 'Shirts', 'T-Shirts', 'Bottoms', 'Sale'];
    const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
    };

    const handleClearFilters = () => {
        setSelectedCategories([]);
        setSelectedSize('');
        setPriceRange({ min: '', max: '' });
        setSortBy('default');
    };

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...allProducts];

        // 1. Filter by Category
        if (selectedCategories.length > 0) {
            result = result.filter(product => {
                // If a product's exact category is in the selected list, include it
                if (selectedCategories.includes(product.category)) return true;

                // Men maps to adult categories
                if (selectedCategories.includes('Men') && product.category !== 'Kids') return true;

                // Kids maps to Kids category
                if (selectedCategories.includes('Kids') && product.category === 'Kids') return true;

                // Sale maps to items with originalPrice or 'Sale' category
                if (selectedCategories.includes('Sale') && product.originalPrice) return true;

                return false;
            });
        }

        // 2. Filter by Size (Note: This is dummy size logic based on the single 'size' field per product for now)
        if (selectedSize) {
            // Very simplified: assuming the product size matches the selected size
            // Real apps would have an array of sizes per product
            result = result.filter(product => product.size === selectedSize || ['32', '8Y'].includes(product.size)); // Fallback for dummy data
        }

        // 3. Filter by Price
        if (priceRange.min !== '') {
            result = result.filter(product => product.price >= parseFloat(priceRange.min));
        }
        if (priceRange.max !== '') {
            result = result.filter(product => product.price <= parseFloat(priceRange.max));
        }

        // 4. Sort
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'new':
                result.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            default:
                // default sorting (id order or however it was initially)
                break;
        }

        return result;
    }, [allProducts, selectedCategories, selectedSize, priceRange, sortBy]);


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
                                {(selectedCategories.length > 0 || selectedSize || priceRange.min || priceRange.max) && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-black uppercase tracking-widest">Active Filters</span>
                                        <button onClick={handleClearFilters} className="text-xs text-gray-500 hover:text-black underline">Clear All</button>
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
                                    {/* We can dynamically filter as they type, or use Apply button. Dynamic is better. We hide the apply button to make it feel more real-time */}
                                </div>

                                <div>
                                    <h3 className="font-heading font-bold text-lg uppercase mb-5 border-b border-black pb-2 tracking-wider">Size</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {availableSizes.map(size => (
                                            <label key={size} className="cursor-pointer relative group">
                                                <input
                                                    type="radio"
                                                    name="size"
                                                    className="peer hidden"
                                                    value={size}
                                                    checked={selectedSize === size}
                                                    onChange={() => setSelectedSize(size)}
                                                />
                                                <div className="w-12 h-12 border border-gray-300 flex items-center justify-center text-sm font-semibold peer-checked:bg-black peer-checked:text-white peer-checked:border-black group-hover:border-black transition uppercase bg-white">
                                                    {size}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {selectedSize && (
                                        <button onClick={() => setSelectedSize('')} className="text-xs text-gray-500 hover:text-black mt-3 block underline">Clear size</button>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => setFiltersOpen(false)}
                                className="md:hidden w-full mt-8 bg-black text-white font-bold text-sm py-4 uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
                            >
                                Show Results <span className="bg-white text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full leading-none">{filteredAndSortedProducts.length}</span>
                            </button>
                        </div>
                    </aside>

                    <div className="w-full md:w-3/4">

                        <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 border border-gray-100 mb-8">
                            <p className="text-sm text-gray-500 font-medium mb-4 sm:mb-0 tracking-wide">
                                Showing <span className="text-black font-bold">{filteredAndSortedProducts.length}</span>  results
                            </p>

                            <div className="flex items-center space-x-4">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-gray-300 px-5 py-2.5 text-sm focus:outline-none focus:border-black bg-white font-medium cursor-pointer transition w-full sm:w-auto"
                                >
                                    <option value="default">Default Sorting</option>
                                    <option value="new">Newest Arrivals</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        {filteredAndSortedProducts.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 border border-gray-100">
                                <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h2 className="text-2xl font-heading font-bold mb-2 uppercase tracking-widest">No products found</h2>
                                <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria.</p>
                                <button onClick={handleClearFilters} className="btn-primary py-3 px-8 text-sm uppercase tracking-widest font-bold">Clear All Filters</button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 min-h-[50vh]">
                                    {filteredAndSortedProducts.map(product => (
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
                                                    <button onClick={() => addToCart({ ...product, size: 'M' })} className="btn-primary w-full py-2 mb-0 md:py-3 text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-xl flex-1 border-none flex items-center justify-center gap-1 md:gap-2 bg-white text-black hover:bg-black hover:text-white transition-colors">
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
                                {/* Hide Pagination when heavily filtered or add logic later */}
                                {filteredAndSortedProducts.length > 5 && (
                                    <div className="mt-20 flex justify-center">
                                        <nav className="flex items-center space-x-2 md:space-x-4">
                                            <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-black hover:border-black transition rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
                                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                            </button>

                                            <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-black bg-black text-white font-bold transition rounded-full shadow-md">1</button>
                                            <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-gray-200 text-gray-600 hover:border-black hover:bg-gray-50 font-semibold transition rounded-full">2</button>
                                            <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-gray-200 text-gray-600 hover:border-black hover:bg-gray-50 font-semibold transition rounded-full">3</button>

                                            <span className="text-gray-400 px-2 tracking-widest hidden sm:inline-block">...</span>
                                            <button className="w-10 h-10 md:w-12 md:h-12 hidden sm:flex items-center justify-center border border-gray-200 text-gray-600 hover:border-black hover:bg-gray-50 font-semibold transition rounded-full">8</button>

                                            <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-gray-200 text-gray-800 hover:text-black hover:border-black transition rounded-full">
                                                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
