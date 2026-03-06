import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api';

export default function Favorites() {
    const { favoriteProducts, favoriteIds, toggleFavorite } = useFavorites();
    const { addToCart } = useCart();
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-24 min-h-screen">
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-center uppercase tracking-tight">Your Favorites</h1>
                <div className="max-w-md mx-auto text-center">
                    <Heart className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                    <p className="text-gray-500 mb-2 text-lg">Sign in to save and view your favorites.</p>
                    {favoriteIds.length > 0 && (
                        <p className="text-sm text-gray-400 mb-6">{favoriteIds.length} item(s) saved locally.</p>
                    )}
                    <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 bg-black text-white hover:bg-gray-800 transition tracking-widest uppercase text-sm font-bold">
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-center uppercase tracking-tight">Your Favorites</h1>

            {favoriteProducts.length === 0 ? (
                <div className="max-w-4xl mx-auto text-center">
                    <Heart className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                    <p className="text-gray-500 mb-8 text-lg">You haven't saved any items yet.</p>
                    <Link to="/shop" className="inline-flex items-center justify-center px-8 py-4 bg-black text-white hover:bg-gray-800 transition tracking-widest uppercase text-sm font-bold">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="max-w-6xl mx-auto">
                    <p className="text-sm text-gray-500 mb-8">{favoriteProducts.length} item{favoriteProducts.length !== 1 ? 's' : ''} saved</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {favoriteProducts.map(product => {
                            const img = product.images?.[0];
                            const image = img?.url
                                || (img?.image_path ? `${API_BASE_URL}/${img.image_path}` : null)
                                || 'https://via.placeholder.com/400x500?text=No+Image';
                            return (
                                <div key={product.id} className="group relative bg-white border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col">
                                    <div className="relative h-[250px] md:h-[320px] bg-gray-50 overflow-hidden">
                                        <Link to={`/product/${product.id}`} className="block w-full h-full">
                                            <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </Link>
                                        <button
                                            onClick={() => toggleFavorite(product.id)}
                                            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md text-red-500 hover:bg-red-50 transition"
                                            title="Remove from favorites"
                                        >
                                            <Heart className="w-4 h-4" fill="currentColor" />
                                        </button>
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{product.category}</div>
                                        <h3 className="font-bold text-sm text-black mb-2 line-clamp-2 flex-1">
                                            <Link to={`/product/${product.id}`} className="hover:text-gray-600 transition">{product.name}</Link>
                                        </h3>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="font-bold text-black">PKR {Number(product.price).toLocaleString()}</span>
                                            {product.original_price && (
                                                <span className="text-xs text-gray-400 line-through">PKR {Number(product.original_price).toLocaleString()}</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => addToCart({ ...product, size: product.sizes?.[0]?.size || product.sizes?.[0] || 'M' })}
                                            className="w-full py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition flex items-center justify-center gap-2"
                                        >
                                            <ShoppingBag className="w-3 h-3" /> Add to Cart
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
