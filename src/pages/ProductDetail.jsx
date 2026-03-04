import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { ShieldCheck, Truck, RotateCcw, Plus, Minus, Heart, Star, Loader2 } from 'lucide-react';
import { API_URL } from '../api';

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);

    // Fetch product from API
    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`${API_URL}/products/${id}`)
            .then(res => {
                if (!res.ok) throw new Error('Product not found');
                return res.json();
            })
            .then(data => {
                if (data.success && data.data) {
                    const p = data.data;
                    setProduct({
                        id: p.id,
                        name: p.name,
                        slug: p.slug,
                        description: p.description,
                        price: p.price,
                        originalPrice: p.original_price,
                        badge: p.badge,
                        category: p.category,
                        images: p.images.length > 0 ? p.images.map(img => img.url) : [
                            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'
                        ],
                        sizes: p.sizes?.length > 0 ? p.sizes.map(s => s.size).filter(Boolean) : [],
                        colors: p.colors?.length > 0 ? p.colors.map(c => c.color_name).filter(Boolean) : [],
                        colorCodes: p.colors?.length > 0 ? p.colors.reduce((acc, c) => { if (c.color_name && c.color_code) acc[c.color_name] = c.color_code; return acc; }, {}) : {},
                        details: p.details?.length > 0 ? p.details : ['Premium quality product'],
                        reviews: p.reviews || [],
                    });
                    // Set defaults
                    if (p.sizes?.length > 0 && p.sizes[0].size) setSelectedSize(p.sizes[0].size);
                    if (p.colors?.length > 0 && p.colors[0].color_name) setSelectedColor(p.colors[0].color_name);
                }
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 mt-[80px]">
                <Loader2 className="w-10 h-10 text-black animate-spin mb-4" />
                <p className="text-gray-500 text-sm uppercase tracking-widest">Loading product...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="text-center py-40 mt-[80px]">
                <h2 className="text-2xl font-heading font-bold mb-4">Product Not Found</h2>
                <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
                <Link to="/shop" className="btn-primary px-8 py-3 text-sm font-semibold uppercase tracking-wider">Back to Shop</Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        const item = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            size: selectedSize,
            color: selectedColor
        };
        for (let i = 0; i < quantity; i++) {
            addToCart(item);
        }
    };

    const getColorStyle = (color) => {
        if (!color) return '#333';
        const code = product.colorCodes?.[color];
        if (code) return code;
        const map = { 'black': '#000', 'white': '#fff', 'navy': '#000080', 'red': '#dc2626', 'blue': '#2563eb', 'gray': '#6b7280', 'green': '#16a34a', 'beige': '#d4b896', 'brown': '#8b4513' };
        return map[color.toLowerCase()] || '#333';
    };

    return (
        <>
            <div className="bg-white py-6 mt-[80px] border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex items-center space-x-2 text-xs text-gray-400 font-medium uppercase tracking-widest">
                        <Link to="/" className="hover:text-black transition">Home</Link>
                        <span>/</span>
                        <Link to="/shop" className="hover:text-black transition">{product.category || 'Shop'}</Link>
                        <span>/</span>
                        <span className="text-black">{product.name}</span>
                    </div>
                </div>
            </div>

            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12">

                    {/* Image Gallery */}
                    <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-4">
                        <div className="flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:w-24 flex-shrink-0">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`flex-shrink-0 w-20 h-24 md:w-full md:h-32 border-2 transition ${activeImage === index ? 'border-black' : 'border-transparent hover:border-gray-200'}`}
                                >
                                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                        <div className="w-full h-[400px] md:h-[600px] bg-gray-50 order-1 md:order-2 overflow-hidden group">
                            <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700 cursor-zoom-in" />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="w-full md:w-1/2">
                        <div className="mb-8 border-b border-gray-100 pb-8">
                            <h1 className="text-3xl md:text-5xl font-heading font-bold text-black mb-2 tracking-tight">{product.name}</h1>

                            {/* Star Reviews */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex text-yellow-500">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star key={star} className={`w-4 h-4 fill-current ${star > 4 ? 'text-gray-300' : ''}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500 underline cursor-pointer hover:text-black transition">{product.reviews.length} Reviews</span>
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-2xl font-bold text-black">PKR {product.price.toLocaleString()}</span>
                                {product.originalPrice && (
                                    <span className="text-lg text-gray-400 line-through">PKR {product.originalPrice.toLocaleString()}</span>
                                )}
                            </div>
                            <p className="text-gray-500 text-sm md:text-base leading-relaxed">{product.description}</p>
                        </div>

                        {/* Color Selection */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-bold uppercase tracking-widest text-black">Color: <span className="text-gray-500 font-medium ml-2">{selectedColor}</span></span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-10 h-10 rounded-full border-2 transition ${selectedColor === color ? 'border-black ring-2 ring-offset-2 ring-black shadow-lg' : 'border-gray-300 hover:border-gray-400'}`}
                                        style={{ backgroundColor: getColorStyle(color) }}
                                    ></button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-bold uppercase tracking-widest text-black">Size: <span className="text-gray-500 font-medium ml-2">{selectedSize}</span></span>
                                <Link to="/size-guide" className="text-xs text-black underline hover:text-gray-500 transition uppercase tracking-widest">Size Guide</Link>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-14 h-14 border transition flex items-center justify-center text-sm font-bold uppercase ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:border-black'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity and Add to Cart */}
                        <div className="flex flex-wrap sm:flex-nowrap gap-3 md:gap-4 mb-10">
                            <div className="flex items-center border border-black bg-white w-28 md:w-32 justify-between flex-shrink-0">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-12 flex items-center justify-center hover:bg-gray-100 transition text-black"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-center text-sm font-bold w-full">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-12 flex items-center justify-center hover:bg-gray-100 transition text-black"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="btn-accent flex-1 min-w-[180px] sm:min-w-0 h-12 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                                className={`w-12 h-12 border flex items-center justify-center transition ${isFavorite(product.id) ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300 hover:bg-gray-50 text-gray-500 hover:text-red-500'}`}
                            >
                                <Heart className="w-5 h-5" fill={isFavorite(product.id) ? "currentColor" : "none"} />
                            </button>
                        </div>

                        {/* Service Highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-gray-100 bg-gray-50 px-6 mb-10">
                            <div className="flex flex-col items-center text-center gap-2">
                                <Truck className="w-6 h-6 text-black" />
                                <span className="text-xs font-bold uppercase tracking-widest text-black">Free Shipping</span>
                                <span className="text-[10px] text-gray-500">Orders &gt; PKR 5,000</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-black" />
                                <span className="text-xs font-bold uppercase tracking-widest text-black">Secure Checkout</span>
                                <span className="text-[10px] text-gray-500">100% Protected</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2">
                                <RotateCcw className="w-6 h-6 text-black" />
                                <span className="text-xs font-bold uppercase tracking-widest text-black">Free Returns</span>
                                <span className="text-[10px] text-gray-500">Within 14 Days</span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="mb-10">
                            <h3 className="font-heading font-bold text-lg uppercase border-b border-black pb-2 tracking-wider mb-4">Product Details</h3>
                            <ul className="space-y-2">
                                {product.details.map((detail, index) => (
                                    <li key={index} className="flex items-center text-gray-600 text-sm">
                                        <span className="w-1 h-1 bg-black rounded-full mr-3"></span>
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Customer Reviews */}
                        <div>
                            <div className="flex justify-between flex-wrap items-center border-b border-black pb-2 mb-6">
                                <h3 className="font-heading font-bold text-lg uppercase tracking-wider">Customer Reviews</h3>
                                <button className="text-xs font-bold uppercase tracking-widest underline">Write a Review</button>
                            </div>

                            <div className="space-y-6">
                                {product.reviews.length > 0 ? product.reviews.map(review => (
                                    <div key={review.id} className="border-b border-gray-100 pb-6">
                                        <div className="flex justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-sm">Customer</span>
                                                <span className="text-[10px] bg-black text-white px-2 py-0.5 uppercase tracking-widest leading-none">Verified</span>
                                            </div>
                                            <span className="text-xs text-gray-500">{review.created_at}</span>
                                        </div>
                                        <div className="flex text-yellow-500 mb-2">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star key={star} className={`w-3 h-3 fill-current ${star > review.rating ? 'text-gray-300' : ''}`} />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-600">{review.comment}</p>
                                    </div>
                                )) : (
                                    <>
                                        <div className="border-b border-gray-100 pb-6">
                                            <div className="flex justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm">Ahsan A.</span>
                                                    <span className="text-[10px] bg-black text-white px-2 py-0.5 uppercase tracking-widest leading-none">Verified</span>
                                                </div>
                                                <span className="text-xs text-gray-500">March 1, 2026</span>
                                            </div>
                                            <div className="flex text-yellow-500 mb-2">
                                                <Star className="w-3 h-3 fill-current" />
                                                <Star className="w-3 h-3 fill-current" />
                                                <Star className="w-3 h-3 fill-current" />
                                                <Star className="w-3 h-3 fill-current" />
                                                <Star className="w-3 h-3 fill-current" />
                                            </div>
                                            <h4 className="font-bold text-sm mb-1">Perfect fit and quality</h4>
                                            <p className="text-sm text-gray-600">The material is incredibly soft and the fit is exactly as described. Will definitely be ordering more in different colors.</p>
                                        </div>
                                        <div className="pb-2">
                                            <div className="flex justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm">Zain K.</span>
                                                    <span className="text-[10px] bg-black text-white px-2 py-0.5 uppercase tracking-widest leading-none">Verified</span>
                                                </div>
                                                <span className="text-xs text-gray-500">February 20, 2026</span>
                                            </div>
                                            <div className="flex text-yellow-500 mb-2">
                                                <Star className="w-3 h-3 fill-current" />
                                                <Star className="w-3 h-3 fill-current" />
                                                <Star className="w-3 h-3 fill-current" />
                                                <Star className="w-3 h-3 fill-current" />
                                                <Star className="w-3 h-3 fill-current text-gray-300" />
                                            </div>
                                            <h4 className="font-bold text-sm mb-1">Good shirt, shrinks a bit</h4>
                                            <p className="text-sm text-gray-600">Really nice shirt, but it shrank slightly after the first wash even on cold. Sized up on my next order.</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
