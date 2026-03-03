import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { ShieldCheck, Truck, RotateCcw, Plus, Minus, Heart, Star } from 'lucide-react';

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useFavorites();

    // Dummy product
    const product = {
        id: id || 'p1',
        name: 'Premium Cotton Blank Tee',
        price: 2499,
        description: 'Elevate your everyday wardrobe with our Premium Cotton Blank Tee. Crafted from 100% organic, long-staple cotton, this t-shirt offers an exceptionally soft hand-feel and superior durability. Features a tailored athletic fit, reinforced stitching, and a clean minimalist aesthetic perfect for layering or wearing solo.',
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800'
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Black', 'White', 'Navy'],
        details: [
            '100% Organic Cotton (220 GSM)',
            'Pre-shrunk fabric',
            'True to size athletic fit',
            'Machine wash cold, tumble dry low'
        ]
    };

    const [activeImage, setActiveImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('Black');
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        // Add multiple quantities 
        const item = { ...product, size: selectedSize, color: selectedColor };
        for (let i = 0; i < quantity; i++) {
            addToCart(item);
        }
        // We only need to call it once if cart logic is updated, but addToCart handles single additions in our simple context right now.
        // Let's adapt CartContext next to take quantity, but for now we'll just loop.
    };

    return (
        <>
            <div className="bg-white py-6 mt-[80px] border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex items-center space-x-2 text-xs text-gray-400 font-medium uppercase tracking-widest">
                        <Link to="/" className="hover:text-black transition">Home</Link>
                        <span>/</span>
                        <Link to="/shop" className="hover:text-black transition">Men</Link>
                        <span>/</span>
                        <Link to="/shop" className="hover:text-black transition">T-Shirts</Link>
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
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current" />
                                    <Star className="w-4 h-4 fill-current text-gray-300" />
                                </div>
                                <span className="text-sm text-gray-500 underline cursor-pointer hover:text-black transition">128 Reviews</span>
                            </div>

                            <div className="text-2xl font-bold text-black mb-6">PKR {product.price.toLocaleString()}</div>
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
                                        style={{ backgroundColor: color.toLowerCase() === 'navy' ? '#000080' : color.toLowerCase() }}
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

                        {/* Details Accordion Idea */}
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

                        {/* Customer Reviews Preview */}
                        <div>
                            <div className="flex justify-between flex-wrap items-center border-b border-black pb-2 mb-6">
                                <h3 className="font-heading font-bold text-lg uppercase tracking-wider">Customer Reviews</h3>
                                <button className="text-xs font-bold uppercase tracking-widest underline">Write a Review</button>
                            </div>

                            <div className="space-y-6">
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
