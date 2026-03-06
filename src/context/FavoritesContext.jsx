import { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const { token } = useAuth();
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [favoriteProducts, setFavoriteProducts] = useState([]);

    useEffect(() => {
        if (token) {
            fetchFavorites();
        } else {
            const saved = localStorage.getItem('urban-threads-favorites');
            setFavoriteIds(saved ? JSON.parse(saved) : []);
            setFavoriteProducts([]);
        }
    }, [token]);

    const fetchFavorites = async () => {
        try {
            const res = await fetch(`${API_URL}/favorites`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setFavoriteProducts(data.data);
                setFavoriteIds(data.data.map(p => p.id));
            }
        } catch (err) {
            console.error('Failed to fetch favorites:', err);
        }
    };

    const toggleFavorite = async (productId) => {
        if (token) {
            try {
                const res = await fetch(`${API_URL}/favorites/toggle`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ product_id: productId })
                });
                const data = await res.json();
                if (data.success) {
                    if (data.is_favorite) {
                        setFavoriteIds(prev => [...prev, productId]);
                        fetchFavorites();
                    } else {
                        setFavoriteIds(prev => prev.filter(id => id !== productId));
                        setFavoriteProducts(prev => prev.filter(p => p.id !== productId));
                    }
                }
            } catch (err) {
                console.error('Failed to toggle favorite:', err);
            }
        } else {
            setFavoriteIds(prev => {
                const updated = prev.includes(productId)
                    ? prev.filter(id => id !== productId)
                    : [...prev, productId];
                localStorage.setItem('urban-threads-favorites', JSON.stringify(updated));
                return updated;
            });
        }
    };

    const isFavorite = (productId) => favoriteIds.includes(productId);

    return (
        <FavoritesContext.Provider value={{ favoriteIds, favoriteProducts, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => useContext(FavoritesContext);
